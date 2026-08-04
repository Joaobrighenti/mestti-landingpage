# Meta Pixel + Conversions API (MESTTI)

Integração híbrida: Pixel no navegador + Conversions API no backend, com deduplicação por `event_id`.

## Eventos

| Evento | Quando | Onde |
|--------|--------|------|
| **Lead** | Formulário enviado com sucesso (`/api/lead` ok) | Pixel + CAPI via fluxo do lead |
| **Contact** | Clique em WhatsApp, `tel:` ou `mailto:` | Pixel + `POST /api/meta-events` |
| **ViewContent** | Páginas de solução/produto | Pixel + `POST /api/meta-events` |

Páginas com ViewContent: `/sensoriamento/`, `/sequenciamento/`, `/producao/`, `/sensores/`, `/atuacao/`, `/cmms/`.

Search **não** é implementado (site sem busca interna relevante).

## Variáveis de ambiente (somente backend)

```env
META_CAPI_ENABLED=true
META_PIXEL_ID=893387710059296
META_CAPI_ACCESS_TOKEN=
META_GRAPH_API_VERSION=v26.0
META_CAPI_TEST_EVENT_CODE=
META_SITE_DOMAIN=mestti.com.br
META_CAPI_TIMEOUT_SECONDS=8
```

Regras:

- `META_CAPI_ACCESS_TOKEN` existe **apenas** no backend (`.env` local / Environment Variables da Vercel).
- Nunca use prefixos `VITE_`, `REACT_APP_`, `NEXT_PUBLIC_` para o token.
- Em produção, deixe `META_CAPI_TEST_EVENT_CODE` vazio.
- O arquivo `.env` real não deve ser versionado (já coberto pelo `.gitignore`).

## Dados enviados à Meta

### Lead (`user_data`)

Quando disponíveis, após normalização + SHA-256:

- `em` (e-mail)
- `ph` (telefone)
- `fn` / `ln` (nome / sobrenome)
- `external_id` (sessionId do lead)

Sem hash:

- `client_ip_address`
- `client_user_agent`
- `fbp`, `fbc` (cookies do Pixel, se existirem)

E-mails sintéticos `*@lead.mestti.local` **não** são enviados.

### Contact / ViewContent

- IP, User-Agent, `fbp`/`fbc` quando existirem
- `external_id` somente se houver identificação legítima
- `custom_data.contact_method`: `whatsapp` | `phone` | `email`
- ViewContent: `content_name`, `content_category`, `content_type`

O conteúdo de mensagens do formulário **não** é enviado à Meta.

## Consentimento

Banner mínimo de cookies de marketing (`js/meta-consent.js`):

- Pixel e eventos de marketing só após **Aceitar**
- Preferência em `localStorage` (`mestti_marketing_consent`)
- Botão flutuante **Cookies** para revisar a escolha
- Lead CAPI só é enviado se o frontend mandar `marketingConsent: true`

Esta implementação **não** garante, por si só, conformidade jurídica (LGPD/GDPR).

## Deduplicação

1. Frontend gera UUID (`generateMetaEventId`)
2. Mesmo `event_id` vai no Pixel (`eventID`) e na CAPI (`event_id`)
3. Backend **não** gera outro ID quando o cliente já enviou um válido

## Arquitetura

```
lib/meta-hash.js          → normalização + SHA-256
lib/meta-conversions.js   → MetaConversionsService (Graph API)
lib/meta-request.js       → IP, validação, rate limit
lib/meta-lead.js          → agenda Lead após /api/lead
api/lead.js               → e-mail + agenda CAPI Lead
api/meta-events.js        → Contact / ViewContent
js/meta-consent.js        → consentimento
js/meta-pixel.js          → Pixel + Contact/ViewContent
js/script.js              → Lead após sucesso do formulário
```

Endpoint CAPI:

`POST https://graph.facebook.com/{version}/{pixel_id}/events`

## Testes automatizados

```bash
npm test
```

Os testes mockam `fetch` e **não** chamam a API real da Meta.

## Teste manual (Gerenciador de Eventos)

1. Abra o [Gerenciador de Eventos](https://business.facebook.com/events_manager2) → seu dataset → **Testar eventos**.
2. Copie o código de teste (ex.: `TEST12345`).
3. Defina temporariamente `META_CAPI_TEST_EVENT_CODE=TEST12345` no `.env` (local) ou na Vercel (Preview).
4. Reinicie o backend (`npm run dev`) ou redeploy.
5. No site, **aceite** cookies de marketing.
6. Acesse `/sensoriamento/` → confirme **ViewContent** (navegador + servidor).
7. Clique no WhatsApp → confirme **Contact**.
8. Envie um formulário válido → confirme **Lead**.
9. Verifique deduplicação (mesmo `event_id` / evento único consolidado).
10. **Remova** `META_CAPI_TEST_EVENT_CODE` antes da produção.

### Inspecionar resposta em desenvolvimento

Com `META_CAPI_ENABLED=true` e token configurado, o backend registra logs seguros:

```text
[meta-capi] response { event_name, event_id, status, error_code, duration_ms, attempt, test_mode }
```

Nunca são logados: token, e-mail, telefone, nome, payload completo, hashes, cookies `fbp`/`fbc`.
