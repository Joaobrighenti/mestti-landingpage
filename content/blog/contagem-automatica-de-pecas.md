---
title: Contagem automática de peças: como funciona e o que conferir
description: A contagem automática de peças usa um sensor que lê um sinal da máquina a cada peça ou ciclo. Veja os tipos de sinal, a diferença entre contar ciclos e peças, o que conferir na instalação e os erros mais comuns.
answer: A contagem automática de peças usa um sensor que registra um sinal a cada peça ou a cada ciclo da máquina, como um pulso infravermelho ou um fim de curso, e envia a contagem para o sistema. Quando cada ciclo produz mais de uma peça, a contagem multiplica os ciclos pelas peças por ciclo. O ponto mais importante é conferir a leitura com uma contagem de referência nos primeiros dias.
date: 2026-10-29
author: leonardo
topic: maquinas-antigas
cta: Automatizar a contagem nas minhas máquinas
mestti: Na Mestti, o sensor lê pulsos de contagem, fim de curso ou medição linear; as peças por ciclo vêm do cadastro da engenharia. A contagem aparece ao vivo no cartão de cada máquina e alimenta o apontamento e o OEE sem digitação.
related:
  - /maquinas-antigas/
  - /apontamento-de-producao/
  - /blog/sensoriamento-industrial-apontamento-manual-dados-tempo-real/
faq:
  - q: O sensor de corrente conta peças?
    a: Não. A corrente indica se a máquina está funcionando ou parada. Para contar peças, é preciso um sinal ligado à peça ou ao ciclo, como um pulso ou um fim de curso.
  - q: E se a máquina produz mais de uma peça por ciclo?
    a: A contagem registra os ciclos e multiplica pelas peças por ciclo cadastradas, por exemplo 4 peças num molde de 4 cavidades.
  - q: Preciso de CLP para contar peças automaticamente?
    a: Não. Um sensor externo lê o sinal físico da máquina sem ligação com o CLP e sem mexer no comando.
---
## Como funciona

O sensor fica num ponto da máquina onde algo acontece **uma vez por peça ou por ciclo**: a peça passa na frente de um sensor infravermelho, um braço aciona um fim de curso, o material avança um comprimento. Cada sinal é registrado e enviado para o sistema.

## Tipos de sinal

| Sinal | Bom para | Cuidado |
| --- | --- | --- |
| Pulso de contagem (infravermelho) | Peças que passam por um ponto fixo | Posição e limpeza do sensor |
| Fim de curso | Movimento que se repete a cada ciclo | Ciclos em vazio contam igual |
| Medição linear | Processos contínuos (corte, extrusão) | Unidade configurada (mm) |
| Corrente elétrica | Saber se a máquina está ligada | **Não conta peças** |

## Ciclo ou peça

Uma injetora com molde de 4 cavidades faz 1 ciclo e entrega 4 peças. Se o sensor conta ciclos, a quantidade é **ciclos × peças por ciclo**. Esse número precisa estar certo no cadastro: com 4 em vez de 2, a produção aparece em dobro.

## O que conferir na instalação

1. **O ponto de leitura** representa uma peça ou um ciclo?
2. **Peças por ciclo** estão certas para aquele produto e molde?
3. **Ciclos em vazio** (sem peça) acontecem? Eles podem precisar de outro ponto de leitura.
4. **A contagem bate** com uma referência (caixa contada, balança) nos primeiros dias?
5. **A rede Wi‑Fi** chega até a máquina?

## Erros comuns

- **Confiar sem conferir.** Os primeiros dias são para comparar com uma contagem de referência.
- **Esquecer de atualizar as peças por ciclo** quando muda o molde.
- **Usar a corrente para contar**, quando ela só diz se a máquina está ligada.
- **Contar peças ruins como boas.** A contagem diz quanto saiu; o refugo precisa ser registrado à parte.
