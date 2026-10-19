import type { Metadata } from "next";
import type { Event, NewsPost } from "@/content/types";
import { getAbsoluteUrl } from "./site-url";

export function postMetadata(post: NewsPost): Metadata {
  const url = getAbsoluteUrl(`/postagens/${post.slug}`);
  const socialImage = post.socialImage?.src ?? post.coverImage;
  const socialImageAlt = post.socialImage?.alt ?? post.coverImageAlt;
  return {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.summary,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      type: "article",
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.summary,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : undefined,
      images: socialImage ? [{ url: socialImage, alt: socialImageAlt }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.summary,
      images: socialImage ? [{ url: socialImage, alt: socialImageAlt }] : [],
    },
  };
}

export const newsMetadata = postMetadata;

export function eventMetadata(event: Event): Metadata {
  const url = getAbsoluteUrl(`/eventos/${event.slug}`);
  const socialImage = event.image ? getAbsoluteUrl(event.image) : undefined;
  return {
    title: event.seo?.title ?? event.title,
    description: event.seo?.description ?? event.summary,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      type: "article",
      title: event.title,
      description: event.summary,
      url,
      images: socialImage ? [{ url: socialImage, alt: event.imageAlt }] : undefined,
    },
  };
}

export function absolutePublicationUrl(path: string) {
  return getAbsoluteUrl(path);
}
