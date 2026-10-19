// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scryptSync } from "node:crypto";
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
import { createSession, editorConfigured, sameOrigin, validSession, verifyPassword } from "./auth";

beforeEach(() => {
  vi.stubEnv("EDITOR_USERNAME", "test-editor");
  vi.stubEnv("EDITOR_SESSION_SECRET", "unit-test-session-secret-with-at-least-32-characters");
  vi.stubEnv(
    "EDITOR_PASSWORD_HASH",
    `test-salt:${scryptSync("test-password", "test-salt", 64).toString("hex")}`,
  );
});
afterEach(() => vi.unstubAllEnvs());

describe("editor authentication", () => {
  it("accepts only the configured user and password", () => {
    expect(verifyPassword("test-editor", "test-password")).toBe(true);
    expect(verifyPassword("someone", "test-password")).toBe(false);
    expect(verifyPassword("test-editor", "incorrect")).toBe(false);
  });
  it("rejects tampered, expired and malformed sessions", () => {
    const now = Date.now();
    const session = createSession(now);
    expect(validSession(session, now)).toBe(true);
    expect(validSession(session + "0", now)).toBe(false);
    expect(validSession(session, now + 8 * 60 * 60 * 1000)).toBe(false);
    expect(validSession("malformed", now)).toBe(false);
    expect(validSession(undefined, now)).toBe(false);
  });
  it("fails closed when configuration is missing or the secret rotates", () => {
    const session = createSession();
    vi.stubEnv("EDITOR_SESSION_SECRET", "another-session-secret-with-at-least-32-characters");
    expect(validSession(session)).toBe(false);
    vi.stubEnv("EDITOR_PASSWORD_HASH", "");
    expect(editorConfigured()).toBe(false);
    expect(validSession(session)).toBe(false);
    expect(verifyPassword("test-editor", "test-password")).toBe(false);
  });
  it("rejects cross-origin mutation requests", () => {
    expect(
      sameOrigin(
        new Request("https://example.org/api/editor/posts", {
          headers: { origin: "https://example.org" },
        }),
      ),
    ).toBe(true);
    expect(
      sameOrigin(
        new Request("https://example.org/api/editor/posts", {
          headers: { origin: "https://other.org" },
        }),
      ),
    ).toBe(false);
    expect(sameOrigin(new Request("https://example.org/api/editor/posts"))).toBe(false);
  });
});
