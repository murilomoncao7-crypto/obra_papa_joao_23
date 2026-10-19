import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import styles from "./PageHeader.module.css";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

type PageHeaderProps = {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  summary?: string;
  visual?: ReactNode;
};

export function PageHeader({ breadcrumbs, title, summary, visual }: PageHeaderProps) {
  return (
    <Section className={styles.section}>
      <Container>
        <nav className={styles.breadcrumb} aria-label="Trilha de navegação">
          <ol>
            <li>
              <Link href="/">Início</Link>
            </li>
            {breadcrumbs.map((item) => (
              <li key={`${item.href ?? "current"}-${item.label}`}>
                {item.href ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  <span aria-current="page">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className={visual ? styles.withVisual : styles.withoutVisual}>
          <div className={styles.content}>
            <h1>{title}</h1>
            {summary ? <p>{summary}</p> : null}
          </div>
          {visual ? <div className={styles.visual}>{visual}</div> : null}
        </div>
      </Container>
    </Section>
  );
}
