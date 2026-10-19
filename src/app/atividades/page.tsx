import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { RelatedCallout } from "@/components/layout/RelatedCallout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { contentRepository } from "@/content";
import styles from "@/styles/content-pages.module.css";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "Atividades",
  description:
    "Atividades de formação, convivência, cultura e esporte registradas pela Obra Papa João XXIII.",
  path: "/atividades",
});

export default async function ActivitiesPage() {
  const activities = await contentRepository.getActivities();
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Atividades" }]}
        title="Atividades"
        summary="Ações identificadas no conteúdo institucional preservado. Agenda, turmas e horários ainda precisam ser confirmados."
      />
      <Section>
        <Container className={styles.activityIndex}>
          {activities.map((activity, index) => {
            const image = activity.image?.variants?.card ?? activity.image;
            return (
              <article className={styles.activityRow} key={activity.id}>
                {image && activity.image ? (
                  <div className={styles.imageFrame}>
                    <Image
                      src={image.src}
                      alt={activity.image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(min-width: 768px) 40vw, 100vw"
                    />
                  </div>
                ) : null}
                <div className={styles.activityRowContent}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h2>{activity.title}</h2>
                  {activity.summary ? <p>{activity.summary}</p> : null}
                  <TextLink href={`/atividades/${activity.slug}`}>Conhecer atividade</TextLink>
                </div>
              </article>
            );
          })}
        </Container>
      </Section>
      <RelatedCallout
        title="Quer saber como participar?"
        text="Turmas, horários e critérios de participação precisam ser confirmados diretamente com a instituição."
        href="/contato"
        label="Consultar a instituição"
      />
    </>
  );
}
