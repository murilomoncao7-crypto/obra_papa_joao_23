import type { Metadata } from "next";
import { EditorPanel } from "@/components/publication/EditorPanel";
import { editorConfigured, isEditor } from "@/lib/editor/auth";
import { publishingConfigured } from "@/lib/editor/cms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Gestão de postagens — Obra Papa João XXIII",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ManagementPage() {
  return (
    <EditorPanel
      authenticated={await isEditor()}
      configured={editorConfigured() && publishingConfigured()}
    />
  );
}
