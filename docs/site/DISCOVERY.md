# Produto e pesquisa para a evolução visual

Data: 2026-10-21. Este levantamento precede as alterações de interface desta etapa.

## Fontes e grau de evidência

Cópias de leitura do branch padrão dos quatro repositórios, sem tocar nos checkouts de trabalho:

- backend: `4e4a52f0c2f6a3dd9a0e05d120dd812ebe50e5b8` (2026-10-20).
- frontend: `285eb90c5a0157120babdfbf13e75c176c9708ca` (2026-10-20).
- AI: `ab1386e9a2d4e1e6657a2f4c58dffedb9a841965` (2026-10-16).
- firmware: `c2ecc6d3ff03e2ea7a253ae49880883eb4c8f1e8` (2026-10-19).

Código implementado comprova um fluxo, não implantação em todos os clientes, eficácia comercial ou disponibilidade contratual universal. Não foram consultados bancos de produção nem dados de clientes. Imagens reutilizadas já pertencem ao site; seus indicadores são exemplos de interface, não resultados de clientes.

**Confirmação direta do responsável nesta conversa:** o nome público correto é Otto e ele deve aparecer. Produção, qualidade e engenharia são as frentes principais. Ordens, apontamento, sequenciamento, OEE e conforme/não conforme são centrais. Vendas e notas fiscais são legados mortos e não devem compor a oferta. A documentação técnica ainda contém Octoplus/Mestti OPS: nomes internos não prevalecem sobre essa confirmação.

## Capacidades verificadas e tradução em valor

### Produção

- `frontend/src/App.tsx`: telas de ordens, operações, sequenciamento, monitoramento, auditoria e não conformidades.
- `backend/app/modules/planning/schemas/ordem_producao.py`: produto, quantidade, entrega, prioridade, liberação para programação, janelas previstas e progresso. Programação e execução são eixos distintos.
- `frontend/src/features/production/planning/types/sequenciamento.ts`: visões Gantt, lista, ordens, programação e restrições.
- `backend/app/modules/planning/services/scheduling_instance_constraints.py`: restrições por ordem/operação. A existência de cadastro não comprova solver automático completo.
- `backend/app/modules/apontamento/`: RAW, materializado e trilha técnica. O site deve explicar o benefício de conferir histórico/contexto, sem expor detalhes de implementação.
- Valor: saber o que produzir, acompanhar o realizado e investigar desvios com uma referência comum.

### Qualidade

- `frontend/src/features/quality/service/checklistService.ts` e `backend/app/modules/qualidade/schemas/checklist.py`: parâmetros, amostras, itens obrigatórios, fotos opcionais/obrigatórias/na não conformidade, revisão e histórico.
- `frontend/src/features/quality/`: planejamento, regras, execução, auditoria e dashboards.
- Valor: levar o padrão de inspeção à operação e recuperar evidências de quem verificou, quando e com qual revisão.
- Limite: registros não garantem certificação, conformidade regulatória ou rastreabilidade universal de toda a cadeia.

### Engenharia

- `frontend/src/features/product_engineering/page/{EngProdutoPage,MontagemPage,ComponentesPage,ProcessosPage}.tsx`: produto, montagem, componentes e processos.
- `frontend/src/features/production/planning/service/{componentesService,processosService}.ts` e `backend/app/modules/planning/models/{componente,processos_plan}.py`: estrutura de produto, sequência e tempos de processo.
- `backend/app/modules/planning/schemas/ordem_producao.py`: criação de ordem a partir de plano/orçamento técnico, com processos e quantidades.
- Valor: dar ao PCP uma referência de como fabricar e do que cada operação precisa.
- Limite: não vender CAD/CAM, PLM completo, projeto mecânico automático ou emissão fiscal.

### Otto

- `AI/contracts/mestti_capabilities.yaml` é atual; `docs/architecture/product-capability-matrix.md` se declara histórico e não pode definir a cobertura atual isoladamente.
- `src/consultoria/capabilities/{production_analysis,operational_bundle,domain_mutations,quality_reads,pcp_reads}.py`: leitura de produção/OEE/paradas/ordens/inspeções e propostas de ações suportadas.
- `frontend/src/features/consultoria/`: conversa, histórico, evidências e aprovação de propostas.
- Contrato: consultar dados autorizados, investigar, preparar proposta, aprovação explícita, execução e auditoria. Não é um piloto autônomo da fábrica, nem substitui os cálculos oficiais.
- Valor: investigar a operação em linguagem natural e preparar ações sem perder a decisão humana.

### Coleta

- `firmware/README.md`, `docs/device-naming.md`: pulsos por IR/fim de curso, comprimento linear e atividade elétrica. Corrente não é contagem de peças nem medição universal de kWh.
- O responsável confirmou rollout majoritário da geração 3.0.0 no histórico do próprio firmware, mas rastreio por classe/binário e limites físicos permanecem documentados. Não declarar perda zero de dados ou compatibilidade com qualquer máquina.
- Firmware v2 usa mm na medição linear; retirar a promessa universal de centímetros/alta resolução e apresentar a unidade configurada no sistema.

## Pesquisa de compradores

A lista fornecida pelo usuário veio de simulações/registros de LLMs. É um mapa qualitativo de intenção, **não VOC de clientes**, volume de busca ou evidência de frequência. Sinaliza: demora para enxergar produção, fila no Excel, perdas/paradas, máquinas existentes, inspeções e avaliação de fornecedores.

Pesquisa exploratória pública em r/manufacturing encontrou relatos sobre planilhas paralelas, necessidade de conferir o andamento no chão e dificuldade de localizar trabalho em processo. Fontes: [programação](https://www.reddit.com/r/manufacturing/comments/1igyxv8/how_do_you_do_your_production_scheduling/), [chão de fábrica](https://www.reddit.com/r/manufacturing/comments/19crx0k/need_something_to_solve_our_shop_floor_problem/), [alta variedade/baixo volume](https://www.reddit.com/r/manufacturing/comments/1uwhe9p/advice_for_highmix_lowvolume_scheduling/). Relatos internacionais, autodeclarados, amostra pequena e com viés; só ajudam a formular hipóteses. Não usar como depoimentos MESTTI, nem traduzir como citações de clientes locais.

Papéis de compra provisórios, baseados no fluxo do produto: gestor busca visibilidade; PCP busca fila/entrega; qualidade busca padrão/evidências; engenharia busca estrutura/processo; operação precisa registrar contexto com clareza. Sem entrevistas suficientes, não são personas validadas. Próxima pesquisa: cinco entrevistas por segmento prioritário, incluindo compradores perdidos, com perguntas sobre última ocorrência real, alternativa usada e critério de escolha.

## Referências de mercado e implicações

As observações abaixo descrevem comunicação pública, não teste dos produtos ou ranking. Sem ferramentas de mercado conectadas, tráfego, backlinks, preço comparável e taxa de conversão estão indisponíveis.

- [Tractian OEE](https://tractian.com/solucoes/oee/monitoramento-de-producao-com-ia): associa atraso de dados, perdas e demonstração sob medida. Implicação: mostrar mecanismo e fluxo, sem copiar promessas de IA ou resultados.
- [ST-One Performance/OEE](https://www.st-one.io/solucao/aplicacoes-para-industrias/performance-oee/): articula dados de processo e análise de desempenho. A URL sem www falhou na consulta; usar a página encontrada em busca. Implicação: explicar que dado foi capturado e para qual decisão serve.
- [Nomus](https://www.nomus.com.br/): posiciona ERP industrial e mostra módulos, setores e casos. Implicação: a MESTTI deve tornar claro seu centro em operação industrial; quantidade de módulos fiscais não é sua mensagem.
- [Evocon](https://evocon.com/articles/production-monitoring/): explica o caminho coleta → contexto → visualização → decisão com exemplos. Implicação: demonstrar a relação sensor/equipe/planejamento, em vez de uma lista de siglas.

Nenhuma ausência em uma página de concorrente foi tratada como ausência da capacidade. As integrações e a assistência humana da MESTTI são características verificadas; exclusividade ou superioridade frente a fornecedores não foi comprovada.

## Uso crítico dos frameworks e skills

- JTBD: decisões desejadas antes das funcionalidades. [Christensen Institute](https://www.christenseninstitute.org/theory/jobs-to-be-done/).
- Obviously Awesome: alternativas reais (papel, planilha, ferramentas separadas), capacidades, valor, comprador e categoria. Sem alegação de liderança. [April Dunford](https://www.aprildunford.com/post/a-quickstart-guide-to-positioning).
- StoryBrand: visitante administra a fábrica; MESTTI fornece instrumentos e caminho. [Fonte oficial](https://storybrand.com/storybrand-the-customer-is-the-hero-sales-framework/).
- PAS: citar um problema e sua consequência concreta, sem prolongar medo ou depreciar o trabalho da equipe.
- AIDA: reconhecer problema → ver funcionamento → conferir adequação → solicitar demonstração. Organização editorial, não garantia de conversão.
- VOC: preservar termos industriais confirmados; ainda faltam transcrições próprias. Não fabricar frases entre aspas como se fossem entrevistas.
- Marketing psychology: reduzir incerteza sobre instalação e próximo passo; evitar escassez falsa, números decorativos e provas inexistentes.
- Skills de marketing, SEO, edição e arquitetura lidas como guias de análise. Exemplos numéricos das skills não são evidências sobre a MESTTI.
- UI UX Pro Max instalado e consultado localmente. A busca `industrial SaaS product demonstration` sugeriu paleta índigo e animações intensas; essa parte foi rejeitada por não representar a marca nem a necessidade. Aplicáveis: hierarquia, contraste, teclado, alvos de toque, dimensões de imagens e movimento controlado.
- Impeccable e frontend-design: preservar identidade, usar demonstração real, variar ritmo e reduzir paredes de texto. Carregador Impeccable sem permissão de execução; referências lidas diretamente.
- Vercel Web Interface Guidelines: consulta à [fonte atual](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), adaptada ao português e HTML estático. A skill React foi instalada/lida; não justifica migrar a landing page para React.

## Diagnóstico visual inicial

Capturas desta branch em `docs/seo/evidence/solutions-desktop.png` e `home-desktop.png` conferidas. A hub nova tem título e texto de largura extensa, caixas textuais repetidas e nenhuma demonstração. A home usa planta 3D, painéis, fotografia, azul institucional e ações verdes. A evolução precisa aproximar os dois mundos sem esconder conteúdo dos visitantes ou dos mecanismos de busca.

A navegação local estava desativada no início desta etapa. A captura anterior é evidência do estado anterior, não validação de uma alteração nova. Validação nova deve ser registrada em documento próprio com os limites reais.
