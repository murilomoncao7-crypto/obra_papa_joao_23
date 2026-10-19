type ParagraphsProps = {
  content: string | string[];
};

export function Paragraphs({ content }: ParagraphsProps) {
  const paragraphs = Array.isArray(content) ? content : [content];

  return (
    <>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}
