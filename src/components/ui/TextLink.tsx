import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./TextLink.module.css";

export function TextLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link className={styles.link} href={href}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}
