import { Card, Text } from "@sanity/ui";

export function ImageRightsNotice() {
  return (
    <Card padding={4} radius={2} shadow={1} tone="caution">
      <div style={{ display: "grid", gap: "1rem" }}>
        <Text weight="semibold">Proteção de crianças e adolescentes</Text>
        <Text>
          Antes de publicar fotografias de crianças e adolescentes, confirme que a instituição
          possui as autorizações necessárias dos responsáveis.
        </Text>
        <Text muted>
          Não anexe documentos de autorização à postagem. Comprovantes devem permanecer em
          armazenamento privado e com acesso restrito.
        </Text>
      </div>
    </Card>
  );
}
