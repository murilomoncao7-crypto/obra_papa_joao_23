import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Gestão de conteúdo")
    .items([
      S.documentTypeListItem("postagem").title("Postagens"),
      S.divider(),
      S.documentTypeListItem("autor").title("Autores"),
      S.documentTypeListItem("categoria").title("Categorias"),
      S.divider(),
      S.listItem()
        .title("Configurações")
        .child(
          S.document()
            .schemaType("configuracoesSite")
            .documentId("configuracoesSite")
            .title("Configurações"),
        ),
    ]);
