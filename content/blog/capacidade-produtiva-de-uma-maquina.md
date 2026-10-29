---
title: Como calcular a capacidade produtiva de uma máquina
description: Capacidade produtiva é quantas peças uma máquina consegue fazer no tempo disponível. Veja a conta passo a passo, a diferença entre capacidade teórica, disponível e real, e por que a fila do PCP depende dela.
answer: Capacidade produtiva é o tempo disponível da máquina dividido pelo tempo de ciclo de cada peça (vezes as peças que saem por ciclo). Comece pelas horas do turno, desconte pausas e paradas programadas, e compare com o que a máquina realmente produziu para descobrir a capacidade real.
date: 2026-10-29
topic: sequenciamento
cta: Descobrir a capacidade real das minhas máquinas
mestti: Na Mestti, o tempo de ciclo e as peças por ciclo vêm do roteiro da engenharia, o calendário de turnos define o tempo disponível e o sensor mostra quanto cada máquina produziu de fato. O sequenciamento usa essa conta para calcular quando cada ordem fica pronta.
related:
  - /pcp/
  - /oee/
faq:
  - q: Qual a diferença entre capacidade teórica e capacidade real?
    a: A teórica considera a máquina rodando o tempo todo no ciclo ideal. A real é o que ela entrega depois de paradas, setups, ritmo abaixo do padrão e refugo. A diferença entre as duas é a perda que o OEE mede.
  - q: Devo usar o ciclo do manual da máquina?
    a: Use o tempo de ciclo cadastrado para aquela peça naquela máquina, conferido com a produção real. O ciclo do manual costuma ser o melhor caso e não considera o produto.
  - q: Capacidade se calcula por máquina ou por setor?
    a: Por máquina primeiro. A capacidade do setor é limitada pela máquina mais lenta do fluxo, o gargalo.
---
## O que é capacidade produtiva

Capacidade produtiva é a quantidade de peças que uma máquina consegue fazer num período. Ela responde a pergunta que o PCP faz todo dia: **cabe esse pedido nesta semana?**

A conta parece simples, mas costuma ser feita com números otimistas. O resultado é a data prometida que não fecha.

## A conta, passo a passo

1. **Tempo do período:** horas dos turnos em que a máquina pode produzir. Ex.: 2 turnos de 8 h = 16 h por dia.
2. **Tempo disponível:** desconte pausas e paradas programadas (refeição, manutenção preventiva, reunião). Ex.: 16 h − 1 h = 15 h = 900 min.
3. **Tempo de ciclo:** quanto tempo a máquina leva para fazer um ciclo daquela peça. Ex.: 30 s.
4. **Peças por ciclo:** num molde de 4 cavidades, cada ciclo produz 4 peças.
5. **Capacidade teórica:** tempo disponível ÷ ciclo × peças por ciclo. Ex.: 900 min × 60 ÷ 30 s × 4 = **7.200 peças por dia**.
6. **Capacidade real:** multiplique pela eficiência que a máquina realmente tem. Com OEE de 75%, ficam **5.400 peças por dia**.

> A diferença entre 7.200 e 5.400 peças não é teoria: são paradas, setups, ritmo e refugo que já acontecem na sua fábrica.

## Teórica, disponível e real

| Capacidade | O que considera | Para que serve |
| --- | --- | --- |
| Teórica | 24 h por dia no ciclo ideal | Limite máximo, quase nunca usado |
| Disponível | Turnos e paradas programadas | Base do planejamento |
| Real | Disponível × eficiência medida | Prometer prazo ao cliente |

## Erros comuns

- **Usar a capacidade teórica para prometer prazo.** O pedido entra na fila como se a máquina nunca parasse.
- **Esquecer o setup.** Cada troca de produto consome capacidade. Com muitas trocas curtas, a perda é grande.
- **Ignorar o gargalo.** De nada adianta sobrar capacidade numa máquina se a seguinte está cheia.
- **Eficiência chutada.** Sem medir, a fábrica costuma estimar uma eficiência maior do que a real.

## Como usar no PCP

Com a capacidade real de cada máquina, o PCP consegue somar a fila: duração de cada operação = ciclo × quantidade ÷ peças por ciclo + setup. Quando a soma passa do tempo disponível até a data de entrega, o atraso aparece **antes** de começar. É isso que um sequenciamento por capacidade faz; veja [como programar a fila de cada máquina](/sequenciamento/).
