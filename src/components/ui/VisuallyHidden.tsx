import type { ComponentPropsWithoutRef } from "react";
import styles from "./VisuallyHidden.module.css";

export function VisuallyHidden(props: ComponentPropsWithoutRef<"span">) {
  return <span className={styles.hidden} {...props} />;
}
