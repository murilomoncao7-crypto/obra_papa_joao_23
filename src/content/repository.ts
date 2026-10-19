import type {
  Activity,
  Event,
  HomePageContent,
  InstitutionalPage,
  NewsPost,
  SiteSettings,
} from "./types";

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  unavailable?: boolean;
}

export interface NewsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  preview?: boolean;
}

export interface EventQuery {
  from?: string;
  to?: string;
  kind?: Event["kind"];
  includePast?: boolean;
}

export interface ContentRepository {
  getSiteSettings(): Promise<SiteSettings>;
  getHomePage(): Promise<HomePageContent>;
  getInstitutionalPages(): Promise<InstitutionalPage[]>;
  getInstitutionalPageBySlug(slug: string): Promise<InstitutionalPage | null>;
  getActivities(): Promise<Activity[]>;
  getActivityBySlug(slug: string): Promise<Activity | null>;
  getNews(options?: NewsQuery): Promise<PaginatedResult<NewsPost>>;
  getNewsCategories(): Promise<string[]>;
  getNewsBySlug(slug: string, options?: { preview?: boolean }): Promise<NewsPost | null>;
  getEvents(options?: EventQuery): Promise<Event[]>;
  getEventBySlug(slug: string): Promise<Event | null>;
}
