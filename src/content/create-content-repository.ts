import type { ContentRepository } from "./repository";
import { LocalContentRepository } from "./local-repository";
import { SanityContentRepository } from "@/sanity/repository";

export function createContentRepository(): ContentRepository {
  const localRepository = new LocalContentRepository();
  return new SanityContentRepository(localRepository);
}
