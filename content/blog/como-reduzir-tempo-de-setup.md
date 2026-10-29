---
title: Como reduzir o tempo de setup na prática
description: Setup longo consome capacidade a cada troca de produto. Veja como medir o setup de verdade, separar o que pode ser feito com a máquina rodando (SMED) e acompanhar a melhora por máquina e por turno.
answer: Para reduzir o setup, primeiro meça quanto ele dura de verdade em cada troca. Depois separe o que só pode ser feito com a máquina parada do que pode ser preparado antes, com ela ainda rodando (a ideia do SMED), padronize a sequência e acompanhe o tempo de cada troca.
date: 2026-10-29
topic: monitoramento
cta: Medir o setup das minhas máquinas
mestti: Na Mestti, o setup aparece como um estado da máquina, com início, fim e duração em cada troca, e o operador registra o motivo no tablet. Dá para comparar o setup por máquina, por produto e por turno e ver se a mudança de método funcionou.
related:
  - /monitoramento-de-maquinas/
  - /oee/
  - /blog/microparadas/
faq:
  - q: O que é SMED?
    a: SMED (troca rápida de ferramenta) é um método para reduzir o setup separando as tarefas internas, que exigem a máquina parada, das externas, que podem ser feitas antes ou depois com ela rodando.
  - q: Setup entra no OEE?
    a: Sim. O tempo de setup reduz a disponibilidade, porque a máquina não está produzindo. Algumas fábricas o tratam como parada planejada; o importante é usar sempre a mesma regra.
  - q: Vale a pena agrupar pedidos para fazer menos setups?
    a: Muitas vezes sim, mas cuidado com a data de entrega. Agrupar por setup reduz trocas e pode atrasar pedidos urgentes; o sequenciamento ajuda a ver esse efeito antes.
---
## Por que o setup importa

Toda troca de produto, molde ou ferramenta é tempo em que a máquina não produz. Em fábricas com muitos pedidos pequenos, o setup pode ser a maior perda do dia, e quase nunca aparece no apontamento com o tempo certo.

## 1. Meça o setup de verdade

O primeiro passo é saber quanto dura cada troca, **do último produto bom do lote anterior até o primeiro produto bom do lote seguinte**. Anotar "setup: 30 min" de cabeça esconde a variação: a mesma troca pode levar 20 minutos num turno e 70 no outro.

Registre por algumas semanas:

- máquina e produto de origem e de destino;
- início e fim da troca;
- quem fez e o que atrasou (ferramenta não estava pronta, ajuste, material).

## 2. Separe interno de externo

A ideia central do SMED é simples:

- **Interno:** só pode ser feito com a máquina parada (trocar o molde, ajustar a fixação).
- **Externo:** pode ser feito antes, com a máquina ainda rodando (buscar a ferramenta, pré-aquecer, separar o material, conferir o desenho).

Em muitas trocas, boa parte do tempo parado é gasto com tarefas externas, como procurar a ferramenta certa.

## 3. Padronize a sequência

- Monte um roteiro de troca por máquina, com a ordem das tarefas.
- Deixe ferramentas e dispositivos num lugar fixo, perto da máquina.
- Use um checklist de preparação para o próximo lote.
- Defina o que conta como "primeira peça boa" e quem aprova.

## 4. Acompanhe por máquina e por turno

| O que olhar | Pergunta que responde |
| --- | --- |
| Duração média do setup | A troca está ficando mais rápida? |
| Variação entre turnos | Algum turno precisa de treinamento ou de ferramenta? |
| Setups por dia | A programação está gerando trocas demais? |
| Setup × padrão | Quais trocas passam do tempo combinado? |

## Erros comuns

- **Medir só a média.** A média esconde as trocas que deram errado.
- **Encurtar o setup e perder qualidade.** Se a primeira peça sai ruim, o tempo volta como refugo.
- **Mudar o método sem medir antes.** Sem um número de partida, não dá para saber se melhorou.
