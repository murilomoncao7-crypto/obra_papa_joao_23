"use client";

import { NextStudio } from "next-sanity/studio";
import { createSanityConfig } from "@/sanity/config";

type GestaoStudioProps = {
  projectId: string;
  dataset: string;
  previewOrigin: string;
};

export function GestaoStudio({ projectId, dataset, previewOrigin }: GestaoStudioProps) {
  return (
    <NextStudio config={createSanityConfig({ projectId, dataset, previewOrigin })} scheme="light" />
  );
}
