import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { getPreviewSanityClient } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const client = getPreviewSanityClient();
  if (!client) {
    return Response.json(
      { message: "A pré-visualização ainda não está configurada." },
      { status: 503 },
    );
  }

  return defineEnableDraftMode({ client }).GET(request);
}
