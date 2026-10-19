import { InternalPage } from "@/components/layout/InternalPage";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "Política de privacidade",
  description: "Página reservada para a política de privacidade institucional, ainda em validação.",
  path: "/politica-de-privacidade",
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <InternalPage
      title="Política de privacidade"
      summary="Documento provisório reservado para informar como dados pessoais serão tratados no site."
      status="Conteúdo jurídico: [VALIDAR COM A INSTITUIÇÃO]."
    />
  );
}
