# Fora do site: checklist de presença e medição (F5)

O site agora explica bem o que a Mestti faz. O que falta para as IAs **recomendarem** a Mestti está quase todo fora
do site: estar indexada nos buscadores que as IAs usam, ser citada por fontes independentes e ter os mesmos dados em
todo lugar. Estas tarefas dependem de contas e de pessoas da Mestti; nenhuma foi feita por este PR.

Ordem sugerida: **1 → 2 → 3** logo depois do deploy; **4 a 7** nas semanas seguintes; **8** todo mês.

## Dados oficiais (copiar exatamente assim em todo cadastro)

Consistência de nome, endereço e contato entre fontes ajuda buscadores e IAs a entenderem que é a mesma empresa.

| Campo | Valor |
| --- | --- |
| Nome | Mestti |
| Razão social | Mestti Tecnologia LTDA |
| CNPJ | 63.380.944/0001-51 |
| Endereço | Rua Santa Terezinha, 1300, Londrina, PR, Brasil |
| Telefone e WhatsApp | +55 43 99109-5035 |
| Site | https://mestti.com.br/ |
| E-mail comercial | comercial@mestti.com.br |
| E-mail de imprensa | imprensa@mestti.com.br |
| Fundação | 2025, em Londrina (PR) |
| Fundador | João Brighenti |
| Categoria | Software de gestão e monitoramento da produção industrial (MES) com sensores próprios |
| LinkedIn | https://www.linkedin.com/company/mestti/ |
| Instagram | https://www.instagram.com/mesttibrasil/ |
| YouTube | https://www.youtube.com/@mesttitech |

**Descrição curta (até 160 caracteres)**

> Sistema brasileiro de gestão da produção com sensores próprios: monitoramento de máquinas, OEE, PCP, apontamento, qualidade e IA para a indústria.

**Descrição longa**

> A Mestti é uma empresa brasileira de Londrina (PR) que desenvolve um sistema de gestão da produção para indústrias
> pequenas e médias. Sensores próprios medem cada máquina (contagem de peças e paradas, sem CLP e sem mexer no
> comando), e engenharia, PCP, chão de fábrica e qualidade usam os mesmos dados: monitoramento ao vivo, OEE,
> sequenciamento por máquina, apontamento no tablet, inspeções com foto e o Otto, assistente de IA que só executa
> ações aprovadas por uma pessoa. Foi uma das cinco empresas selecionadas na 3ª chamada pública do Lab Procel II
> (ENBPar e SENAI Rio de Janeiro).

**English** — Mestti is a Brazilian production management system (MES) with its own sensors: machine monitoring,
OEE, production scheduling, shop-floor reporting, quality inspections and an AI assistant that only acts after human
approval. Based in Londrina, Brazil.

**Español** — Mestti es un sistema brasileño de gestión de la producción (MES) con sensores propios: monitoreo de
máquinas, OEE, secuenciación, registro de producción, inspecciones de calidad y un asistente de IA que solo actúa
con aprobación humana. Con sede en Londrina, Brasil.

## 1. Google Search Console (logo após o deploy)

- [ ] Adicionar a propriedade de domínio `mestti.com.br` (verificação por DNS).
- [ ] Enviar `https://mestti.com.br/sitemap.xml` (79 URLs).
- [ ] Inspecionar e pedir indexação de: `/`, `/mes/`, `/oee/`, `/pcp/`, `/monitoramento-de-maquinas/`, `/maquinas-antigas/`, `/blog/`, `/en/`, `/es/`.
- [ ] Em "Páginas", conferir que os redirecionamentos 301 (artigos antigos, `/sensoriamento/`, `/atuacao/`, `/ppcp/`) aparecem como redirecionados e não como erro.
- [ ] Em "Melhorias", conferir breadcrumbs e dados estruturados sem erro.
- [ ] Depois de 4 semanas: exportar as consultas por página e revisar títulos das páginas com muita impressão e pouco clique.

## 2. Bing Webmaster Tools (alimenta Copilot e a busca do ChatGPT)

- [ ] Importar o site a partir do Search Console (mais rápido) ou verificar por DNS.
- [ ] Enviar o sitemap.
- [ ] Rodar `npm run indexnow` depois de cada deploy com páginas novas ou alteradas (o script confere se a chave `9b2f9d61182c85700b8533e9f50d2f56.txt` está publicada antes de enviar).
- [ ] Acompanhar o relatório de desempenho em IA (citações e URLs usadas nas respostas), quando disponível na conta.

## 3. Conferir o acesso dos robôs em produção

- [ ] `https://mestti.com.br/robots.txt` e `/sitemap.xml` respondem 200.
- [ ] Um teste por user-agent (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot) recebe 200, sem desafio de bot (firewall da Vercel ou outro).

## 4. Perfil de empresa no Google

- [ ] Criar ou reivindicar o perfil "Mestti" com os dados oficiais acima, categoria "Empresa de software".
- [ ] Fotos reais: sensor instalado, tela do sistema, equipe.
- [ ] Pedir a clientes que aceitaram ser citados uma avaliação real no perfil (nunca avaliações compradas ou escritas pela equipe).

## 5. Fontes independentes (o que mais pesa para recomendação)

- [ ] **Apoiadores:** pedir a SENAI, Firjan, Fiep, ENBPar/Procel e Móveis Hub de Arapongas uma menção com link para `https://mestti.com.br/` nas páginas de programas ou associados.
- [ ] **Lab Procel II:** a notícia da ENBPar já cita a Mestti; pedir que o nome tenha link para o site.
- [ ] **Case autorizado:** com a moveleira (ou outro cliente), publicar o caso com nome, setor, período e números medidos; pedir ao cliente que publique também no LinkedIn dele.
- [ ] **Imprensa regional e setorial:** pauta sobre a seleção no Lab Procel e o sensor feito em Londrina (Folha de Londrina, portais de indústria do Paraná, revistas de plástico, metalurgia e moveleira).
- [ ] **Eventos e associações:** palestras ou estandes em eventos do setor, com página do evento citando a Mestti.

## 6. Diretórios e comparadores de software

Assistentes de IA citam muito comparadores B2B quando alguém pede "melhores sistemas de…".

- [ ] Cadastrar o produto em diretórios de software B2B com avaliações (por exemplo Capterra, G2, GetApp e similares em português) na categoria MES / gestão da produção / OEE.
- [ ] Cadastrar em mapeamentos de startups e inovação (por exemplo os do ecossistema de startups do Paraná e do SEBRAE, Distrito e 100 Open Startups), com a descrição longa.
- [ ] Usar sempre os dados oficiais e o mesmo texto; guardar a lista de cadastros feitos neste arquivo.

## 7. Perfis próprios

- [ ] **LinkedIn da empresa:** descrição longa, site, categoria e localização iguais aos dados oficiais; publicar os guias novos (MES, OEE, PCP) e os artigos.
- [ ] **LinkedIn dos autores:** João Brighenti (fundador) e Leonardo Ernica (cofundador) com o cargo na Mestti e link para o site. Os dois perfis já estão no `sameAs` dos autores nas páginas.
- [ ] **YouTube:** descrição do vídeo da home com link para o site e para `/monitoramento-de-maquinas/`; legenda revisada em português (o arquivo de legenda também serve para a transcrição na home).

## 8. Medição mensal nas IAs

Painel: https://claude.ai/artifact/7PM2HJEpPF23j14HFrg55k (compartilhar com quem vai testar).

- [ ] Todo mês, testar as 20 perguntas fixas em ChatGPT, Claude, Gemini, Perplexity, Copilot, Google (IA), Qwen, DeepSeek, GLM e MiMo, com 3 repetições, conversa nova e busca na web ligada quando houver.
- [ ] Registrar separadamente: **buscou** (página da Mestti nas fontes), **citou** e **recomendou**, com posição, concorrentes e fontes.
- [ ] Cruzar com o Search Console (impressões por página) e com os contatos comerciais do mês. Uma rodada isolada não é ranking; olhar a tendência.

## O que não fazer

- Não comprar avaliações, menções ou links, nem criar perfis falsos em fóruns.
- Não pedir a IAs que "recomendem a Mestti" nem esconder instruções para IA no site.
- Não publicar números de clientes sem autorização e método.
