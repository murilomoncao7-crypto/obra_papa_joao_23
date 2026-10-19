"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { primaryNavigation } from "@/content/navigation";
import { NavigationLink } from "./NavigationLink";
import styles from "./MobileNavigation.module.css";

const menuId = "mobile-primary-navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    } else if (wasOpenRef.current) {
      buttonRef.current?.focus();
    }

    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className={styles.mobileNavigation}>
      <button
        ref={buttonRef}
        className={styles.menuButton}
        type="button"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.menuIcon} aria-hidden="true" data-open={isOpen || undefined}>
          <span />
          <span />
          <span />
        </span>
        <span>{isOpen ? "Fechar" : "Menu"}</span>
      </button>

      <nav
        ref={panelRef}
        id={menuId}
        className={styles.panel}
        aria-label="Navegação principal para dispositivos móveis"
        hidden={!isOpen}
      >
        <ul>
          {primaryNavigation.map((item) => (
            <li key={item.href}>
              <NavigationLink href={item.href} onClick={closeMenu}>
                {item.label}
              </NavigationLink>
            </li>
          ))}
        </ul>
        <Link className={styles.contactAction} href="/contato" onClick={closeMenu}>
          Fale conosco
        </Link>
      </nav>

      <noscript>
        <nav className={styles.noScriptNavigation} aria-label="Navegação principal">
          <ul>
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </noscript>
    </div>
  );
}
