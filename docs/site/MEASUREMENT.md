# Medição da jornada comercial

Data: 2026-10-21. Aplicação da skill analytics à jornada atual, sem adicionar serviço de rastreamento ou chamada externa nova.

## Decisões que os dados devem apoiar

- O visitante encontra a frente que corresponde à sua necessidade?
- Quem procura produção, qualidade, engenharia ou Otto avança para uma conversa comercial pertinente?
- O contato foi aceito pelo servidor? A equipe o qualificou e realizou a reunião?
- Os visitantes que vêm de busca e assistentes trazem problemas que a MESTTI consegue atender?

## Estado observado

O site possui tag Google com destinos GA4/Ads, Meta Pixel/CAPI e integração de leads. São mecanismos existentes; não havia acesso às contas ou dados para comprovar recepção, deduplicação ponta a ponta ou desempenho comercial. Nenhum formulário foi enviado a uma conta real.

Foi encontrada uma distorção concreta em `js/script.js`: abrir o modal disparava a mesma conversão Ads utilizada depois de um lead aceito. A chamada na abertura foi retirada. O disparo após o aceite do lead permanece. Isso corrige o significado do evento no código; não prova que as configurações da conta estão corretas ou que conversões históricas serão recalculadas. Nenhum dado passado foi alterado.

WhatsApp/telefone são contatos de intenção. O evento de contato existente não deve ser interpretado automaticamente como oportunidade qualificada. A lista interativa do guia usa checkboxes locais, sem persistência nem transmissão.

## Plano de observação

1. Visita: página, origem, dispositivo, idioma e data.
2. Exploração de frente: destino (produção, qualidade, engenharia, Otto). Pode ser analisada por navegação de páginas; não foi criado um evento novo para cada clique.
3. Abertura de demonstração: intenção de contato, nunca lead. Evento dedicado futuro, sujeito ao fluxo de consentimento e verificação na conta.
4. Lead aceito: confirmação do backend após envio, distinguindo falha e duplicação.
5. Qualificação e reunião: registro comercial humano, com critério e mesma janela de observação.

O evento recomendado para uma futura abertura é `demo_opened`, com contexto da página e sem nome, telefone, e-mail ou conteúdo dos campos. Trata-se de especificação, não evento implementado nesta entrega.

## Hipóteses a confrontar

- Uma hub visual e organizada por situações facilita localizar o módulo adequado.
- A relação entre engenharia, ordem, execução e inspeção torna a amplitude do produto compreensível.
- Exemplos de perguntas e aprovação explícita reduzem expectativas incorretas sobre o Otto.
- Explicar a demonstração e pedir um cenário real favorece a qualidade da conversa.

Não há baseline de conversão ou teste com compradores que comprove essas hipóteses. Não estimar ganhos. Comparar janelas fechadas equivalentes, separar origem/dispositivo e relatar tamanho da amostra. Se o volume for pequeno, priorizar testes de compreensão e entrevistas sobre testes A/B inconclusivos.

## Evolução autorizada posteriormente

Validar eventos nas contas, revisar o carregamento/consentimento das tags existentes, medir qualificação e conferir duplicações entre navegador/servidor. A implementação da interface e um build bem-sucedido não confirmam esses resultados. O protocolo longitudinal de SEO/GEO/AEO permanece em `docs/seo/STRATEGY.md`.
