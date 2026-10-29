---
title: Como escolher um sistema de monitoramento de produção industrial
seo_title: Como escolher um sistema de monitoramento de produção industrial | Mestti
description: Um roteiro para avaliar sistemas de monitoramento de produção com critérios verificáveis: o tipo de sistema, o que é medido, máquinas antigas, um piloto que ajuda a decidir e o que conferir na proposta.
answer: Comece pela informação que falta na fábrica e pela decisão que você precisa tomar. Depois confira como cada dado é produzido (sensor, operador ou cadastro), faça um piloto numa máquina representativa com critérios combinados antes da instalação e exija na proposta escopo, responsabilidades, integrações, dados e critérios de aceite claros.
date: 2026-10-21
updated: 2026-10-29
topic: monitoramento
cta: Avaliar a Mestti na minha fábrica
mestti: A Mestti reúne monitoramento e apontamento de produção, coleta por sensores, sequenciamento visual e checklists e inspeções, com o Otto para consultar a operação e preparar ações com aprovação humana. Leve uma ordem, um exemplo de parada e o modo como sua fábrica confere quantidades hoje. Compatibilidade de equipamentos, integração com ERP e requisitos específicos são confirmados na proposta.
related:
  - /monitoramento-de-maquinas/
  - /mes/
  - /maquinas-antigas/
faq:
  - q: Um painel bonito prova que o sistema funciona?
    a: Não. O painel mostra a informação, mas a avaliação precisa conferir como ela foi produzida. Peça para ver a contagem comparada com uma referência e o caminho do registro de uma parada.
  - q: Qual a diferença entre monitoramento, MES, PCP e manutenção preditiva?
    a: Monitoramento mostra quanto se produziu e por que a máquina parou. MES acompanha a execução das ordens. PCP decide o que produzir e quando. Manutenção preditiva usa sinais como vibração e temperatura para antecipar falhas. As categorias se sobrepõem, mas cada uma exige uma avaliação própria.
  - q: Quanto tempo deve durar um piloto?
    a: O suficiente para cobrir trocas de produto, de turno e algumas paradas reais na máquina escolhida. O importante é combinar os critérios de aceite antes da instalação.
---
Um painel bonito não prova que a contagem está correta, que a causa da parada é conhecida ou que o planejamento será cumprido. Este roteiro ajuda empresários, produção, PCP, qualidade e manutenção a avaliar uma solução com critérios verificáveis.

## Monitoramento, MES, PCP ou manutenção: o que você procura?

| Sua pergunta | O que avaliar |
| --- | --- |
| "Quanto produzimos e por que a máquina parou?" | Coleta de produção, estados da máquina e gestão de paradas. O OEE depende de parâmetros e registros coerentes. |
| "Em qual máquina está a ordem e quanto falta?" | Apontamento por ordem, produto e operação, o que normalmente se chama MES. Confira o fluxo na demonstração, não o nome. |
| "Qual ordem produzir primeiro e quando vamos entregar?" | PCP e programação. Pergunte quais restrições entram na previsão: calendário, capacidade e tempos de processo. |
| "A sequência será recalculada sozinha quando houver uma falha?" | Planejamento avançado (APS) e regras de reprogramação. Peça para ver o cenário; não presuma essa função em qualquer MES. |
| "Quero detectar uma falha antes de a máquina quebrar" | Monitoramento de condição e manutenção preditiva, com sinais como vibração e temperatura. Contagem de peças não é diagnóstico preditivo. |

As categorias se sobrepõem. A [ISA-95](https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard) é uma referência para entender a relação entre os sistemas da empresa e os da operação; use-a como contexto, não como prova de aderência.

## Confira o que é medido e o que depende da equipe

- **Sensor e motivo:** um sensor registra um pulso de produção ou um sinal de funcionamento. Ele não explica sozinho se a parada foi setup, falta de material ou manutenção. Pergunte como o operador registra o motivo e como o supervisor corrige.
- **Unidade:** peças, ciclos, metros ou peso. Em máquinas com várias peças por ciclo, valide a relação entre o evento capturado e a quantidade exibida, inclusive em trocas de produto e turno.
- **OEE:** peça a origem do tempo planejado, do ciclo de referência e das quantidades boa e rejeitada. Cadastros incompletos dão uma falsa impressão de precisão.
- **Inspeção:** uma inspeção digital guarda evidências, mas não substitui sozinha toda a rastreabilidade de lotes e materiais. Se esse é o objetivo, peça para percorrer exatamente esse vínculo.
- **Conexão:** falha de comunicação e parada de produção são eventos diferentes. O painel deve deixar claro o que está atualizado e o que ainda vai ser recuperado.

## É possível monitorar máquinas antigas ou sem CLP?

Depende do sinal disponível e de como ele representa o processo. Sensores externos são uma alternativa em muitos equipamentos; em outros, a coleta exige uma adaptação. Antes de assumir compatibilidade:

1. Defina o evento que será contado e o ponto de instalação.
2. Verifique velocidade de produção, ambiente e acesso ao equipamento.
3. Confirme alimentação, cobertura de rede e o procedimento seguro de instalação.
4. Teste partidas, paradas, troca de produto e leituras que possam contar a mais.
5. Peça o comportamento documentado quando a conexão ou a energia caem, inclusive o limite do armazenamento local.

Veja mais em [como monitorar máquinas antigas sem CLP](/maquinas-antigas/).

## Um piloto que ajuda a decidir

Escolha uma máquina representativa e um problema com referência verificável, e combine os critérios antes da instalação.

1. **Registre a referência:** produto, unidade, turno e quantidade por um método de conferência conhecido.
2. **Compare a contagem:** investigue a diferença entre a referência e o sistema.
3. **Observe uma parada:** horários, duração e o caminho para registrar a causa.
4. **Acompanhe uma ordem:** onde aparece a produção real e como ela se relaciona com o planejado.
5. **Simule uma queda de rede** combinada e observe a recuperação do histórico.
6. **Teste a rotina da equipe:** operador, supervisor e PCP executando as suas tarefas.
7. **Revise o resultado:** o que funcionou, o que depende de ajuste e o que impede a expansão.

Se você precisa de TV de gestão à vista, alertas ou uso pelo celular, teste esses caminhos na demonstração.

## O que deve ficar claro na proposta comercial

- **Escopo:** máquinas, pontos de coleta, usuários, módulos e unidades atendidas.
- **Responsabilidades:** instalação, rede, parametrização, treinamento e manutenção do hardware.
- **Investimento:** sensores, implantação, assinatura, suporte e serviços adicionais, com condições de expansão e cancelamento.
- **Integrações:** sistemas, direção da troca, campos, frequência, responsáveis e custo. "Integra com ERP" precisa de escopo.
- **Dados:** acesso ao histórico, exportação, retenção e o que acontece ao encerrar o contrato.
- **Critérios de aceite:** cenários do piloto, divergências toleradas e como serão tratadas.
- **Evidência:** documentação, demonstração no seu processo e casos autorizados com período e método.

Se duas propostas usam a mesma palavra com significados diferentes, transforme a palavra numa tarefa observável. Em vez de "rastreabilidade completa", peça: "mostre o registro da inspeção desta ordem e a máquina em que ocorreu".

## Responsabilidade editorial

Este guia foi escrito pela Mestti para apoiar a avaliação técnica e comercial. A Mestti fornece as soluções apresentadas; ele não é um ranking independente de fornecedores.
