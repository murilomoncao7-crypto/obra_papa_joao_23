// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({
  verify: vi.fn(),
  configured: vi.fn(),
  publishing: vi.fn(),
  create: vi.fn(),
  commit: vi.fn(),
  patch: vi.fn(),
}));
vi.mock("@/lib/editor/auth", () => ({
  createSession: () => "signed-test-session",
  editorConfigured: mocks.configured,
  editorCookie: "obra_editor",
  sameOrigin: (request: Request) => request.headers.get("origin") === new URL(request.url).origin,
  sessionSeconds: 28800,
  verifyPassword: mocks.verify,
}));
vi.mock("@/lib/editor/cms", () => ({
  publishingConfigured: mocks.publishing,
  editorClient: () => ({ createIfNotExists: mocks.create, patch: mocks.patch }),
}));
import { POST, DELETE } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.configured.mockReturnValue(true);
  mocks.publishing.mockReturnValue(true);
  mocks.verify.mockReturnValue(true);
  mocks.create.mockResolvedValue({ _rev: "revision", count: 0, startedAt: Date.now() });
  const patch = {
    ifRevisionId: () => patch,
    set: () => patch,
    inc: () => patch,
    commit: mocks.commit,
  };
  mocks.patch.mockReturnValue(patch);
  mocks.commit.mockResolvedValue({ _rev: "next", count: 1, startedAt: Date.now() });
});
const request = () =>
  new Request("https://example.org/api/editor/session", {
    method: "POST",
    headers: { origin: "https://example.org", "content-type": "application/json" },
    body: JSON.stringify({ username: "editor", password: "fictitious-password" }),
  });

describe("editor sessions", () => {
  it("sets an HttpOnly session only after credential verification", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("SameSite=strict");
    mocks.verify.mockReturnValue(false);
    const denied = await POST(request());
    expect(denied.status).toBe(401);
    expect(denied.headers.get("set-cookie")).toBeNull();
  });
  it("enforces the shared attempt limit before checking the password", async () => {
    mocks.create.mockResolvedValue({ _rev: "revision", count: 5, startedAt: Date.now() });
    expect((await POST(request())).status).toBe(429);
    expect(mocks.verify).not.toHaveBeenCalled();
  });
  it("fails closed for incomplete configuration or unavailable lockout storage", async () => {
    mocks.publishing.mockReturnValue(false);
    expect((await POST(request())).status).toBe(503);
    mocks.publishing.mockReturnValue(true);
    mocks.create.mockRejectedValue(new Error("unavailable"));
    expect((await POST(request())).status).toBe(503);
    expect(mocks.verify).not.toHaveBeenCalled();
  });
  it("does not allow cross-origin login or logout and expires the logout cookie", async () => {
    const cross = () =>
      new Request("https://example.org/api/editor/session", {
        method: "POST",
        headers: { origin: "https://other.org" },
      });
    expect((await POST(cross())).status).toBe(403);
    expect((await DELETE(cross())).status).toBe(403);
    expect((await DELETE(request())).headers.get("set-cookie")).toContain("Max-Age=0");
  });
});
