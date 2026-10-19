import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/gestao/", "/api/draft-mode/", "/api/sanity/"],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
