import { expect, test } from "@playwright/test";

test("links internos importantes respondem sem erro", async ({ request }) => {
  const routes = [
    "/",
    "/instituicao",
    "/historia",
    "/atividades",
    "/eventos",
    "/postagens",
    "/noticias",
    "/como-ajudar",
    "/contato",
    "/politica-de-privacidade",
  ];
  for (const route of routes) expect((await request.get(route)).status(), route).toBeLessThan(400);
});

test("links externos usam protocolo seguro e proteção de nova aba", async ({ page }) => {
  await page.goto("/contato");
  const links = page.locator('a[target="_blank"]');
  for (let index = 0; index < (await links.count()); index += 1) {
    const link = links.nth(index);
    expect(await link.getAttribute("href")).toMatch(/^https:\/\//);
    expect(await link.getAttribute("rel")).toMatch(/noopener|noreferrer/);
  }
});
