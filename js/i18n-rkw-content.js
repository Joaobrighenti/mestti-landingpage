(function () {
    const content = {
        pt: {
            'rkw.intro': `<p>Calcular o preço de venda de um produto na indústria parece simples: você soma a matéria-prima, coloca uma margem e chega em um valor final.</p>
<p>Mas é exatamente aí que muitas empresas erram.</p>
<p>Na prática, o custo de um produto industrial não está apenas nos materiais que entram nele. Existe também o <strong>custo do processo</strong>: tempo de máquina, mão de obra, energia, manutenção, setup, paradas, perdas, aluguel, depreciação, estrutura administrativa e vários outros gastos que precisam ser pagos pela operação.</p>
<p>Quando esses custos não entram corretamente no cálculo, a empresa pode vender achando que está tendo lucro, quando na verdade está apenas cobrindo parte dos gastos — ou pior, produzindo prejuízo.</p>
<p>É por isso que o <strong>método RKW</strong> pode ser uma ferramenta importante para formar preço de venda na indústria.</p>
<p><strong>Neste artigo, você vai entender:</strong></p>
<ul class="article-intro-list">
    <li>O que é o método RKW</li>
    <li>Como funciona a fórmula de preço de venda</li>
    <li>O que entra em matéria-prima, custo RKW, CVV, CVP e lucro</li>
    <li>Como calcular o custo do processo</li>
    <li>Por que o tempo de produção é tão importante</li>
    <li>Um exemplo prático completo</li>
    <li>Os erros mais comuns na formação de preço industrial</li>
    <li>Como a MESTTI ajuda a transformar tempo de fábrica em dado para precificação</li>
</ul>`,
            'rkw.s1': `<h2>O problema de olhar apenas para a matéria-prima</h2>
<p>Imagine que uma empresa fabrica um produto simples. Para facilitar, pense em um hambúrguer.</p>
<p>Você tem os ingredientes:</p>
<ul class="ingredient-list">
    <li>Pão</li>
    <li>Carne</li>
    <li>Queijo</li>
    <li>Alface</li>
    <li>Tomate</li>
    <li>Molho</li>
    <li>Embalagem</li>
</ul>
<p>Se você somar apenas esses itens, terá o custo direto da matéria-prima.</p>
<div class="example-box">
    <p class="example-box-title">Exemplo de custo de matéria-prima</p>
    <table class="cost-table">
        <tbody>
            <tr><td>Pão</td><td>R$ 0,80</td></tr>
            <tr><td>Alface</td><td>R$ 0,20</td></tr>
            <tr><td>Tomate</td><td>R$ 0,25</td></tr>
            <tr><td>Queijo</td><td>R$ 0,85</td></tr>
            <tr><td>Carne</td><td>R$ 2,15</td></tr>
            <tr><th>Total MP</th><th>R$ 4,25</th></tr>
        </tbody>
    </table>
</div>
<p>Muita gente para a conta aqui. Depois, aplica uma margem: <em>"Se o custo é R$ 4,25, vou vender por R$ 8,50 e pronto."</em></p>
<p>Mas essa conta ignora uma pergunta essencial: <strong>quanto custou transformar esses ingredientes em produto pronto?</strong></p>
<p>Porque além dos ingredientes, existiu processo. Alguém preparou. Uma estrutura foi usada. Teve energia, equipamento, tempo, mão de obra, aluguel, limpeza, manutenção, gestão, perda e parada.</p>
<p>Na indústria, isso fica ainda mais crítico. Um produto pode consumir pouca matéria-prima, mas muito tempo de máquina. Outro pode consumir mais material, mas passar rapidamente pela produção. Se os dois receberem o mesmo critério de custo, um deles provavelmente estará com o preço errado.</p>
<div class="highlight-box">
    <p>Preço de venda não é apenas o custo do que entra no produto. É também o custo de tudo que acontece para o produto existir.</p>
</div>`,
            'rkw.s2': `<h2>O que é o método RKW?</h2>
<p>O método RKW é uma forma de custeio que parte da ideia de que o preço de venda de um produto deve ser capaz de cobrir <strong>todos os gastos da operação</strong> da empresa.</p>
<p>Isso significa que o produto precisa absorver não apenas seus custos diretos, como matéria-prima e embalagem, mas também uma parte dos custos indiretos e fixos da empresa.</p>
<p>Na prática, o RKW busca responder: <em>"Quanto da estrutura da minha empresa esse produto consumiu?"</em></p>
<p>Dentro do custo RKW podem entrar:</p>
<ul>
    <li>Mão de obra direta e indireta</li>
    <li>Energia elétrica, aluguel e depreciação de máquinas</li>
    <li>Manutenção, supervisão e custos administrativos</li>
    <li>Custos de qualidade, setup e paradas produtivas</li>
    <li>Custos de setores de apoio e outros custos fixos da operação</li>
</ul>
<p>A lógica é simples: se esses custos existem para a empresa operar, eles precisam ser pagos pelos produtos vendidos.</p>
<p>O grande desafio está em definir um critério justo para distribuir esses custos entre os produtos. E na indústria, um dos critérios mais importantes é o <strong>tempo de processo</strong>.</p>`,
            'rkw.s3': `<h2>A fórmula de preço de venda usando RKW</h2>
<div class="formula-box">
    <p class="formula-box-label">Fórmula principal</p>
    <p class="formula-box-formula">Preço de Venda = (MP + Custo RKW) / ((100 − (CVV + CVP + L)) / 100)</p>
    <p class="formula-box-note">MP = matéria-prima · Custo RKW = custo do processo · CVV = custo variável de venda · CVP = custo variável de produção · L = lucro desejado</p>
</div>
<div class="sigla-grid">
    <div class="sigla-card">
        <abbr title="Matéria-prima">MP</abbr>
        <p>É o custo dos materiais utilizados diretamente na fabricação do produto.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Custo RKW">Custo RKW</abbr>
        <p>É a parcela dos custos fixos, indiretos e produtivos rateados para aquele produto — o custo do processo.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Custo variável de venda">CVV</abbr>
        <p>São custos que acontecem quando a venda ocorre: comissão, imposto sobre venda, taxa de cartão, marketplace, frete comercial etc.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Custo variável de produção">CVP</abbr>
        <p>São custos variáveis ligados à produção: embalagem, insumos auxiliares, perdas variáveis e consumo específico.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Lucro desejado">L</abbr>
        <p>É a margem de lucro desejada sobre o preço de venda.</p>
    </div>
</div>
<p>A parte de cima da fórmula representa o <strong>custo base do produto</strong>: matéria-prima mais custo do processo.</p>
<p>A parte de baixo representa o quanto sobra da venda depois de descontar custos variáveis e lucro desejado.</p>
<p>Por exemplo, se CVV + CVP + L somam 30%, significa que 30% do preço de venda será destinado a esses fatores. Logo, o custo base precisa caber nos 70% restantes — por isso o cálculo divide o custo base por 0,70.</p>`,
            'rkw.s4': `<h2>Exemplo prático: calculando o preço de venda</h2>
<p>Vamos imaginar um produto industrial com os seguintes dados:</p>
<div class="example-box">
    <p class="example-box-title">Dados do produto</p>
    <ul>
        <li>Matéria-prima: R$ 4,25</li>
        <li>Custo RKW: R$ 2,75</li>
        <li>CVV: 10%</li>
        <li>CVP: 5%</li>
        <li>Lucro desejado: 20%</li>
    </ul>
    <div class="example-calc">
        MP + Custo RKW = 4,25 + 2,75 = <strong>R$ 7,00</strong><br>
        CVV + CVP + L = 10% + 5% + 20% = <strong>35%</strong><br><br>
        Preço de Venda = 7,00 / ((100 − 35) / 100)<br>
        Preço de Venda = 7,00 / 0,65<br>
        Preço de Venda = <strong>R$ 10,77</strong>
    </div>
</div>
<p>Portanto, para cobrir matéria-prima, custo do processo, custos variáveis e ainda atingir 20% de lucro desejado, esse produto deveria ser vendido por aproximadamente <strong>R$ 10,77</strong>.</p>
<div class="warning-box">
    <p>Se a empresa vendesse esse produto por R$ 8,50 achando que estava com boa margem, provavelmente estaria deixando de considerar parte do custo real do processo.</p>
</div>`,
            'rkw.s5': `<h2>O ponto mais importante: onde entra o custo do processo?</h2>
<p>O custo do processo é uma das partes mais importantes da formação de preço industrial. Ele representa o custo necessário para transformar matéria-prima em produto acabado.</p>
<p>Na prática, envolve perguntas como:</p>
<ul>
    <li>Quanto tempo esse produto ficou em produção?</li>
    <li>Qual máquina foi utilizada e qual o custo por hora?</li>
    <li>Quantos operadores estavam envolvidos?</li>
    <li>Houve setup, parada ou retrabalho?</li>
    <li>A velocidade real foi igual à velocidade esperada?</li>
    <li>Esse produto ocupou uma máquina crítica da fábrica?</li>
</ul>
<p>Essas perguntas são essenciais porque o <strong>tempo é um dos principais direcionadores de custo</strong> dentro da indústria. Dois produtos podem ter a mesma matéria-prima, mas custos de processo completamente diferentes.</p>
<div class="compare-grid">
    <div class="compare-card">
        <h3>Produto A</h3>
        <ul>
            <li>Matéria-prima: R$ 5,00</li>
            <li>Tempo de máquina: 10 minutos</li>
        </ul>
    </div>
    <div class="compare-card compare-card--bad">
        <h3>Produto B</h3>
        <ul>
            <li>Matéria-prima: R$ 5,00</li>
            <li>Tempo de máquina: 40 minutos</li>
        </ul>
    </div>
</div>
<p>Se a empresa olhar apenas para a matéria-prima, os dois produtos parecem ter o mesmo custo. Mas na prática, o Produto B consumiu <strong>quatro vezes mais tempo de máquina</strong> — mais energia, mão de obra, ocupação da fábrica e custo fixo absorvido.</p>
<p>Por isso, sem medir o tempo real do processo, o custo RKW pode virar apenas um chute organizado.</p>`,
            'rkw.s6': `<h2>Como encontrar o custo hora máquina</h2>
<p>Uma forma prática de calcular o custo do processo é encontrar o custo hora da máquina, setor ou centro produtivo.</p>
<div class="formula-box">
    <p class="formula-box-label">Custo hora</p>
    <p class="formula-box-formula">Custo hora máquina = Custos do setor ÷ Horas disponíveis do setor</p>
</div>
<div class="example-box">
    <p class="example-box-title">Exemplo mensal de um setor</p>
    <table class="cost-table">
        <tbody>
            <tr><td>Mão de obra</td><td>R$ 8.000</td></tr>
            <tr><td>Energia</td><td>R$ 2.000</td></tr>
            <tr><td>Manutenção</td><td>R$ 1.500</td></tr>
            <tr><td>Depreciação</td><td>R$ 2.500</td></tr>
            <tr><td>Aluguel e estrutura rateada</td><td>R$ 3.000</td></tr>
            <tr><td>Outros custos</td><td>R$ 1.000</td></tr>
            <tr><th>Total mensal</th><th>R$ 18.000</th></tr>
        </tbody>
    </table>
    <p>Com 180 horas produtivas disponíveis no mês:</p>
    <div class="example-calc">
        Custo hora = 18.000 ÷ 180 = <strong>R$ 100/hora</strong><br><br>
        Produto com 15 minutos = 0,25 hora<br>
        Custo do processo = 100 × 0,25 = <strong>R$ 25,00</strong>
    </div>
</div>
<div class="formula-box">
    <p class="formula-box-label">Custo do processo</p>
    <p class="formula-box-formula">Custo do processo = Custo hora máquina × Tempo consumido pelo produto</p>
</div>
<div class="highlight-box">
    <p>Quanto mais preciso for o tempo medido, mais preciso será o custo do processo.</p>
</div>`,
            'rkw.s7': `<h2>O perigo de usar tempo estimado no cálculo de custo</h2>
<p>Muitas empresas usam tempos padrões ou estimativas para calcular custo. Isso não está necessariamente errado. O problema é quando o tempo padrão <strong>não representa a realidade da fábrica</strong>.</p>
<p>Exemplo: a ficha técnica diz que o produto deveria levar 10 minutos. Mas na prática, ele leva 18 minutos por causa de paradas frequentes, falta de material, setup demorado, baixa velocidade da máquina, operador aguardando liberação, retrabalho, ajustes manuais, problemas de qualidade ou gargalos no processo.</p>
<p>Se o preço foi calculado considerando 10 minutos, mas a produção real consome 18 minutos, o custo real será muito maior do que o custo usado na precificação. Essa diferença pode destruir a margem do produto.</p>
<p>E o pior: muitas vezes a empresa só percebe isso no caixa, quando o faturamento aumenta, mas o lucro não aparece.</p>
<div class="warning-box">
    <p>Vender mais não resolve um preço mal calculado. Às vezes, vender mais apenas aumenta o prejuízo.</p>
</div>`,
            'rkw.s8': `<h2>Passo a passo para calcular preço de venda com RKW</h2>
<div class="step-grid">
    <div class="step-card">
        <span class="step-card-num">1</span>
        <h3>Levante a matéria-prima</h3>
        <p>Liste todos os materiais diretos: matéria-prima principal, componentes, embalagem, insumos e perdas previstas.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">2</span>
        <h3>Levante os custos fixos e indiretos</h3>
        <p>Inclua mão de obra, energia, aluguel, manutenção, depreciação, supervisão, administração e qualidade.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">3</span>
        <h3>Separe os custos por setor</h3>
        <p>Distribua os custos entre os setores produtivos: corte, impressão, montagem, embalagem, acabamento, expedição.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">4</span>
        <h3>Calcule o custo hora de cada setor</h3>
        <p>Divida os custos do setor pelas horas disponíveis ou horas produtivas daquele setor.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">5</span>
        <h3>Meça o tempo por processo</h3>
        <p>Identifique quanto tempo o produto passa em cada máquina, linha ou setor.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">6</span>
        <h3>Calcule o custo do processo</h3>
        <p>Multiplique o custo hora pelo tempo consumido em cada etapa.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">7</span>
        <h3>Some matéria-prima + custo RKW</h3>
        <p>Essa será a base de custo do produto.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">8</span>
        <h3>Defina CVV, CVP e lucro</h3>
        <p>Determine os percentuais de custo variável de venda, custo variável de produção e lucro desejado.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">9</span>
        <h3>Aplique a fórmula de preço</h3>
        <p>Preço de Venda = (MP + Custo RKW) / ((100 − (CVV + CVP + L)) / 100)</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">10</span>
        <h3>Revise periodicamente</h3>
        <p>Custos mudam. Tempo de produção muda. Eficiência muda. O preço precisa ser revisado com dados atualizados.</p>
    </div>
</div>`,
            'rkw.s9': `<h2>Erros comuns ao calcular preço de venda na indústria</h2>
<ul class="error-list">
    <li class="error-item">
        <h3>Erro 1: Considerar apenas matéria-prima</h3>
        <p>Esse é um dos erros mais comuns. O produto precisa pagar também a estrutura usada para produzi-lo.</p>
    </li>
    <li class="error-item">
        <h3>Erro 2: Ignorar tempo de máquina</h3>
        <p>Tempo é custo. Se o produto ocupa máquina, operador e estrutura, ele precisa absorver esse custo.</p>
    </li>
    <li class="error-item">
        <h3>Erro 3: Usar o mesmo rateio para todos os produtos</h3>
        <p>Produtos diferentes consomem recursos diferentes. Um rateio genérico pode distorcer o custo real.</p>
    </li>
    <li class="error-item">
        <h3>Erro 4: Não atualizar custos fixos</h3>
        <p>Energia, salários, manutenção e aluguel mudam. Se o custo não for atualizado, o preço fica defasado.</p>
    </li>
    <li class="error-item">
        <h3>Erro 5: Confundir margem com lucro real</h3>
        <p>Colocar 30% em cima do custo não significa necessariamente ter 30% de lucro no preço de venda.</p>
    </li>
    <li class="error-item">
        <h3>Erro 6: Não considerar paradas e perdas</h3>
        <p>Paradas, setup e retrabalho impactam diretamente a produtividade e o custo real.</p>
    </li>
    <li class="error-item">
        <h3>Erro 7: Não medir a produção real</h3>
        <p>Sem dados reais, a empresa depende de apontamento manual, estimativa ou percepção.</p>
    </li>
</ul>`,
            'rkw.s10': `<h2>Por que não basta apenas colocar uma margem em cima?</h2>
<p>Muitas empresas usam uma conta simples: <em>Preço = Custo × 2</em> ou <em>Preço = Custo + 30%</em>.</p>
<p>Esse tipo de cálculo pode até funcionar em negócios muito simples, mas na indústria ele pode ser perigoso.</p>
<p>Isso acontece porque a indústria possui uma estrutura mais complexa: máquinas diferentes, setores diferentes, tempos diferentes, produtos com complexidades diferentes, setups diferentes, custos fixos relevantes, gargalos produtivos, variação de eficiência e perdas e retrabalhos.</p>
<p>O método RKW ajuda justamente a trazer mais lógica para essa distribuição de custos. Ele permite entender melhor quanto cada produto precisa absorver da estrutura da empresa.</p>`,
            'rkw.s11': `<h2>Como a MESTTI ajuda no cálculo do custo do processo</h2>
<p>Até aqui, o ponto principal ficou claro: para calcular bem o preço de venda usando RKW, você precisa conhecer o <strong>custo do processo</strong>. E para conhecer o custo do processo, você precisa medir o <strong>tempo real da produção</strong>.</p>
<p>É aqui que a MESTTI entra.</p>
<p>A MESTTI ajuda indústrias a monitorarem a produção em tempo real, coletando dados como:</p>
<ul>
    <li>Tempo produtivo e tempo parado</li>
    <li>Quantidade produzida e velocidade real</li>
    <li>Performance e disponibilidade da máquina</li>
    <li>Paradas de produção e apontamentos</li>
    <li>Eficiência por máquina e por ordem de produção</li>
    <li>Tempo real consumido no processo</li>
</ul>
<p>Com esses dados, a empresa consegue enxergar se o produto realmente está sendo produzido dentro do tempo esperado — comparando tempo planejado × tempo real, velocidade teórica × velocidade real, custo previsto × custo real e produção esperada × produção realizada.</p>
<p>Na prática, a MESTTI transforma o tempo da fábrica em informação para tomada de decisão. E quando o assunto é preço de venda, isso faz diferença — porque um preço calculado com tempo real é muito mais confiável do que um preço calculado com chute.</p>
<div class="highlight-box">
    <p>Sem medir o processo, o RKW pode virar estimativa. Com dados reais, ele vira gestão.</p>
</div>`,
            'rkw.s12': `<h2>Exemplo: quando o tempo real muda o custo do produto</h2>
<p>Imagine que sua empresa calculou o custo de um produto considerando que ele leva 20 minutos para ser produzido.</p>
<div class="compare-grid">
    <div class="compare-card">
        <h3>Custo previsto</h3>
        <ul>
            <li>Custo hora: R$ 120</li>
            <li>Tempo previsto: 20 min (0,33 h)</li>
            <li><strong>Custo do processo: R$ 39,60</strong></li>
        </ul>
    </div>
    <div class="compare-card compare-card--bad">
        <h3>Custo real (MESTTI)</h3>
        <ul>
            <li>Custo hora: R$ 120</li>
            <li>Tempo real: 32 min (0,53 h)</li>
            <li><strong>Custo do processo: R$ 63,60</strong></li>
        </ul>
    </div>
</div>
<p><strong>Diferença de custo: R$ 24,00</strong> por unidade ou lote, dependendo da unidade de cálculo.</p>
<p>Se essa diferença não for considerada, a empresa pode vender com preço baseado em R$ 39,60 de processo, quando na prática está gastando R$ 63,60. Isso muda completamente a margem — e muitas vezes essa diferença só aparece no resultado financeiro da empresa.</p>`,
            'rkw.s13': `<h2>Checklist para saber se seu preço de venda está correto</h2>
<ul class="checklist">
    <li>Você sabe o custo real da matéria-prima?</li>
    <li>Você sabe o custo hora das suas máquinas ou setores?</li>
    <li>Você sabe quanto tempo cada produto consome no processo?</li>
    <li>Você considera setup no custo?</li>
    <li>Você considera paradas?</li>
    <li>Você atualiza seus custos fixos com frequência?</li>
    <li>Você separa custo variável de venda, custo variável de produção e lucro?</li>
    <li>Você compara tempo planejado com tempo real?</li>
    <li>Você sabe quais produtos ocupam mais a fábrica?</li>
    <li>Você sabe quais produtos parecem lucrativos, mas consomem muito processo?</li>
</ul>
<p>Se você respondeu "não" para várias dessas perguntas, seu preço de venda pode estar sendo calculado com base em informações incompletas. E preço baseado em informação incompleta gera margem distorcida.</p>`,
            'rkw.s14': `<h2>Conclusão: preço de venda industrial precisa considerar o processo</h2>
<p>Calcular preço de venda na indústria não é apenas somar matéria-prima e aplicar uma margem. Esse tipo de cálculo pode esconder custos importantes e fazer a empresa vender produtos com margem menor do que imagina.</p>
<p>O método RKW ajuda a construir uma visão mais completa, porque considera que o produto precisa absorver uma parte dos custos totais da operação.</p>
<p>Mas para que o RKW seja realmente útil, é essencial medir corretamente o custo do processo — e o custo do processo depende diretamente do tempo: tempo de máquina, setup, parada, produtivo, retrabalho e tempo consumido por cada ordem.</p>
<p>Quando a indústria mede esse tempo com precisão, ela consegue calcular melhor seus custos, revisar preços, identificar gargalos e tomar decisões mais inteligentes.</p>
<p><strong>No fim, preço de venda não é chute. Preço de venda é gestão.</strong></p>`,
            'rkw.faq.list': `<p>Confira respostas diretas para as dúvidas mais comuns sobre custo RKW, tempo de processo e formação de preço industrial.</p>
<details class="faq-item">
    <summary>O que é RKW?</summary>
    <p>RKW é um método de custeio que busca distribuir todos os custos da operação da empresa para os produtos, incluindo custos diretos, indiretos, fixos e estruturais.</p>
</details>
<details class="faq-item">
    <summary>O que é custo RKW?</summary>
    <p>Custo RKW é a parcela dos custos da empresa que é atribuída a um produto. Na indústria, ele pode incluir mão de obra, energia, manutenção, depreciação, aluguel, custos administrativos e principalmente o custo do processo produtivo.</p>
</details>
<details class="faq-item">
    <summary>Qual é a fórmula de preço de venda com RKW?</summary>
    <p>A fórmula é: Preço de Venda = (MP + Custo RKW) / ((100 − (CVV + CVP + L)) / 100), onde MP é matéria-prima, CVV é custo variável de venda, CVP é custo variável de produção e L é lucro desejado.</p>
</details>
<details class="faq-item">
    <summary>Por que o tempo de produção influencia no preço de venda?</summary>
    <p>Porque o tempo de produção determina quanto da estrutura da empresa foi consumida pelo produto. Quanto mais tempo um produto ocupa máquina, operador e recursos produtivos, maior tende a ser seu custo de processo.</p>
</details>
<details class="faq-item">
    <summary>Qual o erro mais comum ao calcular preço de venda industrial?</summary>
    <p>O erro mais comum é considerar apenas matéria-prima e margem, ignorando custos de processo, tempo de máquina, paradas, setup, mão de obra e custos fixos.</p>
</details>
<details class="faq-item">
    <summary>Como a MESTTI ajuda na formação de preço?</summary>
    <p>A MESTTI mede dados reais da produção, como tempo produtivo, paradas, quantidade produzida, performance e disponibilidade. Com isso, a empresa consegue entender melhor o custo real do processo e melhorar a formação do preço de venda.</p>
</details>`,
        },
        en: {
            'rkw.intro': `<p>Calculating the selling price of a manufacturing product may sound simple: add raw material cost, apply a margin, and reach a final price.</p>
<p>That is exactly where many companies go wrong.</p>
<p>In practice, the cost of an industrial product is not only the material inputs. There is also the <strong>process cost</strong>: machine time, labor, energy, maintenance, setup, downtime, losses, rent, depreciation, administrative structure, and several other expenses that the operation must absorb.</p>
<p>When these costs are not properly included, the company may think it is making a profit while it is only covering part of total expenses — or worse, producing at a loss.</p>
<p>That is why the <strong>RKW method</strong> can be an important framework for industrial price formation.</p>
<p><strong>In this article, you will learn:</strong></p>
<ul class="article-intro-list">
    <li>What the RKW method is</li>
    <li>How the selling-price formula works</li>
    <li>What belongs in raw material, RKW cost, CVV, CVP, and profit</li>
    <li>How to calculate process cost</li>
    <li>Why production time matters so much</li>
    <li>A complete practical example</li>
    <li>The most common mistakes in industrial pricing</li>
    <li>How MESTTI helps turn shop-floor time into pricing data</li>
</ul>`,
            'rkw.s1': `<h2>The problem with looking only at raw material</h2>
<p>Imagine a company producing a simple product. To make it easy, think of a hamburger.</p>
<p>You have the ingredients:</p>
<ul class="ingredient-list">
    <li>Bun</li>
    <li>Meat</li>
    <li>Cheese</li>
    <li>Lettuce</li>
    <li>Tomato</li>
    <li>Sauce</li>
    <li>Packaging</li>
</ul>
<p>If you add only these items, you get direct raw material cost.</p>
<div class="example-box">
    <p class="example-box-title">Raw material cost example</p>
    <table class="cost-table">
        <tbody>
            <tr><td>Bun</td><td>R$ 0,80</td></tr>
            <tr><td>Lettuce</td><td>R$ 0,20</td></tr>
            <tr><td>Tomato</td><td>R$ 0,25</td></tr>
            <tr><td>Cheese</td><td>R$ 0,85</td></tr>
            <tr><td>Meat</td><td>R$ 2,15</td></tr>
            <tr><th>Total RM</th><th>R$ 4,25</th></tr>
        </tbody>
    </table>
</div>
<p>Many teams stop there and apply a margin: <em>"If cost is R$ 4,25, I will sell at R$ 8,50 and done."</em></p>
<p>But this ignores one critical question: <strong>how much did it cost to turn those inputs into a finished product?</strong></p>
<p>Beyond ingredients, there is process. Someone prepared it. Infrastructure was used. There was energy, equipment, time, labor, rent, cleaning, maintenance, management, loss, and downtime.</p>
<p>In manufacturing, this is even more critical. One product may consume little raw material but a lot of machine time. Another may consume more material but move quickly through production. If both receive the same costing rule, one is likely priced wrong.</p>
<div class="highlight-box">
    <p>Selling price is not only the cost of what goes into the product. It is also the cost of everything required for the product to exist.</p>
</div>`,
            'rkw.s2': `<h2>What is the RKW method?</h2>
<p>The RKW method is a costing approach based on the idea that a product's selling price must cover <strong>all operating expenses</strong> of the business.</p>
<p>This means the product should absorb not only direct costs such as raw material and packaging, but also a share of indirect and fixed costs.</p>
<p>In practical terms, RKW asks: <em>"How much of my company's structure did this product consume?"</em></p>
<p>RKW cost may include:</p>
<ul>
    <li>Direct and indirect labor</li>
    <li>Electric power, rent, and machine depreciation</li>
    <li>Maintenance, supervision, and administrative costs</li>
    <li>Quality costs, setup, and production downtime</li>
    <li>Support-area costs and other fixed operational costs</li>
</ul>
<p>The logic is straightforward: if these costs exist for the business to operate, sold products must pay for them.</p>
<p>The main challenge is choosing a fair driver to allocate these costs across products. In manufacturing, one of the most important drivers is <strong>process time</strong>.</p>`,
            'rkw.s3': `<h2>The RKW-based selling price formula</h2>
<div class="formula-box">
    <p class="formula-box-label">Main formula</p>
    <p class="formula-box-formula">Selling Price = (RM + RKW Cost) / ((100 − (CVV + CVP + L)) / 100)</p>
    <p class="formula-box-note">RM = raw material · RKW Cost = process cost · CVV = variable selling cost · CVP = variable production cost · L = target profit</p>
</div>
<div class="sigla-grid">
    <div class="sigla-card">
        <abbr title="Raw material">RM</abbr>
        <p>Cost of materials directly used to manufacture the product.</p>
    </div>
    <div class="sigla-card">
        <abbr title="RKW Cost">RKW Cost</abbr>
        <p>The allocated share of fixed, indirect, and production costs for that product — the process cost.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Variable selling cost">CVV</abbr>
        <p>Costs incurred when a sale happens: sales commissions, taxes on sales, card fees, marketplace fees, commercial freight, and similar items.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Variable production cost">CVP</abbr>
        <p>Variable costs tied to production: packaging, auxiliary inputs, variable losses, and specific consumption items.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Target profit">L</abbr>
        <p>The desired profit margin over the selling price.</p>
    </div>
</div>
<p>The top part of the formula represents the <strong>product base cost</strong>: raw material plus process cost.</p>
<p>The bottom part represents what remains from the selling price after variable costs and target profit.</p>
<p>For example, if CVV + CVP + L equals 30%, then 30% of the selling price is allocated to those factors. The base cost must fit in the remaining 70% — that is why base cost is divided by 0.70.</p>`,
            'rkw.s4': `<h2>Practical example: calculating selling price</h2>
<p>Let's consider an industrial product with the following data:</p>
<div class="example-box">
    <p class="example-box-title">Product data</p>
    <ul>
        <li>Raw material: R$ 4,25</li>
        <li>RKW Cost: R$ 2,75</li>
        <li>CVV: 10%</li>
        <li>CVP: 5%</li>
        <li>Target profit: 20%</li>
    </ul>
    <div class="example-calc">
        RM + RKW Cost = 4,25 + 2,75 = <strong>R$ 7,00</strong><br>
        CVV + CVP + L = 10% + 5% + 20% = <strong>35%</strong><br><br>
        Selling Price = 7,00 / ((100 − 35) / 100)<br>
        Selling Price = 7,00 / 0,65<br>
        Selling Price = <strong>R$ 10,77</strong>
    </div>
</div>
<p>So, to cover raw material, process cost, variable costs, and still achieve a 20% target profit, this product should be sold at approximately <strong>R$ 10,77</strong>.</p>
<div class="warning-box">
    <p>If the company sold this product at R$ 8,50 believing it had a good margin, it would likely be ignoring part of the real process cost.</p>
</div>`,
            'rkw.s5': `<h2>The key point: where does process cost enter?</h2>
<p>Process cost is one of the most important parts of industrial price formation. It represents the cost required to transform raw material into finished product.</p>
<p>In practice, this includes questions such as:</p>
<ul>
    <li>How long was this product in production?</li>
    <li>Which machine was used, and what is its hourly cost?</li>
    <li>How many operators were involved?</li>
    <li>Was there setup, downtime, or rework?</li>
    <li>Was actual speed equal to expected speed?</li>
    <li>Did this product occupy a critical machine?</li>
</ul>
<p>These questions matter because <strong>time is a primary cost driver</strong> in manufacturing. Two products may have the same raw material cost but very different process costs.</p>
<div class="compare-grid">
    <div class="compare-card">
        <h3>Product A</h3>
        <ul>
            <li>Raw material: R$ 5,00</li>
            <li>Machine time: 10 minutes</li>
        </ul>
    </div>
    <div class="compare-card compare-card--bad">
        <h3>Product B</h3>
        <ul>
            <li>Raw material: R$ 5,00</li>
            <li>Machine time: 40 minutes</li>
        </ul>
    </div>
</div>
<p>If the company looks only at raw material, both products appear to have the same cost. In reality, Product B consumed <strong>four times more machine time</strong> — more energy, labor, plant capacity, and absorbed fixed cost.</p>
<p>That is why, without measuring real process time, RKW cost can become only an organized guess.</p>`,
            'rkw.s6': `<h2>How to determine machine-hour cost</h2>
<p>A practical way to calculate process cost is to determine the hourly cost of the machine, area, or production center.</p>
<div class="formula-box">
    <p class="formula-box-label">Hourly cost</p>
    <p class="formula-box-formula">Machine-hour cost = Area costs ÷ Available area hours</p>
</div>
<div class="example-box">
    <p class="example-box-title">Monthly area example</p>
    <table class="cost-table">
        <tbody>
            <tr><td>Labor</td><td>R$ 8.000</td></tr>
            <tr><td>Energy</td><td>R$ 2.000</td></tr>
            <tr><td>Maintenance</td><td>R$ 1.500</td></tr>
            <tr><td>Depreciation</td><td>R$ 2.500</td></tr>
            <tr><td>Allocated rent and overhead</td><td>R$ 3.000</td></tr>
            <tr><td>Other costs</td><td>R$ 1.000</td></tr>
            <tr><th>Monthly total</th><th>R$ 18.000</th></tr>
        </tbody>
    </table>
    <p>With 180 productive hours available in the month:</p>
    <div class="example-calc">
        Hourly cost = 18.000 ÷ 180 = <strong>R$ 100/hour</strong><br><br>
        Product with 15 minutes = 0,25 hour<br>
        Process cost = 100 × 0,25 = <strong>R$ 25,00</strong>
    </div>
</div>
<div class="formula-box">
    <p class="formula-box-label">Process cost</p>
    <p class="formula-box-formula">Process cost = Machine-hour cost × Product time consumption</p>
</div>
<div class="highlight-box">
    <p>The more accurately time is measured, the more accurate process cost becomes.</p>
</div>`,
            'rkw.s7': `<h2>The risk of using estimated time in costing</h2>
<p>Many companies use standard times or estimates to calculate cost. This is not necessarily wrong. The problem is when the standard time <strong>does not represent factory reality</strong>.</p>
<p>Example: the process sheet says the product should take 10 minutes. In practice, it takes 18 minutes due to frequent stops, material shortages, long setup, reduced machine speed, operator waiting time, rework, manual adjustments, quality issues, or process bottlenecks.</p>
<p>If price was calculated with 10 minutes but real production consumes 18 minutes, actual cost will be much higher than the costing basis used in pricing. This gap can destroy product margin.</p>
<p>Worse, many companies only realize it in cash flow, when revenue rises but profit does not appear.</p>
<div class="warning-box">
    <p>Selling more does not fix poorly calculated pricing. Sometimes selling more only increases the loss.</p>
</div>`,
            'rkw.s8': `<h2>Step-by-step to calculate selling price with RKW</h2>
<div class="step-grid">
    <div class="step-card">
        <span class="step-card-num">1</span>
        <h3>Map raw material</h3>
        <p>List all direct materials: main raw material, components, packaging, inputs, and expected losses.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">2</span>
        <h3>Map fixed and indirect costs</h3>
        <p>Include labor, energy, rent, maintenance, depreciation, supervision, administration, and quality.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">3</span>
        <h3>Allocate costs by area</h3>
        <p>Distribute costs across production areas: cutting, printing, assembly, packaging, finishing, shipping.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">4</span>
        <h3>Calculate hourly cost per area</h3>
        <p>Divide area costs by available hours or productive hours for that area.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">5</span>
        <h3>Measure process time</h3>
        <p>Identify how long the product spends in each machine, line, or area.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">6</span>
        <h3>Calculate process cost</h3>
        <p>Multiply hourly cost by time consumed at each step.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">7</span>
        <h3>Add raw material + RKW cost</h3>
        <p>This is your product's base cost.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">8</span>
        <h3>Define CVV, CVP, and profit</h3>
        <p>Set the percentages for variable selling cost, variable production cost, and target profit.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">9</span>
        <h3>Apply the pricing formula</h3>
        <p>Selling Price = (RM + RKW Cost) / ((100 − (CVV + CVP + L)) / 100)</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">10</span>
        <h3>Review periodically</h3>
        <p>Costs change. Production time changes. Efficiency changes. Price must be reviewed with updated data.</p>
    </div>
</div>`,
            'rkw.s9': `<h2>Common mistakes in industrial selling-price calculation</h2>
<ul class="error-list">
    <li class="error-item">
        <h3>Mistake 1: Considering only raw material</h3>
        <p>This is one of the most frequent errors. The product must also pay for the structure used to produce it.</p>
    </li>
    <li class="error-item">
        <h3>Mistake 2: Ignoring machine time</h3>
        <p>Time is cost. If the product uses machine, operator, and plant structure, it must absorb that cost.</p>
    </li>
    <li class="error-item">
        <h3>Mistake 3: Using the same allocation for all products</h3>
        <p>Different products consume different resources. A generic allocation can distort real cost.</p>
    </li>
    <li class="error-item">
        <h3>Mistake 4: Not updating fixed costs</h3>
        <p>Energy, payroll, maintenance, and rent change. If cost is not updated, pricing becomes outdated.</p>
    </li>
    <li class="error-item">
        <h3>Mistake 5: Confusing markup with real profit</h3>
        <p>Adding 30% on top of cost does not necessarily mean achieving 30% profit on selling price.</p>
    </li>
    <li class="error-item">
        <h3>Mistake 6: Not considering downtime and losses</h3>
        <p>Downtime, setup, and rework directly affect productivity and actual cost.</p>
    </li>
    <li class="error-item">
        <h3>Mistake 7: Not measuring actual production</h3>
        <p>Without actual data, the company depends on manual logs, estimates, or perception.</p>
    </li>
</ul>`,
            'rkw.s10': `<h2>Why is adding a margin not enough?</h2>
<p>Many companies use a simple equation: <em>Price = Cost × 2</em> or <em>Price = Cost + 30%</em>.</p>
<p>This may work in very simple businesses, but in manufacturing it can be risky.</p>
<p>That is because manufacturing has a more complex structure: different machines, different areas, different cycle times, products with different complexity, different setups, significant fixed costs, production bottlenecks, efficiency variation, and losses and rework.</p>
<p>The RKW method helps bring logic to this cost allocation. It allows clearer understanding of how much each product should absorb from the company's structure.</p>`,
            'rkw.s11': `<h2>How MESTTI helps calculate process cost</h2>
<p>By now the main point is clear: to price correctly with RKW, you need to know <strong>process cost</strong>. And to know process cost, you must measure <strong>real production time</strong>.</p>
<p>This is where MESTTI comes in.</p>
<p>MESTTI helps manufacturers monitor production in real time, collecting data such as:</p>
<ul>
    <li>Productive time and downtime</li>
    <li>Output quantity and real speed</li>
    <li>Machine performance and availability</li>
    <li>Production stoppages and event logs</li>
    <li>Efficiency by machine and by production order</li>
    <li>Actual time consumed by process</li>
</ul>
<p>With this data, companies can see whether products are truly being produced within expected time — comparing planned time × real time, theoretical speed × real speed, expected cost × actual cost, and planned output × actual output.</p>
<p>In practice, MESTTI turns shop-floor time into decision-ready information. For selling price, this is critical — because pricing based on real time is far more reliable than pricing based on assumptions.</p>
<div class="highlight-box">
    <p>Without process measurement, RKW becomes an estimate. With real data, it becomes management.</p>
</div>`,
            'rkw.s12': `<h2>Example: when real time changes product cost</h2>
<p>Imagine your company calculated product cost assuming it takes 20 minutes to produce.</p>
<div class="compare-grid">
    <div class="compare-card">
        <h3>Estimated cost</h3>
        <ul>
            <li>Hourly cost: R$ 120</li>
            <li>Estimated time: 20 min (0,33 h)</li>
            <li><strong>Process cost: R$ 39,60</strong></li>
        </ul>
    </div>
    <div class="compare-card compare-card--bad">
        <h3>Actual cost (MESTTI)</h3>
        <ul>
            <li>Hourly cost: R$ 120</li>
            <li>Actual time: 32 min (0,53 h)</li>
            <li><strong>Process cost: R$ 63,60</strong></li>
        </ul>
    </div>
</div>
<p><strong>Cost difference: R$ 24,00</strong> per unit or per lot, depending on your costing unit.</p>
<p>If this difference is not considered, the company may sell based on R$ 39,60 process cost while actually spending R$ 63,60. This completely changes margin — and often only appears later in financial performance.</p>`,
            'rkw.s13': `<h2>Checklist to validate your selling price</h2>
<ul class="checklist">
    <li>Do you know the actual raw material cost?</li>
    <li>Do you know machine-hour cost by machine or area?</li>
    <li>Do you know how much process time each product consumes?</li>
    <li>Do you include setup in cost?</li>
    <li>Do you include downtime?</li>
    <li>Do you update fixed costs frequently?</li>
    <li>Do you separate variable selling cost, variable production cost, and profit?</li>
    <li>Do you compare planned time versus actual time?</li>
    <li>Do you know which products occupy more factory capacity?</li>
    <li>Do you know which products seem profitable but consume too much process time?</li>
</ul>
<p>If you answered "no" to several questions, your selling price may be based on incomplete information. And incomplete information leads to distorted margin.</p>`,
            'rkw.s14': `<h2>Conclusion: industrial selling price must include process</h2>
<p>Calculating selling price in manufacturing is not only adding raw material and applying a margin. That approach can hide relevant costs and make the company sell with lower margin than expected.</p>
<p>The RKW method supports a more complete view because it recognizes that each product must absorb part of total operating costs.</p>
<p>But for RKW to be truly effective, process cost must be measured correctly — and process cost directly depends on time: machine time, setup, downtime, productive time, rework, and time consumed by each order.</p>
<p>When manufacturers measure this time accurately, they can calculate costs better, revise prices, identify bottlenecks, and make smarter decisions.</p>
<p><strong>In the end, selling price is not guesswork. Selling price is management.</strong></p>`,
            'rkw.faq.list': `<p>Here are direct answers to the most common questions about RKW cost, process time, and industrial pricing.</p>
<details class="faq-item">
    <summary>What is RKW?</summary>
    <p>RKW is a costing method that allocates all operating costs of the company to products, including direct, indirect, fixed, and structural costs.</p>
</details>
<details class="faq-item">
    <summary>What is RKW cost?</summary>
    <p>RKW cost is the share of company costs assigned to a product. In manufacturing, it may include labor, energy, maintenance, depreciation, rent, administrative costs, and especially process cost.</p>
</details>
<details class="faq-item">
    <summary>What is the RKW selling-price formula?</summary>
    <p>The formula is: Selling Price = (RM + RKW Cost) / ((100 − (CVV + CVP + L)) / 100), where RM is raw material, CVV is variable selling cost, CVP is variable production cost, and L is target profit.</p>
</details>
<details class="faq-item">
    <summary>Why does production time affect selling price?</summary>
    <p>Because production time defines how much of the company's structure was consumed by the product. The longer a product occupies machines, operators, and production resources, the higher its process cost tends to be.</p>
</details>
<details class="faq-item">
    <summary>What is the most common mistake in industrial pricing?</summary>
    <p>The most common mistake is considering only raw material and margin while ignoring process cost, machine time, downtime, setup, labor, and fixed costs.</p>
</details>
<details class="faq-item">
    <summary>How does MESTTI support price formation?</summary>
    <p>MESTTI measures real production data such as productive time, downtime, output, performance, and availability. This helps companies understand true process cost and improve selling-price formation.</p>
</details>`,
        },
        es: {
            'rkw.intro': `<p>Calcular el precio de venta de un producto industrial puede parecer simple: se suma la materia prima, se aplica un margen y se obtiene un valor final.</p>
<p>Justamente ahí es donde muchas empresas se equivocan.</p>
<p>En la práctica, el costo de un producto industrial no está solo en los materiales que lo componen. También existe el <strong>costo del proceso</strong>: tiempo de máquina, mano de obra, energía, mantenimiento, setup, paradas, pérdidas, alquiler, depreciación, estructura administrativa y varios otros gastos que la operación debe cubrir.</p>
<p>Cuando esos costos no se incorporan correctamente, la empresa puede creer que gana dinero cuando en realidad solo cubre una parte de sus gastos — o peor, produce con pérdida.</p>
<p>Por eso el <strong>método RKW</strong> puede ser una herramienta clave para formar precios de venta en la industria.</p>
<p><strong>En este artículo, vas a entender:</strong></p>
<ul class="article-intro-list">
    <li>Qué es el método RKW</li>
    <li>Cómo funciona la fórmula de precio de venta</li>
    <li>Qué incluye materia prima, costo RKW, CVV, CVP y utilidad</li>
    <li>Cómo calcular el costo del proceso</li>
    <li>Por qué el tiempo de producción es tan importante</li>
    <li>Un ejemplo práctico completo</li>
    <li>Los errores más comunes en la fijación de precio industrial</li>
    <li>Cómo MESTTI ayuda a transformar tiempo de planta en datos para precios</li>
</ul>`,
            'rkw.s1': `<h2>El problema de mirar solo la materia prima</h2>
<p>Imagina una empresa que fabrica un producto simple. Para facilitar, pensemos en una hamburguesa.</p>
<p>Tienes los ingredientes:</p>
<ul class="ingredient-list">
    <li>Pan</li>
    <li>Carne</li>
    <li>Queso</li>
    <li>Lechuga</li>
    <li>Tomate</li>
    <li>Salsa</li>
    <li>Empaque</li>
</ul>
<p>Si sumas solo esos ítems, obtienes el costo directo de materia prima.</p>
<div class="example-box">
    <p class="example-box-title">Ejemplo de costo de materia prima</p>
    <table class="cost-table">
        <tbody>
            <tr><td>Pan</td><td>R$ 0,80</td></tr>
            <tr><td>Lechuga</td><td>R$ 0,20</td></tr>
            <tr><td>Tomate</td><td>R$ 0,25</td></tr>
            <tr><td>Queso</td><td>R$ 0,85</td></tr>
            <tr><td>Carne</td><td>R$ 2,15</td></tr>
            <tr><th>Total MP</th><th>R$ 4,25</th></tr>
        </tbody>
    </table>
</div>
<p>Muchas empresas se quedan ahí y luego aplican un margen: <em>"Si el costo es R$ 4,25, voy a vender en R$ 8,50 y listo."</em></p>
<p>Pero este cálculo ignora una pregunta esencial: <strong>¿cuánto costó transformar esos ingredientes en un producto terminado?</strong></p>
<p>Además de los ingredientes, hubo proceso. Alguien preparó. Se usó infraestructura. Hubo energía, equipos, tiempo, mano de obra, alquiler, limpieza, mantenimiento, gestión, pérdidas y paradas.</p>
<p>En la industria esto es aún más crítico. Un producto puede consumir poca materia prima pero mucho tiempo de máquina. Otro puede consumir más material, pero pasar rápidamente por producción. Si ambos reciben el mismo criterio de costo, probablemente uno quedará mal precificado.</p>
<div class="highlight-box">
    <p>El precio de venta no es solo el costo de lo que entra en el producto. También es el costo de todo lo que ocurre para que ese producto exista.</p>
</div>`,
            'rkw.s2': `<h2>¿Qué es el método RKW?</h2>
<p>El método RKW es un enfoque de costeo que parte de la idea de que el precio de venta de un producto debe cubrir <strong>todos los gastos operativos</strong> de la empresa.</p>
<p>Eso significa que el producto debe absorber no solo costos directos, como materia prima y empaque, sino también una parte de los costos indirectos y fijos.</p>
<p>En la práctica, RKW busca responder: <em>"¿Cuánta estructura de mi empresa consumió este producto?"</em></p>
<p>Dentro del costo RKW pueden incluirse:</p>
<ul>
    <li>Mano de obra directa e indirecta</li>
    <li>Energía eléctrica, alquiler y depreciación de máquinas</li>
    <li>Mantenimiento, supervisión y costos administrativos</li>
    <li>Costos de calidad, setup y paradas productivas</li>
    <li>Costos de áreas de soporte y otros costos fijos operativos</li>
</ul>
<p>La lógica es simple: si esos costos existen para que la empresa opere, los productos vendidos deben pagarlos.</p>
<p>El mayor desafío está en definir un criterio justo para distribuir esos costos entre productos. En la industria, uno de los criterios más importantes es el <strong>tiempo de proceso</strong>.</p>`,
            'rkw.s3': `<h2>La fórmula de precio de venta con RKW</h2>
<div class="formula-box">
    <p class="formula-box-label">Fórmula principal</p>
    <p class="formula-box-formula">Precio de Venta = (MP + Costo RKW) / ((100 − (CVV + CVP + L)) / 100)</p>
    <p class="formula-box-note">MP = materia prima · Costo RKW = costo del proceso · CVV = costo variable de venta · CVP = costo variable de producción · L = utilidad deseada</p>
</div>
<div class="sigla-grid">
    <div class="sigla-card">
        <abbr title="Materia prima">MP</abbr>
        <p>Es el costo de los materiales utilizados directamente en la fabricación del producto.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Costo RKW">Costo RKW</abbr>
        <p>Es la porción de costos fijos, indirectos y productivos asignada a ese producto — el costo del proceso.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Costo variable de venta">CVV</abbr>
        <p>Son costos que ocurren cuando se concreta la venta: comisión, impuesto sobre venta, tasa de tarjeta, marketplace, flete comercial, etc.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Costo variable de producción">CVP</abbr>
        <p>Son costos variables ligados a la producción: empaque, insumos auxiliares, pérdidas variables y consumo específico.</p>
    </div>
    <div class="sigla-card">
        <abbr title="Utilidad deseada">L</abbr>
        <p>Es el margen de utilidad deseado sobre el precio de venta.</p>
    </div>
</div>
<p>La parte superior de la fórmula representa el <strong>costo base del producto</strong>: materia prima más costo del proceso.</p>
<p>La parte inferior representa cuánto queda de la venta después de descontar costos variables y utilidad deseada.</p>
<p>Por ejemplo, si CVV + CVP + L suman 30%, eso significa que 30% del precio de venta se destina a esos factores. Entonces el costo base debe caber en el 70% restante — por eso el cálculo divide el costo base por 0,70.</p>`,
            'rkw.s4': `<h2>Ejemplo práctico: cálculo del precio de venta</h2>
<p>Imaginemos un producto industrial con los siguientes datos:</p>
<div class="example-box">
    <p class="example-box-title">Datos del producto</p>
    <ul>
        <li>Materia prima: R$ 4,25</li>
        <li>Costo RKW: R$ 2,75</li>
        <li>CVV: 10%</li>
        <li>CVP: 5%</li>
        <li>Utilidad deseada: 20%</li>
    </ul>
    <div class="example-calc">
        MP + Costo RKW = 4,25 + 2,75 = <strong>R$ 7,00</strong><br>
        CVV + CVP + L = 10% + 5% + 20% = <strong>35%</strong><br><br>
        Precio de Venta = 7,00 / ((100 − 35) / 100)<br>
        Precio de Venta = 7,00 / 0,65<br>
        Precio de Venta = <strong>R$ 10,77</strong>
    </div>
</div>
<p>Por lo tanto, para cubrir materia prima, costo del proceso, costos variables y aun así alcanzar 20% de utilidad deseada, este producto debería venderse por aproximadamente <strong>R$ 10,77</strong>.</p>
<div class="warning-box">
    <p>Si la empresa vendiera este producto a R$ 8,50 creyendo que tiene buen margen, probablemente estaría dejando fuera parte del costo real del proceso.</p>
</div>`,
            'rkw.s5': `<h2>El punto más importante: ¿dónde entra el costo del proceso?</h2>
<p>El costo del proceso es una de las partes más importantes de la formación de precio industrial. Representa el costo necesario para transformar materia prima en producto terminado.</p>
<p>En la práctica, esto incluye preguntas como:</p>
<ul>
    <li>¿Cuánto tiempo estuvo este producto en producción?</li>
    <li>¿Qué máquina se utilizó y cuál es su costo por hora?</li>
    <li>¿Cuántos operadores estuvieron involucrados?</li>
    <li>¿Hubo setup, parada o retrabajo?</li>
    <li>¿La velocidad real fue igual a la esperada?</li>
    <li>¿Este producto ocupó una máquina crítica de la planta?</li>
</ul>
<p>Estas preguntas son esenciales porque el <strong>tiempo es uno de los principales inductores de costo</strong> en la industria. Dos productos pueden tener la misma materia prima, pero costos de proceso completamente distintos.</p>
<div class="compare-grid">
    <div class="compare-card">
        <h3>Producto A</h3>
        <ul>
            <li>Materia prima: R$ 5,00</li>
            <li>Tiempo de máquina: 10 minutos</li>
        </ul>
    </div>
    <div class="compare-card compare-card--bad">
        <h3>Producto B</h3>
        <ul>
            <li>Materia prima: R$ 5,00</li>
            <li>Tiempo de máquina: 40 minutos</li>
        </ul>
    </div>
</div>
<p>Si la empresa mira solo la materia prima, ambos productos parecen tener el mismo costo. Pero en la práctica, el Producto B consumió <strong>cuatro veces más tiempo de máquina</strong> — más energía, mano de obra, ocupación de planta y costo fijo absorbido.</p>
<p>Por eso, sin medir el tiempo real del proceso, el costo RKW puede convertirse en una estimación organizada.</p>`,
            'rkw.s6': `<h2>Cómo encontrar el costo hora máquina</h2>
<p>Una forma práctica de calcular el costo del proceso es obtener el costo hora de la máquina, área o centro productivo.</p>
<div class="formula-box">
    <p class="formula-box-label">Costo hora</p>
    <p class="formula-box-formula">Costo hora máquina = Costos del área ÷ Horas disponibles del área</p>
</div>
<div class="example-box">
    <p class="example-box-title">Ejemplo mensual de un área</p>
    <table class="cost-table">
        <tbody>
            <tr><td>Mano de obra</td><td>R$ 8.000</td></tr>
            <tr><td>Energía</td><td>R$ 2.000</td></tr>
            <tr><td>Mantenimiento</td><td>R$ 1.500</td></tr>
            <tr><td>Depreciación</td><td>R$ 2.500</td></tr>
            <tr><td>Alquiler y estructura prorrateada</td><td>R$ 3.000</td></tr>
            <tr><td>Otros costos</td><td>R$ 1.000</td></tr>
            <tr><th>Total mensual</th><th>R$ 18.000</th></tr>
        </tbody>
    </table>
    <p>Con 180 horas productivas disponibles en el mes:</p>
    <div class="example-calc">
        Costo hora = 18.000 ÷ 180 = <strong>R$ 100/hora</strong><br><br>
        Producto con 15 minutos = 0,25 hora<br>
        Costo del proceso = 100 × 0,25 = <strong>R$ 25,00</strong>
    </div>
</div>
<div class="formula-box">
    <p class="formula-box-label">Costo del proceso</p>
    <p class="formula-box-formula">Costo del proceso = Costo hora máquina × Tiempo consumido por el producto</p>
</div>
<div class="highlight-box">
    <p>Cuanto más preciso sea el tiempo medido, más preciso será el costo del proceso.</p>
</div>`,
            'rkw.s7': `<h2>El riesgo de usar tiempo estimado en el cálculo de costo</h2>
<p>Muchas empresas usan tiempos estándar o estimaciones para calcular costos. Eso no necesariamente está mal. El problema aparece cuando el tiempo estándar <strong>no representa la realidad de la planta</strong>.</p>
<p>Ejemplo: la hoja técnica dice que el producto debería tardar 10 minutos. Pero en la práctica tarda 18 minutos por paradas frecuentes, falta de material, setup demorado, baja velocidad de máquina, espera de operador, retrabajo, ajustes manuales, problemas de calidad o cuellos de botella.</p>
<p>Si el precio se calculó con 10 minutos, pero la producción real consume 18 minutos, el costo real será mucho mayor que el costo usado para fijar precio. Esa diferencia puede destruir el margen del producto.</p>
<p>Y lo peor: muchas veces la empresa solo lo percibe en caja, cuando la facturación sube pero la utilidad no aparece.</p>
<div class="warning-box">
    <p>Vender más no corrige un precio mal calculado. A veces, vender más solo aumenta la pérdida.</p>
</div>`,
            'rkw.s8': `<h2>Paso a paso para calcular precio de venta con RKW</h2>
<div class="step-grid">
    <div class="step-card">
        <span class="step-card-num">1</span>
        <h3>Levantar la materia prima</h3>
        <p>Lista todos los materiales directos: materia prima principal, componentes, empaque, insumos y pérdidas previstas.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">2</span>
        <h3>Levantar costos fijos e indirectos</h3>
        <p>Incluye mano de obra, energía, alquiler, mantenimiento, depreciación, supervisión, administración y calidad.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">3</span>
        <h3>Separar costos por área</h3>
        <p>Distribuye costos entre áreas productivas: corte, impresión, montaje, empaque, acabado, despacho.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">4</span>
        <h3>Calcular costo hora por área</h3>
        <p>Divide los costos del área por las horas disponibles o horas productivas de esa área.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">5</span>
        <h3>Medir tiempo por proceso</h3>
        <p>Identifica cuánto tiempo pasa el producto en cada máquina, línea o área.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">6</span>
        <h3>Calcular costo del proceso</h3>
        <p>Multiplica el costo hora por el tiempo consumido en cada etapa.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">7</span>
        <h3>Sumar materia prima + costo RKW</h3>
        <p>Esta será la base de costo del producto.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">8</span>
        <h3>Definir CVV, CVP y utilidad</h3>
        <p>Define porcentajes de costo variable de venta, costo variable de producción y utilidad deseada.</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">9</span>
        <h3>Aplicar la fórmula de precio</h3>
        <p>Precio de Venta = (MP + Costo RKW) / ((100 − (CVV + CVP + L)) / 100)</p>
    </div>
    <div class="step-card">
        <span class="step-card-num">10</span>
        <h3>Revisar periódicamente</h3>
        <p>Los costos cambian. El tiempo de producción cambia. La eficiencia cambia. El precio debe revisarse con datos actualizados.</p>
    </div>
</div>`,
            'rkw.s9': `<h2>Errores comunes al calcular precio de venta industrial</h2>
<ul class="error-list">
    <li class="error-item">
        <h3>Error 1: Considerar solo materia prima</h3>
        <p>Es uno de los errores más comunes. El producto también debe pagar la estructura usada para producirlo.</p>
    </li>
    <li class="error-item">
        <h3>Error 2: Ignorar tiempo de máquina</h3>
        <p>El tiempo es costo. Si el producto ocupa máquina, operador y estructura, debe absorber ese costo.</p>
    </li>
    <li class="error-item">
        <h3>Error 3: Usar el mismo prorrateo para todos los productos</h3>
        <p>Productos distintos consumen recursos distintos. Un prorrateo genérico puede distorsionar el costo real.</p>
    </li>
    <li class="error-item">
        <h3>Error 4: No actualizar costos fijos</h3>
        <p>Energía, salarios, mantenimiento y alquiler cambian. Si el costo no se actualiza, el precio queda desfasado.</p>
    </li>
    <li class="error-item">
        <h3>Error 5: Confundir margen con utilidad real</h3>
        <p>Agregar 30% sobre el costo no significa necesariamente obtener 30% de utilidad sobre el precio de venta.</p>
    </li>
    <li class="error-item">
        <h3>Error 6: No considerar paradas y pérdidas</h3>
        <p>Paradas, setup y retrabajo impactan directamente la productividad y el costo real.</p>
    </li>
    <li class="error-item">
        <h3>Error 7: No medir la producción real</h3>
        <p>Sin datos reales, la empresa depende de apuntes manuales, estimaciones o percepción.</p>
    </li>
</ul>`,
            'rkw.s10': `<h2>¿Por qué no basta con agregar un margen?</h2>
<p>Muchas empresas usan una cuenta simple: <em>Precio = Costo × 2</em> o <em>Precio = Costo + 30%</em>.</p>
<p>Este tipo de cálculo puede funcionar en negocios muy simples, pero en la industria puede ser riesgoso.</p>
<p>Esto ocurre porque la industria tiene una estructura más compleja: máquinas distintas, áreas distintas, tiempos distintos, productos con complejidades diferentes, setups distintos, costos fijos relevantes, cuellos de botella, variación de eficiencia y pérdidas y retrabajos.</p>
<p>El método RKW ayuda justamente a traer más lógica a esta distribución de costos. Permite entender mejor cuánto debe absorber cada producto de la estructura de la empresa.</p>`,
            'rkw.s11': `<h2>Cómo MESTTI ayuda en el cálculo del costo del proceso</h2>
<p>Hasta aquí, el punto principal es claro: para calcular bien el precio de venta con RKW, necesitas conocer el <strong>costo del proceso</strong>. Y para conocerlo, necesitas medir el <strong>tiempo real de producción</strong>.</p>
<p>Aquí es donde entra MESTTI.</p>
<p>MESTTI ayuda a industrias a monitorear producción en tiempo real, recopilando datos como:</p>
<ul>
    <li>Tiempo productivo y tiempo detenido</li>
    <li>Cantidad producida y velocidad real</li>
    <li>Rendimiento y disponibilidad de máquina</li>
    <li>Paradas de producción y registros</li>
    <li>Eficiencia por máquina y por orden de producción</li>
    <li>Tiempo real consumido en el proceso</li>
</ul>
<p>Con estos datos, la empresa puede ver si el producto realmente se fabrica dentro del tiempo esperado — comparando tiempo planificado × tiempo real, velocidad teórica × velocidad real, costo previsto × costo real y producción esperada × producción real.</p>
<p>En la práctica, MESTTI transforma tiempo de planta en información para tomar decisiones. Y en precio de venta, eso marca diferencia — porque un precio calculado con tiempo real es mucho más confiable que uno calculado por estimación.</p>
<div class="highlight-box">
    <p>Sin medir el proceso, RKW se vuelve estimación. Con datos reales, se vuelve gestión.</p>
</div>`,
            'rkw.s12': `<h2>Ejemplo: cuando el tiempo real cambia el costo del producto</h2>
<p>Imagina que tu empresa calculó el costo de un producto considerando que tarda 20 minutos en producirse.</p>
<div class="compare-grid">
    <div class="compare-card">
        <h3>Costo previsto</h3>
        <ul>
            <li>Costo hora: R$ 120</li>
            <li>Tiempo previsto: 20 min (0,33 h)</li>
            <li><strong>Costo del proceso: R$ 39,60</strong></li>
        </ul>
    </div>
    <div class="compare-card compare-card--bad">
        <h3>Costo real (MESTTI)</h3>
        <ul>
            <li>Costo hora: R$ 120</li>
            <li>Tiempo real: 32 min (0,53 h)</li>
            <li><strong>Costo del proceso: R$ 63,60</strong></li>
        </ul>
    </div>
</div>
<p><strong>Diferencia de costo: R$ 24,00</strong> por unidad o lote, según la unidad de cálculo.</p>
<p>Si esa diferencia no se considera, la empresa puede vender con precio basado en R$ 39,60 de proceso cuando en la práctica gasta R$ 63,60. Esto cambia completamente el margen — y muchas veces aparece solo después en el resultado financiero.</p>`,
            'rkw.s13': `<h2>Checklist para validar si tu precio de venta es correcto</h2>
<ul class="checklist">
    <li>¿Conoces el costo real de la materia prima?</li>
    <li>¿Conoces el costo hora de tus máquinas o áreas?</li>
    <li>¿Conoces cuánto tiempo consume cada producto en el proceso?</li>
    <li>¿Consideras setup en el costo?</li>
    <li>¿Consideras paradas?</li>
    <li>¿Actualizas tus costos fijos con frecuencia?</li>
    <li>¿Separas costo variable de venta, costo variable de producción y utilidad?</li>
    <li>¿Comparas tiempo planificado con tiempo real?</li>
    <li>¿Sabes qué productos ocupan más capacidad de planta?</li>
    <li>¿Sabes qué productos parecen rentables pero consumen demasiado proceso?</li>
</ul>
<p>Si respondiste "no" a varias de estas preguntas, tu precio de venta puede estar basado en información incompleta. Y un precio basado en información incompleta genera márgenes distorsionados.</p>`,
            'rkw.s14': `<h2>Conclusión: el precio de venta industrial debe considerar el proceso</h2>
<p>Calcular precio de venta en la industria no es solo sumar materia prima y aplicar un margen. Ese cálculo puede ocultar costos importantes y hacer que la empresa venda con menor margen del que imagina.</p>
<p>El método RKW ayuda a construir una visión más completa, porque considera que el producto debe absorber una parte de los costos totales de operación.</p>
<p>Pero para que RKW sea realmente útil, es esencial medir bien el costo del proceso — y el costo del proceso depende directamente del tiempo: tiempo de máquina, setup, parada, productivo, retrabajo y tiempo consumido por cada orden.</p>
<p>Cuando la industria mide ese tiempo con precisión, puede calcular mejor sus costos, revisar precios, identificar cuellos de botella y tomar decisiones más inteligentes.</p>
<p><strong>Al final, el precio de venta no es improvisación. El precio de venta es gestión.</strong></p>`,
            'rkw.faq.list': `<p>Aquí tienes respuestas directas a las dudas más comunes sobre costo RKW, tiempo de proceso y formación de precios industriales.</p>
<details class="faq-item">
    <summary>¿Qué es RKW?</summary>
    <p>RKW es un método de costeo que busca distribuir todos los costos de operación de la empresa a los productos, incluyendo costos directos, indirectos, fijos y estructurales.</p>
</details>
<details class="faq-item">
    <summary>¿Qué es costo RKW?</summary>
    <p>El costo RKW es la parte de los costos de la empresa asignada a un producto. En la industria puede incluir mano de obra, energía, mantenimiento, depreciación, alquiler, costos administrativos y principalmente costo del proceso productivo.</p>
</details>
<details class="faq-item">
    <summary>¿Cuál es la fórmula de precio de venta con RKW?</summary>
    <p>La fórmula es: Precio de Venta = (MP + Costo RKW) / ((100 − (CVV + CVP + L)) / 100), donde MP es materia prima, CVV es costo variable de venta, CVP es costo variable de producción y L es utilidad deseada.</p>
</details>
<details class="faq-item">
    <summary>¿Por qué el tiempo de producción influye en el precio de venta?</summary>
    <p>Porque el tiempo de producción determina cuánta estructura de la empresa fue consumida por el producto. Cuanto más tiempo ocupa máquinas, operadores y recursos productivos, mayor tiende a ser su costo de proceso.</p>
</details>
<details class="faq-item">
    <summary>¿Cuál es el error más común al calcular precio de venta industrial?</summary>
    <p>El error más común es considerar solo materia prima y margen, ignorando costo de proceso, tiempo de máquina, paradas, setup, mano de obra y costos fijos.</p>
</details>
<details class="faq-item">
    <summary>¿Cómo ayuda MESTTI en la formación de precios?</summary>
    <p>MESTTI mide datos reales de producción, como tiempo productivo, paradas, cantidad producida, rendimiento y disponibilidad. Con eso, la empresa entiende mejor el costo real del proceso y mejora la formación del precio de venta.</p>
</details>`,
        },
    };

    window.MESTTI_PAGE_I18N = window.MESTTI_PAGE_I18N || { pt: {}, en: {}, es: {} };
    for (const lang of ['pt', 'en', 'es']) {
        Object.assign(window.MESTTI_PAGE_I18N[lang], content[lang]);
    }
})();
