# Pesquisa e decisões fundamentadas

Consulta em 21/10/2026. Fontes abaixo são documentação, trabalhos dos próprios autores, sites dos fornecedores e relatos identificados como tais. As conclusões são específicas desta implementação; não há previsão de ganho percentual.

## Fundamentos documentados

- [Google: requisitos técnicos](https://developers.google.com/search/docs/essentials/technical): acesso, resposta de sucesso e conteúdo indexável são condições de elegibilidade; não garantem indexação. Decisão: testar acesso e conteúdo entregue, além de metadados.
- [Google: recursos de IA](https://developers.google.com/search/docs/appearance/ai-features) e [guia de otimização generativa](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): a busca pode decompor a necessidade em consultas relacionadas e recuperar fontes do índice. Não exige arquivo ou schema especial. Decisão: tratar necessidades completas em poucas páginas úteis; não produzir páginas para cada fan-out.
- [Google: conteúdo útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) e [conteúdo com IA](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content): priorizar valor para o leitor e revisão de precisão; geração em escala sem valor pode violar políticas. Decisão: aproveitar os artigos existentes e acrescentar apenas um hub e um guia distintos.
- [Google: organização](https://developers.google.com/search/docs/appearance/structured-data/organization), [breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) e [políticas de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies): fatos e navegação devem corresponder ao conteúdo. Decisão: identidade pública e caminhos visíveis; sem preços, avaliações ou certificações inventadas.
- [Google: atualizações](https://developers.google.com/search/updates): FAQ rich results deixaram de aparecer em 07/05/2026; llms.txt não altera visibilidade no Google. Decisão: perguntas úteis continuam; não são vendidas como oportunidade de rich result.
- [OpenAI: FAQ de publishers](https://help.openai.com/en/articles/12627856): distingue descoberta com OAI-SearchBot de GPTBot e orienta acessibilidade para agentes. Decisão: manter a permissão existente e melhorar o conteúdo e os controles; permitir treinamento não é condição inferida para recomendação.
- [Anthropic: crawlers](https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler): distingue ClaudeBot, Claude-SearchBot e Claude-User. Decisão: não apresentar todos como o mesmo robô.
- [Perplexity: crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers): PerplexityBot atende descoberta; requisições de usuário têm finalidade distinta. Firewall também pode impedir acesso. Decisão: robots local não prova acesso por IP real nem inclusão.
- [Qwen: web search](https://help.aliyun.com/en/model-studio/web-search), [Z.AI: web search](https://docs.z.ai/guides/tools/web-search) e [DeepSeek: documentação](https://api-docs.deepseek.com/): recuperação depende do produto, configuração e ferramentas. Decisão: registrar o modo de busca, sem assumir que compartilhar o modelo implica compartilhar fontes. A página pública da [MiMo](https://platform.xiaomimimo.com/) não forneceu conteúdo extraível nesta leitura; não encontramos base suficiente para alegar um mecanismo de seleção ou crawler específico de publishers.

## Pesquisa acadêmica: o que permite concluir

- [Aggarwal et al., GEO, KDD 2024](https://arxiv.org/abs/2311.09735): experimenta intervenções sobre visibilidade em benchmark e em um ambiente comercial. Os resultados dependem do método, domínio e motor. Sustenta investigar clareza e evidência, não extrapolar “até 40%” como expectativa para a MESTTI, oito assistentes ou português industrial.
- [Liu et al., Evaluating Verifiability in Generative Search Engines](https://arxiv.org/abs/2304.09848): diferencia cobertura e precisão de citações e encontra limitações nos sistemas avaliados. Sustenta conferir se a fonte citada realmente apoia a descrição da MESTTI; a mera existência de link não é prova de veracidade.
- [Chen e Koudas, What Drives AI Citations, v1 de 10/10/2026](https://arxiv.org/abs/2610.15033): pré-print recente, observacional com experiências complementares. Distingue propriedades de página, recuperação e conhecimento de marca, com resultados também em B2B. Motiva medir recuperação e menção separadamente. Não fornece efeito causal universal de FAQ, schema ou velocidade; ainda requer replicação independente e no nosso domínio.

Não transportamos percentuais dos estudos para metas comerciais. Modelos, ferramentas e mercados mudam; um resultado recente também pode ser específico da amostra.

## Prática e comunidade

A discussão [sobre utilidade de llms.txt](https://www.reddit.com/r/SEO/comments/1lp5oqd) e o [relato de auditoria de logs](https://www.reddit.com/r/SEO_Experts/comments/1rjjhh6/llmstxt_does_absolutely_nothing_for_your_site/) expõem desacordo e experiências não controladas. São relatos autodeclarados, sem acesso aos logs originais, não comprovação de eficácia nem de ineficácia universal. O [relato de uma microempresa de produção sob medida](https://www.reddit.com/r/Engenharia/comments/1uliba0/quem_trabalha_com_produ%C3%A7%C3%A3o_sob_medida_usa_qual/) ilustra preocupação com complexidade e adequação; não representa pesquisa estatística de clientes MESTTI. Decisão: falar em começar por uma necessidade e avaliar a rotina, sem tratar “mais completo” como objetivo automático.

## Concorrência e caminhos de descoberta

A amostra é intencional, sem classificação de participação, tráfego ou preferência dos assistentes:

- [ST-One: Performance e OEE](https://www.st-one.io/solucao/aplicacoes-para-industrias/performance-oee/) apresenta aplicações e referências de casos; o [caso Henkel](https://st-one.io/wp-content/uploads/2025/01/Case-Study_Henkel-PT.pdf) exemplifica prova contextualizada. Oportunidade MESTTI: evidência própria de implantação e limites claros da coleta. Não atribuir à MESTTI o resultado de outro fornecedor.
- [Tractian: soluções](https://tractian.com/solucoes) separa produção de condição de ativos. Oportunidade: evitar misturar pedido de OEE com diagnóstico preditivo e explicar a diferença durante a compra.
- [Nomus/GTR MES](https://www.nomus.com.br/ecossistema/gtr-mes/) explicita integração e necessidade de confirmar condições técnicas/comerciais. Oportunidade: tratar integração como escopo verificável em vez de promessa genérica.
- [Evocon](https://evocon.com/) reúne casos de uso, fundamentos de OEE, hardware e histórias de clientes. Oportunidade: conectar conteúdo educativo, informação técnica e demonstração, com casos próprios quando houver autorização.
- A busca exploratória “empresas monitoramento produção industrial Brasil” também retornou fornecedores e diretórios, incluindo Visdec, EGA e Industrialli. Esses resultados não demonstram que sejam os mais recomendados nem que todos os nomes do corpus sejam fornecedores equivalentes.

Pesquisa de marca encontrou a home e os termos da MESTTI, um perfil LinkedIn e referências institucionais. A [ENBPar, em 29/09/2026](https://enbpar.gov.br/projetos-selecionados-na-3a-chamada-publica-do-lab-procel-ii-iniciam-etapa-de-aceleracao/) confirma a seleção da Mestti no Lab Procel II e descreve o projeto. É prova primária de participação, sem comprovar exclusividade regional ou resultados já obtidos.

## Uso crítico das skills

Instaladas do upstream: `seo-audit`, `ai-seo`, `site-architecture`, `content-strategy`, `schema` (nome local `schema-markup`) de [marketingskills](https://github.com/coreyhaines31/marketingskills), e `web-quality-audit` de [web-quality-skills](https://github.com/addyosmani/web-quality-skills). Lidas e aplicadas nesta execução. São orientações de trabalho, não evidência experimental.

Adotamos a ordem de auditoria, mapeamento de intenções, diferenciação de páginas, comprovação de conteúdo/schema e revisão de qualidade em navegador. Rejeitamos como regra universal os percentuais de ganho, intervalos fixos de palavras, densidade de links, favorecimento genérico de llms.txt, suposta necessidade de preço em Markdown e associação automática de schemas a citações. Não inventamos preços para satisfazer um checklist. A recomendação de “mais arquivos para agentes” não supera a ausência de demanda/consumidor comprovado.

A referência de medição apontada pela skill web-quality-audit é um arquivo irmão de outra skill e não veio na instalação isolada solicitada. A auditoria usou o fallback documentado de Lighthouse CLI e inspeção manual; não alegamos ter lido aquele arquivo ausente.
