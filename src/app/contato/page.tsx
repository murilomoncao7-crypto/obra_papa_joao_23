import { PageHeader } from "@/components/layout/PageHeader";
import { RelatedCallout } from "@/components/layout/RelatedCallout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { contentRepository } from "@/content";
import styles from "@/styles/content-pages.module.css";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "Contato",
  description:
    "Endereço, telefone, WhatsApp, e-mail, redes sociais e localização da Obra Papa João XXIII em Floresta, Paraná.",
  path: "/contato",
});

export default async function ContactPage() {
  const settings = await contentRepository.getSiteSettings();
  const getContact = (type: string) => settings.contacts.find((contact) => contact.type === type);
  const address = getContact("address");
  const phone = getContact("phone");
  const email = getContact("email");
  const map = getContact("map");
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Contato" }]}
        title="Contato"
        summary="Canais e endereço identificados no conteúdo institucional preservado."
      />
      <Section>
        <Container>
          <div className={styles.contactGrid}>
            <section className={styles.contactBlock}>
              <h2>Endereço</h2>
              {address ? <address>{address.value}</address> : <p>[VALIDAR COM A INSTITUIÇÃO]</p>}
              {map?.href ? (
                <a href={map.href} {...external}>
                  Abrir localização no Google Maps <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </section>
            <section className={styles.contactBlock}>
              <h2>Telefone e WhatsApp</h2>
              {phone?.href ? <a href={phone.href}>{phone.value}</a> : null}
              <a href="https://wa.me/554432361231" {...external}>
                Conversar pelo WhatsApp <span aria-hidden="true">↗</span>
              </a>
            </section>
            <section className={styles.contactBlock}>
              <h2>E-mail</h2>
              {email?.href ? <a href={email.href}>{email.value}</a> : null}
            </section>
            <section className={styles.contactBlock}>
              <h2>Horários e atendimento</h2>
              <p className={styles.validation}>
                Horários de atendimento: [VALIDAR COM A INSTITUIÇÃO]
              </p>
              <p>
                Entre em contato para consultar atividades, eventos, campanhas e formas de
                contribuição.
              </p>
            </section>
            <section className={styles.contactBlock}>
              <h2>Redes sociais</h2>
              <ul className={styles.socialLinks}>
                {settings.socialLinks.map((social) => (
                  <li key={social.id}>
                    <a href={social.href} {...external}>
                      {social.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </Container>
      </Section>
      <RelatedCallout
        title="Quer conhecer formas de participação?"
        text="Veja as possibilidades registradas e confirme diretamente com a instituição."
        href="/como-ajudar"
        label="Como ajudar"
      />
    </>
  );
}
