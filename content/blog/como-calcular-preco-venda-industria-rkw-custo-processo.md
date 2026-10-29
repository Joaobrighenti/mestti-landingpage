---
title: Como calcular o preço de venda de um produto na indústria usando RKW e custo do processo
seo_title: Como calcular preço de venda na indústria com RKW e custo do processo | MESTTI
description: Aprenda como calcular o preço de venda de um produto industrial usando o método RKW, considerando matéria-prima, custos fixos, custo do processo, tempo de máquina, custos variáveis e lucro desejado.
answer: No método RKW, o preço de venda soma todos os custos do produto (matéria-prima, custos variáveis e uma parte dos custos fixos, rateada pelo tempo de máquina de cada processo) e aplica a margem de lucro desejada. O ponto crítico é conhecer o tempo real de cada processo.
date: 2026-06-08
updated: 2026-06-08
topic: custos
cta: Medir o tempo real dos meus processos
related:
  - /engenharia/
  - /oee/
  - /apontamento-de-producao/
faq:
  - q: O que é RKW?
    a: RKW é um método de custeio que busca distribuir todos os custos da operação da empresa para os produtos, incluindo custos diretos, indiretos, fixos e estruturais.
  - q: O que é custo RKW?
    a: Custo RKW é a parcela dos custos da empresa que é atribuída a um produto. Na indústria, ele pode incluir mão de obra, energia, manutenção, depreciação, aluguel, custos administrativos e principalmente o custo do processo produtivo.
  - q: Qual é a fórmula de preço de venda com RKW?
    a: A fórmula é: Preço de Venda = (MP + Custo RKW) / ((100 − (CVV + CVP + L)) / 100), onde MP é matéria-prima, CVV é custo variável de venda, CVP é custo variável de produção e L é lucro desejado.
  - q: Por que o tempo de produção influencia no preço de venda?
    a: Porque o tempo de produção determina quanto da estrutura da empresa foi consumida pelo produto. Quanto mais tempo um produto ocupa máquina, operador e recursos produtivos, maior tende a ser seu custo de processo.
  - q: Qual o erro mais comum ao calcular preço de venda industrial?
    a: O erro mais comum é considerar apenas matéria-prima e margem, ignorando custos de processo, tempo de máquina, paradas, setup, mão de obra e custos fixos.
  - q: Como a MESTTI ajuda na formação de preço?
    a: A MESTTI mede dados reais da produção, como tempo produtivo, paradas, quantidade produzida, performance e disponibilidade. Com isso, a empresa consegue entender melhor o custo real do processo e melhorar a formação do preço de venda.
---
<section id="introducao"><div><p>Calcular o preço de venda de um produto na indústria parece simples: você soma a matéria-prima, coloca uma margem e chega em um valor final.</p>
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
</ul></div></section>
<section id="erro-materia-prima"><div><h2>O problema de olhar apenas para a matéria-prima</h2>
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
</div></div></section>
<section id="metodo-rkw"><div><h2>O que é o método RKW?</h2>
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
<p>O grande desafio está em definir um critério justo para distribuir esses custos entre os produtos. E na indústria, um dos critérios mais importantes é o <strong>tempo de processo</strong>.</p></div></section>
<section id="formula-rkw"><div><h2>A fórmula de preço de venda usando RKW</h2>
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
<p>Por exemplo, se CVV + CVP + L somam 30%, significa que 30% do preço de venda será destinado a esses fatores. Logo, o custo base precisa caber nos 70% restantes — por isso o cálculo divide o custo base por 0,70.</p></div></section>
<section id="exemplo-pratico"><div><h2>Exemplo prático: calculando o preço de venda</h2>
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
</div></div></section>
<section id="custo-processo"><div><h2>O ponto mais importante: onde entra o custo do processo?</h2>
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
<p>Por isso, sem medir o tempo real do processo, o custo RKW pode virar apenas um chute organizado.</p></div></section>
<section id="custo-hora-maquina"><div><h2>Como encontrar o custo hora máquina</h2>
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
</div></div></section>
<section id="tempo-estimado"><div><h2>O perigo de usar tempo estimado no cálculo de custo</h2>
<p>Muitas empresas usam tempos padrões ou estimativas para calcular custo. Isso não está necessariamente errado. O problema é quando o tempo padrão <strong>não representa a realidade da fábrica</strong>.</p>
<p>Exemplo: a ficha técnica diz que o produto deveria levar 10 minutos. Mas na prática, ele leva 18 minutos por causa de paradas frequentes, falta de material, setup demorado, baixa velocidade da máquina, operador aguardando liberação, retrabalho, ajustes manuais, problemas de qualidade ou gargalos no processo.</p>
<p>Se o preço foi calculado considerando 10 minutos, mas a produção real consome 18 minutos, o custo real será muito maior do que o custo usado na precificação. Essa diferença pode destruir a margem do produto.</p>
<p>E o pior: muitas vezes a empresa só percebe isso no caixa, quando o faturamento aumenta, mas o lucro não aparece.</p>
<div class="warning-box">
<p>Vender mais não resolve um preço mal calculado. Às vezes, vender mais apenas aumenta o prejuízo.</p>
</div></div></section>
<div class="article-inline-cta">
<p>Transforme tempo de produção em custo real — pare de precificar no achismo.</p>
</div>
<section id="passo-a-passo"><div><h2>Passo a passo para calcular preço de venda com RKW</h2>
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
</div></div></section>
<section id="erros-comuns"><div><h2>Erros comuns ao calcular preço de venda na indústria</h2>
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
</ul></div></section>
<section id="markup-vs-rkw"><div><h2>Por que não basta apenas colocar uma margem em cima?</h2>
<p>Muitas empresas usam uma conta simples: <em>Preço = Custo × 2</em> ou <em>Preço = Custo + 30%</em>.</p>
<p>Esse tipo de cálculo pode até funcionar em negócios muito simples, mas na indústria ele pode ser perigoso.</p>
<p>Isso acontece porque a indústria possui uma estrutura mais complexa: máquinas diferentes, setores diferentes, tempos diferentes, produtos com complexidades diferentes, setups diferentes, custos fixos relevantes, gargalos produtivos, variação de eficiência e perdas e retrabalhos.</p>
<p>O método RKW ajuda justamente a trazer mais lógica para essa distribuição de custos. Ele permite entender melhor quanto cada produto precisa absorver da estrutura da empresa.</p></div></section>
<section id="mestti"><div><h2>Como a MESTTI ajuda no cálculo do custo do processo</h2>
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
</div></div></section>
<section id="tempo-real"><div><h2>Exemplo: quando o tempo real muda o custo do produto</h2>
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
<p>Se essa diferença não for considerada, a empresa pode vender com preço baseado em R$ 39,60 de processo, quando na prática está gastando R$ 63,60. Isso muda completamente a margem — e muitas vezes essa diferença só aparece no resultado financeiro da empresa.</p></div></section>
<section id="checklist"><div><h2>Checklist para saber se seu preço de venda está correto</h2>
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
<p>Se você respondeu "não" para várias dessas perguntas, seu preço de venda pode estar sendo calculado com base em informações incompletas. E preço baseado em informação incompleta gera margem distorcida.</p></div></section>
<section id="conclusao"><div><h2>Conclusão: preço de venda industrial precisa considerar o processo</h2>
<p>Calcular preço de venda na indústria não é apenas somar matéria-prima e aplicar uma margem. Esse tipo de cálculo pode esconder custos importantes e fazer a empresa vender produtos com margem menor do que imagina.</p>
<p>O método RKW ajuda a construir uma visão mais completa, porque considera que o produto precisa absorver uma parte dos custos totais da operação.</p>
<p>Mas para que o RKW seja realmente útil, é essencial medir corretamente o custo do processo — e o custo do processo depende diretamente do tempo: tempo de máquina, setup, parada, produtivo, retrabalho e tempo consumido por cada ordem.</p>
<p>Quando a indústria mede esse tempo com precisão, ela consegue calcular melhor seus custos, revisar preços, identificar gargalos e tomar decisões mais inteligentes.</p>
<p><strong>No fim, preço de venda não é chute. Preço de venda é gestão.</strong></p></div></section>
