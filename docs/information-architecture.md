# Arquitetura de informação inicial

## Princípios

- A arquitetura parte apenas do conteúdo encontrado no legado.
- Informações permanentes, atividades, eventos e formas de participação devem ser distinguídas entre si.
- Rotas sem conteúdo real suficiente permanecem previstas no modelo, mas não entram na navegação pública até haver conteúdo confirmado.
- Campos incompletos devem exibir `[VALIDAR COM A INSTITUIÇÃO]` em ambiente editorial, não afirmações inventadas.
- A organização observada na referência institucional inspira somente a separação entre conteúdo permanente, agenda, publicações, serviços e contato.

## Mapa de páginas recomendado

| Rota | Decisão | Conteúdo disponível |
| --- | --- | --- |
| `/` | Manter | Apresentação breve, missão resumida, destaques de atividades, próximo evento/campanha quando válido, formas de ajudar e contato essencial |
| `/instituicao` | Manter | Descrição, natureza declarada, público atendido, missão, visão e valores |
| `/historia` | Manter, fora da navegação até validação da cronologia | Fundação, fundador, continuidade pelas Irmãs e referência a Papa João XXIII |
| `/atividades` | Manter | Lista das oito atividades confirmadas no legado |
| `/atividades/[slug]` | Manter no modelo; publicar somente após conteúdo individual | Descrição, imagem, público, agenda e participação de cada atividade |
| `/noticias` | Adiar publicação | Não há notícias no legado |
| `/noticias/[slug]` | Adiar publicação | Não há posts ou acervo editorial no legado |
| `/eventos` | Manter | Festa da Picanha e União Solidária, claramente distinguidas como evento e campanha |
| `/eventos/[slug]` | Manter no modelo | Detalhes estruturados, após validação de datas e serviço |
| `/como-ajudar` | Manter | Doações, eventos, divulgação e União Solidária, sem dados financeiros inventados |
| `/contato` | Manter | Endereço, telefone/WhatsApp, e-mail, redes e mapa, todos sujeitos a validação |

Não se recomenda uma rota independente para horários nesta etapa porque nenhum horário foi encontrado. Horários futuros podem ser apresentados em `/contato` ou nas páginas das atividades e dos eventos conforme seu contexto.

Não se recomenda uma rota genérica de galeria nesta etapa. As imagens disponíveis têm relação direta com instituição, atividades e eventos e devem permanecer próximas ao conteúdo correspondente.

## Navegação inicial

1. Início
2. Instituição
   - Sobre a instituição
   - História, após validação
3. Atividades
4. Eventos e campanhas
5. Como ajudar
6. Contato

“Notícias” deve entrar na navegação apenas quando existir conteúdo real e um processo editorial definido.

## Estrutura da página inicial

1. Identidade e descrição institucional curta.
2. Missão e indicadores confirmados.
3. Atividades em destaque.
4. Evento ou campanha vigente, se validado.
5. Formas de participação.
6. Contatos essenciais e localização.

## Taxonomia inicial

- Conteúdo institucional: apresentação, missão, visão, valores e história.
- Atividades: convivência, cultura, arte, esporte, planejamento e relação com famílias.
- Atualizações: notícias e comunicados, ainda sem conteúdo legado.
- Agenda: eventos com início, término e local.
- Campanhas: ações de apoio com período, instruções e link verificado.
- Participação: doação, presença em eventos e divulgação.

## Regras editoriais para publicação

- `draft`: conteúdo em preparação ou ainda não validado.
- `published`: conteúdo confirmado e autorizado para exibição.
- `archived`: evento, campanha ou publicação mantido apenas como histórico.

Dados temporais devem ter data completa e fuso quando aplicável. Imagens devem possuir origem, autorização, texto alternativo e vínculo explícito com o conteúdo. Contatos e redes devem ser modelados como canais, evitando duplicação em páginas diferentes.

## Dependências antes do layout definitivo

- Resolver a cronologia 1963/1967.
- Confirmar contatos, endereço, redes e quantidade de atendidos.
- Definir quais atividades terão página própria.
- Confirmar Festa da Picanha e União Solidária.
- Obter horários e processo editorial para notícias.
- Auditar direitos e consentimentos das imagens.
- Concluído: versão estática preservada no commit `02083f7234f5ab8dbe23adf3c73412f90db212ed` e na tag `legacy-static-v1`.
