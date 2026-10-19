"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealGridProps {
  children: ReactNode;
  className?: string;
}

export function ScrollRevealGrid({ children, className }: ScrollRevealGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-reveal-card]"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    cards.forEach((card, index) => {
      card.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    });

    container.dataset.revealEnabled = "true";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.setAttribute("data-revealed", "true");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8%",
        threshold: 0.14,
      },
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
