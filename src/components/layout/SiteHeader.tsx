import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DesktopNavigation } from "@/components/navigation/DesktopNavigation";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.utilityBar}>
        <Container className={styles.utilityContent}>
          <span>Acolhimento, educação e novas possibilidades</span>
          <a href="tel:+554432361231">(44) 3236-1231</a>
        </Container>
      </div>
      <Container className={styles.mainBar}>
        <Link className={styles.brand} href="/" aria-label="Página inicial">
          <Image
            src="/images/optimized/logo-obra-320.webp"
            alt=""
            width={88}
            height={88}
            sizes="(max-width: 36rem) 64px, 88px"
            loading="eager"
          />
          <span className={styles.brandText}>
            <strong>Obra de Assistência Social</strong>
            <span>Papa João XXIII</span>
          </span>
        </Link>
        <div className={styles.desktopActions}>
          <DesktopNavigation />
          <Button href="/como-ajudar">Doe agora</Button>
        </div>
        <Link className={styles.mobileDonate} href="/como-ajudar">
          Doe agora
        </Link>
        <MobileNavigation />
      </Container>
    </header>
  );
}
