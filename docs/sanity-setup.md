# Configuração do Sanity e da Vercel

## Arquitetura adotada

O Next.js continua servindo as páginas institucionais a partir do conteúdo local já validado. O
Sanity é usado somente para postagens nesta primeira etapa. Essa separação evita que uma falha do
CMS derrube o restante do site e mantém uma rota de retorno durante a migração.

O Studio fica embutido em `/gestao` e usa a autenticação e as permissões do projeto Sanity. Não há
cadastro público, endpoint de escrita próprio, segundo sistema de login ou token de escrita no
navegador.

## 1. Projetos e datasets

1. Crie ou conecte um único projeto Sanity pertencente à instituição.
2. Use um dataset `staging` para os deployments de Preview da Vercel.
3. Use o dataset `production` somente quando o fluxo editorial estiver aprovado.
4. Convide cada pessoa com sua própria conta. Não compartilhe logins.

## 2. Papéis

- Administrador: papel Administrator do Sanity, restrito a quem gerencia integrantes, tokens e
  configurações.
- Editor: papel Editor, com criação, revisão, publicação e despublicação de conteúdo.

Se o plano contratado permitir papéis personalizados, retire do Editor a administração do projeto e
mantenha apenas as permissões editoriais necessárias. Ative autenticação multifator nas contas.

## 3. Variáveis na Vercel

Cadastre as variáveis abaixo primeiro no ambiente Preview do projeto existente
`obra-papa-joao-23`:

- `NEXT_PUBLIC_SITE_URL`: URL HTTPS do deployment que será usado para validação.
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: identificador público do projeto.
- `NEXT_PUBLIC_SANITY_DATASET`: `staging` em Preview e `production` em Production.
- `SANITY_API_TOKEN`: token com permissão somente de leitura (Viewer), disponível apenas no
  servidor.
- `SANITY_REVALIDATE_SECRET`: valor longo, aleatório e exclusivo para verificar o webhook.

`SANITY_BROWSER_TOKEN` não é necessário nesta implementação. O Studio grava com a sessão da pessoa
autenticada, e o site lê rascunhos no servidor.

Nunca copie os valores reais para `.env.example`, documentação, tickets ou mensagens.

## 4. CORS e origens confiáveis

Em **Sanity Manage → API → CORS origins**, adicione com credenciais:

- `https://obra-papa-joao-23.vercel.app`
- a URL exata do deployment de Preview usado pela equipe
- `http://localhost:3000`, apenas durante desenvolvimento local

Remova URLs de Preview antigas quando não forem mais usadas. Não permita origem curinga pública.

## 5. Webhook assinado

Crie um webhook do Sanity para:

`https://SEU-DOMINIO/api/sanity/revalidate`

Configuração recomendada:

- tipos: `postagem`, `categoria` e `autor`;
- eventos: criar, atualizar e excluir;
- incluir rascunhos: não;
- segredo: o mesmo valor de `SANITY_REVALIDATE_SECRET`;
- projeção: `{ "_type": _type, "slug": slug.current }`.

O endpoint rejeita assinatura inválida e atualiza somente página inicial, feed, páginas individuais e
sitemap. O segredo não é aceito por parâmetro de URL.

## 6. Rascunho técnico de teste

O arquivo `sanity/test-data/postagem-teste.ndjson` contém um rascunho claramente identificado. Ele
deve ser importado somente no dataset `staging`, nunca no dataset de produção. Depois do teste, ele
pode ser excluído no Studio.

Antes de liberar produção, verifique manualmente no Preview: login e bloqueio sem convite, criação e
edição do rascunho, upload JPG/PNG/WebP, bloqueio sem texto alternativo, bloqueio sem as duas
autorizações, preview, publicação, atualização, despublicação e arquivamento.

## 7. Passagem para produção

Somente copie as variáveis para Production e crie o webhook de produção depois que:

- houver ao menos uma conta Administradora institucional;
- o build de Preview estiver aprovado;
- o painel exigir login do Sanity;
- o rascunho de teste não aparecer no feed público;
- publicação, despublicação e arquivamento tiverem sido verificados;
- CORS contiver apenas origens necessárias.
