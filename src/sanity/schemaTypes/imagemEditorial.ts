import { defineField, defineType } from "sanity";
import { sanityApiVersion } from "@/sanity/env";

const maximumImageSize = 10 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const imagemEditorial = defineType({
  name: "imagemEditorial",
  title: "Imagem editorial",
  type: "image",
  options: {
    hotspot: true,
    accept: "image/jpeg,image/png,image/webp",
  },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo",
      type: "string",
      description: "Descreva objetivamente o que a imagem comunica para quem não pode vê-la.",
      validation: (Rule) => Rule.required().min(5).max(180),
    }),
    defineField({
      name: "caption",
      title: "Legenda",
      type: "string",
      description: "Explique o momento sem identificar crianças ou expor informações sensíveis.",
      validation: (Rule) => Rule.required().min(5).max(240),
    }),
    defineField({
      name: "credit",
      title: "Crédito ou origem",
      type: "string",
      description: "Informe a pessoa, equipe ou fonte responsável pela fotografia.",
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "context",
      title: "Contexto da fotografia",
      type: "text",
      rows: 3,
      description: "Registre a atividade e o motivo de uso desta imagem.",
      validation: (Rule) => Rule.required().min(10).max(500),
    }),
    defineField({
      name: "photographedAt",
      title: "Data da fotografia",
      type: "date",
    }),
    defineField({
      name: "authorized",
      title: "Autorização de uso confirmada",
      type: "boolean",
      initialValue: false,
      validation: (Rule) =>
        Rule.custom((value) =>
          value === true ? true : "Confirme a autorização de uso antes de publicar.",
        ),
    }),
    defineField({
      name: "internetAllowed",
      title: "Publicação na internet autorizada",
      type: "boolean",
      initialValue: false,
      validation: (Rule) =>
        Rule.custom((value) =>
          value === true ? true : "Confirme que a imagem pode ser publicada na internet.",
        ),
    }),
  ],
  validation: (Rule) =>
    Rule.custom(async (value, context) => {
      const reference = (value as { asset?: { _ref?: string } } | undefined)?.asset?._ref;
      if (!reference) return true;
      try {
        const asset = await context
          .getClient({ apiVersion: sanityApiVersion })
          .fetch<{ size?: number; mimeType?: string } | null>(`*[_id == $id][0]{size, mimeType}`, {
            id: reference,
          });
        if (asset?.mimeType && !acceptedImageTypes.has(asset.mimeType))
          return "Use somente imagens JPG, PNG ou WebP.";
        if (asset?.size && asset.size > maximumImageSize)
          return "A imagem deve ter no máximo 10 MB.";
        return true;
      } catch {
        return "Não foi possível validar o arquivo agora. Tente novamente antes de publicar.";
      }
    }),
});
