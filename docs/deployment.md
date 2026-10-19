# Operação e deploy

## Estratégia

- Branch de produção: `main`.
- Toda mudança deve chegar por pull request a partir de `feat/nextjs-rebuild` ou outra branch curta.
- Pull requests devem gerar preview isolado e executar o workflow de qualidade.
- Produção só pode ser promovida após revisão institucional e aprovação explícita.
- Esta etapa não publica o site.

## Vercel ou hospedagem Next.js compatível

1. Importar o repositório sem alterar o diretório raiz.
2. Usar a versão da `.nvmrc` e `npm ci`.
3. Comando de build: `npm run build`.
4. Definir `NEXT_PUBLIC_SITE_URL` com a origem HTTPS confirmada, sem barra final.
5. Validar canonical, Open Graph, `robots.txt` e `sitemap.xml` no preview de produção.
6. Configurar o domínio somente após confirmação de titularidade e DNS.
7. Manter HTTPS obrigatório e redirecionamento de uma única origem canônica.

Não são necessárias configurações específicas de Vercel no repositório neste momento.

## Preview e publicação atual

Hoje o conteúdo local muda por pull request. Para validar uma publicação:

1. manter o item como `draft` durante revisão;
2. executar `npm run validate:content` e `npm run test`;
3. revisar texto, data, slug, imagem, alt, direitos e contatos no preview;
4. mudar para `published` somente após aprovação;
5. confirmar que a rota entrou no sitemap e que o slug anterior não foi quebrado;
6. promover o deploy aprovado.

## Rollback

Na Vercel, promover novamente o último deployment saudável. Em outro provedor, restaurar o artefato do commit anterior. Depois, abrir um commit corretivo; não usar `git push --force` ou reescrever a `main`. Rollback de aplicação não substitui backup de conteúdo e imagens.

## CMS futuro

Quando houver CMS, o deploy deverá usar leitura pública cacheada e revalidação autenticada por webhook. Preview de rascunho será separado do cache público. O plano completo está em `docs/architecture/cms-readiness.md`.
