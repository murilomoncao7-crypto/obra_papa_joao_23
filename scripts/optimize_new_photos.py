from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageOps


PHOTO_NAMES = {
    "atividade - rosas.jpg": "atividade-rosas.webp",
    "atividade - setembro amarelo.jpg": "atividade-setembro-amarelo.webp",
    "banner flauta doce.jpg": "banner-flauta-doce.webp",
    "brincadeiras 1.jpg": "brincadeiras-1.webp",
    "brincadeiras 2.jpg": "brincadeiras-2.webp",
    "capoeira 1.jpg": "capoeira-1.webp",
    "capoeira 2.jpg": "capoeira-2.webp",
    "capoeira 3.jpg": "capoeira-3.webp",
    "crianças e equipe.jpg": "criancas-e-equipe.webp",
    "equipe e crianças.jpg": "equipe-e-criancas.webp",
    "faixada.png": "fachada.webp",
    "ilustrativa - teatro 2.jpg": "teatro-ilustrativa-2.webp",
    "ilustrativa - teatro.jpg": "teatro-ilustrativa.webp",
    "musica - ensaios flauta doce.jpg": "musica-ensaio-flauta.webp",
    "musica - flauta doce.jpg": "musica-flauta-doce.webp",
    "musica - publico flauta doce.jpg": "musica-publico-flauta.webp",
    "PAPA JOAO 23.png": "papa-joao-xxiii.webp",
    "revista - 1.jpg": "revista-1.webp",
    "revista 2.jpg": "revista-2.webp",
    "teatro 1.jpg": "teatro-1.webp",
    "uniao 1.jpg": "uniao-1.webp",
    "uniao 2.jpg": "uniao-2.webp",
}


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Uso: optimize_new_photos.py <pasta-origem> <pasta-destino>")

    source_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)

    missing = sorted(set(PHOTO_NAMES) - {path.name for path in source_dir.iterdir()})
    if missing:
        raise SystemExit(f"Fotos não encontradas: {', '.join(missing)}")

    for source_name, output_name in PHOTO_NAMES.items():
        source_path = source_dir / source_name
        output_path = output_dir / output_name

        with Image.open(source_path) as source:
            image = ImageOps.exif_transpose(source)
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGB")
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            if image.mode == "RGBA":
                background = Image.new("RGB", image.size, "white")
                background.paste(image, mask=image.getchannel("A"))
                image = background
            image.save(output_path, "WEBP", quality=82, method=6)
            print(f"{output_name}: {image.width}x{image.height}")


if __name__ == "__main__":
    main()
