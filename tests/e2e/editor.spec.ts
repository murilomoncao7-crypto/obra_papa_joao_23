import { test, expect } from "@playwright/test";
import sharp from "sharp";

test.beforeEach(async ({}, testInfo) => {
  test.skip(
    testInfo.project.name !== "editor-desktop",
    "Use playwright.editor.config.ts para o ambiente editorial fictício.",
  );
});

test("editor login, photo preparation, preview, publication and instructions", async ({ page }) => {
  await page.route("**/api/editor/session", (route) =>
    route.fulfill({ json: { authenticated: true } }),
  );
  let submitted = false;
  await page.route("**/api/editor/posts", async (route) => {
    submitted = route.request().postDataBuffer()?.includes(Buffer.from("image/webp")) ?? false;
    await route.fulfill({
      status: 201,
      json: { url: "/postagens/teste", message: "Postagem publicada. O feed já foi atualizado." },
    });
  });
  await page.goto("/gestao");
  await page.getByLabel("Usuário", { exact: true }).fill("test-editor");
  await page.getByLabel("Senha", { exact: true }).fill("test-password");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Nova postagem" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Publicar no site" })).toBeDisabled();
  await page.getByLabel("Título", { exact: true }).fill("Atividade de integração");
  await page
    .getByLabel("Texto da postagem")
    .fill("Um relato completo de uma atividade educativa realizada pela instituição.");
  await page.getByLabel("Responsável", { exact: true }).fill("Equipe da Obra");
  await page.getByLabel("Categoria", { exact: true }).fill("Atividades");
  const image = await sharp({
    create: { width: 1080, height: 1350, channels: 3, background: "#1d5279" },
  })
    .png()
    .toBuffer();
  await page
    .getByLabel("Fotos (1 a 3)", { exact: true })
    .setInputFiles({ name: "atividade.png", mimeType: "image/png", buffer: image });
  await expect(page.getByRole("img", { name: "Prévia da foto 1" })).toBeVisible();
  await page.getByLabel("Descrição das fotos").fill("Imagem fictícia de teste de publicação");
  await page.getByLabel("Crédito das fotos").fill("Teste automatizado");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Publicar no site" }).click();
  await expect(page.getByRole("status")).toContainText("Postagem publicada");
  expect(submitted).toBe(true);
  await page.getByRole("button", { name: "Orientações", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Como preparar sua postagem" })).toBeVisible();
  await expect(page.getByText(/1080 × 1350 pixels/)).toBeVisible();
  await page.screenshot({ path: "test-results/editor-panel.png", fullPage: true });
});

test("anonymous API calls cannot create posts", async ({ request }) => {
  const response = await request.post("/api/editor/posts", {
    headers: { origin: "http://127.0.0.1:3120" },
    data: {},
  });
  expect(response.status()).toBe(401);
  expect((await request.get("/api/editor/posts")).status()).toBe(401);
});
