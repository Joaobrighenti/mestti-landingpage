---
name: MESTTI — site institucional
description: Identidade industrial existente, estendida por demonstração de produto e leitura editorial.
colors:
  primary-blue: "#024578"
  primary-dark: "#013354"
  primary-light: "#0369a1"
  green: "#059669"
  story-action: "#047857"
  story-action-hover: "#065f46"
  white: "#ffffff"
  gray-50: "#fafafa"
  gray-600: "#52525b"
  gray-800: "#27272a"
  gray-900: "#18181b"
  story-ink: "#15344a"
  story-muted: "#496071"
  story-surface: "#f0f5f8"
  story-line: "#d4e0e8"
  dark-story-ink: "#edf4f8"
  dark-story-muted: "#b5c8d6"
  dark-story-surface: "#142737"
  dark-story-paper: "#0d1c29"
  dark-story-line: "#365065"
  dark-story-blue: "#8acbfa"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(2.35rem, 4.4vw, 4.1rem)"
    fontWeight: 800
    lineHeight: 1.09
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.85rem, 3vw, 2.65rem)"
    lineHeight: 1.16
    letterSpacing: "-.025em"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.25rem"
    lineHeight: 1.35
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "16px"
    lineHeight: 1.75
rounded:
  tag: "4px"
  button: "6px"
  note: "8px"
  flow: "9px"
  panel: "12px"
spacing:
  xs: "clamp(0.25rem, 1vw, 0.5rem)"
  sm: "clamp(0.5rem, 2vw, 1rem)"
  md: "clamp(1rem, 3vw, 1.5rem)"
  lg: "clamp(1.5rem, 4vw, 2rem)"
  xl: "clamp(2rem, 5vw, 3rem)"
  2xl: "clamp(3rem, 6vw, 4rem)"
  3xl: "clamp(4rem, 8vw, 6rem)"
  4xl: "clamp(4rem, 7vw, 5.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.story-action}"
    textColor: "{colors.white}"
    rounded: "{rounded.button}"
    padding: "13px 23px"
  button-primary-hover:
    backgroundColor: "{colors.story-action-hover}"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary-blue}"
    rounded: "{rounded.button}"
    padding: "13px 23px"
  button-on-blue:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary-blue}"
    rounded: "{rounded.button}"
    padding: "13px 23px"
  process-tag:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.tag}"
    padding: "6px 10px"
  engineering-panel:
    backgroundColor: "{colors.story-surface}"
    rounded: "{rounded.panel}"
    padding: "28px"
---

# Design System: MESTTI — site institucional

## Overview

**Creative North Star: "Demonstração industrial com a identidade existente"**

A extensão conserva o azul institucional, a Inter e os temas do site. Telas do sistema, esquemas de processo em HTML e leitura editorial aproximam o visitante da rotina industrial. É continuidade do mundo existente; as novas páginas não substituem a linguagem da home.

A home mantém sua assinatura 3D. Nas demais superfícies, a demonstração e o conteúdo conduzem a composição. O registro abaixo descreve código observado em 2026-10-21; não certifica renderização, acessibilidade ou responsividade. Fontes: `css/base.css`, `css/product-story.css`, header e superfícies listadas em [DESIGN-DECISIONS](docs/site/DESIGN-DECISIONS.md).

**Key Characteristics:**

- Azul institucional para orientação e identidade; verde para ações comerciais.
- Hierarquia tipográfica contínua, conteúdo industrial concreto e áreas de leitura controladas.
- Profundidade discreta em demonstrações; relações explicadas por linhas e agrupamentos.
- Temas claro e escuro preservados, com tokens próprios da extensão.

## Colors

A paleta combina azul industrial, verdes de ação e neutros com leve presença azul na extensão.

### Primary

- **Azul MESTTI** (`primary-blue`): identidade e links; `primary-dark` e `primary-light` pertencem à família já existente.
- **Azul de leitura no escuro** (`dark-story-blue`): links e foco nas superfícies da extensão sob tema escuro.

### Secondary

- **Verde de ação** (`green`): token global existente. A extensão usa `story-action` e seu hover; registrar essa diferença não autoriza uma migração global.

### Neutral

- **Branco e cinza institucional** (`white`, `gray-*`): fundo e texto da base.
- **Tinta industrial** (`story-ink`, `story-muted`): títulos e leitura secundária da extensão.
- **Superfície e linha** (`story-surface`, `story-line`): faixas, molduras e divisores; o papel claro usa branco.
- **Neutros escuros** (`dark-story-*`): substituem tinta, texto secundário, superfície, papel e linha sob `html[data-theme="dark"]`. O verde de ação permanece igual.

**The Identidade Rule.** Preservar as famílias existentes; novas superfícies não introduzem outra paleta de marca.

## Typography

**Display Font / Body Font:** Inter, com os fallbacks registrados no frontmatter. A extensão não acrescenta outra família.

A Inter fornece hierarquia e continuidade entre apresentação e leitura. Display, headline, title e body acima descrevem a extensão; não substituem todas as escalas antigas.

- **Display:** título de abertura com medida máxima de 19ch; na faixa intermediária chega a 24ch.
- **Headline:** seção com espaçamento inferior de 22px.
- **Title:** subtítulo de agrupamento, com espaçamento inferior de 12px.
- **Body:** parágrafos com medida máxima de 70ch e espaçamento inferior de 18px.
- O guia tem título próprio (`clamp(2.2rem, 4vw, 3.7rem)`, máximo 22ch) e subtítulos menores no corpo.

O CSS base fixa `html` em 14px; portanto `rem` não equivale a 16px. A extensão usa peso 800 na abertura e 600 nas ações, dentro dos pesos solicitados pelo link Google Fonts (400/500/600/700/800). A composição das superfícies novas foi conferida nas capturas e larguras registradas em `docs/site/VALIDATION.md`; isso não aprova toda a tipografia legada ou todos os dispositivos.

## Layout

O container institucional tem largura máxima de 1100px, variante de 1200px e margens com safe area. A extensão usa largura `min(1160px, calc(100% - 64px))`; até 700px passa a margens laterais de 20px. Seções usam respiro fluido de 56–100px. Linhas de produto alternam proporções .88/1.12 e imagem/texto, sem transformar toda seção em um card.

Até 950px, heróis, pares e linhas de produto tornam-se uma coluna; o fluxo de quatro etapas passa a duas. Até 700px, escolhas, módulos e fluxo tornam-se uma coluna, botões ocupam a largura disponível e molduras ficam mais compactas. São regras declaradas, não evidência de funcionamento em dispositivos.

O guia combina índice de 235px e corpo de até 750px, com intervalo de 56px. O índice fica sticky a 100px; em 950px reduz a 180px e em 700px integra o fluxo normal. Tabelas têm rolagem horizontal e largura mínima de 530px nessa faixa. Âncoras da extensão reservam 100px para o header. Na impressão, o índice, ações e elementos globais ficam ocultos.

## Elevation & Depth

A profundidade combina faixas tonais e sombras suaves. A moldura de screenshot usa sombra `0 18px 42px rgba(2, 45, 75, .1)`; o sistema base possui quatro sombras ambientes registradas no sidecar. Diagramas usam bordas e divisões internas. O header é fixo, com blur e tratamento próprio; o 3D da home continua uma assinatura específica daquela superfície.

As transições da extensão duram .18s nos botões e setas. O seletor de movimento reduzido elimina transições/animações dentro da extensão. Isso não certifica a cobertura dos demais scripts e efeitos do site.

## Shapes

Bordas finas, cantos discretamente arredondados e molduras maiores para telas organizam a informação. Os raios do frontmatter descrevem tags de processo, botões, notas, fluxos e painéis. A moldura de screenshot usa o raio de painel; a imagem interna tem raio de 5px. Tags de processo são rótulos estáticos, não filtros.

## Components

### Buttons

A ação principal tem texto branco, verde de ação, peso 600 e altura mínima de 48px. A variante contornada usa papel e linha; no hover, destaca a borda azul e a superfície tonal. Dentro do painel Otto, a ação usa branco e texto azul. Links de apoio têm altura mínima de 44px.

Na extensão, links, botões e summaries têm foco visível de 3px com offset de 5px. No painel azul Otto, o foco é branco com offset de 6px. O sidecar reproduz esses estados sem afirmar teste de teclado.

### Cards / Containers

As escolhas são linhas clicáveis com divisor, título, descrição e seta SVG; a seta desloca 3px no hover. Painéis de engenharia e molduras de tela têm papel tonal, borda e respiro. Fluxos são listas ordenadas visualmente em etapas, com divisores; a semântica da lista é preservada.

### Inputs / Fields

O checklist editorial usa checkbox nativo de 20px com a cor da ação; o item marcado muda a cor do texto. Seu foco tem offset de 3px. O formulário de contato conversacional mantém seu campo arredondado de 16px e altura mínima de 44px, com foco verde translúcido. Esse subsistema mantém seus próprios tons de conversa; não os promover a outra identidade de marca.

### Navigation

O header compartilhado mantém logo, navegação, tema e contato. A navegação da extensão é uma faixa tonal com links que quebram em linhas e alvos mínimos de 44px. O guia usa índice navegável. O header muda para menu lateral até 768px; seu comportamento completo depende também de JavaScript.

### Diagramas, demonstrações e Otto

A engenharia usa estrutura de produto e etapas HTML, com tags de processo. Otto combina painel azul, identidade existente, perguntas exemplificativas e o caminho consulta → proposta → aprovação → execução/verificação. FAQ usa `details` e `summary` nativos, com divisores e foco visível.

Screenshots precisam manter legenda que identifica interface/dados de exemplo e limites relevantes. Um número dentro da tela não se torna resultado comercial ao entrar no site; diagramas também não são evidência de eficácia.

## Do's and Don'ts

### Do:

- **Do** preservar azul MESTTI, Inter, ações verdes e temas existentes.
- **Do** combinar demonstrações de interface, esquemas HTML e leitura editorial conforme a superfície.
- **Do** manter legendas e distinguir dados de exemplo de resultados de clientes.
- **Do** preservar foco visível, conteúdo principal em HTML e movimento reduzido na extensão.

### Don't:

- **Don't** replicar o 3D da home como padrão de artigos e páginas de solução.
- **Don't** apresentar screenshots ou diagramas como prova comercial, certificação ou ganho medido.
- **Don't** inventar depoimentos, clientes, resultados ou respostas do Otto com dados de cliente.
- **Don't** tratar revisão estática como certificação visual, de acessibilidade ou de responsividade.
