import type { Metadata } from "next";
import { getSanityPublicConfig } from "@/sanity/env";
import { GestaoStudio } from "./GestaoStudio";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gestão de conteúdo — Obra Papa João XXIII",
  description: "Painel editorial privado da Obra Papa João XXIII.",
  robots: { index: false, follow: false, nocache: true },
};

function previewOrigin() {
  const candidates = [
    process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : undefined,
    process.env.NEXT_PUBLIC_SITE_URL,
    "https://obra-papa-joao-23.vercel.app",
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const url = new URL(candidate);
      if (url.protocol === "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1")
        return url.origin;
    } catch {
      // Tenta a próxima origem conhecida.
    }
  }

  return "https://obra-papa-joao-23.vercel.app";
}

export default function ManagementPage() {
  const config = getSanityPublicConfig();

  if (!config) {
    return (
      <main className={styles.configuration}>
        <h1>Gestão de conteúdo ainda não configurada</h1>
        <p>
          O painel será liberado depois que o projeto Sanity e as variáveis do ambiente forem
          conectados. Nenhum cadastro público é oferecido nesta página.
        </p>
      </main>
    );
  }

  return <GestaoStudio {...config} previewOrigin={previewOrigin()} />;
}
