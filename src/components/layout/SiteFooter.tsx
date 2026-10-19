import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { primaryNavigation } from "@/content/navigation";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.identity}>
            <p className={styles.eyebrow}>Instituição</p>
            <strong>Obra de Assistência Social Papa João XXIII</strong>
            <p>Associação civil filantrópica, sem fins lucrativos.</p>
          </div>

          <div>
            <h2>Contato</h2>
            <address>
              Rua Cidade de Bréscia — Centro
              <br />
              Floresta — Paraná
              <br />
              CEP 87.120-023
            </address>
            <p>
              <a href="tel:+554432361231">(44) 3236-1231</a>
              <br />
              <a href="mailto:oaspfloresta@gmail.com">oaspfloresta@gmail.com</a>
            </p>
          </div>

          <div>
            <h2>Horários</h2>
            <p>Consulte a equipe para confirmar os horários de atendimento.</p>
            <a
              href="https://www.google.com/maps/place/Obra+de+Assist%C3%AAncia+Social+Papa+Jo%C3%A3o+XXIII/@-23.6175335,-52.0862525,17z/data=!3m1!4b1!4m6!3m5!1s0x94f3d37240000001:0xd6f4b62ec32df7bf!8m2!3d-23.6175335!4d-52.0836776!16s%2Fg%2F1wf39sbb?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver localização no mapa
            </a>
          </div>

          <div>
            <h2>Links principais</h2>
            <ul>
              {primaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Redes sociais</h2>
            <ul>
              <li>
                <a
                  href="https://www.facebook.com/obraoaspjxxiii"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/obraassistencial/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className={styles.validationNotice}>
          Para visitas e participação nas atividades, confirme a disponibilidade com a equipe.
        </p>

        <div className={styles.legal}>
          <p>© {currentYear} Obra de Assistência Social Papa João XXIII.</p>
          <Link href="/politica-de-privacidade">Política de privacidade provisória</Link>
        </div>
      </Container>
    </footer>
  );
}
