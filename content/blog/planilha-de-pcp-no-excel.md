---
title: Planilha de PCP no Excel: quando ela deixa de funcionar
description: A planilha de PCP funciona no começo, mas passa a falhar quando a fábrica cresce. Veja os sinais de que ela chegou ao limite, o que uma boa programação precisa ter e como sair dela sem parar a fábrica.
answer: A planilha de PCP deixa de funcionar quando a programação muda mais rápido do que alguém consegue atualizar, quando a data prometida não considera a fila real das máquinas e quando o realizado chega atrasado e digitado à mão. A saída não precisa ser tudo de uma vez; dá para começar por um setor e usar os dois juntos.
date: 2026-10-29
topic: pcp
cta: Ver a fila real das minhas máquinas
mestti: Na Mestti, a carteira do PCP mostra cada ordem e o próximo passo dela, o sequenciamento distribui as operações na fila de cada máquina com data prevista, e o realizado vem do sensor e do tablet. As ordens podem vir do ERP.
related:
  - /pcp/
  - /sequenciamento/
  - /blog/capacidade-produtiva-de-uma-maquina/
faq:
  - q: Dá para fazer PCP bem feito só no Excel?
    a: Numa fábrica pequena, com poucos produtos e pouca mudança, sim. O problema aparece quando há muitas ordens, muitas trocas de prioridade e mais de uma pessoa precisando da mesma informação ao mesmo tempo.
  - q: Preciso jogar a planilha fora no primeiro dia?
    a: Não. O normal é começar por um setor e manter a planilha em paralelo até a equipe confiar nos números do sistema.
  - q: O que levar para avaliar um sistema de PCP?
    a: Uma ordem real com o roteiro, as máquinas que ela usa, a data de entrega e um problema que aconteceu recentemente. Assim a demonstração mostra o seu caso, não um exemplo genérico.
---
## Por que todo mundo começa no Excel

A planilha é flexível, barata e todo mundo sabe usar. Para uma fábrica pequena, com poucos produtos, ela resolve: uma aba de pedidos, uma de máquinas, umas fórmulas de data.

O problema não é a planilha. É o que ela não sabe.

## Sinais de que a planilha chegou ao limite

- **A programação muda várias vezes por dia** e cada mudança obriga a refazer a fila.
- **A data prometida não bate** porque a planilha não sabe que a máquina parou hoje às 9h.
- **O realizado chega no dia seguinte**, digitado a partir de fichas de papel.
- **Só uma pessoa entende as fórmulas**, e ela não pode tirar férias.
- **Existem várias versões** da mesma planilha circulando por e-mail.
- **Ninguém sabe o andamento de uma ordem** sem ir até o chão de fábrica perguntar.

## O que uma boa programação precisa ter

| Precisa ter | Por que |
| --- | --- |
| Tempo de cada operação vindo do roteiro | A duração não pode depender da memória de alguém |
| Fila por máquina, com capacidade | Duas ordens não rodam na mesma máquina ao mesmo tempo |
| Calendário de turnos | Feriado e turno desligado mudam a data de entrega |
| Realizado vindo do chão | O plano precisa saber o que já foi feito e o que parou |
| Aviso de atraso antes de começar | Prometer prazo sabendo qual pedido vai atrasar |

## Como sair da planilha sem parar a fábrica

1. **Escolha um setor**, de preferência o gargalo, onde o atraso dói mais.
2. **Cadastre os roteiros** só das peças desse setor, com tempo de ciclo e máquinas possíveis.
3. **Meça o realizado automaticamente** nas máquinas desse setor.
4. **Use os dois em paralelo** por algumas semanas e compare as datas previstas com as reais.
5. **Expanda** quando a equipe confiar nos números.

Para entender as etapas do trabalho do PCP, veja [o que é PCP e PPCP](/pcp/).
