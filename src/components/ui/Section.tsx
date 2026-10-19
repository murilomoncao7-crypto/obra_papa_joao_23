import type { ComponentPropsWithoutRef } from "react";
import styles from "./Section.module.css";

type SectionTone = "canvas" | "paper" | "forest";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  tone?: SectionTone;
};

export function Section({ className, tone = "canvas", ...props }: SectionProps) {
  const classes = [styles.section, styles[tone], className].filter(Boolean).join(" ");

  return <section className={classes} {...props} />;
}
