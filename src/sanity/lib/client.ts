import "server-only";
import { createClient, type SanityClient } from "next-sanity";
import { getSanityPublicConfig, getSanityReadToken, sanityApiVersion } from "@/sanity/env";

let publishedClient: SanityClient | null = null;

export function getPublishedSanityClient() {
  const config = getSanityPublicConfig();
  if (!config) return null;

  publishedClient ??= createClient({
    ...config,
    apiVersion: sanityApiVersion,
    perspective: "published",
    useCdn: true,
    token: getSanityReadToken(),
    requestTagPrefix: "obra-papa-joao-23",
  });

  return publishedClient;
}

export function getPreviewSanityClient() {
  const config = getSanityPublicConfig();
  const token = getSanityReadToken();
  if (!config || !token) return null;

  return createClient({
    ...config,
    apiVersion: sanityApiVersion,
    perspective: "drafts",
    useCdn: false,
    token,
    requestTagPrefix: "obra-papa-joao-23-preview",
  });
}
