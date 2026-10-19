const projectIdPattern = /^[a-z0-9-]+$/;
const datasetPattern = /^[a-z0-9_-]+$/;

export type SanityPublicConfig = {
  projectId: string;
  dataset: string;
};

export function getSanityPublicConfig(): SanityPublicConfig | null {
  const projectId = (
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
    process.env.SANITY_API_PROJECT_ID ??
    process.env.SANITY_STUDIO_PROJECT_ID
  )?.trim();
  const dataset = (
    process.env.NEXT_PUBLIC_SANITY_DATASET ??
    process.env.SANITY_API_DATASET ??
    process.env.SANITY_STUDIO_DATASET
  )?.trim();

  if (
    !projectId ||
    !dataset ||
    !projectIdPattern.test(projectId) ||
    !datasetPattern.test(dataset)
  ) {
    return null;
  }

  return { projectId, dataset };
}

export function isSanityConfigured() {
  return getSanityPublicConfig() !== null;
}

export function getSanityReadToken() {
  return (
    process.env.SANITY_API_TOKEN?.trim() || process.env.SANITY_API_READ_TOKEN?.trim() || undefined
  );
}

export const sanityApiVersion = "2026-08-20";
