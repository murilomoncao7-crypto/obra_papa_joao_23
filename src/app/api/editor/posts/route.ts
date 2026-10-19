import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { isEditor, sameOrigin } from "@/lib/editor/auth";
import { editorClient, managedPosts } from "@/lib/editor/cms";
import { refreshPublications } from "@/lib/editor/revalidate";
import { publicationBlocks, publicationSlug, publicationText } from "@/lib/editor/publication";

export const runtime = "nodejs";
export const maxDuration = 60;
const maxBody = 4_000_000;

export async function GET() {
  if (!(await isEditor())) return NextResponse.json({ message: "Faça login." }, { status: 401 });
  try {
    return NextResponse.json(
      { posts: await managedPosts() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Não foi possível carregar as postagens." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ message: "Origem inválida." }, { status: 403 });
  if (!(await isEditor()))
    return NextResponse.json({ message: "Sua sessão expirou. Entre novamente." }, { status: 401 });
  if (Number(request.headers.get("content-length")) > maxBody)
    return NextResponse.json(
      { message: "As imagens excedem o limite. Reduza o tamanho e tente novamente." },
      { status: 413 },
    );
  const uploaded: string[] = [];
  let committed = false;
  try {
    // Bound the actual request even if Content-Length is missing or incorrect.
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ message: "Formulário vazio." }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBody) {
        await reader.cancel();
        return NextResponse.json(
          { message: "Envie no máximo 3 imagens, com até 1 MB cada após preparo." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const data = await new Request(request.url, {
      method: "POST",
      headers: { "content-type": request.headers.get("content-type") ?? "" },
      body: Buffer.concat(chunks),
    }).formData();
    const title = publicationText(data.get("title"), 120);
    const text = publicationText(data.get("text"), 10000);
    const alt = publicationText(data.get("alt"), 180);
    const credit = publicationText(data.get("credit"), 160);
    const author = publicationText(data.get("author"), 100);
    const category = publicationText(data.get("category"), 60);
    const files = data
      .getAll("photos")
      .filter((value): value is File => value instanceof File && value.size > 0);
    if (
      title.length < 5 ||
      title.length > 120 ||
      text.length < 30 ||
      text.length > 10000 ||
      alt.length < 5 ||
      alt.length > 180 ||
      !credit ||
      credit.length > 160 ||
      !author ||
      author.length > 100 ||
      !category ||
      category.length > 60 ||
      files.length < 1 ||
      files.length > 3 ||
      data.get("rights") !== "true"
    )
      return NextResponse.json(
        {
          message:
            "Confira título, texto, responsável, categoria, descrição das fotos e autorizações. Envie de 1 a 3 fotos.",
        },
        { status: 400 },
      );
    const processed = [];
    for (const file of files) {
      if (
        !new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type) ||
        file.size > 1_100_000
      )
        return NextResponse.json(
          { message: "Use JPG, PNG ou WebP. Prepare novamente as fotos antes de publicar." },
          { status: 400 },
        );
      const bytes = Buffer.from(await file.arrayBuffer());
      const image = sharp(bytes, { limitInputPixels: 24_000_000, animated: false });
      const metadata = await image.metadata();
      if (
        !["jpeg", "png", "webp"].includes(metadata.format ?? "") ||
        (metadata.pages ?? 1) > 1 ||
        !metadata.width ||
        !metadata.height ||
        metadata.width < 320 ||
        metadata.height < 320
      )
        return NextResponse.json(
          { message: "As fotos devem ser estáticas e ter pelo menos 320 × 320 pixels." },
          { status: 400 },
        );
      processed.push(
        await image
          .rotate()
          .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer(),
      );
    }
    const client = editorClient();
    const images = [];
    for (const bytes of processed) {
      const asset = await client.assets.upload("image", bytes, {
        filename: `postagem-${randomUUID()}.webp`,
        contentType: "image/webp",
      });
      uploaded.push(asset._id);
      images.push({
        _type: "imagemEditorial",
        _key: randomUUID(),
        asset: { _type: "reference", _ref: asset._id },
        alt,
        caption: title,
        credit,
        context: title,
        authorized: true,
        internetAllowed: true,
      });
    }
    const categoryId = `categoria-${createHash("sha256").update(category.toLowerCase()).digest("hex").slice(0, 32)}`;
    const authorId = `autor-${createHash("sha256").update(author.toLowerCase()).digest("hex").slice(0, 32)}`;
    await client.createIfNotExists({
      _id: categoryId,
      _type: "categoria",
      title: category,
      slug: { _type: "slug", current: publicationSlug(category) },
    });
    await client.createIfNotExists({ _id: authorId, _type: "autor", name: author });
    const slug = publicationSlug(title);
    const post = await client.create({
      _id: `postagem-${randomUUID()}`,
      _type: "postagem",
      title,
      slug: { _type: "slug", current: slug },
      summary: text.slice(0, 280),
      content: publicationBlocks(text),
      coverImage: images[0],
      gallery: images.slice(1),
      category: { _type: "reference", _ref: categoryId },
      author: { _type: "reference", _ref: authorId },
      publishedAt: new Date().toISOString(),
      editorialStatus: "published",
      featured: false,
      tags: [],
    });
    committed = true;
    refreshPublications();
    return NextResponse.json(
      {
        id: post._id,
        url: `/postagens/${slug}`,
        message: "Postagem publicada. O feed já foi atualizado.",
      },
      { status: 201 },
    );
  } catch {
    // A failed publication must not leave unreferenced photos in the CMS.
    if (!committed) {
      for (const id of uploaded) {
        try {
          await editorClient().delete(id);
        } catch {
          /* Referenced assets are retained by the CMS. */
        }
      }
    }
    return NextResponse.json(
      {
        message: committed
          ? "A postagem foi salva. Atualize o feed para conferir."
          : "Não foi possível publicar. Verifique os arquivos e a conexão e tente novamente.",
      },
      { status: committed ? 201 : 503 },
    );
  }
}
