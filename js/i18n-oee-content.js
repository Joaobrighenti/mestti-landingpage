(function () {
    const content = {
        pt: {
            'oee.intro': `<p>Quase toda indústria fala em produtividade. Poucas conseguem responder, com números confiáveis, a uma pergunta simples:</p>
<p><strong>Quanto da capacidade da minha fábrica está realmente sendo usada agora?</strong></p>
<p>OEE (Overall Equipment Effectiveness, ou Eficiência Geral do Equipamento) existe exatamente para isso. Ele resume, em um único indicador, três frentes que costumam ficar espalhadas em planilhas, apontamentos e “achismos” do turno: disponibilidade, performance e qualidade.</p>
<p>Quando o OEE é medido tarde, a decisão também chega tarde. Paradas passam, gargalos se repetem e a gestão só vê o estrago no fechamento. Quando o OEE é acompanhado ao vivo, a fábrica ganha tempo de reação — e tempo de reação é dinheiro.</p>
<p>Neste artigo você vai entender o que o OEE mede, como calcular, quais erros destroem o número e como a MESTTI transforma esse indicador em gestão do chão de fábrica em tempo real.</p>
<p><strong>Neste artigo, você vai entender:</strong></p>
<ul class="article-intro-list">
    <li>O que é OEE e o que a fórmula realmente mede</li>
    <li>Os três pilares: disponibilidade, performance e qualidade</li>
    <li>Como calcular OEE passo a passo</li>
    <li>Um exemplo prático com números de turno</li>
    <li>Erros comuns que invalidam o indicador</li>
    <li>A diferença entre OEE no fim do dia e OEE ao vivo</li>
    <li>Como a MESTTI ajuda a acompanhar OEE sem digitação</li>
</ul>`,
            'oee.s1': `<h2>O que é OEE</h2>
<p>OEE é um indicador de eficiência de equipamento. Em vez de olhar só “quantas peças saíram”, ele pergunta se a máquina esteve disponível, se rodou no ritmo esperado e se o que saiu estava conforme.</p>
<div class="formula-box">
    <p class="formula-box-label">Fórmula clássica</p>
    <p class="formula-box-formula">OEE = Disponibilidade × Performance × Qualidade</p>
    <p class="formula-box-note">Cada fator fica entre 0 e 1 (ou 0% e 100%). Multiplicados, mostram o quanto da capacidade teórica se converteu em produção boa.</p>
</div>
<p>Um exemplo rápido:</p>
<div class="example-box">
    <p class="example-box-title">Cálculo rápido</p>
    <ul>
        <li>Disponibilidade: 90%</li>
        <li>Performance: 85%</li>
        <li>Qualidade: 98%</li>
    </ul>
    <div class="example-calc">
        OEE = 0,90 × 0,85 × 0,98 = <strong>74,97%</strong>
    </div>
</div>
<p>Esse ~75% não é “ruim por si só”. O valor importa quando você compara máquina com máquina, turno com turno e plano com real — e quando consegue ver <strong>onde</strong> o número caiu.</p>
<div class="highlight-box">
    <p>OEE útil não é só um percentual no dashboard. É um mapa de perdas: tempo parado, ritmo abaixo do padrão e qualidade que não saiu de primeira.</p>
</div>`,
            'oee.s2': `<h2>Os três pilares do OEE</h2>
<div class="sigla-grid">
    <div class="sigla-card">
        <abbr title="Disponibilidade">Disponibilidade</abbr>
        <p>Quanto tempo a máquina esteve apta a produzir no período planejado.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Performance">Performance</abbr>
        <p>Se, enquanto rodava, a máquina entregou a cadência esperada.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Qualidade">Qualidade</abbr>
        <p>Quanto do produzido saiu bom de primeira.</p>
    </div>
</div>

<h3>1. Disponibilidade</h3>
<div class="formula-box">
    <p class="formula-box-label">Fórmula</p>
    <p class="formula-box-formula">Disponibilidade = Tempo de operação ÷ Tempo planejado</p>
</div>
<p>O que derruba disponibilidade:</p>
<ul>
    <li>Paradas por falha</li>
    <li>Setup e troca de ferramenta longos</li>
    <li>Falta de material ou operador</li>
    <li>Manutenção corretiva não programada</li>
    <li>Microparadas que ninguém registra</li>
</ul>
<p>Se a disponibilidade só é fechada no fim do turno, a gestão perde a chance de agir na hora em que a linha parou.</p>

<h3>2. Performance</h3>
<div class="formula-box">
    <p class="formula-box-label">Fórmula</p>
    <p class="formula-box-formula">Performance = (Peças produzidas × Tempo de ciclo ideal) ÷ Tempo de operação</p>
</div>
<p>O que derruba performance:</p>
<ul>
    <li>Ritmo abaixo do padrão</li>
    <li>Microparadas “invisíveis”</li>
    <li>Velocidade reduzida por medo de quebra</li>
    <li>Processo desajustado</li>
    <li>Contagem imprecisa (apontamento manual errado)</li>
</ul>
<p>Performance baixa com disponibilidade alta é um sinal clássico: a máquina “está ligada”, mas não está rendendo.</p>

<h3>3. Qualidade</h3>
<div class="formula-box">
    <p class="formula-box-label">Fórmula</p>
    <p class="formula-box-formula">Qualidade = Peças boas ÷ Peças totais produzidas</p>
</div>
<p>O que derruba qualidade:</p>
<ul>
    <li>Refugo</li>
    <li>Retrabalho</li>
    <li>Startup com descarte alto</li>
    <li>Variação de processo</li>
    <li>Falta de rastreio por máquina/turno</li>
</ul>
<p>Qualidade no OEE não é só “controle final”. É custo de processo que já aconteceu.</p>`,
            'oee.s3': `<h2>Como calcular OEE na prática (passo a passo)</h2>
<ol>
    <li><strong>Defina o tempo planejado</strong> do turno (descontando pausas oficiais, se for o caso da sua política).</li>
    <li><strong>Registre o tempo parado</strong> com horário de início e fim — não só o total no fim do dia.</li>
    <li><strong>Calcule o tempo de operação</strong> = tempo planejado − tempo parado.</li>
    <li><strong>Conte as peças produzidas</strong> (boas + ruins).</li>
    <li><strong>Separe peças boas</strong> das com defeito/retrabalho.</li>
    <li><strong>Use o tempo de ciclo ideal</strong> (padrão técnico da peça/máquina).</li>
    <li><strong>Aplique a fórmula</strong> Disponibilidade × Performance × Qualidade.</li>
</ol>
<div class="warning-box">
    <p>Sem dados confiáveis em cada etapa, o OEE vira teatro de indicadores.</p>
</div>`,
            'oee.s4': `<h2>Exemplo prático</h2>
<p>Turno de 8 horas (480 minutos), com 30 minutos de pausa oficial → <strong>tempo planejado = 450 min</strong>.</p>
<div class="example-box">
    <p class="example-box-title">Dados do turno</p>
    <table class="cost-table">
        <tbody>
            <tr><td>Paradas acumuladas</td><td>45 min</td></tr>
            <tr><td>Tempo de operação</td><td>405 min</td></tr>
            <tr><td>Tempo de ciclo ideal</td><td>0,5 min/peça</td></tr>
            <tr><td>Peças produzidas</td><td>700</td></tr>
            <tr><td>Peças boas</td><td>672</td></tr>
        </tbody>
    </table>
    <div class="example-calc">
        Disponibilidade = 405 ÷ 450 = <strong>90%</strong><br>
        Tempo teórico necessário = 700 × 0,5 = 350 min<br>
        Performance = 350 ÷ 405 ≈ <strong>86,4%</strong><br>
        Qualidade = 672 ÷ 700 = <strong>96%</strong><br><br>
        OEE = 0,90 × 0,864 × 0,96 ≈ <strong>74,6%</strong>
    </div>
</div>
<p>Agora a pergunta útil não é “74,6% é bom?”. É: <strong>em qual pilar e em qual horário a eficiência caiu?</strong> Sem timestamp de parada e contagem confiável, essa resposta some.</p>`,
            'oee.s5': `<h2>Erros comuns que invalidam o OEE</h2>
<ol>
    <li><strong>Apontar paradas só no fim do turno</strong> — some o horário, a causa e a máquina.</li>
    <li><strong>Misturar tempo ocioso com tempo planejado</strong> sem regra clara.</li>
    <li><strong>Usar meta comercial no lugar do tempo de ciclo ideal</strong> — o OEE deixa de medir o equipamento.</li>
    <li><strong>Ignorar microparadas</strong> — a performance “parece” baixa sem explicação.</li>
    <li><strong>Contar peças no papel</strong> — atraso e erro humano destroem o indicador.</li>
    <li><strong>Olhar só o OEE médio da fábrica</strong> — média esconde a máquina que sangra resultado.</li>
</ol>
<div class="highlight-box">
    <p>Indicador sem dado confiável não governa a fábrica — só decora o relatório.</p>
</div>`,
            'oee.s6': `<h2>OEE médio no fim do dia vs OEE ao vivo</h2>
<p>OEE calculado depois do turno responde “o que aconteceu”.<br>
OEE ao vivo responde “o que está acontecendo” — e ainda dá tempo de corrigir.</p>
<div class="example-box">
    <p class="example-box-title">Diferença prática</p>
    <table class="cost-table">
        <thead>
            <tr><th>Situação</th><th>OEE só no relatório</th><th>OEE em tempo real</th></tr>
        </thead>
        <tbody>
            <tr><td>Linha parou às 09:42</td><td>Visto no fechamento</td><td>Alerta na hora</td></tr>
            <tr><td>Cadência caiu no meio do turno</td><td>Vira “performance baixa” genérica</td><td>Gestor age no turno</td></tr>
            <tr><td>Refugo sobe em uma máquina</td><td>Diluído na média</td><td>Isolado por equipamento</td></tr>
            <tr><td>Decisão de priorizar ordem</td><td>Baseada em percepção</td><td>Baseada em dado atual</td></tr>
        </tbody>
    </table>
</div>
<p>É por isso que indústrias que dependem de planilha e apontamento manual costumam reagir tarde: o indicador existe, mas chega sem utilidade operacional.</p>`,
            'oee.s7': `<h2>Como a MESTTI ajuda</h2>
<p>A MESTTI conecta sensores e software para transformar o chão de fábrica em informação clara e em tempo real — sem digitação e sem esperar o relatório do dia seguinte.</p>
<p>Na prática, isso significa:</p>
<ul>
    <li><strong>Contagem automática de peças</strong> 24 horas por dia</li>
    <li><strong>Status da máquina ao vivo</strong> (rodando ou parada, com horário e duração)</li>
    <li><strong>Paradas registradas no momento</strong> em que acontecem</li>
    <li><strong>Indicadores de OEE, disponibilidade e performance</strong> no mesmo painel</li>
    <li><strong>Visão por máquina</strong>, não só média da planta</li>
    <li>Apoio a <strong>sequenciamento</strong> e <strong>Gantt da produção</strong> com base no real</li>
</ul>
<p>Quando o OEE deixa de ser um número de planilha e vira um painel ao vivo, a gestão para de “achar” e começa a decidir com o que a máquina realmente fez.</p>
<div class="highlight-box">
    <p>Se a pergunta “quanto sua fábrica produziu hoje?” ainda demora para ter resposta, o problema provavelmente já começou — e o primeiro passo é enxergar a operação enquanto ela acontece.</p>
</div>`,
            'oee.s8': `<h2>Checklist rápido para elevar o OEE</h2>
<ul class="checklist">
    <li>Tempo de ciclo ideal definido por produto/máquina</li>
    <li>Paradas com início, fim e causa (não só total)</li>
    <li>Contagem de peças confiável (preferencialmente automática)</li>
    <li>Separação de refugo/retrabalho por equipamento</li>
    <li>OEE acompanhado durante o turno, não só no fechamento</li>
    <li>Comparativo entre máquinas e turnos</li>
    <li>Ações corretivas no mesmo turno em que a perda aparece</li>
</ul>
<p>Se várias dessas caixas ainda estão abertas, o OEE da planta provavelmente está sendo calculado com atraso — ou com dados incompletos.</p>`,
            'oee.s9': `<h2>Conclusão</h2>
<p>OEE não é um troféu de dashboard. É um mapa de perdas: tempo parado, ritmo abaixo do padrão e qualidade que não saiu de primeira.</p>
<p>Calcular certo já ajuda. <strong>Ver em tempo real muda o jogo</strong>, porque a fábrica ganha janela para agir.</p>
<p>A MESTTI existe para essa janela: monitoramento industrial sem digitação, indicadores ao vivo e gestão baseada no chão de fábrica real — não no relatório atrasado.</p>`,
            'oee.faq.list': `<p>Confira respostas diretas para as dúvidas mais comuns sobre OEE, cálculo e acompanhamento em tempo real.</p>
<details class="faq-item">
    <summary>Qual é um bom OEE?</summary>
    <p>Depende do setor, do processo e da maturidade da planta. Mais importante do que um “número mágico” é ter medição confiável e tendência de melhoria por máquina e por turno.</p>
</details>
<details class="faq-item">
    <summary>OEE substitui PCP?</summary>
    <p>Não. OEE mede eficiência do equipamento. PCP planeja e sequencia a produção. Os dois se reforçam quando o plano conversa com o real.</p>
</details>
<details class="faq-item">
    <summary>Posso calcular OEE só com apontamento manual?</summary>
    <p>Dá para começar, mas o atraso e o erro humano limitam o valor. Quanto mais automático for o dado de peça e parada, mais útil o indicador fica para decisão no turno.</p>
</details>
<details class="faq-item">
    <summary>Por onde começar se minha fábrica ainda não mede nada?</summary>
    <p>Comece por disponibilidade e contagem de peças nas máquinas críticas. Depois feche performance e qualidade. A MESTTI acelera esse caminho com sensoriamento e painéis em tempo real.</p>
</details>
<details class="faq-item">
    <summary>Qual a fórmula do OEE?</summary>
    <p>OEE = Disponibilidade × Performance × Qualidade. Cada fator fica entre 0 e 1 (ou 0% e 100%). Multiplicados, mostram quanto da capacidade teórica se converteu em produção boa.</p>
</details>
<details class="faq-item">
    <summary>Como a MESTTI ajuda no OEE?</summary>
    <p>A MESTTI conecta sensores e software para contagem automática, status de máquina ao vivo, registro de paradas no momento e indicadores de OEE, disponibilidade e performance por equipamento — sem digitar e sem esperar o relatório do dia seguinte.</p>
</details>`,
        },
        en: {
            'oee.intro': `<p>Almost every plant talks about productivity. Few can answer, with reliable numbers, a simple question:</p>
<p><strong>How much of my plant capacity is actually being used right now?</strong></p>
<p>OEE (Overall Equipment Effectiveness) exists exactly for that. It summarizes, in a single KPI, three fronts that usually live scattered across spreadsheets, manual logs and shift “guesswork”: availability, performance and quality.</p>
<p>When OEE is measured late, decisions also arrive late. Downtime passes, bottlenecks repeat and management only sees the damage at closing. When OEE is tracked live, the plant gains reaction time — and reaction time is money.</p>
<p>In this article you will understand what OEE measures, how to calculate it, which mistakes destroy the number, and how MESTTI turns this KPI into real-time shop-floor management.</p>
<p><strong>In this article, you will learn:</strong></p>
<ul class="article-intro-list">
    <li>What OEE is and what the formula actually measures</li>
    <li>The three pillars: availability, performance and quality</li>
    <li>How to calculate OEE step by step</li>
    <li>A practical example with shift numbers</li>
    <li>Common mistakes that invalidate the KPI</li>
    <li>The difference between end-of-day OEE and live OEE</li>
    <li>How MESTTI helps track OEE without typing</li>
</ul>`,
            'oee.s1': `<h2>What is OEE</h2>
<p>OEE is an equipment effectiveness KPI. Instead of looking only at “how many parts came out”, it asks whether the machine was available, whether it ran at the expected pace, and whether what came out was conforming.</p>
<div class="formula-box">
    <p class="formula-box-label">Classic formula</p>
    <p class="formula-box-formula">OEE = Availability × Performance × Quality</p>
    <p class="formula-box-note">Each factor sits between 0 and 1 (or 0% and 100%). Multiplied, they show how much theoretical capacity became good production.</p>
</div>
<p>A quick example:</p>
<div class="example-box">
    <p class="example-box-title">Quick calculation</p>
    <ul>
        <li>Availability: 90%</li>
        <li>Performance: 85%</li>
        <li>Quality: 98%</li>
    </ul>
    <div class="example-calc">
        OEE = 0.90 × 0.85 × 0.98 = <strong>74.97%</strong>
    </div>
</div>
<p>That ~75% is not “bad by itself”. The value matters when you compare machine to machine, shift to shift and plan to actual — and when you can see <strong>where</strong> the number dropped.</p>
<div class="highlight-box">
    <p>Useful OEE is not just a percentage on a dashboard. It is a loss map: downtime, pace below standard, and quality that did not pass first time.</p>
</div>`,
            'oee.s2': `<h2>The three pillars of OEE</h2>
<div class="sigla-grid">
    <div class="sigla-card">
        <abbr title="Availability">Availability</abbr>
        <p>How long the machine was able to produce within planned time.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Performance">Performance</abbr>
        <p>Whether, while running, the machine delivered the expected cadence.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Quality">Quality</abbr>
        <p>How much of what was produced came out good first time.</p>
    </div>
</div>

<h3>1. Availability</h3>
<div class="formula-box">
    <p class="formula-box-label">Formula</p>
    <p class="formula-box-formula">Availability = Operating time ÷ Planned time</p>
</div>
<p>What drives availability down:</p>
<ul>
    <li>Failure downtime</li>
    <li>Long setup and tool changes</li>
    <li>Missing material or operator</li>
    <li>Unplanned corrective maintenance</li>
    <li>Micro-stops nobody records</li>
</ul>
<p>If availability is only closed at shift end, management loses the chance to act when the line stopped.</p>

<h3>2. Performance</h3>
<div class="formula-box">
    <p class="formula-box-label">Formula</p>
    <p class="formula-box-formula">Performance = (Parts produced × Ideal cycle time) ÷ Operating time</p>
</div>
<p>What drives performance down:</p>
<ul>
    <li>Pace below standard</li>
    <li>“Invisible” micro-stops</li>
    <li>Speed reduced for fear of breakdown</li>
    <li>Misadjusted process</li>
    <li>Inaccurate counting (wrong manual logging)</li>
</ul>
<p>Low performance with high availability is a classic signal: the machine is “on”, but not delivering.</p>

<h3>3. Quality</h3>
<div class="formula-box">
    <p class="formula-box-label">Formula</p>
    <p class="formula-box-formula">Quality = Good parts ÷ Total parts produced</p>
</div>
<p>What drives quality down:</p>
<ul>
    <li>Scrap</li>
    <li>Rework</li>
    <li>Startup with high discard</li>
    <li>Process variation</li>
    <li>No tracking by machine/shift</li>
</ul>
<p>Quality in OEE is not only “final inspection”. It is process cost that already happened.</p>`,
            'oee.s3': `<h2>How to calculate OEE in practice (step by step)</h2>
<ol>
    <li><strong>Define planned time</strong> for the shift (subtracting official breaks if that is your policy).</li>
    <li><strong>Record downtime</strong> with start and end timestamps — not only a total at day end.</li>
    <li><strong>Calculate operating time</strong> = planned time − downtime.</li>
    <li><strong>Count parts produced</strong> (good + bad).</li>
    <li><strong>Separate good parts</strong> from defect/rework.</li>
    <li><strong>Use ideal cycle time</strong> (technical standard for part/machine).</li>
    <li><strong>Apply the formula</strong> Availability × Performance × Quality.</li>
</ol>
<div class="warning-box">
    <p>Without reliable data at each step, OEE becomes KPI theater.</p>
</div>`,
            'oee.s4': `<h2>Practical example</h2>
<p>8-hour shift (480 minutes), with 30 minutes of official break → <strong>planned time = 450 min</strong>.</p>
<div class="example-box">
    <p class="example-box-title">Shift data</p>
    <table class="cost-table">
        <tbody>
            <tr><td>Accumulated downtime</td><td>45 min</td></tr>
            <tr><td>Operating time</td><td>405 min</td></tr>
            <tr><td>Ideal cycle time</td><td>0.5 min/part</td></tr>
            <tr><td>Parts produced</td><td>700</td></tr>
            <tr><td>Good parts</td><td>672</td></tr>
        </tbody>
    </table>
    <div class="example-calc">
        Availability = 405 ÷ 450 = <strong>90%</strong><br>
        Theoretical time needed = 700 × 0.5 = 350 min<br>
        Performance = 350 ÷ 405 ≈ <strong>86.4%</strong><br>
        Quality = 672 ÷ 700 = <strong>96%</strong><br><br>
        OEE = 0.90 × 0.864 × 0.96 ≈ <strong>74.6%</strong>
    </div>
</div>
<p>The useful question is not “is 74.6% good?”. It is: <strong>on which pillar and at which time did efficiency drop?</strong> Without downtime timestamps and reliable counts, that answer disappears.</p>`,
            'oee.s5': `<h2>Common mistakes that invalidate OEE</h2>
<ol>
    <li><strong>Logging downtime only at shift end</strong> — start time, cause and machine disappear.</li>
    <li><strong>Mixing idle time with planned time</strong> without a clear rule.</li>
    <li><strong>Using a commercial target instead of ideal cycle time</strong> — OEE stops measuring the equipment.</li>
    <li><strong>Ignoring micro-stops</strong> — performance “looks” low with no explanation.</li>
    <li><strong>Counting parts on paper</strong> — delay and human error destroy the KPI.</li>
    <li><strong>Looking only at plant-average OEE</strong> — averages hide the machine bleeding results.</li>
</ol>
<div class="highlight-box">
    <p>A KPI without reliable data does not govern the plant — it only decorates the report.</p>
</div>`,
            'oee.s6': `<h2>End-of-day average OEE vs live OEE</h2>
<p>OEE calculated after the shift answers “what happened”.<br>
Live OEE answers “what is happening” — and still leaves time to correct.</p>
<div class="example-box">
    <p class="example-box-title">Practical difference</p>
    <table class="cost-table">
        <thead>
            <tr><th>Situation</th><th>OEE only in the report</th><th>Real-time OEE</th></tr>
        </thead>
        <tbody>
            <tr><td>Line stopped at 09:42</td><td>Seen at closing</td><td>Alert immediately</td></tr>
            <tr><td>Cadence dropped mid-shift</td><td>Becomes generic “low performance”</td><td>Manager acts in the shift</td></tr>
            <tr><td>Scrap rises on one machine</td><td>Diluted in the average</td><td>Isolated by equipment</td></tr>
            <tr><td>Order prioritization decision</td><td>Based on perception</td><td>Based on current data</td></tr>
        </tbody>
    </table>
</div>
<p>That is why plants that depend on spreadsheets and manual logging often react late: the KPI exists, but arrives without operational usefulness.</p>`,
            'oee.s7': `<h2>How MESTTI helps</h2>
<p>MESTTI connects sensors and software to turn the shop floor into clear, real-time information — without typing and without waiting for the next-day report.</p>
<p>In practice, that means:</p>
<ul>
    <li><strong>Automatic part counting</strong> 24 hours a day</li>
    <li><strong>Live machine status</strong> (running or stopped, with time and duration)</li>
    <li><strong>Downtime recorded at the moment</strong> it happens</li>
    <li><strong>OEE, availability and performance indicators</strong> on the same panel</li>
    <li><strong>Per-machine view</strong>, not only plant average</li>
    <li>Support for <strong>sequencing</strong> and <strong>production Gantt</strong> based on reality</li>
</ul>
<p>When OEE stops being a spreadsheet number and becomes a live panel, management stops “guessing” and starts deciding from what the machine actually did.</p>
<div class="highlight-box">
    <p>If the question “how much did your plant produce today?” still takes too long to answer, the problem has probably already started — and the first step is to see the operation while it happens.</p>
</div>`,
            'oee.s8': `<h2>Quick checklist to raise OEE</h2>
<ul class="checklist">
    <li>Ideal cycle time defined by product/machine</li>
    <li>Downtime with start, end and cause (not only totals)</li>
    <li>Reliable part counting (preferably automatic)</li>
    <li>Scrap/rework separated by equipment</li>
    <li>OEE tracked during the shift, not only at closing</li>
    <li>Comparison across machines and shifts</li>
    <li>Corrective actions in the same shift where the loss appears</li>
</ul>
<p>If several of these boxes are still open, plant OEE is probably calculated late — or with incomplete data.</p>`,
            'oee.s9': `<h2>Conclusion</h2>
<p>OEE is not a dashboard trophy. It is a loss map: downtime, pace below standard, and quality that did not pass first time.</p>
<p>Calculating it correctly already helps. <strong>Seeing it in real time changes the game</strong>, because the plant gains a window to act.</p>
<p>MESTTI exists for that window: industrial monitoring without typing, live indicators and management based on the real shop floor — not the delayed report.</p>`,
            'oee.faq.list': `<p>Direct answers to the most common questions about OEE, calculation and real-time tracking.</p>
<details class="faq-item">
    <summary>What is a good OEE?</summary>
    <p>It depends on the sector, process and plant maturity. More important than a “magic number” is reliable measurement and an improvement trend by machine and by shift.</p>
</details>
<details class="faq-item">
    <summary>Does OEE replace production planning (PCP)?</summary>
    <p>No. OEE measures equipment effectiveness. PCP plans and sequences production. The two reinforce each other when the plan talks to reality.</p>
</details>
<details class="faq-item">
    <summary>Can I calculate OEE with manual logging only?</summary>
    <p>You can start that way, but delay and human error limit the value. The more automatic part and downtime data are, the more useful the KPI becomes for in-shift decisions.</p>
</details>
<details class="faq-item">
    <summary>Where should I start if my plant measures nothing yet?</summary>
    <p>Start with availability and part counting on critical machines. Then close performance and quality. MESTTI accelerates that path with sensing and real-time panels.</p>
</details>
<details class="faq-item">
    <summary>What is the OEE formula?</summary>
    <p>OEE = Availability × Performance × Quality. Each factor sits between 0 and 1 (or 0% and 100%). Multiplied, they show how much theoretical capacity became good production.</p>
</details>
<details class="faq-item">
    <summary>How does MESTTI help with OEE?</summary>
    <p>MESTTI connects sensors and software for automatic counting, live machine status, downtime recorded as it happens, and OEE, availability and performance indicators per equipment — without typing and without waiting for the next-day report.</p>
</details>`,
        },
        es: {
            'oee.intro': `<p>Casi toda industria habla de productividad. Pocas pueden responder, con números confiables, una pregunta simple:</p>
<p><strong>¿Cuánta capacidad de mi fábrica se está usando realmente ahora?</strong></p>
<p>El OEE (Overall Equipment Effectiveness, o Eficiencia General del Equipo) existe exactamente para eso. Resume, en un solo indicador, tres frentes que suelen quedar dispersas en planillas, apuntamientos y “suposiciones” del turno: disponibilidad, rendimiento y calidad.</p>
<p>Cuando el OEE se mide tarde, la decisión también llega tarde. Las paradas pasan, los cuellos de botella se repiten y la gestión solo ve el daño al cierre. Cuando el OEE se sigue en vivo, la fábrica gana tiempo de reacción — y tiempo de reacción es dinero.</p>
<p>En este artículo entenderá qué mide el OEE, cómo calcularlo, qué errores destruyen el número y cómo MESTTI transforma ese indicador en gestión de planta en tiempo real.</p>
<p><strong>En este artículo, usted va a entender:</strong></p>
<ul class="article-intro-list">
    <li>Qué es el OEE y qué mide realmente la fórmula</li>
    <li>Los tres pilares: disponibilidad, rendimiento y calidad</li>
    <li>Cómo calcular el OEE paso a paso</li>
    <li>Un ejemplo práctico con números de turno</li>
    <li>Errores comunes que invalidan el indicador</li>
    <li>La diferencia entre OEE al fin del día y OEE en vivo</li>
    <li>Cómo MESTTI ayuda a seguir el OEE sin digitar</li>
</ul>`,
            'oee.s1': `<h2>Qué es OEE</h2>
<p>El OEE es un indicador de eficiencia de equipo. En lugar de mirar solo “cuántas piezas salieron”, pregunta si la máquina estuvo disponible, si corrió al ritmo esperado y si lo que salió estaba conforme.</p>
<div class="formula-box">
    <p class="formula-box-label">Fórmula clásica</p>
    <p class="formula-box-formula">OEE = Disponibilidad × Rendimiento × Calidad</p>
    <p class="formula-box-note">Cada factor queda entre 0 y 1 (o 0% y 100%). Multiplicados, muestran cuánta capacidad teórica se convirtió en producción buena.</p>
</div>
<p>Un ejemplo rápido:</p>
<div class="example-box">
    <p class="example-box-title">Cálculo rápido</p>
    <ul>
        <li>Disponibilidad: 90%</li>
        <li>Rendimiento: 85%</li>
        <li>Calidad: 98%</li>
    </ul>
    <div class="example-calc">
        OEE = 0,90 × 0,85 × 0,98 = <strong>74,97%</strong>
    </div>
</div>
<p>Ese ~75% no es “malo por sí solo”. El valor importa cuando usted compara máquina con máquina, turno con turno y plan con real — y cuando puede ver <strong>dónde</strong> cayó el número.</p>
<div class="highlight-box">
    <p>Un OEE útil no es solo un porcentaje en el dashboard. Es un mapa de pérdidas: tiempo parado, ritmo por debajo del estándar y calidad que no salió a la primera.</p>
</div>`,
            'oee.s2': `<h2>Los tres pilares del OEE</h2>
<div class="sigla-grid">
    <div class="sigla-card">
        <abbr title="Disponibilidad">Disponibilidad</abbr>
        <p>Cuánto tiempo la máquina estuvo apta para producir en el período planificado.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Rendimiento">Rendimiento</abbr>
        <p>Si, mientras corría, la máquina entregó la cadencia esperada.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Calidad">Calidad</abbr>
        <p>Cuánto de lo producido salió bueno a la primera.</p>
    </div>
</div>

<h3>1. Disponibilidad</h3>
<div class="formula-box">
    <p class="formula-box-label">Fórmula</p>
    <p class="formula-box-formula">Disponibilidad = Tiempo de operación ÷ Tiempo planificado</p>
</div>
<p>Qué derriba la disponibilidad:</p>
<ul>
    <li>Paradas por falla</li>
    <li>Setup y cambio de herramienta largos</li>
    <li>Falta de material u operador</li>
    <li>Mantenimiento correctivo no programado</li>
    <li>Microparadas que nadie registra</li>
</ul>
<p>Si la disponibilidad solo se cierra al final del turno, la gestión pierde la chance de actuar cuando la línea paró.</p>

<h3>2. Rendimiento (Performance)</h3>
<div class="formula-box">
    <p class="formula-box-label">Fórmula</p>
    <p class="formula-box-formula">Rendimiento = (Piezas producidas × Tiempo de ciclo ideal) ÷ Tiempo de operación</p>
</div>
<p>Qué derriba el rendimiento:</p>
<ul>
    <li>Ritmo por debajo del estándar</li>
    <li>Microparadas “invisibles”</li>
    <li>Velocidad reducida por miedo a rotura</li>
    <li>Proceso desajustado</li>
    <li>Conteo impreciso (apuntamiento manual errado)</li>
</ul>
<p>Rendimiento bajo con disponibilidad alta es una señal clásica: la máquina “está encendida”, pero no está rindiendo.</p>

<h3>3. Calidad</h3>
<div class="formula-box">
    <p class="formula-box-label">Fórmula</p>
    <p class="formula-box-formula">Calidad = Piezas buenas ÷ Piezas totales producidas</p>
</div>
<p>Qué derriba la calidad:</p>
<ul>
    <li>Rechazo / scrap</li>
    <li>Retrabajo</li>
    <li>Arranque con alto descarte</li>
    <li>Variación de proceso</li>
    <li>Falta de rastro por máquina/turno</li>
</ul>
<p>La calidad en el OEE no es solo “control final”. Es costo de proceso que ya ocurrió.</p>`,
            'oee.s3': `<h2>Cómo calcular el OEE en la práctica (paso a paso)</h2>
<ol>
    <li><strong>Defina el tiempo planificado</strong> del turno (descontando pausas oficiales, si es la política de su planta).</li>
    <li><strong>Registre el tiempo parado</strong> con hora de inicio y fin — no solo el total al fin del día.</li>
    <li><strong>Calcule el tiempo de operación</strong> = tiempo planificado − tiempo parado.</li>
    <li><strong>Cuente las piezas producidas</strong> (buenas + malas).</li>
    <li><strong>Separe piezas buenas</strong> de las con defecto/retrabajo.</li>
    <li><strong>Use el tiempo de ciclo ideal</strong> (estándar técnico de la pieza/máquina).</li>
    <li><strong>Aplique la fórmula</strong> Disponibilidad × Rendimiento × Calidad.</li>
</ol>
<div class="warning-box">
    <p>Sin datos confiables en cada etapa, el OEE se vuelve teatro de indicadores.</p>
</div>`,
            'oee.s4': `<h2>Ejemplo práctico</h2>
<p>Turno de 8 horas (480 minutos), con 30 minutos de pausa oficial → <strong>tiempo planificado = 450 min</strong>.</p>
<div class="example-box">
    <p class="example-box-title">Datos del turno</p>
    <table class="cost-table">
        <tbody>
            <tr><td>Paradas acumuladas</td><td>45 min</td></tr>
            <tr><td>Tiempo de operación</td><td>405 min</td></tr>
            <tr><td>Tiempo de ciclo ideal</td><td>0,5 min/pieza</td></tr>
            <tr><td>Piezas producidas</td><td>700</td></tr>
            <tr><td>Piezas buenas</td><td>672</td></tr>
        </tbody>
    </table>
    <div class="example-calc">
        Disponibilidad = 405 ÷ 450 = <strong>90%</strong><br>
        Tiempo teórico necesario = 700 × 0,5 = 350 min<br>
        Rendimiento = 350 ÷ 405 ≈ <strong>86,4%</strong><br>
        Calidad = 672 ÷ 700 = <strong>96%</strong><br><br>
        OEE = 0,90 × 0,864 × 0,96 ≈ <strong>74,6%</strong>
    </div>
</div>
<p>Ahora la pregunta útil no es “¿74,6% es bueno?”. Es: <strong>¿en qué pilar y en qué horario cayó la eficiencia?</strong> Sin timestamp de parada y conteo confiable, esa respuesta desaparece.</p>`,
            'oee.s5': `<h2>Errores comunes que invalidan el OEE</h2>
<ol>
    <li><strong>Apuntar paradas solo al final del turno</strong> — desaparecen la hora, la causa y la máquina.</li>
    <li><strong>Mezclar tiempo ocioso con tiempo planificado</strong> sin regla clara.</li>
    <li><strong>Usar meta comercial en lugar del tiempo de ciclo ideal</strong> — el OEE deja de medir el equipo.</li>
    <li><strong>Ignorar microparadas</strong> — el rendimiento “parece” bajo sin explicación.</li>
    <li><strong>Contar piezas en papel</strong> — el atraso y el error humano destruyen el indicador.</li>
    <li><strong>Mirar solo el OEE promedio de la fábrica</strong> — el promedio esconde la máquina que sangra resultado.</li>
</ol>
<div class="highlight-box">
    <p>Un indicador sin dato confiable no gobierna la fábrica — solo decora el informe.</p>
</div>`,
            'oee.s6': `<h2>OEE promedio al fin del día vs OEE en vivo</h2>
<p>El OEE calculado después del turno responde “qué pasó”.<br>
El OEE en vivo responde “qué está pasando” — y todavía da tiempo de corregir.</p>
<div class="example-box">
    <p class="example-box-title">Diferencia práctica</p>
    <table class="cost-table">
        <thead>
            <tr><th>Situación</th><th>OEE solo en el informe</th><th>OEE en tiempo real</th></tr>
        </thead>
        <tbody>
            <tr><td>La línea paró a las 09:42</td><td>Visto al cierre</td><td>Alerta en el momento</td></tr>
            <tr><td>La cadencia cayó a mitad del turno</td><td>Se vuelve “rendimiento bajo” genérico</td><td>El gestor actúa en el turno</td></tr>
            <tr><td>El rechazo sube en una máquina</td><td>Diluido en el promedio</td><td>Aislado por equipo</td></tr>
            <tr><td>Decisión de priorizar orden</td><td>Basada en percepción</td><td>Basada en dato actual</td></tr>
        </tbody>
    </table>
</div>
<p>Por eso las industrias que dependen de planilla y apuntamiento manual suelen reaccionar tarde: el indicador existe, pero llega sin utilidad operativa.</p>`,
            'oee.s7': `<h2>Cómo ayuda MESTTI</h2>
<p>MESTTI conecta sensores y software para transformar la planta en información clara y en tiempo real — sin digitar y sin esperar el informe del día siguiente.</p>
<p>En la práctica, eso significa:</p>
<ul>
    <li><strong>Conteo automático de piezas</strong> 24 horas al día</li>
    <li><strong>Estado de la máquina en vivo</strong> (corriendo o parada, con hora y duración)</li>
    <li><strong>Paradas registradas en el momento</strong> en que ocurren</li>
    <li><strong>Indicadores de OEE, disponibilidad y rendimiento</strong> en el mismo panel</li>
    <li><strong>Visión por máquina</strong>, no solo promedio de la planta</li>
    <li>Apoyo a <strong>secuenciación</strong> y <strong>Gantt de producción</strong> con base en lo real</li>
</ul>
<p>Cuando el OEE deja de ser un número de planilla y se vuelve un panel en vivo, la gestión deja de “suponer” y empieza a decidir con lo que la máquina realmente hizo.</p>
<div class="highlight-box">
    <p>Si la pregunta “¿cuánto produjo su fábrica hoy?” todavía demora en tener respuesta, el problema probablemente ya empezó — y el primer paso es ver la operación mientras ocurre.</p>
</div>`,
            'oee.s8': `<h2>Checklist rápido para elevar el OEE</h2>
<ul class="checklist">
    <li>Tiempo de ciclo ideal definido por producto/máquina</li>
    <li>Paradas con inicio, fin y causa (no solo total)</li>
    <li>Conteo de piezas confiable (preferentemente automático)</li>
    <li>Separación de rechazo/retrabajo por equipo</li>
    <li>OEE seguido durante el turno, no solo al cierre</li>
    <li>Comparativo entre máquinas y turnos</li>
    <li>Acciones correctivas en el mismo turno en que aparece la pérdida</li>
</ul>
<p>Si varias de estas casillas siguen abiertas, el OEE de la planta probablemente se calcula con atraso — o con datos incompletos.</p>`,
            'oee.s9': `<h2>Conclusión</h2>
<p>El OEE no es un trofeo de dashboard. Es un mapa de pérdidas: tiempo parado, ritmo por debajo del estándar y calidad que no salió a la primera.</p>
<p>Calcularlo bien ya ayuda. <strong>Verlo en tiempo real cambia el juego</strong>, porque la fábrica gana ventana para actuar.</p>
<p>MESTTI existe para esa ventana: monitoreo industrial sin digitar, indicadores en vivo y gestión basada en la planta real — no en el informe atrasado.</p>`,
            'oee.faq.list': `<p>Respuestas directas a las dudas más comunes sobre OEE, cálculo y seguimiento en tiempo real.</p>
<details class="faq-item">
    <summary>¿Cuál es un buen OEE?</summary>
    <p>Depende del sector, del proceso y de la madurez de la planta. Más importante que un “número mágico” es tener medición confiable y tendencia de mejora por máquina y por turno.</p>
</details>
<details class="faq-item">
    <summary>¿El OEE sustituye al PCP?</summary>
    <p>No. El OEE mide la eficiencia del equipo. El PCP planifica y secuencia la producción. Ambos se refuerzan cuando el plan conversa con lo real.</p>
</details>
<details class="faq-item">
    <summary>¿Puedo calcular OEE solo con apuntamiento manual?</summary>
    <p>Se puede empezar, pero el atraso y el error humano limitan el valor. Cuanto más automático sea el dato de pieza y parada, más útil resulta el indicador para decidir en el turno.</p>
</details>
<details class="faq-item">
    <summary>¿Por dónde empezar si mi fábrica aún no mide nada?</summary>
    <p>Empiece por disponibilidad y conteo de piezas en las máquinas críticas. Después cierre rendimiento y calidad. MESTTI acelera ese camino con sensorización y paneles en tiempo real.</p>
</details>
<details class="faq-item">
    <summary>¿Cuál es la fórmula del OEE?</summary>
    <p>OEE = Disponibilidad × Rendimiento × Calidad. Cada factor queda entre 0 y 1 (o 0% y 100%). Multiplicados, muestran cuánta capacidad teórica se convirtió en producción buena.</p>
</details>
<details class="faq-item">
    <summary>¿Cómo ayuda MESTTI en el OEE?</summary>
    <p>MESTTI conecta sensores y software para conteo automático, estado de máquina en vivo, registro de paradas en el momento e indicadores de OEE, disponibilidad y rendimiento por equipo — sin digitar y sin esperar el informe del día siguiente.</p>
</details>`,
        },
    };

    window.MESTTI_PAGE_I18N = window.MESTTI_PAGE_I18N || { pt: {}, en: {}, es: {} };
    for (const lang of ['pt', 'en', 'es']) {
        Object.assign(window.MESTTI_PAGE_I18N[lang], content[lang]);
    }
})();
