# Publicações locais

## Escolha da fonte

A primeira versão usa arquivos TypeScript em `src/content/news.ts` e `src/content/events.ts`. Essa opção foi escolhida porque o projeto já compila TypeScript em modo estrito, o volume atual é pequeno e não existe conteúdo editorial confirmado que justifique MDX, CMS ou uma dependência de validação.

Os componentes consultam somente `ContentRepository`. Uma integração futura com CMS poderá implementar a mesma interface sem alterar as páginas.

## Validação

`publication-validation.ts` valida os dados quando os módulos são carregados e interrompe o build em caso de:

- ID ou slug duplicado;
- formato de slug inválido;
- data inválida;
- data final anterior à inicial;
- imagem sem texto alternativo.

Não foi adicionada Zod. Para dois schemas locais pequenos e tipados, as verificações explícitas cobrem as invariantes necessárias sem acrescentar dependência de produção. Uma biblioteca de schema passa a ter benefício concreto quando os dados vierem de JSON, API ou CMS não confiável.

## Regras públicas

- Apenas itens com `status: "published"` aparecem nas listagens e páginas de detalhe.
- Rascunhos, arquivados e slugs inexistentes retornam 404.
- Notícias são ordenadas da mais recente para a mais antiga.
- Eventos são ordenados pela data inicial; datas passadas recebem situação “Encerrado”.
- Listagens sem conteúdo exibem um estado vazio.
- Categoria e paginação não aparecem enquanto o volume não justificar esses controles.
- A campanha União Solidária não entra em `events.ts` enquanto não houver data inicial confirmada; ela continua documentada no conteúdo de participação.

## SEO e ambiente

As páginas de detalhe geram título, descrição, Open Graph, datas editoriais e dados estruturados. A URL canônica é emitida quando `NEXT_PUBLIC_SITE_URL` contém a origem pública confirmada. O projeto não define um domínio provisório para evitar inventar a URL institucional.

## Como adicionar conteúdo

1. Adicionar o item ao arquivo correspondente.
2. Preencher todos os campos obrigatórios e texto alternativo de imagens.
3. Manter `status: "draft"` durante revisão institucional.
4. Executar lint, TypeScript e build.
5. Alterar para `published` somente após confirmação e autorização.
