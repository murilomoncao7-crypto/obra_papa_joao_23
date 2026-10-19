import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const requestedRoutes = [
  "/",
  "/instituicao",
  "/historia",
  "/atividades",
  "/atividades/capoeira",
  "/postagens",
  "/eventos",
  "/como-ajudar",
  "/contato",
  "/politica-de-privacidade",
];

test("página inicial carrega sem overflow, falhas de imagem ou erros de acessibilidade", async ({
  page,
}) => {
  const failed: string[] = [];
  page.on("response", (response) => {
    if (response.status() >= 400 && response.request().resourceType() === "image")
      failed.push(response.url());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
  expect(failed).toEqual([]);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("navegação principal leva à instituição", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name !== "desktop")
    await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.getByRole("link", { name: "Instituição", exact: true }).first().click();
  await expect(page).toHaveURL(/\/instituicao$/);
  await expect(page.getByRole("heading", { level: 1, name: "Instituição" })).toBeVisible();
});

test("páginas principais preservam conteúdo, controles e imagens dentro da tela", async ({
  page,
}) => {
  for (const route of requestedRoutes) {
    await page.goto(route);
    await expect(page.locator("main h1").first(), route).toBeVisible();

    const result = await page.evaluate(() => {
      const isVisible = (element: Element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden";
      };
      const controls = Array.from(document.querySelectorAll("a, button")).filter(isVisible);
      const textElements = Array.from(
        document.querySelectorAll("h1, h2, h3, p, li, dt, dd, figcaption"),
      ).filter(isVisible);
      const images = Array.from(document.images).filter(isVisible);

      const clippedControls = controls
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left < -1 || rect.right > window.innerWidth + 1;
        })
        .map((element) => element.textContent?.trim());

      const hiddenText = textElements
        .filter((element) => {
          const style = getComputedStyle(element);
          const clips = style.overflow === "hidden" || style.overflow === "clip";
          return (
            clips &&
            (element.scrollWidth > element.clientWidth + 1 ||
              element.scrollHeight > element.clientHeight + 1)
          );
        })
        .map((element) => element.textContent?.trim());

      const distortedImages = images
        .filter((image) => {
          if (!image.complete || !image.naturalWidth || !image.naturalHeight) return false;
          const fit = getComputedStyle(image).objectFit;
          if (fit === "cover" || fit === "contain") return false;
          const rect = image.getBoundingClientRect();
          const displayedRatio = rect.width / rect.height;
          const naturalRatio = image.naturalWidth / image.naturalHeight;
          return Math.abs(displayedRatio - naturalRatio) / naturalRatio > 0.04;
        })
        .map((image) => image.alt || image.currentSrc);

      const textCoveredByImages = textElements
        .filter((text) => {
          if (!text.textContent?.trim()) return false;
          const textRect = text.getBoundingClientRect();
          return images.some((image) => {
            if (text.contains(image) || image.contains(text)) return false;
            const imageRect = image.getBoundingClientRect();
            const overlapWidth =
              Math.min(textRect.right, imageRect.right) - Math.max(textRect.left, imageRect.left);
            const overlapHeight =
              Math.min(textRect.bottom, imageRect.bottom) - Math.max(textRect.top, imageRect.top);
            return overlapWidth > 2 && overlapHeight > 2;
          });
        })
        .map((element) => element.textContent?.trim());

      return {
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        clippedControls,
        hiddenText,
        distortedImages,
        textCoveredByImages,
      };
    });

    expect(result, route).toEqual({
      overflow: false,
      clippedControls: [],
      hiddenText: [],
      distortedImages: [],
      textCoveredByImages: [],
    });
  }
});

test("postagens exibem estado vazio, preservam links antigos e slug inexistente retorna 404", async ({
  page,
}) => {
  await page.goto("/postagens");
  await expect(page.getByRole("heading", { name: "Nenhuma postagem disponível" })).toBeVisible();
  await page.goto("/noticias");
  await expect(page).toHaveURL(/\/postagens$/);
  const response = await page.goto("/postagens/publicacao-inexistente");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/não encontrada/i);
});

test("menu móvel controla estado, fecha com Escape e devolve o foco", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "desktop", "Fluxo exclusivo do menu móvel");
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Doe agora" })).toBeVisible();
  const button = page.getByRole("button", { name: "Abrir menu" });
  await button.click();
  await expect(page.getByRole("button", { name: "Fechar menu" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(
    await page.evaluate(() => {
      const header = document.querySelector("header")?.getBoundingClientRect();
      const main = document.querySelector("main")?.getBoundingClientRect();
      return Boolean(header && main && main.top >= header.bottom - 1);
    }),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
});
