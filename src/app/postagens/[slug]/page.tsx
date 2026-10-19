import type { Metadata } from "next";
import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PortablePostContent } from "@/components/publication/PortablePostContent";
import { PostCard } from "@/components/publication/PostCard";
import { PreviewModeBanner } from "@/components/publication/PreviewModeBanner";
import { StructuredData } from "@/components/publication/StructuredData";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { contentRepository } from "@/content";
import { formatPublicationDate } from "@/content/publication-utils";
import { absolutePublicationUrl, postMetadata } from "@/lib/publication-metadata";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const getPost = cache((slug: string, preview: boolean) =>
  contentRepository.getNewsBySlug(slug, { preview }),
);

export async function generateStaticParams() {
  return (await contentRepository.getNews({ pageSize: 100 })).items.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!slugPattern.test(slug)) return {};
  const preview = (await draftMode()).isEnabled;
  const post = await getPost(slug, preview);
  if (!post) return {};
  return preview
    ? { ...postMetadata(post), robots: { index: false, follow: false } }
    : postMetadata(post);
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!slugPattern.test(slug)) notFound();
  const preview = (await draftMode()).isEnabled;
  const post = await getPost(slug, preview);
  if (!post) notFound();

  const relatedResult = await contentRepository.getNews({
    category: post.category,
    pageSize: 4,
    preview,
  });
  const related = relatedResult.items.filter((item) => item.id !== post.id).slice(0, 3);
  const canonical = absolutePublicationUrl(`/postagens/${post.slug}`);
  const updatedIsRelevant =
    post.updatedAt && post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10);

  return (
    <>
      {preview ? <PreviewModeBanner /> : null}
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.summary,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: post.author
            ? { "@type": "Person", name: post.author }
            : { "@type": "Organization", name: "Obra Papa João XXIII" },
          publisher: { "@type": "Organization", name: "Obra Papa João XXIII" },
          image: post.socialImage?.src ?? post.coverImage,
          mainEntityOfPage: canonical,
        }}
      />
      <PageHeader
        breadcrumbs={[{ href: "/postagens", label: "Postagens" }, { label: post.title }]}
        title={post.title}
        summary={post.summary}
      />
      <Section>
        <Container>
          <article className={styles.article}>
            <div className={styles.meta}>
              <Tag>{post.category}</Tag>
              <time dateTime={post.publishedAt}>
                Publicado em {formatPublicationDate(post.publishedAt)}
              </time>
              {updatedIsRelevant ? (
                <time dateTime={post.updatedAt}>
                  Atualizado em {formatPublicationDate(post.updatedAt!)}
                </time>
              ) : null}
              {post.author ? <span>Por {post.author}</span> : null}
              {preview ? <span className={styles.status}>Status: {post.status}</span> : null}
            </div>

            {post.coverImage ? (
              <figure className={styles.cover}>
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt}
                  width={post.coverImageWidth ?? 1200}
                  height={post.coverImageHeight ?? 800}
                  priority
                  sizes="(max-width: 767px) calc(100vw - 2rem), 44rem"
                />
                {post.coverImageCaption || post.coverImageCredit ? (
                  <figcaption>
                    {post.coverImageCaption}
                    {post.coverImageCredit ? <span> Foto: {post.coverImageCredit}</span> : null}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            <PortablePostContent value={post.content} />

            {post.gallery?.length ? (
              <section className={styles.gallerySection} aria-labelledby="galeria-titulo">
                <h2 id="galeria-titulo">Galeria de fotografias</h2>
                <div className={styles.gallery}>
                  {post.gallery.map((image) => (
                    <figure key={image.id}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        sizes="(max-width: 639px) calc(100vw - 2rem), 22rem"
                      />
                      {image.caption || image.credit ? (
                        <figcaption>
                          {image.caption}
                          {image.credit ? <span> Foto: {image.credit}</span> : null}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            {canonical ? (
              <section className={styles.share} aria-labelledby="compartilhar-titulo">
                <h2 id="compartilhar-titulo">Compartilhar</h2>
                <p>Estes links só abrem o serviço escolhido quando você decide usá-lo.</p>
                <div className={styles.shareLinks}>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${canonical}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(canonical)}`}
                  >
                    E-mail
                  </a>
                </div>
              </section>
            ) : null}
          </article>

          {related.length ? (
            <aside className={styles.related} aria-labelledby="relacionadas-titulo">
              <h2 id="relacionadas-titulo">Postagens relacionadas</h2>
              <div className={styles.relatedGrid}>
                {related.map((item) => (
                  <PostCard key={item.id} post={item} preview={preview} />
                ))}
              </div>
            </aside>
          ) : null}

          <p className={styles.back}>
            <TextLink href="/postagens">Voltar para postagens</TextLink>
          </p>
        </Container>
      </Section>
    </>
  );
}
