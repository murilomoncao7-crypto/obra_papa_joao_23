import type { ContentRepository, NewsQuery, PaginatedResult } from "@/content/repository";
import type { ContentStatus, NewsPost, PublicationImage } from "@/content/types";
import { getPreviewSanityClient, getPublishedSanityClient } from "@/sanity/lib/client";
import {
  previewPostBySlugQuery,
  previewPostsQuery,
  publishedCategoriesQuery,
  publishedPostBySlugQuery,
  publishedPostsQuery,
} from "@/sanity/queries";

type SanityPostDto = Partial<NewsPost> & {
  id?: unknown;
  slug?: unknown;
  title?: unknown;
  summary?: unknown;
  publishedAt?: unknown;
  category?: unknown;
};

const positiveInteger = (value: number | undefined, fallback: number) =>
  Number.isInteger(value) && value && value > 0 ? value : fallback;

function contentStatus(value: unknown): ContentStatus {
  if (value === "inReview" || value === "published" || value === "archived") return value;
  return "draft";
}

function publicationImage(value: unknown): PublicationImage | undefined {
  if (!value || typeof value !== "object") return undefined;
  const image = value as Partial<PublicationImage>;
  if (
    typeof image.src !== "string" ||
    !image.src.startsWith("https://cdn.sanity.io/images/") ||
    typeof image.width !== "number" ||
    typeof image.height !== "number" ||
    typeof image.alt !== "string"
  ) {
    return undefined;
  }
  return {
    id: typeof image.id === "string" ? image.id : image.src,
    src: image.src,
    width: image.width,
    height: image.height,
    alt: image.alt,
    caption: typeof image.caption === "string" ? image.caption : undefined,
    credit: typeof image.credit === "string" ? image.credit : undefined,
    context: typeof image.context === "string" ? image.context : undefined,
    photographedAt: typeof image.photographedAt === "string" ? image.photographedAt : undefined,
  };
}

function mapPost(value: SanityPostDto | null): NewsPost | null {
  if (
    !value ||
    typeof value.id !== "string" ||
    typeof value.slug !== "string" ||
    typeof value.title !== "string" ||
    typeof value.summary !== "string" ||
    typeof value.publishedAt !== "string" ||
    typeof value.category !== "string"
  ) {
    return null;
  }

  const gallery = Array.isArray(value.gallery)
    ? value.gallery
        .map(publicationImage)
        .filter((image): image is PublicationImage => Boolean(image))
    : [];

  return {
    id: value.id.replace(/^drafts\./, ""),
    slug: value.slug,
    title: value.title,
    summary: value.summary,
    content: Array.isArray(value.content) || typeof value.content === "string" ? value.content : "",
    publishedAt: value.publishedAt,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
    author: typeof value.author === "string" ? value.author : undefined,
    category: value.category,
    tags: Array.isArray(value.tags)
      ? value.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    coverImage:
      typeof value.coverImage === "string" &&
      value.coverImage.startsWith("https://cdn.sanity.io/images/")
        ? value.coverImage
        : undefined,
    coverImageWidth: typeof value.coverImageWidth === "number" ? value.coverImageWidth : undefined,
    coverImageHeight:
      typeof value.coverImageHeight === "number" ? value.coverImageHeight : undefined,
    coverImageAlt: typeof value.coverImageAlt === "string" ? value.coverImageAlt : "",
    coverImageCaption:
      typeof value.coverImageCaption === "string" ? value.coverImageCaption : undefined,
    coverImageCredit:
      typeof value.coverImageCredit === "string" ? value.coverImageCredit : undefined,
    coverImageContext:
      typeof value.coverImageContext === "string" ? value.coverImageContext : undefined,
    gallery,
    socialImage: publicationImage(value.socialImage),
    featured: value.featured === true,
    status: contentStatus(value.status),
    seo: value.seo && typeof value.seo === "object" ? value.seo : undefined,
  };
}

function cmsUnavailable() {
  console.error("[conteudo] O CMS de postagens está temporariamente indisponível.");
}

export class SanityContentRepository implements ContentRepository {
  constructor(private readonly fallback: ContentRepository) {}

  getSiteSettings = () => this.fallback.getSiteSettings();
  getHomePage = () => this.fallback.getHomePage();
  getInstitutionalPages = () => this.fallback.getInstitutionalPages();
  getInstitutionalPageBySlug = (slug: string) => this.fallback.getInstitutionalPageBySlug(slug);
  getActivities = () => this.fallback.getActivities();
  getActivityBySlug = (slug: string) => this.fallback.getActivityBySlug(slug);
  getEvents = (options?: Parameters<ContentRepository["getEvents"]>[0]) =>
    this.fallback.getEvents(options);
  getEventBySlug = (slug: string) => this.fallback.getEventBySlug(slug);

  async getNews(options: NewsQuery = {}): Promise<PaginatedResult<NewsPost>> {
    const page = positiveInteger(options.page, 1);
    const pageSize = Math.min(positiveInteger(options.pageSize, 9), 100);
    const client = options.preview ? getPreviewSanityClient() : getPublishedSanityClient();
    if (!client) return this.fallback.getNews(options);

    try {
      const start = (page - 1) * pageSize;
      const query = options.preview ? previewPostsQuery : publishedPostsQuery;
      const result = await client.fetch<{ items: SanityPostDto[]; total: number }>(
        query,
        { start, end: start + pageSize, category: options.category ?? null },
        options.preview
          ? { cache: "no-store" }
          : { next: { revalidate: 30, tags: ["sanity", "postagem"] } },
      );
      const items = result.items.map(mapPost).filter((post): post is NewsPost => Boolean(post));
      return {
        items,
        page,
        pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / pageSize),
      };
    } catch {
      cmsUnavailable();
      return { ...(await this.fallback.getNews(options)), unavailable: true };
    }
  }

  async getNewsCategories() {
    const client = getPublishedSanityClient();
    if (!client) return this.fallback.getNewsCategories();
    try {
      const categories = await client.fetch<unknown[]>(
        publishedCategoriesQuery,
        {},
        {
          next: { revalidate: 30, tags: ["sanity", "categoria", "postagem"] },
        },
      );
      return categories
        .filter((category): category is string => typeof category === "string" && Boolean(category))
        .toSorted((a, b) => a.localeCompare(b, "pt-BR"));
    } catch {
      cmsUnavailable();
      return this.fallback.getNewsCategories();
    }
  }

  async getNewsBySlug(slug: string, options: { preview?: boolean } = {}) {
    const client = options.preview ? getPreviewSanityClient() : getPublishedSanityClient();
    if (!client) return this.fallback.getNewsBySlug(slug, options);
    try {
      const query = options.preview ? previewPostBySlugQuery : publishedPostBySlugQuery;
      const value = await client.fetch<SanityPostDto | null>(
        query,
        { slug },
        options.preview
          ? { cache: "no-store" }
          : { next: { revalidate: 30, tags: ["sanity", "postagem", `postagem:${slug}`] } },
      );
      return mapPost(value);
    } catch {
      cmsUnavailable();
      return this.fallback.getNewsBySlug(slug, options);
    }
  }
}
