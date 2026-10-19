import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextContent, PublicationImage } from "@/content/types";
import styles from "./PortablePostContent.module.css";

function safeHref(value: unknown) {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value, "https://obra-papa-joao-23.vercel.app");
    if (!["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) return undefined;
    return value;
  } catch {
    return undefined;
  }
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = safeHref((value as { href?: unknown } | undefined)?.href);
      if (!href) return <>{children}</>;
      const external = href.startsWith("http");
      return (
        <a href={href} rel={external ? "noopener noreferrer" : undefined}>
          {children}
        </a>
      );
    },
  },
  types: {
    imagemEditorial: ({ value }) => {
      const image = value as PublicationImage;
      if (!image?.src || !image.alt || !image.width || !image.height) return null;
      return (
        <figure>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 767px) calc(100vw - 2rem), 44rem"
          />
          {image.caption || image.credit ? (
            <figcaption>
              {image.caption}
              {image.credit ? <span> Foto: {image.credit}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
  unknownType: () => null,
};

export function PortablePostContent({ value }: { value: string | PortableTextContent }) {
  if (typeof value === "string") return <p>{value}</p>;
  return (
    <div className={styles.content}>
      <PortableText value={value} components={components} />
    </div>
  );
}
