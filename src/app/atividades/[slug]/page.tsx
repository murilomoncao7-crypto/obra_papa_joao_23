import type { Metadata } from "next";
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

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await contentRepository.getActivities()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const activity = await contentRepository.getActivityBySlug((await params).slug);
  return activity
    ? createPageMetadata({
        title: activity.title,
        description:
          activity.summary ?? `Informações sobre ${activity.title} na Obra Papa João XXIII.`,
        path: `/atividades/${activity.slug}`,
      })
    : {};
}

export default async function ActivityPage({ params }: Props) {
  const activity = await contentRepository.getActivityBySlug((await params).slug);
  if (!activity) notFound();
  const fields = [
    ["Público", activity.audience],
    ["Frequência", activity.frequency],
    ["Local", activity.location],
    ["Responsável", activity.responsible],
  ].filter((field): field is [string, string] => Boolean(field[1]));

  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: "/atividades", label: "Atividades" }, { label: activity.title }]}
        title={activity.title}
        summary={activity.summary}
        visual={
          activity.image ? (
            <div
              className={styles.imageFrame}
              style={
                activity.image.width >= activity.image.height
                  ? { aspectRatio: `${activity.image.width} / ${activity.image.height}` }
                  : undefined
              }
            >
              <Image
                src={activity.image.src}
                alt={activity.image.alt}
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
          <div className={styles.reading}>
            {activity.content ? <Paragraphs content={activity.content} /> : null}
            {fields.length || activity.schedules?.length || activity.contacts?.length ? (
              <dl className={styles.fieldList}>
                {fields.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
                {activity.schedules?.map((schedule) => (
                  <div key={schedule.id}>
                    <dt>{schedule.label}</dt>
                    <dd>
                      {schedule.notes ??
                        [schedule.startsAt, schedule.endsAt].filter(Boolean).join("–")}
                    </dd>
                  </div>
                ))}
                {activity.contacts?.map((contact) => (
                  <div key={contact.id}>
                    <dt>{contact.label}</dt>
                    <dd>
                      {contact.href ? <a href={contact.href}>{contact.value}</a> : contact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {activity.gallery && activity.gallery.length > 1 ? (
              <div className={styles.gallery}>
                {activity.gallery.map((image) => {
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
        title="Informações para participação"
        text="Consulte a instituição para confirmar disponibilidade, horários e critérios desta atividade."
        href="/contato"
        label="Entrar em contato"
      />
    </>
  );
}
