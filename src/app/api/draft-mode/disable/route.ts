import { draftMode } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const mode = await draftMode();
  mode.disable();
  return Response.redirect(new URL("/postagens", request.url), 303);
}
