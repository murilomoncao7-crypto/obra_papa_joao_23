import { createContentRepository } from "./create-content-repository";

export type { ContentRepository, EventQuery, NewsQuery, PaginatedResult } from "./repository";
export type * from "./types";

export const contentRepository = createContentRepository();
