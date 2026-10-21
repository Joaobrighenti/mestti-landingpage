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

## Pendência material: navegador

A ferramenta retornou repetidamente `Local browser use is disabled in Work settings`. O usuário confirmou a ativação e marcou o plugin Navegador como ativo; mesmo assim, a consulta de inventário continuou retornando nenhuma superfície e o mesmo erro. Não foi usado outro navegador ou automação para contornar a configuração.

Portanto, permanecem pendentes nesta versão: capturas novas em desktop/celular, revisão do tema escuro renderizado, overflow, teclado real, abertura/fechamento do formulário e conferência do layout do 3D após as alterações de conteúdo. As capturas e notas Lighthouse da etapa SEO são **anteriores** e não certificam esta interface. Nenhuma nota de acessibilidade, desempenho ou conversão foi atribuída às mudanças novas.

O teste externo Google continua pendente pelo bloqueio operacional já registrado na etapa anterior. Não se declara aprovação externa dos dados estruturados, indexação ou ganho de visibilidade.

## Escopo editorial

O artigo fiscal saiu da lista de descoberta e do sitemap e recebeu `noindex,follow` e nota de conteúdo histórico; sua URL foi preservada. Isso evita usá-lo como apresentação da oferta atual, conforme o responsável definiu vendas e notas fiscais como legados mortos. Não houve atualização de aconselhamento tributário nesta tarefa.

Eficiência energética permanece como projeto Lab Procel documentado, sem ser apresentada como medição atual comprovada em kWh. Prazos fixos sem evidência contratual foram substituídos por cronograma conforme avaliação técnica.

## Entrega e próximos passos

Branch `feat/seo-geo-aeo`, PR existente, sem merge/deploy. O preview automático da branch permanece desabilitado. A revisão visual precisa ser concluída quando o navegador estiver acessível, antes de considerar a qualidade da experiência validada.
