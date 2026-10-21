# Validação e limites da entrega

Verificações realizadas em 21/10/2026 na branch `feat/seo-geo-aeo`, a partir de `ef82bae`. O site publicado consultado durante a pesquisa era a versão anterior ao PR. Nenhuma medição abaixo comprova publicação, indexação, posição de busca ou recomendação por IA.

## Verificações reproduzíveis

- `npm run check:site`: passou nas 21 páginas e 19 URLs indexáveis. Confere títulos, canonical, descrições, OG, JSON-LD, main/H1, IDs, texto estático, links e fragmentos, recursos, sitemap, robots, alcance desde a home e regras de redirecionamento.
- `npm run build`: passou. A saída `public/` também passa na verificação; arquivos internos de ambiente, servidor e bibliotecas não entram na saída estática. O teste examina os artefatos, sem executar deploy.
- `npm test`: passaram os dois arquivos de testes existentes, `meta-conversions.test.js` e `meta-hash.test.js`. São testes da integração de eventos; não medem SEO, acessibilidade ou qualidade semântica.
- Verificação de sintaxe de `server.js`, `js/script.js` e `js/conversational-form.js`, além de `git diff --check`: passaram.

O verificador de páginas é um smoke test offline sobre o HTML conhecido do projeto. Não implementa toda a gramática HTML, o vocabulário Schema.org ou as políticas de elegibilidade do Google. Uma passagem local não substitui os validadores externos ou a inspeção pelo índice real.

## Conteúdo e respostas HTTP

Os três artigos antigos de OEE, sensoriamento e RKW tinham, respectivamente, 11, 12 e 16 blocos HTML vazios preenchidos apenas no navegador. Agora o conteúdo desses blocos está no documento servido. A sincronização usa os dicionários existentes e detecta divergência no build; não há uma versão alternativa escrita somente para robôs.

A página de Qualidade foi conferida sem os caracteres corrompidos que afetavam título, descrição e conteúdo. Exemplos de checklists e os números demonstrativos da home recebem identificação adequada. Os links para duas imagens inexistentes de certificados foram removidos; não havia evidência para recriar certificações.

[http-local.json](evidence/http-local.json) registra a leitura HTTP no servidor de desenvolvimento atualizado:

- 19/19 URLs do sitemap responderam `200`.
- Robots, sitemap e resumo Markdown responderam com seus tipos de conteúdo; o Markdown tem `X-Robots-Tag: noindex`.
- Caminho inexistente respondeu `404`, sem um catch-all que crie soft 404.
- URLs duplicadas de produção e aliases responderam com redirect permanente; parâmetros de campanha foram preservados.
- Download Android respondeu como APK. As rotas de API verificadas por HEAD não receberam redirecionamento de documentos. São endpoints POST; o `404` de HEAD não significa falha do envio.

Não foram enviados formulários, mensagens, e-mails ou leads de teste. Entrega de e-mail, planilha e atribuição comercial continuam exigindo uma verificação controlada com as contas e o consentimento apropriados.

[public-access.json](evidence/public-access.json) registra `200` na home publicada com cinco identificações declaradas: navegador, Googlebot, OAI-SearchBot, Claude-SearchBot e PerplexityBot. É uma requisição da nossa origem com esses User-Agents, não uma execução a partir das redes reais dos robôs. Não prova acesso por IP do crawler, rastreamento efetivo ou indexação.

## Auditorias em navegador

Lighthouse CLI 13.5.0, Chromium 154, localhost, perfil mobile nas páginas Soluções e Qualidade e preset desktop no guia. `throttlingMethod=provided`: números do ambiente de laboratório, sem simulação padrão de rede/CPU. As configurações exatas e horários constam dos JSONs. Foram configurados padrões de bloqueio de terceiros; os relatórios ainda identificaram cookies de terceiros, portanto não se presume que o bloqueio tenha isolado o carregamento.

- **Soluções, mobile:** desempenho 96, acessibilidade 100, SEO 100, boas práticas 77. LCP 2,2 s; CLS 0; TBT 0 ms. [Relatório](evidence/solutions-lighthouse.json), [captura mobile](evidence/solutions-mobile.jpg).
- **Qualidade, mobile:** desempenho 96, acessibilidade 100, SEO 100, boas práticas 77. LCP 2,2 s; CLS 0; TBT 0 ms. [Relatório](evidence/quality-lighthouse.json), [captura mobile](evidence/quality-mobile.jpg).
- **Guia de avaliação, desktop:** desempenho 81, acessibilidade 100, SEO 100, boas práticas 77. LCP 0,8 s; CLS 0,061; TBT 400 ms. [Relatório](evidence/guide-lighthouse.json).

As auditorias apontaram cookies de terceiros e ocorrências relacionadas no painel Issues. O guia ainda tem trabalho de JavaScript e recursos compartilhados a investigar. Não transformamos o PR de conteúdo em uma mudança sem validação da integração de marketing. Revisar consentimento/carregamento de terceiros é uma pendência concreta; 77 em boas práticas não foi apresentado como aprovação total.

As tentativas de Lighthouse na home com a cena 3D não produziram um relatório final dentro do orçamento de execução. A medição da home é **inconclusiva**, não “aprovada”. É necessário um perfil específico no ambiente de destino. Também não há baseline equivalente concluída para alegar ganho de LCP, INP ou pontuação antes/depois. INP e Core Web Vitals de usuários reais não foram medidos.

## Revisão manual e correção do diálogo

Foram observados o site publicado, as novas páginas em desktop, a página de Qualidade em captura mobile real da auditoria e a página de Soluções nos temas claro e escuro. A home chegou a renderizar a cena completa, mas apresentou carregamento demorado nesta sessão; isso não resolve a medição inconclusiva de desempenho. O índice do guia foi exercitado. Não foram registrados erros de execução na inspeção do guia.

A inspeção do formulário aberto encontrou um problema preexistente: a camada permanecia com `aria-hidden=true` enquanto o chat era visível. Corrigimos estado/nome do diálogo, foco inicial, ciclo de Tab/Shift+Tab e retorno ao acionador ao fechar. O formulário de suporte visualmente oculto fica `inert`; o campo do chat recebe nome acessível. Abertura, navegação por teclado e fechamento com Escape foram exercitados sem preencher nem enviar dados. Os relatórios Lighthouse anteriores examinam o estado fechado e não comprovam essa correção dinâmica; a evidência dessa parte é a inspeção manual do DOM e dos controles.

Capturas de revisão: [Soluções claro](evidence/solutions-desktop.png), [Soluções escuro](evidence/solutions-dark-desktop.png), [guia](evidence/guide-desktop.png) e [home renderizada](evidence/home-desktop.png). A revisão não equivale a uma auditoria completa com usuários de leitores de tela, dispositivos físicos ou todos os estados dos formulários.

## Otimização de recursos

Sete versões usadas no site passaram de **36.891.495 bytes para 1.061.854 bytes**, redução de **97,12%** na soma desses arquivos. [Originais, dimensões e versões](evidence/image-optimization.json). Os originais permanecem no repositório. Isso é redução de peso das imagens selecionadas; não é redução medida de 97% no carregamento de uma página ou no consumo de todos os visitantes.

## Validação externa, descoberta e pendências

O teste oficial de resultados enriquecidos foi aberto e preparado em modo de código, mas a revisão automática de aprovação inicialmente bloqueou a submissão do HTML ainda não publicado ao Google por considerá-la exportação de conteúdo privado. O usuário autorizou explicitamente o envio do HTML do novo guia ao Google. Na retomada, a revisão automática não conseguiu autorizar nem a abertura de `https://search.google.com/test/rich-results`, devido ao limite de uso da ferramenta de aprovação. Esse segundo bloqueio é operacional, não uma reprovação do HTML ou do seu conteúdo. A submissão continua pendente; não se declara aprovação pelo Rich Results Test ou Schema.org Validator. A validação local de JSON-LD passou.

As buscas de marca e de fornecedores serviram à pesquisa exploratória; não constituem um painel de posições. Não foram executadas campanhas independentes em ChatGPT, Claude, Gemini, Perplexity, DeepSeek, Qwen, GLM e MiMo. Não havia acesso autenticado a Search Console, Bing Webmaster Tools ou dados de conversão. O protocolo de medição longitudinal está em [STRATEGY.md](STRATEGY.md).

Depois de uma publicação autorizada: confirmar redirects e headers no CDN, testar URLs no Google, submeter sitemap nas contas pertinentes, acompanhar erros e indexação e medir resultados comerciais com consentimento. Manter em aberto a verificação de compatibilidade específica de hardware, escopo de integrações, casos autorizados e documentação técnica por kit.

A configuração Vercel desabilita deploy automático desta branch. O trabalho é entregue em PR, sem merge ou execução de deploy.
