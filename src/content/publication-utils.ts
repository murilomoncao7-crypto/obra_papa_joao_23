import type { Event } from "./types";

export function formatPublicationDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(value),
  );
}

export function isPastEvent(event: Event, now = new Date()) {
  const end = event.endsAt ?? event.startsAt;
  return new Date(`${end.slice(0, 10)}T23:59:59.999Z`).getTime() < now.getTime();
}

export function eventStatusLabel(event: Event) {
  if (event.eventStatus === "cancelled") return "Cancelado";
  if (event.eventStatus === "completed" || isPastEvent(event)) return "Encerrado";
  return "Programado";
}
