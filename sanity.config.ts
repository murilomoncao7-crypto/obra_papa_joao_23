import { createSanityConfig } from "./src/sanity/config";

export default createSanityConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "projeto-nao-configurado",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  previewOrigin: process.env.NEXT_PUBLIC_SITE_URL || "https://obra-papa-joao-23.vercel.app",
});
