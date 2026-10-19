import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  inverse?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  inverse = false,
}: SectionHeadingProps) {
  return (
    <header className={`${styles.heading} ${inverse ? styles.inverse : ""}`}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <div className={styles.description}>{description}</div> : null}
    </header>
  );
}
