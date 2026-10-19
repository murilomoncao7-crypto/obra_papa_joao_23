const siteUrlValue = process.env.NEXT_PUBLIC_SITE_URL;

export function getSiteUrl(): URL | null {
  if (!siteUrlValue) return null;
  try {
    const url = new URL(siteUrlValue);
    return url.protocol === "https:" || url.hostname === "localhost" ? url : null;
  } catch {
    return null;
  }
}

export function getAbsoluteUrl(path: string): string | undefined {
  const siteUrl = getSiteUrl();
  return siteUrl ? new URL(path, siteUrl).toString() : undefined;
}
