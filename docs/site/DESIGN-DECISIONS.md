# Decisões da extensão visual

Data: 2026-10-21. Escopo: site institucional em `mestti-landingpage-seo`.

## Autoridade e direção

[DISCOVERY](DISCOVERY.md) registra evidência e confirmação do responsável; [STRATEGY](STRATEGY.md) registra alternativas e jornada. [PRODUCT](../../PRODUCT.md) reúne fatos duráveis e [DESIGN](../../DESIGN.md) descreve o sistema observado. As confirmações sobre Otto e pilares prevalecem sobre nomes e módulos legados em documentos técnicos.

A direção escolhida é “Demonstração industrial com a identidade existente”. A extensão conserva azul MESTTI, Inter, CTA verde, temas e assinatura 3D da home. Reutiliza telas existentes e adiciona esquemas HTML e leitura editorial; não constitui um novo mundo visual.

## Aplicação por superfície

- **Home — Persuade:** mantém a abertura e o 3D; conecta os três pilares e apresenta Otto.
- **Soluções — Persuade:** escolhas por necessidade, telas com legendas, linhas alternadas e relação entre módulos.
- **Engenharia — Persuade:** estrutura de produto, componentes/processos e passagem para a ordem. O esquema demonstra relação; não promete CAD/CAM ou PLM completo.
- **Otto — Persuade:** perguntas e etapas de decisão com aprovação humana. O nome público é Otto; vendas/fiscal ficam fora da oferta atual.
- **Guia de escolha — Read:** abertura visual, orientação por objetivo, índice, corpo editorial e roteiro de avaliação.
- **Páginas existentes:** seções contextuais recebem a mesma linguagem, sem substituir todos os estilos antigos.

Os modos pertencem a este registro de superfícies; não são uma regra global de PRODUCT ou DESIGN.

## Sistema e fronteiras

`css/base.css` mantém tokens institucionais, fonte e container. `css/product-story.css` implementa tokens próprios de tinta, papel, linha e ação, incluindo overrides do tema escuro. O verde global e o da extensão diferem; documentá-los não autoriza uniformização do legado. Layout usa grids, divisores e faixas, com sombra concentrada em demonstrações.

Screenshots exibem interface e dados de exemplo; legendas delimitam sua interpretação. Não constituem case, ganho percentual, certificação, prova de ROI ou disponibilidade universal. Diagramas HTML são explicativos. Não foram acrescentados fatos comerciais para preencher espaços visuais.

O sidecar `.impeccable/design.json` estende o frontmatter de DESIGN: sombras, movimento, breakpoints, metadados e amostras autocontidas. Rampas tonais sintetizadas servem à visualização do painel e não criam tokens de implementação. As amostras não enviam leads nem executam ações do produto.

## Evidência e limitações da verificação

Fontes estáticas conferidas: `css/base.css`, `css/product-story.css`, `css/header.css`, `css/conversational-form.css` e HTML de home, soluções, engenharia, Otto e `blog/como-escolher-sistema-monitoramento-producao/`. A revisão independente anterior confirmou no código foco, inert, headers e consistência de copy. Essa conclusão é limitada à inspeção estática.

A navegação foi restabelecida e as capturas novas em `docs/site/evidence/` mostram as composições atuais em desktop/celular e temas. A revisão independente não encontrou defeitos materiais restantes nesses estados após as correções. O menu deixou de sofrer sobreposição do WhatsApp, fecha ao mudar de tamanho e expõe `aria-expanded`; o índice do guia permanece visível com overflow restrito a `clip` no body dessa página. O formulário informa “agendamento automático”. Escopo e limites em [VALIDATION](VALIDATION.md); não é certificação completa de acessibilidade ou desempenho.

O carregador `impeccable context` não executou por `permission denied` no launcher. Contexto e referências foram lidos diretamente; a configuração do navegador não foi contornada.

## Pendências não canonizadas

A base usa raiz de 14px. A hierarquia e a leitura das superfícies novas foram conferidas nas capturas registradas; o legado foi preservado, sem promover toda sua tipografia a regra aprovada. Os pesos da extensão agora correspondem aos carregados: 800 na abertura e 600 nas ações. Nenhum outro defeito visual foi inferido sem renderização.
