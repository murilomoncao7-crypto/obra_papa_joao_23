"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEventHandler, ReactNode } from "react";
import styles from "./NavigationLink.module.css";

type NavigationLinkProps = {
  children: ReactNode;
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function NavigationLink({ children, href, onClick }: NavigationLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      className={styles.link}
      href={href}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive || undefined}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
