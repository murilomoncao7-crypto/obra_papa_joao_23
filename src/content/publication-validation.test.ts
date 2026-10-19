import { describe, expect, it } from "vitest";
import type { Event, NewsPost } from "./types";
import { validateEvents, validateNews } from "./publication-validation";

const news = (overrides: Partial<NewsPost> = {}): NewsPost => ({
  id: "notice-1",
  slug: "comunicado-institucional",
  title: "Comunicado institucional",
  summary: "Resumo confirmado.",
  content: "Conteúdo confirmado.",
  publishedAt: "2026-08-01",
  category: "Comunicados",
  tags: [],
  coverImageAlt: "",
  status: "published",
  ...overrides,
});

const event = (overrides: Partial<Event> = {}): Event => ({
  id: "event-1",
  slug: "evento-confirmado",
  kind: "event",
  title: "Evento confirmado",
  summary: "Resumo confirmado.",
  content: "Descrição confirmada.",
  startsAt: "2026-08-30",
  eventStatus: "scheduled",
  contacts: [],
  status: "published",
  ...overrides,
});

describe("validação de publicações", () => {
  it("rejeita slugs duplicados", () => {
    expect(() => validateNews([news(), news({ id: "notice-2" })])).toThrow("Slug duplicado");
  });

  it("rejeita datas inválidas", () => {
    expect(() => validateEvents([event({ startsAt: "data-inválida" })])).toThrow(
      "startsAt inválida",
    );
  });

  it("rejeita data final anterior à inicial", () => {
    expect(() => validateEvents([event({ endsAt: "2026-08-01" })])).toThrow("Data final anterior");
  });

  it("rejeita imagens sem texto alternativo", () => {
    expect(() => validateNews([news({ coverImage: "/imagem.webp" })])).toThrow(
      "Imagem sem texto alternativo",
    );
  });
});
