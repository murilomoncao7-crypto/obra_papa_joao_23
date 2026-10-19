# Direção visual institucional

## Objetivo

O sistema visual deve comunicar acolhimento, tradição, comunidade, confiança, trabalho social, espiritualidade, transparência e proximidade humana. A solução evita convenções de produto digital e organiza o conteúdo com ritmo editorial, linhas discretas, tipografia expressiva e informação prática facilmente localizada.

## Fontes observadas

- A marca institucional preservada na tag `legacy-static-v1`.
- As fotografias e composições disponíveis no projeto legado.
- A arquitetura de informação da Catedral de Maringá, estudada somente quanto à separação entre conteúdo institucional, notícias, eventos, horários, contato e participação comunitária.

Nenhum código, texto, componente, esquema cromático, imagem, logotipo ou composição da referência foi reutilizado.

## Conceito: presença que acolhe

A direção combina a permanência de uma publicação institucional com a proximidade de uma organização comunitária. O ouro aparece como linha de orientação e detalhe, não como efeito decorativo. O verde estabelece confiança e continuidade. Fundos em papel quente reduzem a aparência tecnológica e favorecem leitura prolongada.

A assimetria é controlada: títulos e conteúdo editorial ocupam áreas amplas, enquanto informações práticas ficam em colunas mais estreitas. Listas e divisores substituem conjuntos repetitivos de cartões.

## Cor

A paleta parte da marca existente, mas foi reinterpretada para uso digital:

- Verde profundo: títulos, cabeçalhos e superfícies institucionais.
- Verde médio: ações primárias e estados ativos.
- Ouro envelhecido: linhas, marcadores e destaques editoriais.
- Papel quente: fundo predominante.
- Branco quente: superfícies de leitura.
- Tinta escura: texto principal.
- Cinza esverdeado: texto secundário.
- Vermelho: reservado para erros e alertas; não é cor decorativa.

Não são usados gradientes, transparências vítreas ou sombras expressivas. Os valores completos e papéis semânticos estão em `src/styles/tokens.css`.

## Tipografia

### Cormorant Garamond

Usada somente em títulos, citações e elementos editoriais. Suas proporções clássicas comunicam tradição e espiritualidade sem imitar a tipografia da referência. Os pesos 500, 600 e 700 preservam legibilidade em telas.

### Source Sans 3

Usada em textos, navegação, rótulos, formulários e informações práticas. Possui formas abertas e leitura confortável em tamanhos menores, equilibrando a personalidade da fonte serifada.

Ambas são carregadas por `next/font`, com `display: swap` e subconjunto latino. Poppins não foi mantida automaticamente.

## Espaçamento e composição

- Escala de 4 px a 96 px para manter ritmo consistente.
- Conteúdo geral limitado a 74 rem.
- Texto corrido limitado a aproximadamente 43 rem ou 72 caracteres.
- Seções usam espaço vertical amplo, sem alternância mecânica de cores.
- Bordas aparecem como divisores editoriais.
- Raios pequenos ficam restritos a controles e à imagem circular da marca.
- Sombras são reservadas para elementos que realmente precisam de separação.

## Fotografia e identidade

Fotografias reais da instituição são preferíveis a ilustrações genéricas. Contudo, antes de publicá-las, devem ser confirmados autoria, data, contexto e consentimento de imagem, especialmente quando houver crianças e adolescentes.

As imagens `obra.png` e `obra2.png` não foram incorporadas à página de validação. Além da pendência de direitos, `obra2.png` contém informações históricas que conflitam com o HTML legado. O logotipo é o único recurso visual usado nesta etapa.

Futuros tratamentos fotográficos devem preservar cor natural, evitar filtros dramáticos e usar legendas factuais. Elementos gráficos podem derivar das linhas, faixas e cores da marca, sem redesenhá-la ou criar símbolos religiosos não confirmados.

## Componentes básicos

- `Container`: limita largura e margens responsivas.
- `Section`: controla ritmo vertical e tons semânticos.
- `SectionHeading`: organiza sobretítulo, título e descrição.
- `Button`: ação primária, secundária ou sobre fundo escuro.
- `TextLink`: navegação editorial com indicação textual de direção.
- `Tag`: classificação breve, sem ícone decorativo.
- `VisuallyHidden`: contexto adicional para tecnologias assistivas.

Os componentes são Server Components e não dependem de bibliotecas externas.

## Acessibilidade

- Contraste foi considerado na escolha dos pares de cor; deve ser reconfirmado em auditoria automatizada e manual quando o layout definitivo existir.
- Todo elemento interativo recebe foco visível com contorno e afastamento consistentes.
- Há link para pular ao conteúdo principal.
- A navegação funciona por teclado sem menu dependente de JavaScript.
- Textos não dependem apenas de cor para comunicar estado.
- `prefers-reduced-motion` desativa transições e rolagem suave.
- Tamanhos tipográficos são responsivos sem produzir títulos que ocupem a tela inteira.

## Critérios para a próxima etapa

- Confirmar direitos de uso e consentimentos das fotografias.
- Validar metadados e textos institucionais ainda marcados.
- Verificar contraste com ferramenta automatizada e inspeção manual.
- Testar navegação em 320 px, 768 px, 1024 px e telas amplas.
- Validar o sistema com conteúdo real antes de ampliar o número de componentes.
