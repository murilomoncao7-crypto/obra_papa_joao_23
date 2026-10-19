import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import styles from "./InternalPage.module.css";

type InternalPageProps = {
  title: string;
  summary: string;
  status?: string;
};

export function InternalPage({ title, summary, status }: InternalPageProps) {
  return (
    <Section aria-labelledby="internal-page-title">
      <Container className={styles.content}>
        <Tag>Estrutura inicial</Tag>
        <h1 id="internal-page-title">{title}</h1>
        <p>{summary}</p>
        {status ? <p className={styles.status}>{status}</p> : null}
      </Container>
    </Section>
  );
}
