import type { Metadata } from "next";
import { getAbsoluteUrl } from "./site-url";

type PageMetadataOptions = { title: string; description: string; path: string; noIndex?: boolean };

export function createPageMetadata({
  title,
  description,
  path,
  noIndex,
}: PageMetadataOptions): Metadata {
  const url = getAbsoluteUrl(path);
  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: { type: "website", locale: "pt_BR", title, description, url },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
