import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { defineDocuments, defineLocations, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { sanityApiVersion, type SanityPublicConfig } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

type StudioConfigOptions = SanityPublicConfig & { previewOrigin: string };

const productionOrigin = "https://obra-papa-joao-23.vercel.app";

const mainDocuments = defineDocuments([
  {
    route: "/postagens/:slug",
    filter: `_type == "postagem" && slug.current == $slug`,
  },
]);

const locations = {
  postagem: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (document) => ({
      locations: [
        ...(document?.slug
          ? [
              {
                title: document.title || "Postagem",
                href: `/postagens/${document.slug}`,
              },
            ]
          : []),
        { title: "Todas as postagens", href: "/postagens" },
        { title: "Página inicial", href: "/" },
      ],
    }),
  }),
};

export function createSanityConfig({ projectId, dataset, previewOrigin }: StudioConfigOptions) {
  const allowOrigins = new Set([previewOrigin, productionOrigin]);
  if (process.env.NODE_ENV === "development") allowOrigins.add("http://localhost:*");

  return defineConfig({
    name: "default",
    title: "Gestão de conteúdo — Obra Papa João XXIII",
    basePath: "/gestao",
    projectId,
    dataset,
    schema: { types: schemaTypes },
    plugins: [
      structureTool({ structure }),
      presentationTool({
        title: "Pré-visualização",
        previewUrl: {
          initial: previewOrigin,
          previewMode: {
            enable: "/api/draft-mode/enable",
            disable: "/api/draft-mode/disable",
            shareAccess: false,
          },
        },
        allowOrigins: [...allowOrigins],
        resolve: { mainDocuments, locations },
      }),
      visionTool({ defaultApiVersion: sanityApiVersion }),
    ],
    document: {
      actions: (previous, context) =>
        context.schemaType === "configuracoesSite"
          ? previous.filter((action) => !["delete", "duplicate"].includes(action.action ?? ""))
          : previous,
    },
  });
}
