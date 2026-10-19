import { defineField, defineType } from "sanity";

export const categoria = defineType({
  name: "categoria",
  title: "Categoria",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nome",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "slug",
      title: "Identificador na URL",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descrição",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});
