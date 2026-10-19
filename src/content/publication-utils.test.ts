import { describe, expect, it } from "vitest";
import type { Event } from "./types";
import { eventStatusLabel, formatPublicationDate, isPastEvent } from "./publication-utils";

const event: Event = {
  id: "event",
  slug: "event",
  kind: "event",
  title: "Evento",
  summary: "Resumo",
  content: "Descrição",
  startsAt: "2026-08-01",
  eventStatus: "scheduled",
  contacts: [],
  status: "published",
};

describe("datas de eventos", () => {
  it("identifica evento passado pelo final do dia", () => {
    expect(isPastEvent(event, new Date("2026-08-02T00:00:00Z"))).toBe(true);
    expect(eventStatusLabel(event)).toMatch(/Programado|Encerrado/);
  });

  it("formata datas em português", () => {
    expect(formatPublicationDate("2026-08-30")).toContain("30 de agosto de 2026");
  });
});
