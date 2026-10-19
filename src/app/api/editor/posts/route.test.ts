// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import sharp from "sharp";
vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({
  isEditor: vi.fn(),
  upload: vi.fn(),
  create: vi.fn(),
  createIfNotExists: vi.fn(),
  delete: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock("@/lib/editor/auth", () => ({
  isEditor: mocks.isEditor,
  sameOrigin: (request: Request) => request.headers.get("origin") === new URL(request.url).origin,
}));
vi.mock("@/lib/editor/cms", () => ({
  editorClient: () => ({
    assets: { upload: mocks.upload },
    create: mocks.create,
    createIfNotExists: mocks.createIfNotExists,
    delete: mocks.delete,
  }),
  managedPosts: vi.fn(),
}));
vi.mock("@/lib/editor/revalidate", () => ({ refreshPublications: mocks.refresh }));
import { POST } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.isEditor.mockResolvedValue(true);
  mocks.upload.mockResolvedValue({ _id: "image-test" });
  mocks.create.mockResolvedValue({ _id: "postagem-test" });
});

async function form(rights = true, fake = false) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    title: "Atividade da instituição",
    text: "Um relato completo da atividade realizada pela equipe com os participantes.",
    alt: "Participantes na atividade",
    credit: "Acervo da instituição",
    author: "Equipe",
    category: "Atividades",
  }))
    data.set(key, value);
  if (rights) data.set("rights", "true");
  const bytes = fake
    ? Buffer.from("not-an-image")
    : await sharp({ create: { width: 400, height: 500, channels: 3, background: "#ffffff" } })
        .png()
        .toBuffer();
  data.append("photos", new File([new Uint8Array(bytes)], "photo.png", { type: "image/png" }));
  return new Request("https://example.org/api/editor/posts", {
    method: "POST",
    headers: { origin: "https://example.org" },
    body: data,
  });
}

describe("publish endpoint", () => {
  it("blocks anonymous uploads and cross-origin requests before storage", async () => {
    mocks.isEditor.mockResolvedValue(false);
    expect((await POST(await form())).status).toBe(401);
    expect(
      (await POST(new Request("https://example.org/api/editor/posts", { method: "POST" }))).status,
    ).toBe(403);
    expect(mocks.upload).not.toHaveBeenCalled();
  });
  it("requires image consent and validates actual image bytes", async () => {
    expect((await POST(await form(false))).status).toBe(400);
    expect((await POST(await form(true, true))).status).toBe(503);
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("persists the post and refreshes public pages only after successful commit", async () => {
    const response = await POST(await form());
    expect(response.status).toBe(201);
    expect(mocks.upload).toHaveBeenCalledTimes(1);
    expect(mocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: "postagem",
        editorialStatus: "published",
        content: expect.any(Array),
      }),
    );
    expect(mocks.refresh).toHaveBeenCalledTimes(1);
  });
  it("cleans uploaded assets after a failed save and does not report publication", async () => {
    mocks.create.mockRejectedValueOnce(new Error("unavailable"));
    expect((await POST(await form())).status).toBe(503);
    expect(mocks.delete).toHaveBeenCalledWith("image-test");
    expect(mocks.refresh).not.toHaveBeenCalled();
  });
  it("rejects an oversized request before upload", async () => {
    expect(
      (
        await POST(
          new Request("https://example.org/api/editor/posts", {
            method: "POST",
            headers: { origin: "https://example.org", "content-length": "5000000" },
            body: "x",
          }),
        )
      ).status,
    ).toBe(413);
    expect(mocks.upload).not.toHaveBeenCalled();
  });
});
