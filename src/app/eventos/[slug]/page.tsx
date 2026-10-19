import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Paragraphs } from "@/components/content/Paragraphs";
import { PageHeader } from "@/components/layout/PageHeader";
import { RelatedCallout } from "@/components/layout/RelatedCallout";
import { StructuredData } from "@/components/publication/StructuredData";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { contentRepository } from "@/content";
import { eventStatusLabel, formatPublicationDate } from "@/content/publication-utils";
import { absolutePublicationUrl, eventMetadata } from "@/lib/publication-metadata";
import styles from "@/styles/publications.module.css";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  const params = (await contentRepository.getEvents()).map(({ slug }) => ({ slug }));
  return params.length === 0 && process.env.SITES_STATIC_EXPORT === "1"
    ? [{ slug: "evento-indisponivel" }]
    : params;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await contentRepository.getEventBySlug((await params).slug);
  return event ? eventMetadata(event) : {};
}

export default async function EventDetailPage({ params }: Props) {
  const event = await contentRepository.getEventBySlug((await params).slug);
  if (!event) notFound();
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description: event.summary,
          startDate: event.startsAt,
          endDate: event.endsAt,
          eventStatus:
            event.eventStatus === "cancelled"
              ? "https://schema.org/EventCancelled"
              : "https://schema.org/EventScheduled",
          location: event.location ? { "@type": "Place", name: event.location } : undefined,
          image: event.image,
          url: absolutePublicationUrl(`/eventos/${event.slug}`),
        }}
      />
      <PageHeader
        breadcrumbs={[{ href: "/eventos", label: "Eventos e campanhas" }, { label: event.title }]}
        title={event.title}
        summary={event.summary}
      />
      <Section>
        <Container>
          <article className={styles.detail}>
            {event.image ? (
              <div className={styles.image}>
                <Image
                  src={event.image}
                  alt={event.imageAlt ?? ""}
                  fill
                  sizes="(min-width: 768px) 46rem, 100vw"
                />
              </div>
            ) : null}
            <div className={styles.content}>
              <Paragraphs content={event.content} />
              {event.sections?.map((section) => (
                <section key={section.id}>
                  <h2>{section.title}</h2>
                  <Paragraphs content={section.content} />
                </section>
              ))}
            </div>
            <dl className={styles.fields}>
              <div>
                <dt>Situação</dt>
                <dd>{eventStatusLabel(event)}</dd>
              </div>
              <div>
                <dt>Data inicial</dt>
                <dd>
                  <time dateTime={event.startsAt}>{formatPublicationDate(event.startsAt)}</time>
                </dd>
              </div>
              {event.endsAt ? (
                <div>
                  <dt>Data final</dt>
                  <dd>
                    <time dateTime={event.endsAt}>{formatPublicationDate(event.endsAt)}</time>
                  </dd>
                </div>
              ) : null}
              {event.time ? (
                <div>
                  <dt>Horário</dt>
                  <dd>{event.time}</dd>
                </div>
              ) : null}
              {event.location ? (
                <div>
                  <dt>Localização</dt>
                  <dd>{event.location}</dd>
                </div>
              ) : null}
              {event.contacts.map((contact) => (
                <div key={contact.id}>
                  <dt>{contact.label}</dt>
                  <dd>
                    {contact.href ? <a href={contact.href}>{contact.value}</a> : contact.value}
                  </dd>
                </div>
              ))}
            </dl>
            {event.registrationUrl ? (
              <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                Fazer inscrição <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </article>
        </Container>
      </Section>
      <RelatedCallout
        title="Precisa de mais informações?"
        text="Consulte os canais oficiais antes de participar ou divulgar."
        href="/contato"
        label="Entrar em contato"
      />
    </>
  );
}
