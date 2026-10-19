import { NextResponse } from "next/server";
import { isEditor, sameOrigin } from "@/lib/editor/auth";
import { editorClient } from "@/lib/editor/cms";
import { refreshPublications } from "@/lib/editor/revalidate";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request))
    return NextResponse.json({ message: "Origem inválida." }, { status: 403 });
  if (!(await isEditor()))
    return NextResponse.json({ message: "Faça login novamente." }, { status: 401 });
  const { id } = await params;
  if (!/^[a-zA-Z0-9_-]{1,120}$/.test(id))
    return NextResponse.json({ message: "Postagem inválida." }, { status: 400 });
  try {
    const { revision } = await request.json();
    if (typeof revision !== "string" || revision.length > 120)
      return NextResponse.json({ message: "Recarregue a lista." }, { status: 400 });
    const client = editorClient();
    const current = await client.getDocument(id);
    if (!current || current._type !== "postagem")
      return NextResponse.json({ message: "Postagem não encontrada." }, { status: 404 });
    // Removing from the feed is reversible and preserves the institutional record.
    await client.patch(id).ifRevisionId(revision).set({ editorialStatus: "archived" }).commit();
    refreshPublications();
    return NextResponse.json({ message: "Postagem retirada do feed." });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível retirar a postagem. Recarregue a lista e tente novamente." },
      { status: 409 },
    );
  }
}
