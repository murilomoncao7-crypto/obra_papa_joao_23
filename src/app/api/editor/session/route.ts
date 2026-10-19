import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  createSession,
  editorConfigured,
  editorCookie,
  sameOrigin,
  sessionSeconds,
  verifyPassword,
} from "@/lib/editor/auth";
import { editorClient, publishingConfigured } from "@/lib/editor/cms";

export const runtime = "nodejs";

// Shared lockout in the CMS works across serverless instances and deployments.
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ message: "Origem inválida." }, { status: 403 });
  if (!editorConfigured() || !publishingConfigured())
    return NextResponse.json(
      { message: "O acesso editorial ainda precisa ser configurado." },
      { status: 503 },
    );
  if (Number(request.headers.get("content-length")) > 2048)
    return NextResponse.json({ message: "Solicitação inválida." }, { status: 413 });
  try {
    const body = await request.json();
    if (typeof body.username !== "string" || typeof body.password !== "string")
      return NextResponse.json({ message: "Informe usuário e senha." }, { status: 400 });
    const client = editorClient();
    // Vercel overwrites x-vercel-forwarded-for. Outside Vercel use a shared bucket.
    const ip = process.env.VERCEL
      ? (request.headers.get("x-vercel-forwarded-for") ?? "unknown")
      : "local";
    const id = `editor-login-${createHash("sha256").update(ip).digest("hex").slice(0, 32)}`;
    const windowMs = 15 * 60 * 1000;
    let attempt = await client.createIfNotExists({
      _id: id,
      _type: "editorLogin",
      count: 0,
      startedAt: Date.now(),
    });
    if (Date.now() - Number(attempt.startedAt) >= windowMs) {
      attempt = await client
        .patch(id)
        .ifRevisionId(attempt._rev)
        .set({ count: 0, startedAt: Date.now() })
        .commit();
    }
    if (Number(attempt.count) >= 5)
      return NextResponse.json(
        { message: "Muitas tentativas. Aguarde 15 minutos para tentar novamente." },
        { status: 429 },
      );
    await client.patch(id).ifRevisionId(attempt._rev).inc({ count: 1 }).commit();
    if (!verifyPassword(body.username, body.password))
      return NextResponse.json({ message: "Usuário ou senha inválidos." }, { status: 401 });
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(editorCookie, createSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: sessionSeconds,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json(
      { message: "Não foi possível entrar agora. Tente novamente." },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ message: "Origem inválida." }, { status: 403 });
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(editorCookie, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
