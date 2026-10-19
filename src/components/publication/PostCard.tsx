import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import type { NewsPost } from "@/content/types";
import { formatPublicationDate } from "@/content/publication-utils";
import styles from "./PostCard.module.css";
import { PostPhotos } from "./PostPhotos";
import type { PublicationImage } from "@/content/types";

const statusLabels = {
  draft: "Rascunho",
  inReview: "Em revisão",
  published: "Publicado",
  archived: "Arquivado",
};

export function PostCard({ post, preview = false }: { post: NewsPost; preview?: boolean }) {
  const images: PublicationImage[] = [
    ...(post.coverImage
      ? [
          {
            id: `${post.id}-capa`,
            src: post.coverImage,
            width: post.coverImageWidth ?? 1200,
            height: post.coverImageHeight ?? 800,
            alt: post.coverImageAlt,
          },
        ]
      : []),
    ...(post.gallery ?? []),
  ].filter(
    (image, index, all) => all.findIndex((candidate) => candidate.src === image.src) === index,
  );
  return (
    <article className={styles.card}>
      <header className={styles.profile}>
        <span className={styles.avatar} aria-hidden="true">
          O
        </span>
        <div>
          <strong>Obra Papa João XXIII</strong>
          <span>{post.author || "Histórias da nossa comunidade"}</span>
        </div>
      </header>
      <PostPhotos images={images} title={post.title} />
      <div className={styles.content}>
        <div className={styles.meta}>
          <Tag>{post.category}</Tag>
          <time dateTime={post.publishedAt}>{formatPublicationDate(post.publishedAt)}</time>
          {preview ? <span className={styles.status}>{statusLabels[post.status]}</span> : null}
        </div>
        <h2>
          <Link href={`/postagens/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.summary}</p>
        <Link className={styles.readMore} href={`/postagens/${post.slug}`}>
          Ler postagem
        </Link>
      </div>
    </article>
  );
}
