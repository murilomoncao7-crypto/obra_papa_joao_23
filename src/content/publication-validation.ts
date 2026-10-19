import type { Event, NewsPost } from "./types";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertValidDate(value: string, field: string, id: string) {
  if (Number.isNaN(Date.parse(value))) throw new Error(`${field} inválida em ${id}: ${value}`);
}

function assertUnique<T extends { id: string; slug: string }>(items: T[], label: string) {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`ID duplicado em ${label}: ${item.id}`);
    if (slugs.has(item.slug)) throw new Error(`Slug duplicado em ${label}: ${item.slug}`);
    if (!slugPattern.test(item.slug)) throw new Error(`Slug inválido em ${label}: ${item.slug}`);
    ids.add(item.id);
    slugs.add(item.slug);
  }
}

export function validateNews(items: NewsPost[]) {
  assertUnique(items, "notícias");
  for (const post of items) {
    assertValidDate(post.publishedAt, "publishedAt", post.id);
    if (post.updatedAt) assertValidDate(post.updatedAt, "updatedAt", post.id);
    if (post.coverImage && !post.coverImageAlt?.trim())
      throw new Error(`Imagem sem texto alternativo: ${post.id}`);
  }
  return items;
}

export function validateEvents(items: Event[]) {
  assertUnique(items, "eventos");
  for (const event of items) {
    assertValidDate(event.startsAt, "startsAt", event.id);
    if (event.endsAt) {
      assertValidDate(event.endsAt, "endsAt", event.id);
      if (Date.parse(event.endsAt) < Date.parse(event.startsAt))
        throw new Error(`Data final anterior à inicial: ${event.id}`);
    }
    if (event.image && !event.imageAlt?.trim())
      throw new Error(`Imagem sem texto alternativo: ${event.id}`);
  }
  return items;
}
