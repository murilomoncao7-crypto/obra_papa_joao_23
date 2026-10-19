import "server-only";
import { createClient } from "next-sanity";
import { getSanityPublicConfig, sanityApiVersion } from "@/sanity/env";

export function publishingConfigured() {
  return Boolean(getSanityPublicConfig() && process.env.SANITY_EDITOR_TOKEN);
}

export function editorClient() {
  const config = getSanityPublicConfig();
  const token = process.env.SANITY_EDITOR_TOKEN;
  if (!config || !token) throw new Error("CMS_NOT_CONFIGURED");
  return createClient({ ...config, token, apiVersion: sanityApiVersion, useCdn: false });
}

export type ManagedPost = {
  _id: string;
  _rev: string;
  title: string;
  slug: string;
  publishedAt: string;
  editorialStatus: string;
};

export async function managedPosts() {
  return editorClient().fetch<ManagedPost[]>(
    `*[_type == "postagem" && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...100]{_id, _rev, title, "slug": slug.current, publishedAt, editorialStatus}`,
    {},
    { cache: "no-store" },
  );
}
