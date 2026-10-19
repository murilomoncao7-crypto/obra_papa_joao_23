# Inventário e política de imagens

## Preservação

Os originais estão preservados no commit `02083f7234f5ab8dbe23adf3c73412f90db212ed` e na tag `legacy-static-v1`. Cópias de trabalho permanecem em `public/images/legacy`; `obra2.png` continua na raiz porque sua possível relação com `obra2.jpeg` não foi confirmada. A interface não deve referenciar originais legados diretamente.

Nenhum original foi sobrescrito. Os derivados ficam em `public/images/optimized`, sem EXIF, ICC ou metadados auxiliares. Nomes usam apenas caracteres seguros para URL.

## Originais

| Arquivo | Formato | Dimensão | Tamanho | Uso identificado | Texto alternativo atual | Recorte |
| --- | --- | ---: | ---: | --- | --- | --- |
| `obra.png` | PNG RGB | 1254×1254 | 2,65 MiB | Hero e apresentação institucional | Registros da sede, das atividades e da comunidade da Obra Papa João XXIII | Não aplicado; composição quadrada deve ser preservada. |
| `musica.png` | PNG RGB | 1536×1024 | 2,63 MiB | Atividade e galeria de música | Atividade de música na Obra Papa João XXIII | Não necessário para 3:2; validar enquadramento se houver novo card. |
| `capoeira.png` | PNG RGB | 1536×1024 | 2,83 MiB | Atividade e galeria de capoeira | Atividade de capoeira na Obra Papa João XXIII | Não necessário para 3:2. |
| `esporte.png` | PNG RGB | 1536×1024 | 3,02 MiB | Atividade e galeria de esporte | Atividade de esporte na Obra Papa João XXIII | Não necessário para 3:2. |
| `conversa.png` | PNG RGB | 1536×1024 | 2,85 MiB | Rodas de conversa | Roda de conversa na Obra Papa João XXIII | Não necessário para 3:2. |
| `danca.png` | PNG RGB | 1536×1024 | 2,56 MiB | Dança e galeria | Atividade de dança na Obra Papa João XXIII | Não necessário para 3:2. |
| `teatro.png` | PNG RGB | 1536×1024 | 2,65 MiB | Teatro e galeria | Atividade de teatro na Obra Papa João XXIII | Não necessário para 3:2. |
| `festapicanha.png` | PNG RGB | 1536×1024 | 2,59 MiB | Evento Festa da Picanha, ainda em rascunho | Registro da Festa da Picanha no site legado | Não necessário para 3:2; validar direitos antes de publicar. |
| `uniao_solidaria.png` | PNG indexado com transparência | 524×232 | 11,5 KiB | Campanha União Solidária, sem data confirmada | Marca da campanha União Solidária | Não recortar; proporção da marca deve ser preservada. |
| `logo_obra.jpg` | JPEG RGB | 320×320 | 30,6 KiB | Cabeçalho, favicon e identidade | Vazio no cabeçalho porque o nome adjacente já identifica a marca | Não recortar; já é quadrado. |
| `obra2.png` | PNG RGB | 1086×1448 | 2,34 MiB | Não publicado; possível relação não confirmada com referência quebrada `obra2.jpeg` | Não definido para publicação | Não gerar derivado até validação. |

Total preservado inventariado: **24,17 MiB**.

## Derivados

- Hero institucional: 1200×1200.
- Cards quadrados: 720×720; thumbnails: 320×320.
- Galeria e detalhes 3:2: 1200×800.
- Cards 3:2: 720×480.
- Thumbnails 3:2: 320×213.
- Marca: 192×192 e 96×96.
- União Solidária: 524×232 e 320×142.

Foram gerados 28 WebP e 27 AVIF. AVIF só foi mantido quando ficou pelo menos 10% menor que o WebP correspondente. Totais:

| Conjunto | Arquivos | Tamanho |
| --- | ---: | ---: |
| WebP | 28 | 2,65 MiB |
| AVIF vantajosos | 27 | 1,38 MiB |
| Todos os derivados | 55 | 4,03 MiB |
| Fontes WebP atualmente referenciadas | 9 | 1,68 MiB |

O `next/image` usa `sizes` e negociação configurada para AVIF/WebP. Apenas o hero da página inicial usa `priority`. Containers com `fill` possuem `aspect-ratio` ou altura reservada; cards usam dimensões intrínsecas explícitas.

## Rastreabilidade

As relações entre original, derivados, dimensões e finalidade ficam em `GalleryImage.variants`. Uma futura biblioteca de mídia do CMS deve manter `src`, largura, altura, texto alternativo, legenda, crédito, consentimento e variantes equivalentes.

