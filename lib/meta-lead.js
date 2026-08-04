import { getMetaConversionsService } from './meta-conversions.js';
import {
  getClientIp,
  getClientUserAgent,
  isAllowedEventSourceUrl,
  isValidEventId,
  sanitizeCookieToken,
} from './meta-request.js';

/**
 * Extrai metadados Meta do body do lead (event_id, fbp, fbc, URL).
 */
export function extractMetaLeadFields(payload = {}) {
  const eventId =
    typeof payload.eventId === 'string'
      ? payload.eventId.trim()
      : typeof payload.metaEventId === 'string'
        ? payload.metaEventId.trim()
        : '';

  const fbp = sanitizeCookieToken(payload.fbp);
  const fbc = sanitizeCookieToken(payload.fbc);

  let eventSourceUrl = '';
  if (typeof payload.eventSourceUrl === 'string') {
    eventSourceUrl = payload.eventSourceUrl.trim();
  } else if (typeof payload.pageUrl === 'string') {
    eventSourceUrl = payload.pageUrl.trim();
  } else if (typeof payload.pagePath === 'string' && payload.pagePath.trim()) {
    const domain = process.env.META_SITE_DOMAIN || 'mestti.com.br';
    const path = payload.pagePath.startsWith('/') ? payload.pagePath : `/${payload.pagePath}`;
    eventSourceUrl = `https://${domain}${path}`;
  }

  const externalId =
    typeof payload.sessionId === 'string' && payload.sessionId.trim()
      ? payload.sessionId.trim()
      : typeof payload.externalId === 'string'
        ? payload.externalId.trim()
        : '';

  return { eventId, fbp, fbc, eventSourceUrl, externalId };
}

/**
 * Envia Lead na CAPI após salvamento bem-sucedido do lead.
 * Nunca lança — falhas da Meta são logadas com segurança.
 */
export async function scheduleLeadMetaEvent(req, payload = {}) {
  try {
    const meta = getMetaConversionsService();
    if (!meta.isConfigured()) return { ok: true, skipped: true };

    // Respeita consentimento de marketing enviado pelo frontend
    const consent =
      payload.marketingConsent === true ||
      payload.marketingConsent === 'true' ||
      payload.marketingConsent === 1;
    if (!consent) {
      return { ok: true, skipped: true, reason: 'no_marketing_consent' };
    }

    const fields = extractMetaLeadFields(payload);
    if (!isValidEventId(fields.eventId)) {
      console.error('[meta-capi] lead_skip', { reason: 'invalid_event_id' });
      return { ok: false, error: 'invalid_event_id' };
    }

    if (!isAllowedEventSourceUrl(fields.eventSourceUrl, meta.siteDomain)) {
      console.error('[meta-capi] lead_skip', { reason: 'invalid_event_source_url' });
      return { ok: false, error: 'invalid_event_source_url' };
    }

    const ddiDigits = String(payload.ddi || '').replace(/\D/g, '');
    const phoneDigits = String(payload.phone || '').replace(/\D/g, '');
    const phoneFull =
      ddiDigits && phoneDigits && !phoneDigits.startsWith(ddiDigits)
        ? `${ddiDigits}${phoneDigits}`
        : phoneDigits || ddiDigits;

    const email = typeof payload.email === 'string' ? payload.email.trim() : '';
    // Não enviar e-mail sintético whatsapp+...@lead.mestti.local como PII
    const safeEmail =
      email && !email.endsWith('@lead.mestti.local') ? email : '';

    return await meta.sendLead({
      eventId: fields.eventId,
      eventSourceUrl: fields.eventSourceUrl,
      email: safeEmail,
      phone: phoneFull,
      fullName: typeof payload.name === 'string' ? payload.name : '',
      externalId: fields.externalId,
      clientIpAddress: getClientIp(req),
      clientUserAgent: getClientUserAgent(req),
      fbp: fields.fbp,
      fbc: fields.fbc,
    });
  } catch (err) {
    console.error('[meta-capi] lead_schedule_error', { error: err?.message || 'unknown' });
    return { ok: false, error: 'lead_schedule_error' };
  }
}
