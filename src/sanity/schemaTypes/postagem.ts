import { defineArrayMember, defineField, defineType } from "sanity";
import { ImageRightsNotice } from "@/sanity/components/ImageRightsNotice";
import { validateImagePermissions } from "@/sanity/schemaTypes/imageValidation";

const imageWarning =
  "Antes de publicar fotografias de crianças e adolescentes, confirme que a instituição possui as autorizações necessárias dos responsáveis.";

export const postagem = defineType({
  name: "postagem",
  title: "Postagem",
  type: "document",
  groups: [
    { name: "content", title: "Conteúdo", default: true },
    { name: "images", title: "Fotografias" },
    { name: "publication", title: "Publicação" },
    { name: "seo", title: "SEO e compartilhamento" },
  ],
  initialValue: {
    editorialStatus: "draft",
    featured: false,
    publishedAt: new Date().toISOString(),
  },
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().min(5).max(120),
    }),
    defineField({
      name: "slug",
      title: "Endereço da postagem",
      type: "slug",
      group: "content",
      description: "Clique em “Gerar” para criar um endereço único a partir do título.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Resumo",
      type: "text",
      rows: 4,
      group: "content",
      description: "Texto curto usado nos cards e em mecanismos de busca.",
      validation: (Rule) => Rule.required().min(30).max(280),
    }),
    defineField({
      name: "content",
      title: "Conteúdo completo",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Título de seção", value: "h2" },
            { title: "Subtítulo", value: "h3" },
            { title: "Citação", value: "blockquote" },
          ],
          lists: [
            { title: "Lista com marcadores", value: "bullet" },
            { title: "Lista numerada", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Negrito", value: "strong" },
              { title: "Itálico", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "Endereço",
                    type: "url",
                    validation: (Rule) =>
                      Rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({ type: "imagemEditorial" }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "imageRightsNotice",
      title: "Orientação importante",
      type: "string",
      group: "images",
      readOnly: true,
      components: { input: ImageRightsNotice },
    }),
    defineField({
      name: "coverImage",
      title: "Imagem de capa",
      type: "imagemEditorial",
      group: "images",
      description: imageWarning,
    }),
    defineField({
      name: "gallery",
      title: "Galeria de fotografias",
      type: "array",
      group: "images",
      description: imageWarning,
      of: [defineArrayMember({ type: "imagemEditorial" })],
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: "category",
      title: "Categoria",
      type: "reference",
      to: [{ type: "categoria" }],
      group: "publication",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Etiquetas",
      type: "array",
      group: "publication",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (Rule) => Rule.unique().max(12),
    }),
    defineField({
      name: "author",
      title: "Autor ou responsável",
      type: "reference",
      to: [{ type: "autor" }],
      group: "publication",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Data de publicação",
      type: "datetime",
      group: "publication",
      validation: (Rule) =>
        Rule.custom((value, context) =>
          context.document?.editorialStatus === "published" && !value
            ? "Informe a data antes de publicar."
            : true,
        ),
    }),
    defineField({
      name: "editorialStatus",
      title: "Status editorial",
      type: "string",
      group: "publication",
      initialValue: "draft",
      options: {
        layout: "radio",
        list: [
          { title: "Rascunho", value: "draft" },
          { title: "Em revisão", value: "inReview" },
          { title: "Publicado", value: "published" },
          { title: "Arquivado", value: "archived" },
        ],
      },
      description:
        "Somente itens com status “Publicado”, data válida e documento publicado no Sanity aparecem no site.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Destacar na página inicial",
      type: "boolean",
      group: "publication",
      initialValue: false,
    }),
    defineField({
      name: "seoTitle",
      title: "Título para SEO",
      type: "string",
      group: "seo",
      description: "Se ficar vazio, o título da postagem será usado.",
      validation: (Rule) => Rule.max(60).warning("Prefira até 60 caracteres."),
    }),
    defineField({
      name: "seoDescription",
      title: "Descrição para SEO",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Se ficar vazia, o resumo será usado.",
      validation: (Rule) => Rule.max(160).warning("Prefira até 160 caracteres."),
    }),
    defineField({
      name: "socialImage",
      title: "Imagem para compartilhamento social",
      type: "imagemEditorial",
      group: "seo",
      description: imageWarning,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((document) =>
      validateImagePermissions(document as Parameters<typeof validateImagePermissions>[0]),
    ),
  preview: {
    select: {
      title: "title",
      status: "editorialStatus",
      publishedAt: "publishedAt",
      media: "coverImage",
    },
    prepare({ title, status, publishedAt, media }) {
      const statusLabels: Record<string, string> = {
        draft: "Rascunho",
        inReview: "Em revisão",
        published: "Publicado",
        archived: "Arquivado",
      };
      const date = publishedAt
        ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(publishedAt))
        : "sem data";
      return {
        title: title || "Postagem sem título",
        subtitle: `${statusLabels[status] ?? "Rascunho"} · ${date}`,
        media,
      };
    },
  },
});
