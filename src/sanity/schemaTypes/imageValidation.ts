type ImageValue = {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
  credit?: string;
  context?: string;
  authorized?: boolean;
  internetAllowed?: boolean;
};

type PostWithImages = {
  coverImage?: ImageValue;
  gallery?: ImageValue[];
  socialImage?: ImageValue;
  content?: unknown[];
};

function inlineImages(content: unknown[] | undefined) {
  return (content ?? []).filter((item): item is ImageValue & { _type: "imagemEditorial" } =>
    Boolean(
      item && typeof item === "object" && (item as { _type?: string })._type === "imagemEditorial",
    ),
  );
}

export function validateImagePermissions(document: PostWithImages | undefined) {
  if (!document) return true;
  const images = [
    document.coverImage,
    ...(document.gallery ?? []),
    document.socialImage,
    ...inlineImages(document.content),
  ].filter((image): image is ImageValue => Boolean(image?.asset?._ref));

  for (const image of images) {
    if (!image.alt?.trim()) return "Toda imagem precisa de texto alternativo.";
    if (!image.caption?.trim()) return "Toda imagem precisa de legenda.";
    if (!image.credit?.trim()) return "Toda imagem precisa informar crédito ou origem.";
    if (!image.context?.trim()) return "Toda imagem precisa informar o contexto da fotografia.";
    if (image.authorized !== true)
      return "Confirme que a instituição possui autorização de uso para todas as imagens.";
    if (image.internetAllowed !== true)
      return "Confirme que todas as imagens podem ser publicadas na internet.";
  }

  return true;
}
