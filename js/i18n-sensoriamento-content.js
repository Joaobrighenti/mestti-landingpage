(function () {
    const content = {
        pt: {
            'sensor.intro': `<p>Em muita fábrica, o “dado de produção” ainda nasce assim: o operador anota no papel, digita no sistema no fim do turno, alguém consolida a planilha e a gestão só vê o resultado no dia seguinte.</p>
<p>O problema não é falta de esforço. É atraso, inconsistência e perda de contexto. Quando a peça foi produzida? Em qual máquina a linha realmente parou? A cadência caiu às 10h ou só no fechamento “parece” que o turno foi fraco?</p>
<p>Indústria 4.0, nesse cenário, deixa de ser slide e vira uma pergunta prática: <strong>dá para coletar o que a máquina fez sem depender de digitação?</strong></p>
<p>A resposta passa por sensoriamento industrial — hardware simples, bem instalado, ligado a um painel ao vivo. Neste artigo você vai entender o que é sensoriamento no chão de fábrica, por que o apontamento manual falha, quais sensores resolvem quais dores e como a MESTTI transforma contagem, status de máquina e paradas em gestão com tempo de reação.</p>
<p><strong>Neste artigo, você vai entender:</strong></p>
<ul class="article-intro-list">
    <li>O que é sensoriamento industrial (sem jargão)</li>
    <li>Por que o apontamento manual falha no turno</li>
    <li>O que a Indústria 4.0 muda de verdade no chão de fábrica</li>
    <li>Quais sensores resolvem quais dores</li>
    <li>Um exemplo prático do mesmo turno, dois jeitos de ver</li>
    <li>Erros comuns ao digitalizar a coleta</li>
    <li>Por onde começar e como a MESTTI ajuda</li>
</ul>`,
            'sensor.s1': `<h2>O que é sensoriamento industrial (sem jargão)</h2>
<p>Sensoriamento industrial é capturar eventos reais da operação — peça produzida, máquina ligada ou parada, comprimento extrudado, ciclo concluído — e enviá-los automaticamente para um sistema, em vez de pedir que alguém digite depois.</p>
<p>Não é “substituir o operador”. É tirar do operador a tarefa de ser o relógio e o contador da fábrica, para que ele foque em setup, qualidade e resolução de problema.</p>
<p>Em termos práticos, o sensor:</p>
<ol>
    <li><strong>Detecta</strong> um evento físico (passagem de peça, corrente elétrica, fim de curso, encoder de comprimento).</li>
    <li><strong>Registra</strong> horário e máquina.</li>
    <li><strong>Envia</strong> o dado para o dashboard (e guarda localmente se a rede oscilar).</li>
    <li><strong>Alimenta</strong> indicadores: produção, disponibilidade, performance, OEE, histórico por turno.</li>
</ol>
<div class="highlight-box">
    <p>Sem esse elo, qualquer indicador bonito no PowerPoint ainda depende de memória humana.</p>
</div>`,
            'sensor.s2': `<h2>Por que o apontamento manual falha no turno</h2>
<p>Apontamento manual até “funciona” em volume baixo. Em operação real, ele costuma quebrar em cinco pontos:</p>
<ol>
    <li><strong>Atraso</strong> — o dado chega depois da decisão que importava.</li>
    <li><strong>Erro de digitação</strong> — número trocado, máquina errada, turno misturado.</li>
    <li><strong>Microparadas invisíveis</strong> — ninguém anota a parada de 40 segundos que se repete 30 vezes.</li>
    <li><strong>Carga no operador</strong> — em alta cadência, anotar compete com produzir.</li>
    <li><strong>Falta de timestamp confiável</strong> — “parou de manhã” não ajuda manutenção nem PCP.</li>
</ol>
<div class="example-box">
    <p class="example-box-title">Exemplo típico do fim do turno</p>
    <ul>
        <li>Produção apontada: 1.200 peças</li>
        <li>Realidade da linha (se houvesse contagem automática): 1.080 peças + várias microparadas</li>
    </ul>
    <p>Resultado: PCP planeja o dia seguinte com base em um número otimista, a manutenção não vê o padrão de falha, e a gestão discute “produtividade” sem saber onde o tempo foi embora.</p>
</div>
<p>O apontamento não é vilão por ser antigo. É limitado porque o chão de fábrica é rápido demais para papel e planilha.</p>`,
            'sensor.s3': `<h2>O que a Indústria 4.0 muda de verdade no chão de fábrica</h2>
<p>Esqueça a lista genérica de “pilares”. No turno, Indústria 4.0 útil costuma significar três mudanças concretas:</p>
<table class="cost-table">
    <thead>
        <tr><th>Antes (manual)</th><th>Depois (sensor + painel)</th></tr>
    </thead>
    <tbody>
        <tr><td>Produção digitada no fim do turno</td><td>Contagem automática 24/7</td></tr>
        <tr><td>“A máquina parou um pouco”</td><td>Parada com início, fim e duração</td></tr>
        <tr><td>Indicador no relatório do dia seguinte</td><td>Alerta e visão ao vivo</td></tr>
        <tr><td>Média da planta esconde gargalo</td><td>Visão por máquina e por posto</td></tr>
        <tr><td>Decisão por percepção do turno</td><td>Decisão com dado atual</td></tr>
    </tbody>
</table>
<div class="highlight-box">
    <p>Isso não exige fábrica nova. Exige <strong>coleta automática confiável</strong> nas máquinas que mais importam — e disciplina para agir no mesmo turno em que a perda aparece.</p>
</div>`,
            'sensor.s4': `<h2>Quais sensores resolvem quais dores</h2>
<p>Nem todo sensor serve para tudo. O erro comum é comprar hardware “bonito” sem cruzar com a dor do processo.</p>
<div class="sigla-grid">
    <div class="sigla-card">
        <abbr title="Contagem">Contagem de peças</abbr>
        <p>Produção real, cadência e base para performance e OEE.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Status">Status da máquina</abbr>
        <p>Disponibilidade com horário — ligada, parada ou setup.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Encoder">Metro linear</abbr>
        <p>Extrusão e processos contínuos medidos em comprimento.</p>
    </div>
</div>
<h3>1. Contagem de peças</h3>
<p><strong>Para quê:</strong> linhas com peça unitária, esteira, montagem, injeção, processos repetitivos.</p>
<p><strong>O que resolve:</strong> produção real por máquina/posto, cadência, base para performance e OEE.</p>
<p><strong>Tipos comuns:</strong> infravermelho, indutivo de proximidade, laser, fim de curso (limit switch) — a escolha depende do material, do ambiente e do mecanismo.</p>
<h3>2. Status da máquina (ligada / parada)</h3>
<p><strong>Para quê:</strong> disponibilidade e OEE confiáveis.</p>
<p><strong>O que resolve:</strong> saber se a máquina estava apta a produzir, com horário — sem depender de alguém lembrar de anotar a parada.</p>
<p><strong>Abordagem prática:</strong> leitura de corrente elétrica (não invasiva) para identificar operação, parada e, em muitos casos, setup — instalação rápida, sem “abrir” o processo.</p>
<h3>3. Contagem por metro linear (encoder)</h3>
<p><strong>Para quê:</strong> extrusão, moveleiro e processos em que o resultado é comprimento, não peça unitária.</p>
<p><strong>O que resolve:</strong> produção em centímetros (ou metros) 24/7, com histórico na nuvem e base para rendimento do turno.</p>
<h3>4. O que o sensor sozinho não resolve</h3>
<div class="warning-box">
    <p>Sensor sem painel vira log esquecido. Painel sem sensor vira tela alimentada por digitação. O valor está no <strong>conjunto</strong>: evento físico → registro confiável → indicador acionável → ação no turno.</p>
</div>`,
            'sensor.s5': `<h2>Exemplo prático: o mesmo turno, dois jeitos de ver</h2>
<p>Cenário: uma célula com máquina crítica, turno de 8 horas, meta de ritmo conhecida.</p>
<div class="example-box">
    <p class="example-box-title">Com apontamento manual</p>
    <ul>
        <li>Operador anota totais a cada 2 horas (quando dá).</li>
        <li>Uma microparada de 1 minuto se repete dezenas de vezes — some do radar.</li>
        <li>Às 16h, o supervisor “sente” que o turno foi fraco.</li>
        <li>Só no relatório do dia seguinte a produção fecha abaixo do plano — sem horário claro da queda.</li>
    </ul>
</div>
<div class="example-box">
    <p class="example-box-title">Com sensoriamento + dashboard</p>
    <ul>
        <li>Cada peça (ou metro) entra no sistema no momento do evento.</li>
        <li>Status de máquina marca início e fim de cada parada.</li>
        <li>Às 10:15 o painel já mostra cadência abaixo do padrão naquela máquina.</li>
        <li>Manutenção e liderança atuam ainda no turno; o PCP ajusta a sequência com base no real, não no “achismo”.</li>
    </ul>
</div>
<div class="highlight-box">
    <p>A diferença não é cosmética. É <strong>tempo de reação</strong> — o mesmo ativo que o artigo de OEE da MESTTI trata como dinheiro no chão de fábrica.</p>
</div>`,
            'sensor.s6': `<h2>Erros comuns ao “digitalizar” a coleta de dados</h2>
<ol>
    <li><strong>Querer sensor em tudo no dia 1</strong> — comece pelas máquinas gargalo e pelas linhas de maior volume.</li>
    <li><strong>Trocar papel por planilha e chamar de Indústria 4.0</strong> — se ainda depende de digitação, o atraso continua.</li>
    <li><strong>Ignorar instalação e ambiente</strong> — sensor mal posicionado gera falso positivo e mata a confiança no dado.</li>
    <li><strong>Olhar só o total do dia</strong> — sem visão por horário e por máquina, você só confirma o problema depois.</li>
    <li><strong>Não definir o que cada evento significa</strong> — “contagem” sem regra de peça boa/ruim, ou “parada” sem política de setup, vira indicador confuso.</li>
    <li><strong>Esquecer a rede</strong> — oscilação de Wi-Fi sem buffer local perde evento; hardware sério grava e sincroniza depois.</li>
</ol>`,
            'sensor.s7': `<h2>Por onde começar (passo a passo)</h2>
<ol>
    <li><strong>Liste as 3–5 máquinas</strong> que mais limitam o throughput ou geram mais dúvida de produção.</li>
    <li><strong>Escolha o evento certo:</strong> peça, status elétrico ou metro linear.</li>
    <li><strong>Instale com a equipe da planta</strong> (quando o hardware permitir instalação rápida) e valide contagem/parada por algumas horas.</li>
    <li><strong>Coloque o dado no painel ao vivo</strong> — produção, paradas, disponibilidade.</li>
    <li><strong>Treine a liderança do turno</strong> a olhar o painel e agir no mesmo turno.</li>
    <li><strong>Só então</strong> expanda para mais postos e feche o ciclo com OEE completo.</li>
</ol>
<div class="highlight-box">
    <p>Digitalização que funciona é incremental e ligada à dor — não um projeto de TI de 18 meses sem resultado no chão.</p>
</div>`,
            'sensor.s8': `<h2>Como a MESTTI ajuda</h2>
<p>A MESTTI combina sensores industriais e software para monitoramento em tempo real: contagem automática, status de máquina, paradas com horário e indicadores no dashboard — sem digitação no fim do turno.</p>
<p>Na prática:</p>
<ul>
    <li><strong>Sensor de contagem de peças</strong> (infravermelho, indutivo, laser ou mecânico), com integração ao painel</li>
    <li><strong>Sensor de status da máquina</strong> por leitura de corrente (instalação rápida, tipicamente em minutos)</li>
    <li><strong>Encoder de metro linear</strong> para processos contínuos (extrusão / moveleiro)</li>
    <li><strong>Buffer local</strong> contra queda de internet — o evento não some se a rede oscilar</li>
    <li><strong>Visão por máquina</strong> de produção, paradas, disponibilidade e performance</li>
    <li>Base sólida para <strong>OEE ao vivo</strong>, sequenciamento e decisão de turno</li>
</ul>
<p>Se a sua planta ainda responde “quanto produzimos hoje?” só depois do fechamento, o gargalo provavelmente não é falta de reunião — é falta de coleta automática no momento em que a peça sai e a máquina para.</p>`,
            'sensor.s9': `<h2>Checklist rápido: sua coleta de dados está pronta?</h2>
<ul class="checklist">
    <li>Evento de produção definido (peça, ciclo ou metro linear)</li>
    <li>Máquinas críticas mapeadas (não a planta inteira de uma vez)</li>
    <li>Contagem ou status automático — não só planilha</li>
    <li>Paradas com início, fim e duração</li>
    <li>Painel olhado <strong>durante</strong> o turno</li>
    <li>Responsável do turno sabe o que fazer quando a cadência cai</li>
    <li>Rede/Wi-Fi com plano para oscilação (buffer / sincronização)</li>
    <li>Comparativo por máquina e por turno (não só média)</li>
</ul>
<p>Se várias dessas caixas ainda estão abertas, a planta provavelmente ainda decide com atraso — ou com dados incompletos.</p>`,
            'sensor.s10': `<h2>Conclusão</h2>
<p>Sensoriamento industrial não é moda. É o jeito de transformar o que a máquina fez em informação útil <strong>enquanto o turno ainda pode corrigir o rumo</strong>.</p>
<p>Apontamento manual registra o passado com atraso. Sensor + painel mostram o presente com horário, máquina e contexto.</p>
<p>A MESTTI existe para esse presente: hardware no chão de fábrica, dados na nuvem e gestão sem digitação — da contagem ao status da máquina, com indicadores que dão tempo de reação de verdade.</p>`,
            'sensor.faq.list': `<p>Confira respostas diretas para as dúvidas mais comuns sobre sensoriamento, coleta automática e monitoramento em tempo real.</p>
<details class="faq-item">
    <summary>Preciso trocar todas as máquinas para ter sensoriamento?</summary>
    <p>Não. Na maioria dos casos o sensor se adapta ao equipamento existente (contagem, corrente, encoder). O ganho começa nas máquinas críticas, não na troca da linha inteira.</p>
</details>
<details class="faq-item">
    <summary>Sensor substitui o MES / ERP?</summary>
    <p>Não. Sensor e dashboard de chão alimentam a operação com o real. MES/ERP continuam no planejamento, estoque e gestão. O ponto é não depender de digitação tardia para saber o que a máquina fez.</p>
</details>
<details class="faq-item">
    <summary>E se a internet da fábrica cair?</summary>
    <p>Hardware bem desenhado guarda eventos localmente e sincroniza quando a conexão volta. Sem isso, você perde exatamente os minutos em que mais precisava do histórico.</p>
</details>
<details class="faq-item">
    <summary>Por onde começar se hoje só temos papel?</summary>
    <p>Escolha uma máquina gargalo, automatize contagem ou status, coloque no painel e treine o turno a agir com o dado. Depois expanda. A MESTTI acelera esse caminho com sensores e monitoramento em tempo real.</p>
</details>
<details class="faq-item">
    <summary>Sensores servem só para OEE?</summary>
    <p>OEE é um dos frutos. Antes disso, você já ganha produção confiável, mapa de paradas, cadência por horário e base para custo, PCP e manutenção. O indicador completo fica muito mais honesto quando a coleta deixa de ser manual.</p>
</details>`,
        },
        en: {
            'sensor.intro': `<p>In many plants, “production data” still starts like this: the operator writes on paper, types into the system at shift end, someone consolidates a spreadsheet, and management only sees the result the next day.</p>
<p>The problem is not lack of effort. It is delay, inconsistency and loss of context. When was the piece produced? Which machine actually stopped the line? Did cadence drop at 10 a.m., or does the shift only “look” weak at closing?</p>
<p>In that scenario, Industry 4.0 stops being a slide and becomes a practical question: <strong>can you capture what the machine did without depending on typing?</strong></p>
<p>The answer is industrial sensing — simple hardware, well installed, connected to a live dashboard. In this article you will understand what sensing means on the shop floor, why manual logging fails, which sensors solve which pains, and how MESTTI turns counting, machine status and downtime into management with reaction time.</p>
<p><strong>In this article, you will learn:</strong></p>
<ul class="article-intro-list">
    <li>What industrial sensing is (without jargon)</li>
    <li>Why manual logging fails during the shift</li>
    <li>What Industry 4.0 actually changes on the floor</li>
    <li>Which sensors solve which pains</li>
    <li>A practical example: same shift, two ways of seeing</li>
    <li>Common mistakes when digitizing data collection</li>
    <li>Where to start and how MESTTI helps</li>
</ul>`,
            'sensor.s1': `<h2>What industrial sensing is (without jargon)</h2>
<p>Industrial sensing means capturing real operating events — piece produced, machine on or stopped, extruded length, cycle completed — and sending them automatically to a system, instead of asking someone to type later.</p>
<p>It is not “replacing the operator”. It is removing the job of being the plant’s clock and counter, so the operator can focus on setup, quality and problem solving.</p>
<p>In practical terms, the sensor:</p>
<ol>
    <li><strong>Detects</strong> a physical event (part passing, electrical current, limit switch, length encoder).</li>
    <li><strong>Records</strong> time and machine.</li>
    <li><strong>Sends</strong> the data to the dashboard (and stores it locally if the network drops).</li>
    <li><strong>Feeds</strong> KPIs: production, availability, performance, OEE, shift history.</li>
</ol>
<div class="highlight-box">
    <p>Without that link, any pretty KPI in a slide deck still depends on human memory.</p>
</div>`,
            'sensor.s2': `<h2>Why manual logging fails during the shift</h2>
<p>Manual logging can “work” at low volume. In real operations, it usually breaks in five places:</p>
<ol>
    <li><strong>Delay</strong> — the data arrives after the decision that mattered.</li>
    <li><strong>Typing errors</strong> — wrong number, wrong machine, mixed shift.</li>
    <li><strong>Invisible micro-stops</strong> — nobody logs the 40-second stop that repeats 30 times.</li>
    <li><strong>Operator load</strong> — at high cadence, logging competes with producing.</li>
    <li><strong>No reliable timestamp</strong> — “it stopped in the morning” does not help maintenance or production planning.</li>
</ol>
<div class="example-box">
    <p class="example-box-title">Typical end-of-shift example</p>
    <ul>
        <li>Logged production: 1,200 pieces</li>
        <li>Line reality (with automatic counting): 1,080 pieces + several micro-stops</li>
    </ul>
    <p>Result: planning builds the next day on an optimistic number, maintenance misses the failure pattern, and management debates “productivity” without knowing where time went.</p>
</div>
<p>Manual logging is not a villain for being old. It is limited because the shop floor is too fast for paper and spreadsheets.</p>`,
            'sensor.s3': `<h2>What Industry 4.0 actually changes on the shop floor</h2>
<p>Forget the generic “pillars” list. On the shift, useful Industry 4.0 usually means three concrete changes:</p>
<table class="cost-table">
    <thead>
        <tr><th>Before (manual)</th><th>After (sensor + dashboard)</th></tr>
    </thead>
    <tbody>
        <tr><td>Production typed at shift end</td><td>Automatic counting 24/7</td></tr>
        <tr><td>“The machine stopped a bit”</td><td>Downtime with start, end and duration</td></tr>
        <tr><td>KPI in next-day report</td><td>Alert and live view</td></tr>
        <tr><td>Plant average hides bottleneck</td><td>View by machine and station</td></tr>
        <tr><td>Decision by shift perception</td><td>Decision with current data</td></tr>
    </tbody>
</table>
<div class="highlight-box">
    <p>This does not require a new plant. It requires <strong>reliable automatic collection</strong> on the machines that matter most — and discipline to act in the same shift the loss appears.</p>
</div>`,
            'sensor.s4': `<h2>Which sensors solve which pains</h2>
<p>Not every sensor fits every job. A common mistake is buying “nice” hardware without matching it to the process pain.</p>
<div class="sigla-grid">
    <div class="sigla-card">
        <abbr title="Counting">Piece counting</abbr>
        <p>Real production, cadence and a base for performance and OEE.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Status">Machine status</abbr>
        <p>Availability with timestamps — running, stopped or setup.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Encoder">Linear meter</abbr>
        <p>Extrusion and continuous processes measured by length.</p>
    </div>
</div>
<h3>1. Piece counting</h3>
<p><strong>For:</strong> unit-piece lines, conveyors, assembly, injection, repetitive processes.</p>
<p><strong>Solves:</strong> real production by machine/station, cadence, base for performance and OEE.</p>
<p><strong>Common types:</strong> infrared, inductive proximity, laser, limit switch — choice depends on material, environment and mechanism.</p>
<h3>2. Machine status (on / stopped)</h3>
<p><strong>For:</strong> reliable availability and OEE.</p>
<p><strong>Solves:</strong> knowing whether the machine was able to produce, with timestamps — without depending on someone remembering to log the stop.</p>
<p><strong>Practical approach:</strong> non-invasive current reading to identify running, stopped and often setup — fast install, without “opening” the process.</p>
<h3>3. Linear-meter counting (encoder)</h3>
<p><strong>For:</strong> extrusion, furniture and processes where output is length, not a unit piece.</p>
<p><strong>Solves:</strong> production in centimeters (or meters) 24/7, with cloud history and a base for shift yield.</p>
<h3>4. What the sensor alone does not solve</h3>
<div class="warning-box">
    <p>A sensor without a dashboard becomes a forgotten log. A dashboard without a sensor becomes a screen fed by typing. Value is in the <strong>set</strong>: physical event → reliable record → actionable KPI → action in the shift.</p>
</div>`,
            'sensor.s5': `<h2>Practical example: the same shift, two ways of seeing</h2>
<p>Scenario: a cell with a critical machine, 8-hour shift, known pace target.</p>
<div class="example-box">
    <p class="example-box-title">With manual logging</p>
    <ul>
        <li>Operator logs totals every 2 hours (when possible).</li>
        <li>A 1-minute micro-stop repeats dozens of times — off the radar.</li>
        <li>At 4 p.m., the supervisor “feels” the shift was weak.</li>
        <li>Only in the next-day report does production close below plan — with no clear time of the drop.</li>
    </ul>
</div>
<div class="example-box">
    <p class="example-box-title">With sensing + dashboard</p>
    <ul>
        <li>Each piece (or meter) enters the system at the event moment.</li>
        <li>Machine status marks start and end of every stop.</li>
        <li>At 10:15 the dashboard already shows cadence below standard on that machine.</li>
        <li>Maintenance and leadership act still in the shift; planning adjusts the sequence on reality, not guesswork.</li>
    </ul>
</div>
<div class="highlight-box">
    <p>The difference is not cosmetic. It is <strong>reaction time</strong> — the same asset the MESTTI OEE article treats as money on the shop floor.</p>
</div>`,
            'sensor.s6': `<h2>Common mistakes when “digitizing” data collection</h2>
<ol>
    <li><strong>Wanting sensors everywhere on day 1</strong> — start with bottleneck machines and highest-volume lines.</li>
    <li><strong>Replacing paper with a spreadsheet and calling it Industry 4.0</strong> — if it still depends on typing, delay remains.</li>
    <li><strong>Ignoring install and environment</strong> — a badly placed sensor creates false positives and kills trust in the data.</li>
    <li><strong>Looking only at the day total</strong> — without view by time and machine, you only confirm the problem later.</li>
    <li><strong>Not defining what each event means</strong> — “count” without good/bad rules, or “stop” without a setup policy, becomes a confusing KPI.</li>
    <li><strong>Forgetting the network</strong> — Wi-Fi drops without local buffer lose events; serious hardware stores and syncs later.</li>
</ol>`,
            'sensor.s7': `<h2>Where to start (step by step)</h2>
<ol>
    <li><strong>List the 3–5 machines</strong> that most limit throughput or create the most production doubt.</li>
    <li><strong>Choose the right event:</strong> piece, electrical status or linear meter.</li>
    <li><strong>Install with the plant team</strong> (when hardware allows a fast install) and validate counting/downtime for a few hours.</li>
    <li><strong>Put the data on a live dashboard</strong> — production, downtime, availability.</li>
    <li><strong>Train shift leadership</strong> to watch the dashboard and act in the same shift.</li>
    <li><strong>Only then</strong> expand to more stations and close the loop with full OEE.</li>
</ol>
<div class="highlight-box">
    <p>Digitization that works is incremental and tied to pain — not an 18-month IT project with no floor result.</p>
</div>`,
            'sensor.s8': `<h2>How MESTTI helps</h2>
<p>MESTTI combines industrial sensors and software for real-time monitoring: automatic counting, machine status, timestamped downtime and dashboard KPIs — without end-of-shift typing.</p>
<p>In practice:</p>
<ul>
    <li><strong>Piece-counting sensor</strong> (infrared, inductive, laser or mechanical), integrated to the dashboard</li>
    <li><strong>Machine-status sensor</strong> via current reading (fast install, typically minutes)</li>
    <li><strong>Linear-meter encoder</strong> for continuous processes (extrusion / furniture)</li>
    <li><strong>Local buffer</strong> against internet drops — the event does not vanish if the network oscillates</li>
    <li><strong>Per-machine view</strong> of production, downtime, availability and performance</li>
    <li>Solid base for <strong>live OEE</strong>, sequencing and shift decisions</li>
</ul>
<p>If your plant still answers “how much did we produce today?” only after closing, the bottleneck is probably not a lack of meetings — it is a lack of automatic collection at the moment the piece leaves and the machine stops.</p>`,
            'sensor.s9': `<h2>Quick checklist: is your data collection ready?</h2>
<ul class="checklist">
    <li>Production event defined (piece, cycle or linear meter)</li>
    <li>Critical machines mapped (not the whole plant at once)</li>
    <li>Automatic counting or status — not spreadsheet only</li>
    <li>Downtime with start, end and duration</li>
    <li>Dashboard watched <strong>during</strong> the shift</li>
    <li>Shift owner knows what to do when cadence drops</li>
    <li>Network/Wi-Fi plan for drops (buffer / sync)</li>
    <li>Compare by machine and shift (not average only)</li>
</ul>
<p>If several of these boxes are still open, the plant is probably still deciding late — or with incomplete data.</p>`,
            'sensor.s10': `<h2>Conclusion</h2>
<p>Industrial sensing is not a fad. It is how you turn what the machine did into useful information <strong>while the shift can still correct course</strong>.</p>
<p>Manual logging records the past with delay. Sensor + dashboard show the present with time, machine and context.</p>
<p>MESTTI exists for that present: hardware on the floor, data in the cloud and management without typing — from counting to machine status, with KPIs that give real reaction time.</p>`,
            'sensor.faq.list': `<p>Direct answers to the most common questions about industrial sensing, automatic collection and real-time monitoring.</p>
<details class="faq-item">
    <summary>Do I need to replace every machine to get sensing?</summary>
    <p>No. In most cases the sensor adapts to existing equipment (counting, current, encoder). Gains start on critical machines, not by replacing the whole line.</p>
</details>
<details class="faq-item">
    <summary>Does a sensor replace MES / ERP?</summary>
    <p>No. Floor sensors and dashboards feed operations with reality. MES/ERP stay for planning, inventory and management. The point is not depending on late typing to know what the machine did.</p>
</details>
<details class="faq-item">
    <summary>What if plant internet goes down?</summary>
    <p>Well-designed hardware stores events locally and syncs when the connection returns. Without that, you lose exactly the minutes when you most needed the history.</p>
</details>
<details class="faq-item">
    <summary>Where to start if today we only have paper?</summary>
    <p>Pick a bottleneck machine, automate counting or status, put it on the dashboard and train the shift to act on the data. Then expand. MESTTI accelerates that path with sensors and real-time monitoring.</p>
</details>
<details class="faq-item">
    <summary>Are sensors only for OEE?</summary>
    <p>OEE is one outcome. Before that, you already gain reliable production, a downtime map, cadence by time and a base for cost, planning and maintenance. The full KPI becomes much more honest when collection stops being manual.</p>
</details>`,
        },
        es: {
            'sensor.intro': `<p>En muchas fábricas, el “dato de producción” todavía nace así: el operador anota en papel, digita en el sistema al final del turno, alguien consolida la planilla y la gestión solo ve el resultado al día siguiente.</p>
<p>El problema no es falta de esfuerzo. Es atraso, inconsistencia y pérdida de contexto. ¿Cuándo se produjo la pieza? ¿En qué máquina la línea realmente paró? ¿La cadencia cayó a las 10h o solo al cierre “parece” que el turno fue débil?</p>
<p>Industria 4.0, en ese escenario, deja de ser diapositiva y se vuelve una pregunta práctica: <strong>¿se puede capturar lo que la máquina hizo sin depender de digitar?</strong></p>
<p>La respuesta pasa por la sensorización industrial — hardware simple, bien instalado, conectado a un panel en vivo. En este artículo entenderá qué es sensorización en planta, por qué falla el apunte manual, qué sensores resuelven qué dolores y cómo MESTTI transforma conteo, estado de máquina y paradas en gestión con tiempo de reacción.</p>
<p><strong>En este artículo, usted va a entender:</strong></p>
<ul class="article-intro-list">
    <li>Qué es sensorización industrial (sin jerga)</li>
    <li>Por qué falla el apunte manual en el turno</li>
    <li>Qué cambia de verdad la Industria 4.0 en planta</li>
    <li>Qué sensores resuelven qué dolores</li>
    <li>Un ejemplo práctico: el mismo turno, dos formas de ver</li>
    <li>Errores comunes al digitalizar la recolección</li>
    <li>Por dónde empezar y cómo ayuda MESTTI</li>
</ul>`,
            'sensor.s1': `<h2>Qué es sensorización industrial (sin jerga)</h2>
<p>Sensorización industrial es capturar eventos reales de la operación — pieza producida, máquina encendida o parada, longitud extruida, ciclo concluido — y enviarlos automáticamente a un sistema, en vez de pedir que alguien digite después.</p>
<p>No es “reemplazar al operador”. Es quitarle la tarea de ser el reloj y el contador de la fábrica, para que se concentre en setup, calidad y resolución de problemas.</p>
<p>En términos prácticos, el sensor:</p>
<ol>
    <li><strong>Detecta</strong> un evento físico (paso de pieza, corriente eléctrica, final de carrera, encoder de longitud).</li>
    <li><strong>Registra</strong> horario y máquina.</li>
    <li><strong>Envía</strong> el dato al panel (y lo guarda localmente si la red oscila).</li>
    <li><strong>Alimenta</strong> indicadores: producción, disponibilidad, rendimiento, OEE, historial por turno.</li>
</ol>
<div class="highlight-box">
    <p>Sin ese eslabón, cualquier indicador bonito en PowerPoint todavía depende de la memoria humana.</p>
</div>`,
            'sensor.s2': `<h2>Por qué falla el apunte manual en el turno</h2>
<p>El apunte manual hasta “funciona” en bajo volumen. En operación real, suele romperse en cinco puntos:</p>
<ol>
    <li><strong>Atraso</strong> — el dato llega después de la decisión que importaba.</li>
    <li><strong>Error de digitación</strong> — número cambiado, máquina equivocada, turno mezclado.</li>
    <li><strong>Microparadas invisibles</strong> — nadie anota la parada de 40 segundos que se repite 30 veces.</li>
    <li><strong>Carga en el operador</strong> — en alta cadencia, anotar compite con producir.</li>
    <li><strong>Falta de timestamp confiable</strong> — “paró por la mañana” no ayuda a mantenimiento ni a PCP.</li>
</ol>
<div class="example-box">
    <p class="example-box-title">Ejemplo típico del final del turno</p>
    <ul>
        <li>Producción apuntada: 1.200 piezas</li>
        <li>Realidad de la línea (con conteo automático): 1.080 piezas + varias microparadas</li>
    </ul>
    <p>Resultado: PCP planifica el día siguiente con un número optimista, mantenimiento no ve el patrón de falla, y la gestión discute “productividad” sin saber dónde se fue el tiempo.</p>
</div>
<p>El apunte no es villano por ser antiguo. Es limitado porque la planta es demasiado rápida para papel y planilla.</p>`,
            'sensor.s3': `<h2>Qué cambia de verdad la Industria 4.0 en planta</h2>
<p>Olvide la lista genérica de “pilares”. En el turno, Industria 4.0 útil suele significar tres cambios concretos:</p>
<table class="cost-table">
    <thead>
        <tr><th>Antes (manual)</th><th>Después (sensor + panel)</th></tr>
    </thead>
    <tbody>
        <tr><td>Producción digitada al final del turno</td><td>Conteo automático 24/7</td></tr>
        <tr><td>“La máquina paró un poco”</td><td>Parada con inicio, fin y duración</td></tr>
        <tr><td>Indicador en el informe del día siguiente</td><td>Alerta y visión en vivo</td></tr>
        <tr><td>Promedio de planta esconde cuello de botella</td><td>Visión por máquina y por puesto</td></tr>
        <tr><td>Decisión por percepción del turno</td><td>Decisión con dato actual</td></tr>
    </tbody>
</table>
<div class="highlight-box">
    <p>Esto no exige fábrica nueva. Exige <strong>recolección automática confiable</strong> en las máquinas que más importan — y disciplina para actuar en el mismo turno en que aparece la pérdida.</p>
</div>`,
            'sensor.s4': `<h2>Qué sensores resuelven qué dolores</h2>
<p>No todo sensor sirve para todo. El error común es comprar hardware “bonito” sin cruzarlo con el dolor del proceso.</p>
<div class="sigla-grid">
    <div class="sigla-card">
        <abbr title="Conteo">Conteo de piezas</abbr>
        <p>Producción real, cadencia y base para rendimiento y OEE.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Estado">Estado de máquina</abbr>
        <p>Disponibilidad con horario — encendida, parada o setup.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Encoder">Metro lineal</abbr>
        <p>Extrusión y procesos continuos medidos por longitud.</p>
    </div>
</div>
<h3>1. Conteo de piezas</h3>
<p><strong>Para qué:</strong> líneas con pieza unitaria, cinta, montaje, inyección, procesos repetitivos.</p>
<p><strong>Qué resuelve:</strong> producción real por máquina/puesto, cadencia, base para rendimiento y OEE.</p>
<p><strong>Tipos comunes:</strong> infrarrojo, inductivo de proximidad, láser, final de carrera — la elección depende del material, del ambiente y del mecanismo.</p>
<h3>2. Estado de la máquina (encendida / parada)</h3>
<p><strong>Para qué:</strong> disponibilidad y OEE confiables.</p>
<p><strong>Qué resuelve:</strong> saber si la máquina estaba apta para producir, con horario — sin depender de que alguien recuerde anotar la parada.</p>
<p><strong>Enfoque práctico:</strong> lectura de corriente eléctrica (no invasiva) para identificar operación, parada y, en muchos casos, setup — instalación rápida, sin “abrir” el proceso.</p>
<h3>3. Conteo por metro lineal (encoder)</h3>
<p><strong>Para qué:</strong> extrusión, mueblero y procesos en que el resultado es longitud, no pieza unitaria.</p>
<p><strong>Qué resuelve:</strong> producción en centímetros (o metros) 24/7, con historial en la nube y base para rendimiento del turno.</p>
<h3>4. Lo que el sensor solo no resuelve</h3>
<div class="warning-box">
    <p>Sensor sin panel se vuelve log olvidado. Panel sin sensor se vuelve pantalla alimentada por digitación. El valor está en el <strong>conjunto</strong>: evento físico → registro confiable → indicador accionable → acción en el turno.</p>
</div>`,
            'sensor.s5': `<h2>Ejemplo práctico: el mismo turno, dos formas de ver</h2>
<p>Escenario: una célula con máquina crítica, turno de 8 horas, meta de ritmo conocida.</p>
<div class="example-box">
    <p class="example-box-title">Con apunte manual</p>
    <ul>
        <li>Operador anota totales cada 2 horas (cuando puede).</li>
        <li>Una microparada de 1 minuto se repite decenas de veces — desaparece del radar.</li>
        <li>A las 16h, el supervisor “siente” que el turno fue débil.</li>
        <li>Solo en el informe del día siguiente la producción cierra por debajo del plan — sin horario claro de la caída.</li>
    </ul>
</div>
<div class="example-box">
    <p class="example-box-title">Con sensorización + dashboard</p>
    <ul>
        <li>Cada pieza (o metro) entra al sistema en el momento del evento.</li>
        <li>El estado de máquina marca inicio y fin de cada parada.</li>
        <li>A las 10:15 el panel ya muestra cadencia por debajo del estándar en esa máquina.</li>
        <li>Mantenimiento y liderazgo actúan aún en el turno; PCP ajusta la secuencia con base en lo real, no en el “achismo”.</li>
    </ul>
</div>
<div class="highlight-box">
    <p>La diferencia no es cosmética. Es <strong>tiempo de reacción</strong> — el mismo activo que el artículo de OEE de MESTTI trata como dinero en planta.</p>
</div>`,
            'sensor.s6': `<h2>Errores comunes al “digitalizar” la recolección de datos</h2>
<ol>
    <li><strong>Querer sensor en todo el día 1</strong> — empiece por las máquinas cuello de botella y las líneas de mayor volumen.</li>
    <li><strong>Cambiar papel por planilla y llamarlo Industria 4.0</strong> — si todavía depende de digitar, el atraso continúa.</li>
    <li><strong>Ignorar instalación y ambiente</strong> — sensor mal posicionado genera falso positivo y mata la confianza en el dato.</li>
    <li><strong>Mirar solo el total del día</strong> — sin visión por horario y por máquina, solo confirma el problema después.</li>
    <li><strong>No definir qué significa cada evento</strong> — “conteo” sin regla de pieza buena/mala, o “parada” sin política de setup, se vuelve indicador confuso.</li>
    <li><strong>Olvidar la red</strong> — oscilación de Wi-Fi sin buffer local pierde evento; hardware serio graba y sincroniza después.</li>
</ol>`,
            'sensor.s7': `<h2>Por dónde empezar (paso a paso)</h2>
<ol>
    <li><strong>Liste las 3–5 máquinas</strong> que más limitan el throughput o generan más duda de producción.</li>
    <li><strong>Elija el evento correcto:</strong> pieza, estado eléctrico o metro lineal.</li>
    <li><strong>Instale con el equipo de planta</strong> (cuando el hardware permita instalación rápida) y valide conteo/parada por algunas horas.</li>
    <li><strong>Ponga el dato en el panel en vivo</strong> — producción, paradas, disponibilidad.</li>
    <li><strong>Entrene al liderazgo del turno</strong> a mirar el panel y actuar en el mismo turno.</li>
    <li><strong>Solo entonces</strong> expanda a más puestos y cierre el ciclo con OEE completo.</li>
</ol>
<div class="highlight-box">
    <p>Digitalización que funciona es incremental y ligada al dolor — no un proyecto de TI de 18 meses sin resultado en planta.</p>
</div>`,
            'sensor.s8': `<h2>Cómo ayuda MESTTI</h2>
<p>MESTTI combina sensores industriales y software para monitoreo en tiempo real: conteo automático, estado de máquina, paradas con horario e indicadores en el panel — sin digitar al final del turno.</p>
<p>En la práctica:</p>
<ul>
    <li><strong>Sensor de conteo de piezas</strong> (infrarrojo, inductivo, láser o mecánico), con integración al panel</li>
    <li><strong>Sensor de estado de máquina</strong> por lectura de corriente (instalación rápida, típicamente en minutos)</li>
    <li><strong>Encoder de metro lineal</strong> para procesos continuos (extrusión / mueblero)</li>
    <li><strong>Buffer local</strong> contra caída de internet — el evento no desaparece si la red oscila</li>
    <li><strong>Visión por máquina</strong> de producción, paradas, disponibilidad y rendimiento</li>
    <li>Base sólida para <strong>OEE en vivo</strong>, secuenciamiento y decisión de turno</li>
</ul>
<p>Si su planta todavía responde “¿cuánto producimos hoy?” solo después del cierre, el cuello de botella probablemente no es falta de reunión — es falta de recolección automática en el momento en que la pieza sale y la máquina para.</p>`,
            'sensor.s9': `<h2>Checklist rápido: ¿su recolección de datos está lista?</h2>
<ul class="checklist">
    <li>Evento de producción definido (pieza, ciclo o metro lineal)</li>
    <li>Máquinas críticas mapeadas (no toda la planta de una vez)</li>
    <li>Conteo o estado automático — no solo planilla</li>
    <li>Paradas con inicio, fin y duración</li>
    <li>Panel mirado <strong>durante</strong> el turno</li>
    <li>Responsable del turno sabe qué hacer cuando cae la cadencia</li>
    <li>Red/Wi-Fi con plan para oscilación (buffer / sincronización)</li>
    <li>Comparativo por máquina y por turno (no solo promedio)</li>
</ul>
<p>Si varias de estas casillas aún están abiertas, la planta probablemente todavía decide con atraso — o con datos incompletos.</p>`,
            'sensor.s10': `<h2>Conclusión</h2>
<p>La sensorización industrial no es moda. Es la forma de transformar lo que la máquina hizo en información útil <strong>mientras el turno todavía puede corregir el rumbo</strong>.</p>
<p>El apunte manual registra el pasado con atraso. Sensor + panel muestran el presente con horario, máquina y contexto.</p>
<p>MESTTI existe para ese presente: hardware en planta, datos en la nube y gestión sin digitar — del conteo al estado de máquina, con indicadores que dan tiempo de reacción de verdad.</p>`,
            'sensor.faq.list': `<p>Respuestas directas a las dudas más comunes sobre sensorización, recolección automática y monitoreo en tiempo real.</p>
<details class="faq-item">
    <summary>¿Necesito cambiar todas las máquinas para tener sensorización?</summary>
    <p>No. En la mayoría de los casos el sensor se adapta al equipo existente (conteo, corriente, encoder). La ganancia empieza en las máquinas críticas, no en el cambio de toda la línea.</p>
</details>
<details class="faq-item">
    <summary>¿El sensor reemplaza el MES / ERP?</summary>
    <p>No. Sensor y dashboard de planta alimentan la operación con lo real. MES/ERP siguen en planificación, stock y gestión. El punto es no depender de digitación tardía para saber qué hizo la máquina.</p>
</details>
<details class="faq-item">
    <summary>¿Y si cae internet de la fábrica?</summary>
    <p>Hardware bien diseñado guarda eventos localmente y sincroniza cuando vuelve la conexión. Sin eso, pierde exactamente los minutos en que más necesitaba el historial.</p>
</details>
<details class="faq-item">
    <summary>¿Por dónde empezar si hoy solo tenemos papel?</summary>
    <p>Elija una máquina cuello de botella, automatice conteo o estado, póngalo en el panel y entrene al turno a actuar con el dato. Después expanda. MESTTI acelera ese camino con sensores y monitoreo en tiempo real.</p>
</details>
<details class="faq-item">
    <summary>¿Los sensores sirven solo para OEE?</summary>
    <p>OEE es uno de los frutos. Antes de eso, ya gana producción confiable, mapa de paradas, cadencia por horario y base para costo, PCP y mantenimiento. El indicador completo queda mucho más honesto cuando la recolección deja de ser manual.</p>
</details>`,
        }
    };

    window.MESTTI_PAGE_I18N = window.MESTTI_PAGE_I18N || { pt: {}, en: {}, es: {} };
    for (const lang of ['pt', 'en', 'es']) {
        Object.assign(window.MESTTI_PAGE_I18N[lang], content[lang]);
    }
})();
