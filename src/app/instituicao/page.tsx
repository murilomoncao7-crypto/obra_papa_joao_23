import Image from "next/image";
import { notFound } from "next/navigation";
import { Paragraphs } from "@/components/content/Paragraphs";
import { PageHeader } from "@/components/layout/PageHeader";
import { RelatedCallout } from "@/components/layout/RelatedCallout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { contentRepository } from "@/content";
import styles from "@/styles/content-pages.module.css";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "Instituição",
  description:
    "Conheça a Obra de Assistência Social Papa João XXIII, sua missão, visão, valores e público atendido.",
  path: "/instituicao",
});

export default async function InstitutionPage() {
  const page = await contentRepository.getInstitutionalPageBySlug("instituicao");
  if (!page) notFound();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: page.title }]}
        title={page.title}
        summary={page.summary}
        visual={
          page.image ? (
            <div
              className={styles.imageFrame}
              style={
                page.image.width >= page.image.height
                  ? { aspectRatio: `${page.image.width} / ${page.image.height}` }
                  : undefined
              }
            >
              <Image
                src={page.image.src}
                alt={page.image.alt}
                fill
                loading="eager"
                sizes="(min-width: 768px) 42vw, 100vw"
              />
            </div>
          ) : undefined
        }
      />
      <Section>
        <Container>
          <nav className={styles.contextNavigation} aria-label="Nesta seção">
            <ul>
              <li>
                <a aria-current="page" href="/instituicao">
                  Instituição
                </a>
              </li>
              <li>
                <a href="/historia">História</a>
              </li>
            </ul>
          </nav>
          <div className={styles.reading}>
            <Paragraphs content={page.content} />
            <div className={styles.sections}>
              {page.sections?.map((section) => (
                <article key={section.id}>
                  <h2>{section.title}</h2>
                  {section.content ? <Paragraphs content={section.content} /> : null}
                  {section.items ? (
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
            {page.gallery && page.gallery.length > 1 ? (
              <div className={styles.gallery}>
                {page.gallery.map((image) => {
                  const source = image.variants?.gallery ?? image;
                  return (
                    <figure key={image.id}>
                      <div className={styles.galleryImageFrame}>
                        <Image
                          src={source.src}
                          alt={image.alt}
                          width={source.width}
                          height={source.height}
                          sizes="(max-width: 415px) calc(100vw - 2rem), (max-width: 767px) 46vw, 21rem"
                        />
                      </div>
                      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                    </figure>
                  );
                })}
              </div>
            ) : null}
          </div>
        </Container>
      </Section>
      <RelatedCallout
        title="Conheça as atividades"
        text="Veja as ações registradas no conteúdo institucional preservado."
        href="/atividades"
        label="Ver atividades"
      />
    </>
  );
}
