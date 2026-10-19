import { describe, expect, it } from "vitest";
import { validateImagePermissions } from "./imageValidation";

const validImage = {
  asset: { _ref: "image-test-1200x800-jpg" },
  alt: "Educadores reunidos durante uma atividade",
  caption: "Atividade coletiva na instituição.",
  credit: "Equipe da Obra",
  context: "Registro de uma atividade educativa para divulgação institucional.",
  authorized: true,
  internetAllowed: true,
};

describe("proteção editorial de imagens", () => {
  it("permite rascunhos sem imagens", () => {
    expect(validateImagePermissions({})).toBe(true);
  });

  it("rejeita imagem sem texto alternativo", () => {
    expect(validateImagePermissions({ coverImage: { ...validImage, alt: "" } })).toContain(
      "texto alternativo",
    );
  });

  it("rejeita imagem sem autorização de uso", () => {
    expect(
      validateImagePermissions({ coverImage: { ...validImage, authorized: false } }),
    ).toContain("autorização de uso");
  });

  it("rejeita imagem sem autorização para internet", () => {
    expect(
      validateImagePermissions({ coverImage: { ...validImage, internetAllowed: false } }),
    ).toContain("publicadas na internet");
  });

  it("aceita imagens com todos os controles confirmados", () => {
    expect(
      validateImagePermissions({
        coverImage: validImage,
        gallery: [validImage],
        socialImage: validImage,
      }),
    ).toBe(true);
  });
});
