import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { PageHeader } from "@/components/layout/PageHeader";
import { PostCard } from "@/components/publication/PostCard";
import { PreviewModeBanner } from "@/components/publication/PreviewModeBanner";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { contentRepository } from "@/content";
import { createPageMetadata } from "@/lib/page-metadata";
import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Postagens",
  description: "Histórias, atividades e comunicados da Obra Papa João XXIII.",
  path: "/postagens",
});

type Props = {
  searchParams: Promise<{ page?: string; categoria?: string }>;
};

function pageUrl(page: number, category?: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (category) params.set("categoria", category);
  const query = params.toString();
  return query ? `/postagens?${query}` : "/postagens";
}

export default async function PostsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const category = params.categoria?.trim().slice(0, 80) || undefined;
  const preview = (await draftMode()).isEnabled;
  const [result, categories] = await Promise.all([
    contentRepository.getNews({ page, pageSize: 9, category, preview }),
    contentRepository.getNewsCategories(),
  ]);

  return (
    <>
      {preview ? <PreviewModeBanner /> : null}
      <PageHeader
        breadcrumbs={[{ label: "Postagens" }]}
        title="Postagens"
        summary="Histórias, atividades e comunicados da Obra Papa João XXIII."
      />
      <Section>
        <Container>
          {categories.length > 0 ? (
            <nav className={styles.controls} aria-label="Filtrar postagens por categoria">
              <h2>Filtrar por categoria</h2>
              <ul className={styles.filters}>
                <li>
                  <Link href="/postagens" aria-current={!category ? "page" : undefined}>
                    Todas
                  </Link>
                </li>
                {categories.map((item) => (
                  <li key={item}>
                    <Link
                      href={pageUrl(1, item)}
                      aria-current={category === item ? "page" : undefined}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {result.unavailable ? (
            <div className={styles.notice} role="status">
              <strong>Não foi possível atualizar as postagens agora.</strong>
              <p>O restante do site continua disponível. Tente novamente em alguns instantes.</p>
            </div>
          ) : null}

          {result.items.length === 0 ? (
            <div className={styles.empty}>
              <h2>Nenhuma postagem disponível</h2>
              <p>
                Em breve, novas histórias e atividades da Obra Papa João XXIII serão compartilhadas
                aqui.
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {result.items.map((post) => (
                <PostCard key={post.id} post={post} preview={preview} />
              ))}
            </div>
          )}

          {result.totalPages > 1 ? (
            <nav className={styles.pagination} aria-label="Paginação das postagens">
              {result.page > 1 ? (
                <Link href={pageUrl(result.page - 1, category)}>Postagens anteriores</Link>
              ) : null}
              <span aria-live="polite">
                Página {result.page} de {result.totalPages}
              </span>
              {result.page < result.totalPages ? (
                <Link href={pageUrl(result.page + 1, category)}>Próximas postagens</Link>
              ) : null}
            </nav>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
