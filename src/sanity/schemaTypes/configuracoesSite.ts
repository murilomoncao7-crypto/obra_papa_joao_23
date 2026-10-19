import { defineField, defineType } from "sanity";

export const configuracoesSite = defineType({
  name: "configuracoesSite",
  title: "Configurações",
  type: "document",
  fields: [
    defineField({
      name: "postsPerPage",
      title: "Postagens por página",
      type: "number",
      initialValue: 9,
      readOnly: true,
      description:
        "Reservado para expansão futura. A primeira etapa utiliza nove postagens por página.",
      validation: (Rule) => Rule.integer().min(3).max(12),
    }),
  ],
});
