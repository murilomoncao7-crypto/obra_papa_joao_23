import { defineField, defineType } from "sanity";

export const autor = defineType({
  name: "autor",
  title: "Autor ou responsável",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nome público",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "role",
      title: "Função na instituição",
      type: "string",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "bio",
      title: "Apresentação pública",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(500),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
