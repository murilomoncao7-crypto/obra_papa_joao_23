import type { MetadataRoute } from "next";
import { contentRepository } from "@/content";
import { getAbsoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getAbsoluteUrl("/");
  if (!base) return [];
  const [activities, posts, events] = await Promise.all([
    contentRepository.getActivities(),
    contentRepository.getNews({ pageSize: 100 }),
    contentRepository.getEvents(),
  ]);
  const paths = [
    "/",
    "/instituicao",
    "/historia",
    "/atividades",
    "/postagens",
    "/eventos",
    "/como-ajudar",
    "/contato",
    "/politica-de-privacidade",
    ...activities.map(({ slug }) => `/atividades/${slug}`),
    ...posts.items.map(({ slug }) => `/postagens/${slug}`),
    ...events.map(({ slug }) => `/eventos/${slug}`),
  ];
  return paths.map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
