import { buildHashedUserData } from './meta-hash.js';
import { isValidEventId } from './meta-request.js';

const ALLOWED_EVENTS = new Set(['Lead', 'Contact', 'ViewContent']);

/**
 * Serviço isolado para Meta Conversions API.
 * Token permanece apenas em variáveis de ambiente do backend.
 */
export class MetaConversionsService {
  constructor(env = process.env) {
    this.enabled = String(env.META_CAPI_ENABLED || '').toLowerCase() === 'true';
    this.pixelId = String(env.META_PIXEL_ID || '').trim();
    this.accessToken = String(env.META_CAPI_ACCESS_TOKEN || '').trim();
    this.apiVersion = String(env.META_GRAPH_API_VERSION || 'v26.0').trim() || 'v26.0';
    this.testEventCode = String(env.META_CAPI_TEST_EVENT_CODE || '').trim();
    this.siteDomain = String(env.META_SITE_DOMAIN || 'mestti.com.br').trim() || 'mestti.com.br';
    this.timeoutSeconds = Math.min(
      30,
      Math.max(1, Number(env.META_CAPI_TIMEOUT_SECONDS) || 8)
    );
    this.maxRetries = 2;
  }

  isConfigured() {
    return Boolean(this.enabled && this.pixelId && this.accessToken);
  }

  getEndpointUrl() {
    return `https://graph.facebook.com/${this.apiVersion}/${this.pixelId}/events`;
  }

  /**
   * Monta o payload oficial da Graph API (sem access_token no body).
   */
  buildPayload({
    eventName,
    eventId,
    eventSourceUrl,
    userData = {},
    customData,
    eventTime,
  }) {
    if (!ALLOWED_EVENTS.has(eventName)) {
      throw new Error('meta_event_not_allowed');
    }
    if (!isValidEventId(eventId)) {
      throw new Error('meta_invalid_event_id');
    }

    const event = {
      event_name: eventName,
      event_time: eventTime || Math.floor(Date.now() / 1000),
      event_id: eventId.trim(),
      action_source: 'website',
      user_data: userData && typeof userData === 'object' ? userData : {},
    };

    if (eventSourceUrl) {
      event.event_source_url = eventSourceUrl;
    }

    if (customData && typeof customData === 'object' && Object.keys(customData).length) {
      event.custom_data = customData;
    }

    const payload = { data: [event] };

    if (this.testEventCode) {
      payload.test_event_code = this.testEventCode;
    }

    return payload;
  }

  buildLeadUserData(input = {}) {
    return buildHashedUserData({
      email: input.email,
      phone: input.phone,
      firstName: input.firstName,
      lastName: input.lastName,
      fullName: input.fullName || input.name,
      externalId: input.externalId,
      clientIpAddress: input.clientIpAddress,
      clientUserAgent: input.clientUserAgent,
      fbp: input.fbp,
      fbc: input.fbc,
    });
  }

  buildContactUserData(input = {}) {
    const data = buildHashedUserData({
      externalId: input.externalId,
      clientIpAddress: input.clientIpAddress,
      clientUserAgent: input.clientUserAgent,
      fbp: input.fbp,
      fbc: input.fbc,
    });
    return data;
  }

  buildViewContentUserData(input = {}) {
    return this.buildContactUserData(input);
  }

  async sendLead(params) {
    const userData = this.buildLeadUserData(params);
    return this.sendEvent({
      eventName: 'Lead',
      eventId: params.eventId,
      eventSourceUrl: params.eventSourceUrl,
      userData,
      customData: params.customData,
      eventTime: params.eventTime,
    });
  }

  async sendContact(params) {
    const userData = this.buildContactUserData(params);
    const customData = { ...(params.customData || {}) };
    if (params.contactMethod && !customData.contact_method) {
      customData.contact_method = params.contactMethod;
    }
    return this.sendEvent({
      eventName: 'Contact',
      eventId: params.eventId,
      eventSourceUrl: params.eventSourceUrl,
      userData,
      customData: Object.keys(customData).length ? customData : undefined,
      eventTime: params.eventTime,
    });
  }

  async sendViewContent(params) {
    const userData = this.buildViewContentUserData(params);
    return this.sendEvent({
      eventName: 'ViewContent',
      eventId: params.eventId,
      eventSourceUrl: params.eventSourceUrl,
      userData,
      customData: params.customData,
      eventTime: params.eventTime,
    });
  }

  /**
   * Envia evento à Meta com retries em 429/5xx e timeout.
   * Nunca propaga erro quebra de fluxo — retorna { ok, skipped?, error?, status? }.
   */
  async sendEvent({
    eventName,
    eventId,
    eventSourceUrl,
    userData,
    customData,
    eventTime,
  }) {
    if (!this.enabled) {
      return { ok: true, skipped: true, reason: 'disabled' };
    }
    if (!this.pixelId || !this.accessToken) {
      return { ok: true, skipped: true, reason: 'not_configured' };
    }

    let payload;
    try {
      payload = this.buildPayload({
        eventName,
        eventId,
        eventSourceUrl,
        userData,
        customData,
        eventTime,
      });
    } catch (err) {
      const code = err?.message || 'meta_payload_error';
      console.error('[meta-capi] payload_error', { event_name: eventName, event_id: eventId, error: code });
      return { ok: false, error: code };
    }

    const url = `${this.getEndpointUrl()}?access_token=${encodeURIComponent(this.accessToken)}`;
    const body = JSON.stringify(payload);
    const started = Date.now();

    let attempt = 0;
    let lastResult = { ok: false, error: 'unknown' };

    while (attempt <= this.maxRetries) {
      attempt += 1;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutSeconds * 1000);

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          signal: controller.signal,
        });

        const durationMs = Date.now() - started;
        let metaErrorCode = '';
        let responseJson = null;

        try {
          responseJson = await res.json();
          if (responseJson?.error?.code != null) {
            metaErrorCode = String(responseJson.error.code);
          } else if (responseJson?.error?.message) {
            metaErrorCode = 'meta_api_error';
          }
        } catch {
          /* corpo não-JSON */
        }

        // Log seguro — sem token, PII, cookies ou payload completo
        console.info('[meta-capi] response', {
          event_name: eventName,
          event_id: eventId,
          status: res.status,
          error_code: metaErrorCode || undefined,
          duration_ms: durationMs,
          attempt,
          test_mode: Boolean(this.testEventCode),
        });

        if (res.ok) {
          return { ok: true, status: res.status, durationMs, eventsReceived: responseJson?.events_received };
        }

        lastResult = {
          ok: false,
          status: res.status,
          error: metaErrorCode || `http_${res.status}`,
          durationMs,
        };

        const retryable = res.status === 429 || res.status >= 500;
        if (!retryable || attempt > this.maxRetries) {
          return lastResult;
        }

        await sleep(backoffMs(attempt));
      } catch (err) {
        const durationMs = Date.now() - started;
        const isTimeout = err?.name === 'AbortError';
        const error = isTimeout ? 'timeout' : 'network_error';

        console.error('[meta-capi] request_failed', {
          event_name: eventName,
          event_id: eventId,
          error,
          duration_ms: durationMs,
          attempt,
        });

        lastResult = { ok: false, error, durationMs };

        if (attempt > this.maxRetries) {
          return lastResult;
        }
        await sleep(backoffMs(attempt));
      } finally {
        clearTimeout(timeout);
      }
    }

    return lastResult;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffMs(attempt) {
  return Math.min(2000, 200 * 2 ** (attempt - 1));
}

/** Instância singleton lazy (env lido na primeira chamada / criação). */
let defaultService = null;

export function getMetaConversionsService(env = process.env) {
  if (!defaultService) {
    defaultService = new MetaConversionsService(env);
  }
  return defaultService;
}

/** Para testes — reseta o singleton. */
export function resetMetaConversionsService() {
  defaultService = null;
}

/**
 * Agenda envio sem bloquear a resposta HTTP principal.
 * Em serverless, ainda aguarda o Promise se o caller usar await com catch.
 */
export function scheduleMetaSend(promiseFactory) {
  try {
    const p = promiseFactory();
    if (p && typeof p.then === 'function') {
      p.catch((err) => {
        console.error('[meta-capi] background_error', {
          error: err?.message || 'unknown',
        });
      });
      return p;
    }
  } catch (err) {
    console.error('[meta-capi] schedule_error', { error: err?.message || 'unknown' });
  }
  return Promise.resolve({ ok: false, error: 'schedule_failed' });
}
