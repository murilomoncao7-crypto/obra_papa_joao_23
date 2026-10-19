import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { RelatedCallout } from "@/components/layout/RelatedCallout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import styles from "@/styles/content-pages.module.css";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "Como ajudar",
  description:
    "Formas de apoiar e participar das ações da Obra Papa João XXIII identificadas no conteúdo institucional.",
  path: "/como-ajudar",
});

const options = [
  [
    "Doações",
    "Contribuições ajudam a manter o atendimento, o cuidado e as oportunidades oferecidas às crianças e adolescentes.",
  ],
  [
    "Participação em eventos",
    "Participe das ações promovidas pela Obra e ajude a fortalecer a mobilização da comunidade.",
  ],
  [
    "Divulgação",
    "Compartilhe as ações solidárias da instituição e convide mais pessoas a fazer parte dessa causa.",
  ],
];

const campaignWhatsAppUrl =
  "https://wa.me/554432361231?text=Ol%C3%A1!%20Gostaria%20de%20adquirir%20um%20ou%20mais%20cupons%20da%20Uni%C3%A3o%20Solid%C3%A1ria%20para%20ajudar%20a%20Obra%20de%20Assist%C3%AAncia%20Social%20Papa%20Jo%C3%A3o%20XXIII.%20Pode%20me%20ajudar%3F%20%F0%9F%95%8A%EF%B8%8F";

export default function HelpPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Como ajudar" }]}
        title="Como ajudar"
        summary="Sua participação ajuda a manter vivas as oportunidades de cuidado, convivência e desenvolvimento oferecidas pela Obra."
      />
      <Section>
        <Container>
          <div className={styles.helpGrid}>
            {options.map(([title, text]) => (
              <article className={styles.helpBlock} key={title}>
                <h2>{title}</h2>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
      <Section className={styles.campaignSection}>
        <Container>
          <article className={styles.campaign} id="uniao-solidaria">
            <header className={styles.campaignHeader}>
              <div>
                <p className={styles.eyebrow}>Juntos por uma causa que transforma vidas</p>
                <h2>Campanha União Solidária</h2>
              </div>
              <div className={styles.campaignLogo}>
                <Image
                  src="/images/optimized/uniao-solidaria-card-524.webp"
                  alt="União Solidária — transformando vidas"
                  width={524}
                  height={232}
                  sizes="(max-width: 767px) calc(100vw - 4rem), 32rem"
                />
              </div>
            </header>

            <div className={styles.campaignContent}>
              <p>
                A Campanha União Solidária é uma iniciativa voltada à promoção da solidariedade e da
                transformação social, conectando pessoas, recursos e sonhos em apoio a instituições
                que desenvolvem trabalhos importantes em suas comunidades.
              </p>
              <p>
                Criada pelo Instituto Dexis, com o apoio da Sicredi Dexis e do Instituto Cocamar, a
                campanha tem como propósito fortalecer entidades sociais e contribuir para que elas
                possam continuar desenvolvendo seus projetos e atendendo as pessoas que mais
                precisam.
              </p>
              <p>
                Entre as instituições apoiadas está a Obra de Assistência Social Papa João XXIII, de
                Floresta-PR, que desenvolve um trabalho voltado ao atendimento e acompanhamento de
                crianças e adolescentes.
              </p>

              <section>
                <h3>Uma forma de contribuir com a Obra</h3>
                <p>
                  Por meio da União Solidária, a comunidade tem a oportunidade de contribuir
                  diretamente com a Obra através da aquisição de cupons solidários.
                </p>
                <p>
                  Os cupons podem ser adquiridos por meio da própria Obra ou, quando disponibilizado
                  pela campanha, através de sua plataforma oficial. Além de contribuir com a
                  instituição, os participantes concorrem aos prêmios oferecidos pela campanha.
                </p>
                <p>
                  Dessa forma, a participação une solidariedade e oportunidade: ao adquirir um
                  cupom, a pessoa contribui para fortalecer o trabalho da Obra e ainda participa da
                  premiação da campanha.
                </p>
              </section>

              <section>
                <h3>Cupons que ajudam a transformar</h3>
                <p>
                  A campanha foi pensada para que a participação da comunidade pudesse se
                  transformar em apoio concreto às instituições beneficiadas. Cada contribuição
                  ajuda a fortalecer o trabalho desenvolvido pela Obra e a manter suas ações
                  voltadas às crianças e adolescentes atendidos.
                </p>
                <p>
                  Em uma das edições da campanha, os cupons solidários, no valor de R$ 10,00, davam
                  aos participantes a oportunidade de concorrer a diversos prêmios, entre eles 3
                  carros, 3 motos, 9 Alexas, 3 patinetes e 9 iPhones.
                </p>
                <p>
                  Mais do que concorrer a prêmios, participar da União Solidária significa fazer
                  parte de uma rede de pessoas que acredita que a união pode gerar oportunidades e
                  transformar realidades.
                </p>
              </section>

              <section>
                <h3>União que faz a diferença</h3>
                <p>
                  A parceria entre a campanha, as instituições e a comunidade demonstra que grandes
                  transformações podem começar com pequenos gestos.
                </p>
                <p>
                  Para a Obra de Assistência Social Papa João XXIII, a União Solidária representa
                  mais uma forma de fortalecer sua missão e continuar oferecendo cuidado,
                  acompanhamento e oportunidades para as crianças e adolescentes atendidos.
                </p>
                <p>
                  Quando a comunidade se une, a solidariedade se transforma em ação e a ação pode
                  transformar vidas.
                </p>
              </section>
            </div>

            <div className={styles.campaignActions}>
              <a
                className={styles.actionLink}
                href={campaignWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Garanta seu cupom físico — apoie essa causa
              </a>
              <a
                className={styles.actionLinkSecondary}
                href="https://www.campanhauniaosolidaria.com.br/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar o site oficial <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        </Container>
      </Section>
      <RelatedCallout
        title="Combine a forma de apoio"
        text="Fale com a instituição para receber orientações atuais antes de fazer uma doação ou participar."
        href="/contato"
        label="Entrar em contato"
      />
    </>
  );
}
