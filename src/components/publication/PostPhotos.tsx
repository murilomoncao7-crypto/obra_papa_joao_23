"use client";
import Image from "next/image";
import { useState } from "react";
import type { PublicationImage } from "@/content/types";
import styles from "./PostPhotos.module.css";

export function PostPhotos({ images, title }: { images: PublicationImage[]; title: string }) {
  const [current, setCurrent] = useState(0);
  if (!images.length) return null;
  return (
    <div className={styles.gallery} role="group" aria-label={`Fotos de ${title}`}>
      <div className={styles.frame}>
        {images.map((image, index) => (
          <div key={image.id} hidden={index !== current} className={styles.slide}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) 50vw, 33vw"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {images.length > 1 ? (
        <div className={styles.controls}>
          <button
            aria-label="Foto anterior"
            onClick={() => setCurrent((current + images.length - 1) % images.length)}
          >
            ←
          </button>
          <span aria-live="polite">
            {current + 1} / {images.length}
          </span>
          <button
            aria-label="Próxima foto"
            onClick={() => setCurrent((current + 1) % images.length)}
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  );
}
