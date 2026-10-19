import Image from "next/image";
import { draftMode } from "next/headers";
import { PostCard } from "@/components/publication/PostCard";
import { FeedRefresh } from "@/components/publication/FeedRefresh";
import { PreviewModeBanner } from "@/components/publication/PreviewModeBanner";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollRevealGrid } from "@/components/ui/ScrollRevealGrid";
import { TextLink } from "@/components/ui/TextLink";
import { contentRepository } from "@/content";
import styles from "./page.module.css";

export default async function Home() {
  const preview = (await draftMode()).isEnabled;
  const [settings, home, activities, latestPosts] = await Promise.all([
    contentRepository.getSiteSettings(),
    contentRepository.getHomePage(),
    contentRepository.getActivities(),
    contentRepository.getNews({ pageSize: 3, preview }),
  ]);

  const phone = settings.contacts.find((contact) => contact.type === "phone");
  const email = settings.contacts.find((contact) => contact.type === "email");
  const address = settings.contacts.find((contact) => contact.type === "address");
  const map = settings.contacts.find((contact) => contact.type === "map");

  return (
    <>
      <FeedRefresh />
      {preview ? <PreviewModeBanner /> : null}
      <section className={styles.hero} aria-labelledby="hero-title">
        <Container className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <h1 id="hero-title">{home.hero.title}</h1>
            <p className={styles.heroSummary}>
              {home.hero.summary}{" "}
              {home.hero.summaryAccent ? (
                <span className={styles.heroSummaryAccent}>{home.hero.summaryAccent}</span>
              ) : null}
            </p>
            <div className={styles.actions}>
              <Button href={home.hero.primaryAction.href}>{home.hero.primaryAction.label}</Button>
              <Button href={home.hero.secondaryAction.href} variant="secondary">
                {home.hero.secondaryAction.label}
              </Button>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroPhotoMain}>
              <Image
                src={home.hero.image.src}
                alt={home.hero.image.alt}
                fill
                priority
                sizes="(max-width: 767px) 88vw, 45vw"
              />
            </div>
            <div className={styles.heroPhotoSecondary}>
              <Image
                src={home.gallery[1].src}
                alt={home.gallery[1].alt}
                fill
                sizes="(max-width: 767px) 36vw, 16vw"
              />
            </div>
            <div className={styles.heroPhotoTertiary}>
              <Image
                src={home.gallery[0].src}
                alt={home.gallery[0].alt}
                fill
                sizes="(max-width: 767px) 34vw, 15vw"
              />
            </div>
            <span className={styles.sparkOne} aria-hidden="true">
              ✦
            </span>
            <span className={styles.sparkTwo} aria-hidden="true">
              ✦
            </span>
            <span className={styles.sparkThree} aria-hidden="true">
              ✦
            </span>
          </div>
        </Container>
        <div className={styles.waveCyan} aria-hidden="true" />
        <div className={styles.waveBlue} aria-hidden="true" />
        <div className={styles.waveNavy} aria-hidden="true" />
      </section>

      <Section tone="paper">
        <Container>
          <div className={styles.sectionTopline}>
            <SectionHeading
              eyebrow="Aprender, criar e conviver"
              title="Um mundo de possibilidades"
              description={home.activityIntroduction}
            />
            <TextLink href="/atividades">Ver todas as atividades</TextLink>
          </div>
          <ScrollRevealGrid className={styles.activityGrid}>
            {activities.slice(0, 6).map((activity) => (
              <article key={activity.id} className={styles.activityCard} data-reveal-card>
                {activity.image ? (
                  <div className={styles.activityImage}>
                    <Image
                      src={activity.image.src}
                      alt={activity.image.alt}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    />
                  </div>
                ) : null}
                <div className={styles.activityContent}>
                  <h3>{activity.title}</h3>
                  {activity.summary ? <p>{activity.summary}</p> : null}
                  <TextLink href={`/atividades/${activity.slug}`}>Conhecer atividade</TextLink>
                </div>
              </article>
            ))}
          </ScrollRevealGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className={styles.sectionTopline}>
            <SectionHeading
              eyebrow="Novidades da Obra"
              title="Últimas postagens"
              description="Histórias, atividades e comunicados compartilhados pela instituição."
            />
            <TextLink href="/postagens">Ver todas as postagens</TextLink>
          </div>
          {latestPosts.items.length ? (
            <div className={styles.latestPostsGrid}>
              {latestPosts.items.map((post) => (
                <PostCard key={post.id} post={post} preview={preview} />
              ))}
            </div>
          ) : (
            <p className={styles.latestPostsEmpty}>
              Em breve, novas histórias e atividades da Obra Papa João XXIII serão compartilhadas
              aqui.
            </p>
          )}
        </Container>
      </Section>

      <section className={styles.institutionSection}>
        <Container className={styles.institutionGrid}>
          <div className={styles.institutionPhoto}>
            <Image
              src={home.gallery[4].src}
              alt={home.gallery[4].alt}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
            />
            <span aria-hidden="true">Juntos, todos os dias</span>
          </div>
          <div className={styles.institutionContent}>
            <p className={styles.institutionEyebrow}>Desde {home.institution.foundationYear}</p>
            <h2>{home.institution.title}</h2>
            <p className={styles.institutionSummary}>{home.institution.summary}</p>
            <p>{home.institution.history}</p>
            <TextLink href="/historia">Conheça a nossa história</TextLink>
          </div>
        </Container>
      </section>

      <section className={styles.participationSection}>
        <Container className={styles.participationGrid}>
          <div>
            <p className={styles.participationEyebrow}>Faça parte</p>
            <h2>{home.participation.title}</h2>
            <p>{home.participation.summary}</p>
            <Button href="/como-ajudar">Quero ajudar</Button>
          </div>
          <ul className={styles.participationList}>
            {home.participation.options.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
        </Container>
      </section>

      <Section tone="paper">
        <Container>
          <div className={styles.sectionTopline}>
            <SectionHeading
              eyebrow="Vida na instituição"
              title="Momentos que contam nossa história"
              description={home.galleryIntroduction}
            />
          </div>
          <div className={styles.gallery}>
            {home.gallery.map((image) => (
              <figure key={image.id}>
                <div className={styles.galleryImage}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 383px) calc(100vw - 2rem), (max-width: 767px) 46vw, (max-width: 1023px) 31vw, 23vw"
                  />
                </div>
                {image.caption ? <figcaption>{image.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className={styles.locationGrid}>
          <div>
            <SectionHeading
              eyebrow="Venha nos conhecer"
              title={home.locationTitle}
              description={address?.value}
            />
          </div>
          <div className={styles.locationDetails}>
            <span className={styles.locationMark} aria-hidden="true">
              ●
            </span>
            {phone ? (
              <p>
                <strong>{phone.label}</strong>
                <a href={phone.href}>{phone.value}</a>
              </p>
            ) : null}
            {email ? (
              <p>
                <strong>{email.label}</strong>
                <a href={email.href}>{email.value}</a>
              </p>
            ) : null}
            <p className={styles.serviceNote}>Consulte a instituição para confirmar os horários.</p>
            {map?.href ? (
              <a
                className={styles.mapLink}
                href={map.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {map.value}
              </a>
            ) : null}
          </div>
        </Container>
      </Section>
    </>
  );
}
