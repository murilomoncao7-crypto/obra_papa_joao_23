# Preparação para gestão de conteúdo

## Status da decisão

Decisão provisória. Nenhum CMS, banco, autenticação ou painel foi escolhido ou instalado nesta etapa. A decisão final depende de teste com as pessoas que publicarão, orçamento, frequência e volume de conteúdo, política de dados e capacidade de manutenção.

## Estado atual

O site usa modelos de domínio TypeScript e um contrato `ContentRepository`. A composição pública ocorre em `src/content/index.ts`, que cria a implementação `LocalContentRepository`. Componentes e páginas importam apenas `@/content`; não conhecem nomes de arquivos, formato de armazenamento ou fornecedor.

Notícias e eventos permanecem em arquivos TypeScript locais validados. O repositório aplica visibilidade, filtros, ordenação e paginação antes de devolver modelos de domínio. Uma integração futura deverá mapear a resposta externa para esses mesmos modelos dentro de um adaptador, sem expor DTOs do CMS à interface.

## Conteúdos editáveis previstos

- configurações do site, navegação e dados de contato;
- páginas institucionais, missão, história e chamadas relacionadas;
- atividades, horários e formas de participação;
- notícias, categorias, etiquetas e SEO;
- eventos, campanhas, inscrições e contatos;
- imagens, textos alternativos, legendas, créditos e autorizações;
- avisos temporários e destaques da página inicial.

Campos legais, dados bancários e informações sensíveis precisam de permissões e revisão mais restritas. O CMS não deve armazenar dados de beneficiários sem uma avaliação específica de necessidade, LGPD, consentimento e retenção.

## Perfis previstos

| Perfil | Responsabilidade prevista |
| --- | --- |
| Colaborador | Criar e editar seus próprios rascunhos; enviar imagens autorizadas; não publicar. |
| Editor | Revisar conteúdo, acessibilidade, datas, links, SEO e direitos de imagem. |
| Publicador | Aprovar, publicar, despublicar e programar conteúdo. |
| Administrador | Gerenciar usuários, permissões, schemas, integrações e recuperação; não deve ser conta de uso editorial diário. |

Aplicar menor privilégio, contas individuais e autenticação multifator quando a plataforma permitir. Contas compartilhadas não atendem à necessidade de auditoria.

## Fluxo editorial proposto

1. Colaborador cria um rascunho.
2. Validações bloqueiam slug duplicado, data inválida e imagem sem texto alternativo.
3. Editor verifica conteúdo institucional, contatos, cronologia, direitos e consentimentos.
4. Preview autenticado mostra o rascunho no layout real sem torná-lo público.
5. Publicador aprova publicação imediata ou programada.
6. O CMS aciona revalidação ou novo deploy conforme a estratégia escolhida.
7. Alterações posteriores criam nova versão; restauração não apaga o histórico.

Estados mínimos: `draft`, `inReview`, `published` e `archived`. O domínio atual mantém `draft`, `published` e `archived`; `inReview` deve ser incorporado somente quando o fluxo e o CMS forem definidos.

## Imagens

Será necessário upload com limites de formato, dimensão e tamanho, geração de variações, texto alternativo obrigatório, legenda, crédito, origem, consentimento e data de expiração quando aplicável. A política deve impedir executáveis e SVG não sanitizado, remover metadados sensíveis quando necessário e definir exclusão segura. CDN e armazenamento devem ter backup e URLs estáveis.

## Preview, histórico e auditoria

O preview deve usar o modo de rascunho do Next.js ou mecanismo equivalente, protegido por token curto e permissão do CMS. Nunca aceitar slug ou URL de preview sem validação.

O histórico mínimo precisa registrar autor, horário, estado anterior, estado novo e publicação/despublicação. A auditoria deve ser pesquisável e ter retenção definida. Restauração de versão e exportação periódica são requisitos de continuidade, não substitutos de backup.

## Segurança e backups

- MFA, menor privilégio, revisão periódica de acessos e revogação ao desligamento;
- tokens somente no servidor, com escopo de leitura para o site público;
- separação entre ambientes de teste e produção;
- validação e sanitização no adaptador, mesmo quando o CMS também valida;
- atualização de CMS, plugins, banco e sistema operacional quando autogeridos;
- logs sem conteúdo sensível e alertas para alterações administrativas;
- backups automáticos de banco e mídia, criptografados e testados por restauração;
- plano documentado para indisponibilidade e exportação completa.

## Custo operacional

O custo total inclui assinatura, hospedagem, banco, armazenamento e tráfego de imagens, e-mail, monitoramento, backup, atualizações, suporte e horas da equipe. Serviço gerenciado reduz operação, mas aumenta dependência e custo recorrente. Autohospedagem reduz licenciamento em alguns cenários, mas transfere segurança, disponibilidade e recuperação para a equipe.

Preços e limites mudam; devem ser cotados novamente com volume estimado de usuários, documentos, mídia, API e ambientes antes da decisão.

## Comparação técnica futura

| Critério | Sanity | Strapi | Payload CMS | WordPress headless |
| --- | --- | --- | --- | --- |
| Usuários não técnicos | Studio configurável e edição visual fortes; exige modelagem cuidadosa. | Painel convencional e Content Manager acessível. | Painel moderno derivado do schema; pode exigir adaptação inicial. | Interface mais familiar e grande oferta de treinamento. |
| Manutenção | Conteúdo e ativos gerenciados pelo serviço; Studio continua sendo aplicação mantida pela equipe. | Cloud gerenciado ou servidor, banco, mídia e upgrades sob responsabilidade própria. | Pode integrar-se ao Next.js, mas requer banco, armazenamento e operação quando autohospedado. | Exige manutenção frequente do core, plugins, tema/headless bridge, PHP, banco e hospedagem. |
| Hospedagem | Content Lake hospedado; Studio pode ser hospedado separadamente. | Strapi Cloud ou autohospedagem. | Payload Cloud ou autohospedagem compatível com Node e banco suportado. | Muitos hosts gerenciados ou autohospedagem; frontend Next.js continua separado. |
| Custo | Entrada gerenciada e limites por plano; cresce com usuários, uso e recursos avançados. | Community autohospedada ou Cloud; operação própria deve entrar na conta. | Código aberto com opção gerenciada; banco e arquivos influenciam o custo. | Software aberto, mas hospedagem, plugins premium, segurança e manutenção podem dominar o custo. |
| Imagens | Pipeline e ativos hospedados; bom suporte a transformações e hot spots. | Media Library com upload, edição e providers de armazenamento. | Collections de upload e adaptadores de armazenamento configuráveis. | Media Library madura; otimização e distribuição frequentemente dependem de host ou plugins. |
| Preview | Presentation Tool e edição visual integrados ao ecossistema. | Recurso de Preview configurável; workflows avançados variam por plano. | Drafts, versions e preview integráveis ao Next.js. | Preview e revisões existem, mas o headless exige integração própria para refletir o frontend Next.js. |
| Permissões | Papéis por projeto/dataset; granularidade avançada depende do plano. | RBAC administrativo com permissões por conteúdo, campo e ação. | Access Control em código, por coleção, campo e operação. | Papéis e capabilities maduros; granularidade adicional costuma envolver código ou plugins. |
| TypeScript | Schemas em JavaScript/TypeScript e clientes tipáveis; consultas exigem disciplina de geração/mapeamento. | Suporta desenvolvimento TypeScript e geração de tipos, mas DTOs continuam externos ao domínio. | Nativo em TypeScript, schemas code-first e tipos gerados. | REST retorna JSON; tipos precisam ser gerados ou mantidos no adaptador. |
| Next.js | Integração oficial forte, preview e edição visual. | Integração por REST/GraphQL; simples, mas mantida como aplicação separada. | Construído sobre Next.js e oferece API local/REST/GraphQL; maior acoplamento arquitetural possível. | REST API estável e amplo ecossistema; preview, cache e campos personalizados exigem composição. |
| Portabilidade | Exportação possível, mas GROQ, Portable Text e Studio elevam o custo de saída. | Banco e API controláveis; componentes e relações ainda exigem migração. | Código e schemas sob controle; migração de banco e rich text exige planejamento. | Exportação e REST amplamente conhecidos; plugins e blocos proprietários podem reduzir portabilidade real. |
| Dependência de fornecedor | Média/alta no Content Lake e recursos visuais. | Baixa/média autohospedado; maior no Cloud e recursos comerciais. | Baixa/média no código aberto; aumenta com serviços gerenciados e integração profunda. | Baixa no core, porém pode ser alta em plugins, host e construtores específicos. |

## Recomendação provisória

Sanity é o primeiro candidato para uma prova de conceito se a prioridade for reduzir operação e oferecer boa experiência de edição e preview com Next.js. O risco principal é dependência do Content Lake, GROQ, Portable Text e limites do plano.

Payload CMS é o segundo candidato se a equipe responsável tiver capacidade de operar banco, mídia e atualizações e valorizar TypeScript, schemas code-first e controle do código. Strapi é uma alternativa equilibrada para uma aplicação CMS separada e convencional. WordPress headless deve ser priorizado somente se a instituição já tiver equipe, hospedagem e familiaridade comprovadas com WordPress, pois o custo de plugins, segurança e integração de preview pode superar a familiaridade inicial.

Antes da decisão: protótipo curto com duas pessoas não técnicas, notícia com galeria, evento com inscrição, preview, revisão, restauração, exportação e medição do custo mensal projetado. A recomendação final depende da equipe, orçamento e volume real de publicações.

## Migração dos dados locais

1. Congelar e exportar os arquivos locais validados.
2. Criar schemas equivalentes no CMS sem importar nomes de fornecedor para o domínio.
3. Implementar um adaptador que converta DTOs externos em `SiteSettings`, `InstitutionalPage`, `Activity`, `NewsPost` e `Event`.
4. Importar primeiro rascunhos, mídia e relacionamentos em ambiente de teste.
5. Comparar contagens, slugs, datas, textos alternativos e hashes de arquivos.
6. Fazer revisão institucional e teste de preview.
7. Trocar somente a factory de composição.
8. Manter exportação local de retorno até completar o período de estabilização.

## Impacto no deploy

Hoje, alterar conteúdo exige commit e novo build. Com CMS, há três opções: renderização dinâmica com cache, revalidação sob demanda por webhook, ou build acionado por publicação. A escolha deve considerar velocidade editorial, custo, disponibilidade do CMS e comportamento em falhas.

A opção inicial preferida é conteúdo público cacheado com revalidação autenticada após publicação. O último conteúdo publicado deve continuar disponível se o CMS estiver temporariamente indisponível. Preview deve ser dinâmico e nunca compartilhar o cache público. Nenhuma dessas integrações é implementada nesta etapa.

## Fontes oficiais consultadas

- [Sanity: papéis e permissões](https://www.sanity.io/docs/user-guides/roles)
- [Sanity: arquitetura de edição visual](https://www.sanity.io/docs/visual-editing/visual-editing-architecture)
- [Strapi: Draft & Publish](https://docs.strapi.io/cms/features/draft-and-publish)
- [Strapi: RBAC](https://docs.strapi.io/cms/features/rbac)
- [Strapi: Media Library](https://docs.strapi.io/cms/features/media-library)
- [Strapi: desenvolvimento com TypeScript](https://docs.strapi.io/cms/typescript/development)
- [Payload: conceitos e integração com Next.js](https://payloadcms.com/docs/getting-started/concepts)
- [Payload: drafts](https://payloadcms.com/docs/versions/drafts)
- [Payload: versions](https://payloadcms.com/docs/versions/overview)
- [Payload: access control](https://payloadcms.com/docs/access-control/overview)
- [WordPress: REST API](https://developer.wordpress.org/rest-api/reference/)
- [WordPress: papéis e capabilities](https://wordpress.org/documentation/article/roles-and-capabilities/)
- [WordPress: Media Library](https://wordpress.org/documentation/article/media-library-screen/)
