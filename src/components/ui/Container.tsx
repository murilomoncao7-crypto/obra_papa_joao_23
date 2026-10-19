import type { ComponentPropsWithoutRef } from "react";
import styles from "./Container.module.css";

export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  const classes = className ? `${styles.container} ${className}` : styles.container;

  return <div className={classes} {...props} />;
}
