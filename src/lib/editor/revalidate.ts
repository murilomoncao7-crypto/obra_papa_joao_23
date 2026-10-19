import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";

export function refreshPublications() {
  for (const tag of ["sanity", "postagem", "categoria"]) revalidateTag(tag, { expire: 0 });
  for (const path of ["/", "/postagens", "/sitemap.xml"]) revalidatePath(path);
  revalidatePath("/postagens/[slug]", "page");
}
