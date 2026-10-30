# Integração de formulários com Google Sheets

O site encaminha dados à planilha somente após o envio de um formulário. Respostas parciais da conversa permanecem no armazenamento de sessão do navegador e não são enviadas como progresso ou abandono. A solicitação concluída é encaminhada ao servidor por POST; o serviço de e-mail segue seu fluxo independente.

A API encaminha os dados ao Web App do Google Apps Script por POST com JSON no corpo. O script em `scripts/google-sheets-leads.gs` possui `doPost` e retorna um objeto com `status: success` ou `status: error`; o servidor trata resposta inválida ou erro como falha, sem reenviar dados pela URL. Cadastro e leads usam a mesma URL, com seleção da aba pelo corpo da requisição.

## Implantação e verificação

1. Confirme que o Web App implantado corresponde ao `scripts/google-sheets-leads.gs` e possui `doPost` compatível. Se necessário, crie uma nova versão da implantação antes de publicar a alteração do site.
2. Configure a URL do Web App na variável de ambiente já existente. Não exponha credenciais no navegador ou em arquivos públicos.
3. Em ambiente de teste, envie um formulário completo com dados fictícios e confirme o recebimento na aba correta. Teste cadastro e lead separadamente.
4. Confirme que preencher e abandonar o formulário não envia dados parciais. Não teste com dados reais de clientes.
5. Se a integração falhar, investigue a implantação do Apps Script e os logs sem registrar conteúdo ou URLs contendo dados pessoais.

A compatibilidade com a implantação efetiva, sua autenticação, permissões e critérios de retenção devem ser confirmados pelo responsável antes da publicação. A alteração do transporte não remove registros eventualmente existentes.
