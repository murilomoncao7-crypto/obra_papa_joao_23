# Obra de Assistência Social Papa João XXIII

Site institucional da Obra Papa João XXIII, em Floresta, Paraná. A aplicação apresenta informações institucionais, história, atividades, formas de participação, contato, notícias e eventos validados.

O site estático original está preservado no commit `02083f7234f5ab8dbe23adf3c73412f90db212ed` e na tag anotada `legacy-static-v1`.

## Tecnologias

- Next.js 16 com App Router e Server Components;
- React 19;
- TypeScript estrito;
- CSS Modules e tokens CSS;
- `next/font` e `next/image`;
- Vitest, React Testing Library, Playwright e axe;
- ESLint e Prettier;
- npm e GitHub Actions.

## Requisitos

- Node.js 24.18.0, conforme `.nvmrc`;
- npm compatível com a versão do Node;
- Google Chrome para os testes Playwright locais.

## Instalação

```bash
npm ci
```

Copie `.env.example` para `.env.local` apenas quando houver uma URL pública ou de preview confirmada.

## Desenvolvimento

```bash
npm run dev
```

A aplicação abre em `http://localhost:3000` por padrão.

## Scripts

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento. |
| `npm run lint` | ESLint e verificação de formatação. |
| `npm run format` | Aplica Prettier aos arquivos técnicos. |
| `npm run typecheck` | TypeScript sem emissão. |
| `npm run validate:content` | Testes de schemas, datas, slugs e imagens. |
| `npm run test:unit` | Vitest e Testing Library. |
| `npm run test:e2e` | Fluxos Playwright em desktop, tablet e celular. |
| `npm run check:links` | Links internos e externos importantes. |
| `npm run test` | Suíte unitária e end-to-end. |
| `npm run build` | Build otimizado de produção. |
| `npm run start` | Executa o build localmente. |

## Estrutura

- `src/app`: rotas, metadados e estados do App Router;
- `src/components`: layout, navegação e componentes reutilizáveis;
- `src/content`: domínio, validação, repositório abstrato e fonte local;
- `src/lib`: composição de SEO e URLs;
- `src/styles`: tokens, reset, tipografia e estilos compartilhados;
- `public/images/legacy`: originais preservados;
- `public/images/optimized`: derivados WebP e AVIF;
- `tests/e2e`: fluxos Playwright;
- `docs`: auditorias, decisões e operação;
- `.github/workflows`: integração contínua.

## Conteúdo local

Eventos e páginas institucionais permanecem locais. Postagens são lidas do Sanity por um adaptador de
`ContentRepository`, com fallback seguro para o repositório local. Conteúdo não confirmado permanece
em rascunho e nunca entra nas consultas públicas.

Processo atual: editar arquivo local, validar schema, revisar no preview, obter aprovação institucional e somente então publicar por pull request. Não invente nomes, datas, horários, contatos ou campanhas.

## Imagens

Originais não devem ser sobrescritos. O inventário, textos alternativos, usos e métricas estão em `docs/image-inventory.md`. Novas imagens precisam de origem, autorização, texto alternativo, dimensões e derivados adequados.

## Variáveis de ambiente

| Variável | Obrigatoriedade | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Obrigatória antes do deploy público | Canonical, Open Graph, robots e sitemap. Deve ser uma origem HTTPS confirmada, sem barra final. |

Não versione `.env.local`, tokens ou credenciais.

## Testes e qualidade

Antes de abrir pull request:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Os testes cobrem validações de conteúdo e datas, menu móvel, navegação, notícias sem resultados, 404, links, imagens, overflow e acessibilidade básica.

## Build e deploy

```bash
npm run build
npm run start
```

O projeto é compatível com Vercel e hospedagens que suportem Next.js 16 e Node 24. Não há `vercel.json` porque nenhuma configuração específica é necessária. Branch, preview, HTTPS, rollback e validação editorial estão em `docs/deployment.md`.

## Postagens e painel editorial

O feed público fica em `/postagens`, com fotos em carrossel, categorias e atualização automática.
Responsáveis acessam `/gestao` com usuário e senha configurados no servidor. O formulário prepara
as fotos, permite revisar a postagem e publica no Sanity. Não há senha embutida no código.

Publicar ou retirar uma postagem atualiza o cache do site, sem exigir novo deploy. O feed aberto
consulta atualizações a cada 30 segundos. O webhook do Sanity permanece disponível para alterações
realizadas fora do painel.

A ativação técnica, o cadastro das variáveis de ambiente e as orientações de imagens estão em
`docs/painel-postagens.md`. Para gerar as credenciais localmente, execute
`node scripts/configure-editor.mjs`. O projeto Sanity, dataset e token Editor precisam estar
configurados antes da liberação. As instruções anteriores de administração do Studio permanecem
em `docs/sanity-setup.md` e `docs/manual-editorial-sanity.md` como referência técnica.

Testes isolados do painel: `npx playwright test --config=playwright.editor.config.ts`.
Os testes usam dados fictícios e não publicam no CMS institucional.

## Contribuição

1. Criar uma branch a partir da versão revisada.
2. Fazer mudanças pequenas e rastreáveis.
3. Não apagar legado ou substituir dados institucionais sem identificar a finalidade.
4. Executar todas as verificações.
5. Abrir pull request; não fazer merge direto nem force push.

## Solução de problemas

- `npm ci` falha: confirme Node 24.18.0 e um `package-lock.json` sem alterações manuais.
- Playwright não encontra navegador: instale Google Chrome ou ajuste o canal apenas com justificativa no pull request.
- Sitemap vazio: configure `NEXT_PUBLIC_SITE_URL` com uma URL válida.
- Imagem não aparece: confirme caminho, variante e arquivo; não substitua por semelhança de nome.
- Conteúdo não aparece: confirme `status: "published"`, slug e validações.
- Build de fontes falha sem rede: execute em ambiente com acesso aos arquivos de `next/font` ou migre as fontes para arquivos locais em uma etapa autorizada.
