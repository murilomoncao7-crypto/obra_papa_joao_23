"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type PublicChromeProps = {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  structuredData: ReactNode;
};

export function PublicChrome({ children, header, footer, structuredData }: PublicChromeProps) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/gestao");

  if (isStudio) return children;

  return (
    <>
      {structuredData}
      <a className="skip-link" href="#conteudo-principal">
        Ir para o conteúdo principal
      </a>
      {header}
      <main id="conteudo-principal">{children}</main>
      {footer}
    </>
  );
}
