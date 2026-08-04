import { getMetaConversionsService } from '../lib/meta-conversions.js';
import {
  checkRateLimit,
  getClientIp,
  getClientUserAgent,
  isAllowedEventName,
  isAllowedEventSourceUrl,
  isValidEventId,
  sanitizeCookieToken,
  sanitizeCustomData,
} from '../lib/meta-request.js';

/**
 * POST /api/meta-events
 * Aceita Contact e ViewContent (Lead vai pelo fluxo /api/lead).
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`meta:${ip || 'unknown'}`, { windowMs: 60_000, max: 40 });
    if (!rate.allowed) {
      return res.status(429).json({ ok: false, error: 'rate_limited' });
    }

    const raw = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    // Nunca aceitar access_token ou payload arbitrário da Meta
    if (raw.access_token != null || raw.accessToken != null) {
      return res.status(400).json({ ok: false, error: 'invalid_payload' });
    }

    const eventName = typeof raw.eventName === 'string' ? raw.eventName.trim() : '';
    if (!isAllowedEventName(eventName, { publicOnly: true })) {
      return res.status(400).json({ ok: false, error: 'event_not_allowed' });
    }

    const eventId = typeof raw.eventId === 'string' ? raw.eventId.trim() : '';
    if (!isValidEventId(eventId)) {
      return res.status(400).json({ ok: false, error: 'invalid_event_id' });
    }

    const meta = getMetaConversionsService();
    const eventSourceUrl =
      typeof raw.eventSourceUrl === 'string' ? raw.eventSourceUrl.trim() : '';

    if (!isAllowedEventSourceUrl(eventSourceUrl, meta.siteDomain)) {
      return res.status(400).json({ ok: false, error: 'invalid_event_source_url' });
    }

    const fbp = sanitizeCookieToken(raw.fbp);
    const fbc = sanitizeCookieToken(raw.fbc);
    const externalId =
      typeof raw.externalId === 'string' ? raw.externalId.trim().slice(0, 128) : '';
    const customData = sanitizeCustomData(raw.customData);
    const userAgent = getClientUserAgent(req);

    const baseParams = {
      eventId,
      eventSourceUrl,
      clientIpAddress: ip,
      clientUserAgent: userAgent,
      fbp: fbp || undefined,
      fbc: fbc || undefined,
      externalId: externalId || undefined,
      customData,
    };

    // Aguarda CAPI (timeout curto) para não perder o evento no freeze do serverless.
    // Falha da Meta nunca vira 500 para o visitante.
    try {
      if (eventName === 'Contact') {
        const contactMethod =
          typeof raw.contactMethod === 'string'
            ? raw.contactMethod.trim().slice(0, 32)
            : customData?.contact_method;
        await meta.sendContact({ ...baseParams, contactMethod });
      } else {
        await meta.sendViewContent(baseParams);
      }
    } catch {
      /* já logado no serviço */
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[meta-events] error', { error: err?.message || 'unknown' });
    return res.status(200).json({ ok: true, warning: 'accepted_with_error' });
  }
}
