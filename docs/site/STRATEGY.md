# Direção estratégica, editorial e visual

Definida em 2026-10-21 após o levantamento em [DISCOVERY.md](DISCOVERY.md), antes da implementação desta etapa.

## Alternativas consideradas

1. **Especialista em monitoramento/OEE.** Fácil de reconhecer e compatível com a origem do produto. Restrita demais: esconde engenharia, qualidade, programação e Otto. Aproveitar a clareza da entrada, sem limitar a oferta inteira.
2. **ERP completo para toda a indústria.** Amplitude aparente, mas cria expectativas sobre fiscal/vendas explicitamente fora do produto atual. Rejeitada.
3. **Gestão da operação industrial conectando engenharia, produção e qualidade.** Escolhida. Demonstra o caminho do produto até a execução e suas evidências. Sensores alimentam o contexto; Otto ajuda a consultá-lo e preparar ações aprovadas. A amplitude aparece por relações compreensíveis, não por inventário técnico.

Mensagem de trabalho: “Da estrutura do produto ao que acontece na fábrica.” Descrição direta: “Engenharia, ordens, programação, apontamento e qualidade conectados na MESTTI.” O foco é entender e conduzir a operação; ganhos percentuais não demonstrados permanecem fora da mensagem.

## Alternativas visuais

- **Documento editorial uniforme:** legível, barato, porém já rejeitado pelo usuário como pouco visual. Manter legibilidade no corpo do guia, mudar abertura e orientação.
- **Tecnologia cenográfica em todas as páginas:** repete o impacto do 3D, mas compete com a compreensão e aumenta custo. Rejeitada como padrão.
- **Demonstração industrial com a identidade existente:** escolhida. Azul MESTTI, superfícies claras, verde nas ações comerciais, telas existentes, fotografias disponíveis, diagramas HTML de processo e conteúdo com diferentes densidades. O 3D permanece assinatura da home; não se replica em artigos.

A consulta à base de estilos é inspiração, não pesquisa de usuários. Preservar fonte existente e temas claro/escuro; não importar fonte, biblioteca de componentes ou framework novo.

## Jornada e arquitetura

- Home: reconhecer oferta em poucos segundos; entender as três frentes; conhecer Otto; explorar solução ou solicitar demonstração.
- `/solucoes/`: escolher pelo problema; ver produção, qualidade e engenharia em funcionamento; relacionar os módulos; verificar adequação; agir.
- `/producao/`, `/sequenciamento/`, `/qualidade/`, `/sensoriamento/`, `/sensores/`: preservar URLs e recursos existentes; integrar conteúdo contextual que foi acrescentado sem tratamento visual; corrigir afirmações sem sustentação.
- `/engenharia/`: explicar estrutura de produto, componentes e processos e a relação com as ordens. Página própria justificada pela frente central confirmada pelo responsável.
- `/otto/`: apresentar consultas e propostas com aprovação, com exemplos de perguntas e etapas. Usar Otto publicamente; não expor nomes de modelos/provedores ou prometer autonomia ilimitada.
- Guia de escolha: entrada visual, resposta rápida por objetivo, índice navegável, corpo editorial estreito, roteiro prático e resumo da proposta. Conteúdo principal segue no HTML.
- Header enxuto: Soluções, Otto, Blog, Sensores, Sobre. Instalação permanece contextual e no rodapé; engenharia aparece na hub e no rodapé. Evitar mega menu neste tamanho de site.
- CTA principal: “Solicitar demonstração”. Secundário: explorar o produto/ler o guia. WhatsApp e contato existentes continuam disponíveis. Não criar teste grátis, agenda ou garantia não confirmados.

## Conversão, clareza e confiança

A demonstração deve ser apresentada como conversa sobre processo, máquinas e módulos; não confundir o botão com acesso instantâneo ao produto. Antecipar o que levar (uma ordem e um problema real). Preservar a integração de leads existente, sem enviar testes a contas reais.

Remover promessa universal de implantação em uma semana, prazo físico de 1–3 dias e duração fixa de acompanhamento sem evidência contratual. Manter as etapas e explicar que cronograma depende da avaliação. Eficiência energética aparece como projeto Lab Procel documentado, não como medição de kWh já comprovada pelo sensor de atividade elétrica. Remover conformidade normativa implícita.

A nova apresentação do Otto pode ilustrar perguntas e fluxo, mas não inventar respostas com dados de cliente. Diagramas são explicativos e screenshots mostram interface: números nunca serão apresentados como prova comercial. Não acrescentar clientes, depoimentos, resultados, selos ou certificações.

## Prioridade de execução

1. Corrigir enquadramento da oferta e promessas frágeis; registrar contexto de marketing compartilhado.
2. Integrar hub e guia à linguagem visual do site e melhorar navegação de leitura.
3. Apresentar engenharia e Otto com conteúdo próprio fundamentado, ligados à home e à hub.
4. Conectar melhorias visuais às páginas existentes e à identidade institucional, sem reescrever a aplicação.
5. Validar funcionamento, conteúdo, rastreabilidade, acessibilidade, temas e responsividade. Comparar capturas e corrigir problemas materiais.

## Medição e evolução

Hipóteses: mais clareza entre módulos facilita encontrar uma solução; telas explicadas melhoram compreensão; transparência sobre demonstração reduz abandono por expectativa errada. Não chamar hipóteses de ganhos obtidos.

Funil recomendado: visita por intenção → exploração de módulo → abertura da demonstração → lead aceito pelo backend → lead qualificado → reunião. Abertura/click não é lead. Preservar eventos de conversão existentes e consentimento; não introduzir rastreadores ou ampliar envio de dados nesta etapa. Plano de eventos e limitações em [MEASUREMENT.md](MEASUREMENT.md).

Depois de publicação autorizada: avaliar mesmas janelas fechadas por origem/dispositivo e qualidade de lead; acompanhar busca orgânica e citações separadamente. Não atribuir causalidade com simples antes/depois. Testes de compreensão com compradores e entrevistas devem confrontar a direção escolhida.
