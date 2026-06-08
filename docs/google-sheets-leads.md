# Integração MESTTI → Google Sheets (leads progressivos)

Este documento descreve **passo a passo** como o site envia dados para a planilha Google Sheets durante o chat de demonstração e no envio final.

---

## Visão geral

```
Navegador (chat/formulário)
    → POST /api/lead-progress  (a cada passo ou no envio final)
        → server.js (local) ou api/lead-progress.js (Vercel)
            → lib/sheets-sync.js
                → GET na URL do Web App (Google Apps Script)
                    → scripts/google-sheets-leads.gs
                        → Planilha "Leads" (upsert por sessionId)
```

O e-mail completo do lead continua indo por **`POST /api/lead`** (Resend). O Google Sheets recebe **cópia progressiva** dos mesmos campos, útil para ver abandono e etapa atual.

---

## 1. Configuração (uma vez)

### 1.1 Google Apps Script

1. Crie ou abra a planilha de destino no Google Sheets.
2. **Extensões → Apps Script** e cole o código de `scripts/google-sheets-leads.gs`.
3. Ajuste `SHEET_NAME` se a aba não se chamar `Leads`.
4. **Implantar → Nova implantação → App da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
5. Copie a URL que termina em **`/exec`** (não use `/dev`).

### 1.2 Variável de ambiente

No `.env` (local) e na Vercel (Production):

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/SEU_ID/exec
```

Se a variável estiver vazia, o backend **não falha**: responde `sheets: "skipped"` e o site segue normal.

---

## 2. Identificação da sessão (`sessionId`)

Antes de qualquer sync, o front gera ou recupera um ID por formulário e página:

| Onde | Função |
|------|--------|
| `script.js` | `getOrCreateLeadSessionId(form)` |
| Armazenamento | `sessionStorage` — chave `mesttiLeadSession_{pathname}_{formId}` |
| Formato | `crypto.randomUUID()` ou fallback `lead_{timestamp}_{random}` |
| Também em | `form.dataset.mesttiLeadSession` |

**Regra:** uma linha na planilha = um `sessionId`. Cada novo sync **atualiza a mesma linha** (upsert).

---

## 3. Quando o front dispara o sync

### 3.1 A cada passo do chat (`event: step_completed`)

Arquivo: `conversational-form.js` → `syncProgress()` → `window.MesttiLead.syncLeadProgress()`.

Ordem dos passos (se o campo existir no formulário):

| # | `chatStepKey` | Campo |
|---|---------------|--------|
| 1 | `name` | Nome |
| 2 | `empresa` | Empresa |
| 3 | `email` | E-mail |
| 4 | `phone` | Telefone (+ DDI) |
| 5 | `cargo` | Cargo (select) |
| 6 | `setor` | Setor (select) |
| 7 | `solucao` | Solução (select) |
| 8 | `observacao` | Observação (opcional) |
| 9 | `mensagem` | Mensagem (opcional) |

Após o usuário responder cada pergunta, o chat chama:

```js
sync(form, formId, {
  event: 'step_completed',
  chatStepKey: 'email',      // exemplo
  stepIndex: 3,              // passo concluído (1-based)
  totalSteps: 9,
  leadSource: 'chat_progress'
});
```

O campo **`chatStep`** enviado ao servidor é montado assim:

`3/9 — E-mail`

### 3.2 Usuário fecha o modal sem concluir (`event: abandoned`)

Quando o modal de contato fecha e o chat tinha sido iniciado, `conversational-form.js` observa a classe `active` e chama:

```js
syncProgress('abandoned')
// leadSource: 'chat_abandoned'
```

### 3.3 Envio final do formulário (`event: submitted`)

Arquivo: `script.js` → `submitLeadForm()`.

Fluxo:

1. `POST /api/lead` — envia e-mail via Resend (nome + e-mail obrigatórios).
2. Se OK, `syncLeadProgress()` com `event: 'submitted'` e `leadSource` conforme origem (`submit`, `modal_close`, etc.).
3. `clearLeadSessionId(form)` — limpa sessão após sucesso.

### 3.4 Condição para enviar progresso parcial

Em `syncLeadProgress()`, **não envia** se ainda não houver dado útil, exceto no evento `submitted`:

- Nome com ≥ 2 caracteres, **ou**
- E-mail com `@`, **ou**
- Telefone com ≥ 8 dígitos, **ou**
- Empresa, cargo, setor, solução, mensagem ou observação preenchidos

---

## 4. Payload JSON (navegador → `/api/lead-progress`)

Montado em `script.js` (`collectLeadPayload` + metadados do chat):

| Campo | Descrição |
|-------|-----------|
| `sessionId` | ID único da sessão (obrigatório) |
| `timestamp` | ISO 8601 (`new Date().toISOString()`) |
| `event` | `step_completed` \| `abandoned` \| `submitted` |
| `chatStep` | Texto legível, ex.: `4/9 — Telefone` |
| `chatStepKey` | Chave do passo, ex.: `phone` |
| `stepIndex` | Número do passo concluído |
| `totalSteps` | Total de passos do chat |
| `name`, `email`, `phone`, `ddi` | Campos do formulário |
| `empresa`, `cargo`, `setor`, `solucao` | Texto exibido nos selects |
| `mensagem`, `observacao` | Textos livres |
| `pagePath` | Ex.: `/` ou `/contato/` |
| `leadSource` | Rótulo em PT, ex.: `Chat — progresso` |
| `formId` | Ex.: `contactForm` |

Exemplo:

```json
{
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2026-06-07T14:30:00.000Z",
  "event": "step_completed",
  "chatStep": "2/9 — Empresa",
  "chatStepKey": "empresa",
  "stepIndex": 2,
  "totalSteps": 9,
  "name": "João Silva",
  "email": "",
  "phone": "",
  "ddi": "+55",
  "empresa": "Fábrica XYZ",
  "cargo": "",
  "setor": "",
  "solucao": "",
  "mensagem": "",
  "observacao": "",
  "pagePath": "/",
  "leadSource": "Chat — progresso",
  "formId": "contactForm"
}
```

Requisição:

```http
POST /api/lead-progress
Content-Type: application/json
```

`keepalive: true` no `fetch` — permite sync ao fechar aba em alguns casos.

---

## 5. Backend Node (`server.js` / `api/lead-progress.js`)

1. Recebe o JSON do body.
2. Normaliza com `normalizeLeadProgressPayload()` (`lib/sheets-sync.js`).
3. Exige `sessionId`; senão **400** `session_id_required`.
4. Chama `forwardLeadToGoogleSheets(payload, GOOGLE_SHEETS_WEBHOOK_URL)`.
5. Resposta ao front:
   - **200** `{ ok: true, sheets: "synced" }` ou `{ ok: true, sheets: "skipped" }`
   - **502** se o webhook falhar (timeout 20s, erro HTTP, etc.)

---

## 6. Encaminhamento para o Google (`lib/sheets-sync.js`)

1. Monta URL do Web App com **query string** (todos os campos não vazios).
2. Faz **`GET`** (não POST) para evitar problemas de redirect do Apps Script.
3. Timeout: 20 segundos.

Exemplo de URL gerada:

```
https://script.google.com/macros/s/.../exec?sessionId=...&event=step_completed&name=Jo%C3%A3o&...
```

---

## 7. Google Apps Script (`google-sheets-leads.gs`)

### Entrada

- **`doGet(e)`** — lê `e.parameter` (modo usado pelo backend).
- **`doPost(e)`** — lê JSON em `e.postData.contents` (alternativo / testes manuais).

### Planilha

- Aba: `Leads` (const `SHEET_NAME`).
- Cabeçalhos criados automaticamente na primeira execução:

```
sessionId | updatedAt | event | chatStep | stepIndex | totalSteps |
name | email | phone | ddi | empresa | cargo | setor | solucao |
mensagem | observacao | pagePath | leadSource | formId
```

### Upsert

1. Busca `sessionId` na coluna A (a partir da linha 2).
2. Se encontrar → **substitui a linha inteira** com os valores novos.
3. Se não encontrar → **appendRow** (nova linha).
4. `updatedAt` = `payload.timestamp` ou data atual.

Assim, a planilha sempre mostra o **estado mais recente** da conversa, não uma linha por passo.

---

## 8. Resumo dos eventos na planilha

| `event` | Quando | `leadSource` típico |
|---------|--------|-------------------|
| `step_completed` | Usuário respondeu um passo do chat | Chat — progresso |
| `abandoned` | Fechou o modal no meio do chat | Chat — abandonou |
| `submitted` | Formulário enviado com sucesso | Envio completo / Botão enviar / Confirmação ao fechar modal |

---

## 9. Arquivos envolvidos

| Arquivo | Papel |
|---------|--------|
| `conversational-form.js` | Dispara sync a cada passo e no abandon |
| `script.js` | `syncLeadProgress`, `collectLeadPayload`, `submitLeadForm`, `MesttiLead` |
| `lib/sheets-sync.js` | Normalização + GET para webhook |
| `server.js` | Rota `POST /api/lead-progress` (dev local) |
| `api/lead-progress.js` | Mesma rota na Vercel |
| `scripts/google-sheets-leads.gs` | Web App na planilha |
| `.env` | `GOOGLE_SHEETS_WEBHOOK_URL` |

---

## 10. Teste manual rápido

1. Configure `GOOGLE_SHEETS_WEBHOOK_URL` no `.env`.
2. `npm run dev` e abra o site.
3. Abra o modal **Demonstração** e responda nome + empresa.
4. Verifique na planilha: uma linha com seu `sessionId`, `event=step_completed`, `chatStep` atualizado.
5. Conclua o envio: mesma linha com `event=submitted` e todos os campos preenchidos.

Teste direto no Web App (navegador):

```
https://script.google.com/macros/s/SEU_ID/exec?sessionId=teste-123&event=step_completed&name=Teste&email=teste@exemplo.com
```

Resposta esperada: JSON `{ "status": "success", ... }`.
