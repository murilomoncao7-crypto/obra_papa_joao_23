import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import type { NewsPost } from "@/content/types";
import { formatPublicationDate } from "@/content/publication-utils";
import styles from "./PostCard.module.css";

const statusLabels = {
  draft: "Rascunho",
  inReview: "Em revisão",
  published: "Publicado",
  archived: "Arquivado",
};

export function PostCard({ post, preview = false }: { post: NewsPost; preview?: boolean }) {
  return (
    <article className={styles.card}>
      {post.coverImage ? (
        <Link className={styles.imageLink} href={`/postagens/${post.slug}`} tabIndex={-1}>
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt}
            width={post.coverImageWidth ?? 1200}
            height={post.coverImageHeight ?? 800}
            sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) 50vw, 33vw"
          />
        </Link>
      ) : null}
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
