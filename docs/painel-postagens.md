# Painel de postagens

O feed público fica em `/postagens`. Responsáveis entram em `/gestao` com o usuário e a senha definidos pela instituição. Somente sessões válidas podem publicar ou retirar postagens. Fotos e documentos são mantidos no projeto Sanity da instituição; não ficam no disco temporário das funções da Vercel.

## Ativação técnica

O painel permanece bloqueado até que todas as configurações estejam disponíveis. O site institucional continua acessível.

1. No projeto Sanity institucional, confirme o dataset de produção. Para dataset privado, configure também um token Viewer para a leitura pública no servidor.
2. Crie um token Sanity com papel Editor para a aplicação. Guarde-o somente na variável sensível `SANITY_EDITOR_TOKEN` da Vercel, em Production. Nunca use prefixo `NEXT_PUBLIC_` para tokens.
   Se a integração Sanity já estiver instalada na Vercel, reconecte o projeto incluindo **Production**, com **Sensitive** habilitado. O código reconhece automaticamente `SANITY_API_WRITE_TOKEN`, `SANITY_API_READ_TOKEN`, `SANITY_API_PROJECT_ID` e `SANITY_API_DATASET`; não é necessário revelar ou copiar os tokens da integração.
3. Configure `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` e `NEXT_PUBLIC_SITE_URL`. Configure `SANITY_API_TOKEN` com o token Viewer quando necessário. O navegador não precisa de acesso de escrita ao CMS.
4. Execute `node scripts/configure-editor.mjs` no computador do administrador. Informe o usuário e a senha desejados. A senha não aparece na tela; o script gera o hash e uma chave de sessão no `.env.local`, ignorado pelo Git.
5. Copie `EDITOR_USERNAME`, `EDITOR_PASSWORD_HASH` e `EDITOR_SESSION_SECRET` para as variáveis de Production da Vercel. Marque-as como sensíveis. Não envie os valores em conversas, tickets ou commits.
6. Faça um novo deploy. Confirme login válido, rejeição de senha incorreta, publicação de teste autorizada, exibição no feed e retirada do teste. O teste público deve ser feito por um responsável com imagens aprovadas.

As variáveis de Production não devem ser copiadas para previews de branches. Se houver ambiente de testes, use outro dataset e credenciais próprias. O painel não embute senha padrão; sem configuração, falha de forma fechada.

## Publicar

1. Entre em `/gestao` e abra **Criar postagem**.
2. Escreva título (5 a 120 caracteres), texto (30 a 10.000 caracteres), responsável e categoria.
3. Selecione de uma a três fotos. A primeira será a capa. Veja a prévia.
4. Informe descrição acessível, crédito e confirme autorizações de uso e publicação na internet.
5. Clique em **Publicar no site** e aguarde a confirmação. Use **Abrir postagem** para conferir.

O formulário preserva o texto caso a publicação falhe. Para retirar uma publicação, use a aba **Publicações** e **Retirar do feed**. O documento será arquivado, preservando o histórico; a lista mostra os 100 registros mais recentes.

## Fotos

| Uso | Recomendação |
| --- | --- |
| Foto vertical | 1080 × 1350 pixels, proporção 4:5 |
| Foto quadrada | 1080 × 1080 pixels, proporção 1:1 |
| Formatos aceitos | JPG/JPEG, PNG ou WebP estáticos |
| Quantidade | Uma a três fotos por postagem |
| Limite por original | 10 MB; mínimo de 320 × 320 pixels |

O painel reduz as cópias para até 1600 pixels no maior lado e até 1 MB por foto. O servidor verifica os arquivos, aplica a orientação, converte para WebP e remove metadados da imagem. As imagens do feed são apresentadas sem cortar rostos ou textos. Créditos, descrição acessível e autorizações são obrigatórios.

## Atualização automática

Publicar ou arquivar no painel salva primeiro o documento no Sanity e em seguida invalida o cache da página inicial, feed, detalhes e sitemap. A página de feed aberta consulta atualizações a cada 30 segundos enquanto a aba está visível. Não são necessários commit no GitHub ou novo deploy para cada postagem.

Para alterações feitas diretamente no Sanity Studio, configure o webhook assinado existente `/api/sanity/revalidate` conforme `docs/sanity-setup.md`. A leitura pública também tem revalidação periódica de 30 segundos. Publicação agendada no Studio não deve ser confundida com o botão de publicação imediata deste painel.

## Acesso e manutenção

Sessões duram oito horas, usam cookie HttpOnly, Secure em produção e SameSite Strict. Alterar usuário, hash da senha ou chave invalida sessões anteriores após o deploy. O CMS mantém um limite compartilhado de cinco tentativas por origem de rede a cada 15 minutos; falha de consulta ou concorrência não libera acesso. O usuário compartilhado não identifica individualmente quem entrou: o campo responsável é editorial. Contas individuais continuam disponíveis por meio da administração do Sanity, se a instituição preferir ampliar a gestão futuramente.

O painel só grava conteúdo no Sanity. Ele não tem credenciais para alterar código, disparar builds ou administrar a Vercel. Testes automatizados usam credenciais e imagens fictícias e não publicam no dataset institucional.
