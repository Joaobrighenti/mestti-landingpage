---
title: MTBF e MTTR: o que são, como calcular e para que servem
description: MTBF é o tempo médio entre falhas; MTTR é o tempo médio para reparar. Veja as fórmulas, um exemplo calculado, como os dois se relacionam com a disponibilidade e quais dados você precisa registrar.
answer: MTBF (tempo médio entre falhas) é o tempo de funcionamento dividido pelo número de falhas, e mostra com que frequência a máquina quebra. MTTR (tempo médio para reparar) é o tempo total de reparo dividido pelo número de falhas, e mostra quanto demora para voltar. Para calcular os dois, você precisa do início e do fim de cada parada por falha.
date: 2026-10-29
author: leonardo
topic: monitoramento
cta: Registrar as paradas com início e fim
mestti: Na Mestti, cada parada fica registrada com início, fim e motivo, por máquina. Esses são os dados de que MTBF e MTTR precisam, sem depender de alguém anotar o horário à mão.
related:
  - /monitoramento-de-maquinas/
  - /oee/
  - /glossario/
faq:
  - q: Qual a diferença entre MTBF e MTTR?
    a: O MTBF mede a frequência das falhas (quanto tempo a máquina roda entre uma falha e outra). O MTTR mede a duração do reparo (quanto tempo leva para voltar). Um olha a confiabilidade; o outro, a velocidade da manutenção.
  - q: Setup entra no cálculo de MTBF?
    a: Não. MTBF e MTTR consideram falhas. Setup, falta de material e paradas planejadas ficam de fora, ou o indicador deixa de medir a confiabilidade da máquina.
  - q: Como MTBF e MTTR se relacionam com a disponibilidade?
    a: Uma forma comum de estimar a disponibilidade por falhas é MTBF ÷ (MTBF + MTTR). Quanto mais tempo entre falhas e mais rápido o reparo, maior a disponibilidade.
---
## MTBF: tempo médio entre falhas

**MTBF = tempo de funcionamento ÷ número de falhas**

Mostra de quanto em quanto tempo a máquina quebra. Quanto maior, mais confiável.

## MTTR: tempo médio para reparar

**MTTR = tempo total de reparo ÷ número de falhas**

Mostra quanto tempo a máquina fica parada, em média, a cada falha. Quanto menor, mais rápida a manutenção.

## Exemplo calculado

Uma máquina, num mês, com dados ilustrativos:

| Dado | Valor |
| --- | --- |
| Tempo planejado de produção | 352 h |
| Falhas | 4 |
| Tempo total de reparo | 8 h |
| Tempo de funcionamento | 352 − 8 = 344 h |

- **MTBF** = 344 h ÷ 4 = **86 h** entre falhas.
- **MTTR** = 8 h ÷ 4 = **2 h** por reparo.
- **Disponibilidade por falhas** ≈ 86 ÷ (86 + 2) ≈ **97,7%**.

## O que você precisa registrar

- **Início e fim** de cada parada, não só o total do dia.
- **Motivo** de cada parada, para separar falha de setup, falta de material e paradas planejadas.
- **Máquina** em que aconteceu.

Sem o horário de início e fim, o MTTR vira estimativa. Sem o motivo, o MTBF mistura quebra com troca de produto.

## Para que servem

- **MTBF baixo**: a máquina quebra com frequência. Investigue a causa raiz e a manutenção preventiva.
- **MTTR alto**: o reparo demora. Verifique peças de reposição, acesso ao técnico e procedimento.
- **Os dois juntos** ajudam a decidir onde investir: em evitar a falha ou em voltar mais rápido.

Veja também os outros termos no [glossário de produção](/glossario/).
