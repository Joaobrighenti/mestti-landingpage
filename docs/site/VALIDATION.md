# Validação da evolução de comunicação e UX/UI

Data: 2026-10-21. Este documento distingue a etapa visual atual das auditorias anteriores em `docs/seo/VALIDATION.md`.

## Verificações realizadas nesta versão

- `npm run check:site`: 23 páginas, 20 URLs indexáveis, títulos, canonical, metadados sociais, JSON-LD, links, recursos, fragmentos e alcance desde a home.
- `npm run build`: geração estática e verificação da saída passaram. Não é deploy.
- HTTP local: 20/20 URLs do sitemap responderam `200` e entregaram HTML idêntico aos arquivos desta branch. Ver `evidence/http-local.json`; não é um teste de renderização.
- `npm test`: os dois arquivos de testes existentes da integração de eventos passaram. Não são testes da composição visual ou de SEO.
- Sintaxe JavaScript e `git diff --check`: passaram.
- HTML Validate 11.17.0: quatro páginas (Soluções, Engenharia, Otto e guia) sem erros/avisos na configuração registrada. Regras estilísticas e regras dependentes de CSS/render não utilizadas estão discriminadas no relatório. Ver `evidence/static-review.json`. Regras desativadas: `void-style`, `no-trailing-whitespace`, `line-length`, `no-inline-style`, `svg/focusable`, `prefer-native-element`, `wcag/h32`, `heading-level`, `require-sri`, `long-title`, `attribute-boolean-style`, `doctype-style` e `tel-non-breaking`; as demais do preset `html-validate:recommended` foram mantidas.
- CSS Tree 3.2.1: stylesheet `css/product-story.css` sem erro de parse. Não é comprovação de layout.
- Conferência dos 26 textos novos da home nos dicionários PT/EN/ES e das novas opções comerciais: sem chave ausente. HTML inicial dos textos corrigidos acompanha PT. Ver `evidence/i18n.json`.
- Dimensões das novas imagens de contexto conferidas nos arquivos; reaproveitamos assets do site e o ícone do Otto do frontend. Não foram criados números, clientes ou depoimentos.

As páginas novas de Engenharia/Otto e a hub ainda são PT. Elas não apresentam seletor para prometer uma tradução parcial; a preferência de idioma salva não é sobrescrita. A home e as páginas anteriormente traduzidas continuam com seus controles, e os textos alterados foram atualizados nos três idiomas.

## Revisão independente

Uma revisão independente estática confirmou a direção editorial e encontrou três ajustes: foco sem contraste no painel Otto, dicionário institucional antigo sobrescrevendo o HTML e ausência da indicação de página atual. Os três foram corrigidos e conferidos em nova revisão. A mesma revisão confirmou os estados de `inert` no modal, a remoção da conversão indevida na abertura, dimensões das imagens e destinos das âncoras. É um parecer sobre o código, sem aprovação visual.

## Revisão renderizada em navegador

A navegação foi restabelecida em 21/10. A revisão cobriu os estados capturados de home, Soluções, Engenharia, Otto e guia, em desktop (1440×900) e celular (390×844; área útil de 375px com barra de rolagem). As páginas novas também foram examinadas em tema escuro. As capturas desta etapa estão em `evidence/`; as anteriores de `docs/seo/` não foram usadas como prova do novo layout.

- Home: 3D renderizado, transição para os três pilares e telas de exemplo conferidas. A navegação da home teve timeouts na ferramenta, embora a página e o 3D estivessem visíveis depois. Não se interpreta essa observação como uma medida de desempenho.
- Nas larguras medidas, `scrollWidth` permaneceu abaixo de `innerWidth`; não houve corte horizontal do conteúdo principal observado. Isso não cobre todos os dispositivos.
- Imagens carregadas nas páginas novas; na home, a única imagem sem fonte era o placeholder vazio do lightbox fechado, não uma imagem visível quebrada.
- Menu mobile: abriu/fechou; o WhatsApp sobrepunha o CTA e foi ocultado enquanto o menu está aberto. Captura `menu-mobile-fixed.png`; opacidade do FAB medida em 0. Ao ampliar para 1440px, menu fechado, `aria-expanded=false`, classe de menu removida e FAB visível novamente.
- Guia: âncoras e marcação da checklist funcionaram; uma opção marcada foi confirmada no DOM. O índice não permanecia visível por causa do overflow do body legado. Correção restrita ao guia, confirmada com índice a 100px do topo durante rolagem em 3860px (`guide-checklist-desktop.png`).
- Otto: exemplos em acordeão abriram e exibiram o conteúdo de ações suportadas e aprovação humana.
- Demonstração: abriu em desktop/mobile, sem preenchimento ou envio de lead. Tab moveu o foco para “Fechar demonstração”; Escape fechou e devolveu o foco ao CTA. Abertura/fechamento e estado inerte conferidos. A legenda passou de “online agora” para “agendamento automático” em PT/EN/ES, descrevendo o fluxo existente.
- Console da aba de Soluções ao final: nenhum erro capturado no recorte consultado. Não é uma varredura de todos os erros de todas as páginas.

A revisão independente das novas capturas não identificou defeitos materiais restantes nos estados examinados. Os achados de menu, redimensionamento e índice foram corrigidos e reexaminados. A aprovação é limitada a esses estados: não é certificação WCAG, auditoria completa com leitor de tela, medição de conversão ou teste de entrega do formulário.

Capturas anteriores à correção do menu/modal podem mostrar o estado precedente. Para avaliar esses controles, use `menu-mobile-fixed.png`, `demo-desktop.png` e `guide-checklist-desktop.png`, que registram os ajustes finais.

## Dados estruturados externos

O teste oficial do Google foi executado por entrada de HTML com autorização explícita do responsável. O primeiro teste detectou dois itens válidos (Article e BreadcrumbList), com quatro avisos opcionais nas datas. `dateModified` foi corrigido para o timestamp documentado da revisão, com fuso; `datePublished` presumido foi removido, pois esta versão ainda não foi publicada. A data efetiva deve ser registrada quando houver publicação autorizada. A documentação oficial atual de Article trata essas propriedades como recomendadas, diferentemente do resumo de campos obrigatórios da skill.

O [resultado final](https://search.google.com/test/rich-results/result?id=p8kESHqmdcf7OUaflJaLMQ) detectou **dois itens válidos e nenhum aviso exibido**. Evidência em `evidence/google-rich-results.json` (hash do HTML) e `google-rich-results.png`. Teste por código não confirma acesso do Google à futura URL, publicação, indexação, aparência em resultados ou citação por assistentes.

## Escopo editorial

O artigo fiscal saiu da lista de descoberta e do sitemap e recebeu `noindex,follow` e nota de conteúdo histórico; sua URL foi preservada. Isso evita usá-lo como apresentação da oferta atual, conforme o responsável definiu vendas e notas fiscais como legados mortos. Não houve atualização de aconselhamento tributário nesta tarefa.

Eficiência energética permanece como projeto Lab Procel documentado, sem ser apresentada como medição atual comprovada em kWh. Prazos fixos sem evidência contratual foram substituídos por cronograma conforme avaliação técnica.

## Entrega e próximos passos

Branch `feat/seo-geo-aeo`, PR existente, sem merge/deploy. O preview automático da branch permanece desabilitado. A revisão renderizada descrita acima foi concluída para os estados registrados. Não foi realizada nova medição Lighthouse após esta extensão; as notas antigas não certificam o novo layout.
