import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import styles from "./RelatedCallout.module.css";

type RelatedCalloutProps = {
  title: string;
  text: string;
  href: string;
  label: string;
};

export function RelatedCallout({ title, text, href, label }: RelatedCalloutProps) {
  return (
    <Section tone="forest">
      <Container className={styles.content}>
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Button href={href} variant="light">
          {label}
        </Button>
      </Container>
    </Section>
  );
}
