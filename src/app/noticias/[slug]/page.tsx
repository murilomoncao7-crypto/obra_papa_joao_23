type Props = { params: Promise<{ slug: string }> };
import { permanentRedirect } from "next/navigation";

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/postagens/${encodeURIComponent(slug)}`);
}
