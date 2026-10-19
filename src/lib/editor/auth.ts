import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const editorCookie = "obra_editor";
export const sessionSeconds = 8 * 60 * 60;

export function editorConfigured() {
  return Boolean(
    process.env.EDITOR_USERNAME &&
    process.env.EDITOR_PASSWORD_HASH &&
    (process.env.EDITOR_SESSION_SECRET?.length ?? 0) >= 32,
  );
}

export function verifyPassword(username: string, password: string) {
  if (!editorConfigured() || password.length > 256 || username.length > 80) return false;
  const [salt, hash] = process.env.EDITOR_PASSWORD_HASH!.split(":");
  if (!salt || !hash || !/^[a-f0-9]{128}$/.test(hash)) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  const passwordMatches = timingSafeEqual(actual, expected);
  return username === process.env.EDITOR_USERNAME && passwordMatches;
}

function signature(payload: string) {
  return createHmac("sha256", process.env.EDITOR_SESSION_SECRET!)
    .update(`${process.env.EDITOR_USERNAME}:${process.env.EDITOR_PASSWORD_HASH}:${payload}`)
    .digest("hex");
}

export function createSession(now = Date.now()) {
  if (!editorConfigured()) throw new Error("EDITOR_NOT_CONFIGURED");
  const payload = Buffer.from(
    JSON.stringify({
      expires: now + sessionSeconds * 1000,
      nonce: randomBytes(16).toString("hex"),
    }),
  ).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function validSession(token: string | undefined, now = Date.now()) {
  if (!token || token.length > 512 || !editorConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 2 || !/^[a-f0-9]{64}$/.test(parts[1])) return false;
  if (!timingSafeEqual(Buffer.from(signature(parts[0]), "hex"), Buffer.from(parts[1], "hex")))
    return false;
  try {
    const data = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    return (
      typeof data.expires === "number" &&
      data.expires > now &&
      data.expires <= now + sessionSeconds * 1000
    );
  } catch {
    return false;
  }
}

export async function isEditor() {
  return validSession((await cookies()).get(editorCookie)?.value);
}

export function sameOrigin(request: Request) {
  try {
    return request.headers.get("origin") === new URL(request.url).origin;
  } catch {
    return false;
  }
}
