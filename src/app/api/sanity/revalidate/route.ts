import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

type SanityWebhookBody = {
  _type?: string;
  slug?: string | { current?: string };
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    return Response.json({ message: "Revalidação não configurada." }, { status: 503 });
  }

  try {
    const { isValidSignature, body } = await parseBody<SanityWebhookBody>(request, secret, true);
    if (!isValidSignature) {
      return Response.json({ message: "Assinatura inválida." }, { status: 401 });
    }
    if (!body?._type || !["postagem", "categoria", "autor"].includes(body._type)) {
      return Response.json({ message: "Evento ignorado." }, { status: 202 });
    }

    revalidateTag("sanity", "max");
    revalidateTag("postagem", "max");
    revalidateTag("categoria", "max");
    revalidatePath("/", "page");
    revalidatePath("/postagens", "page");
    revalidatePath("/postagens/[slug]", "page");
    revalidatePath("/sitemap.xml", "page");

    const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;
    if (slug && slugPattern.test(slug)) revalidateTag(`postagem:${slug}`, "max");

    return Response.json({ revalidated: true });
  } catch {
    console.error("[conteudo] Falha ao processar uma revalidação assinada do CMS.");
    return Response.json({ message: "Não foi possível revalidar o conteúdo." }, { status: 400 });
  }
}
