import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { contentRepository } from "@/content";
import { eventStatusLabel, formatPublicationDate } from "@/content/publication-utils";
import styles from "@/styles/publications.module.css";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Eventos e campanhas",
  description: "Agenda confirmada de eventos e campanhas da Obra Papa João XXIII.",
  path: "/eventos",
});

export default async function EventsPage() {
  const events = await contentRepository.getEvents();
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Eventos e campanhas" }]}
        title="Eventos e campanhas"
        summary="Encontros e campanhas que mobilizam a comunidade em favor das crianças e adolescentes atendidos pela Obra."
      />
      <Section>
        <Container>
          {events.length === 0 ? (
            <div className={styles.empty}>
              <h2>Nenhum evento publicado</h2>
              <p>
                Os registros encontrados no site anterior permanecem em validação e não são
                apresentados como agenda confirmada.
              </p>
            </div>
          ) : (
            <div className={styles.list}>
              {events.map((event) => (
                <article className={styles.item} key={event.id}>
                  <div>
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.imageAlt ?? ""}
                        width={320}
                        height={200}
                        sizes="(min-width: 768px) 10rem, 100vw"
                      />
                    ) : (
                      <time dateTime={event.startsAt}>{formatPublicationDate(event.startsAt)}</time>
                    )}
                  </div>
                  <div>
                    <div className={styles.itemMeta}>
                      <Tag>{event.kind === "campaign" ? "Campanha" : "Evento"}</Tag>
                      <span>{eventStatusLabel(event)}</span>
                    </div>
                    <h2>{event.title}</h2>
                    <p className={styles.summary}>{event.summary}</p>
                    <p>
                      <time dateTime={event.startsAt}>{formatPublicationDate(event.startsAt)}</time>
                      {event.time ? `, ${event.time}` : ""}
                    </p>
                    <TextLink href={`/eventos/${event.slug}`}>Ver detalhes</TextLink>
                  </div>
                </article>
              ))}
            </div>
          )}
          <aside className={styles.campaignCallout}>
            <Tag>Campanha</Tag>
            <h2>União Solidária</h2>
            <p>
              Adquira cupons solidários, apoie diretamente a Obra e participe de uma corrente que
              transforma vidas.
            </p>
            <TextLink href="/como-ajudar#uniao-solidaria">Conhecer a campanha</TextLink>
          </aside>
        </Container>
      </Section>
    </>
  );
}
