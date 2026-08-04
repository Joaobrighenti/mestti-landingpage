/**
 * Helpers de requisição para Meta CAPI: IP, validação de event_id/URL, rate limit.
 */

const EVENT_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_EVENT_ID_LEN = 64;
const MAX_URL_LEN = 2048;
const MAX_STRING_FIELD = 256;
const MAX_CUSTOM_DATA_KEYS = 12;

const ALLOWED_EVENT_NAMES = new Set(['Lead', 'Contact', 'ViewContent']);
const PUBLIC_EVENT_NAMES = new Set(['Contact', 'ViewContent']);

/** Domínios/hosts permitidos para event_source_url */
const ALLOWED_HOSTS = new Set([
  'mestti.com.br',
  'www.mestti.com.br',
  'localhost',
  '127.0.0.1',
]);

/**
 * Extrai IP do cliente considerando proxies confiáveis (Vercel / Nginx).
 * Não confia cegamente em headers arbitrários do cliente.
 */
export function getClientIp(req) {
  const headers = req?.headers || {};

  // Vercel documenta este header como o IP do cliente
  const vercelIp = firstHeaderValue(headers['x-vercel-forwarded-for']);
  if (vercelIp && isPlausibleIp(vercelIp)) {
    return vercelIp;
  }

  const realIp = firstHeaderValue(headers['x-real-ip']);
  if (realIp && isPlausibleIp(realIp)) {
    return realIp;
  }

  // x-forwarded-for: primeiro hop (cliente original) quando atrás de proxy confiável
  const xff = firstHeaderValue(headers['x-forwarded-for']);
  if (xff) {
    const first = xff.split(',')[0].trim();
    if (isPlausibleIp(first)) return first;
  }

  const socketIp = req?.socket?.remoteAddress || req?.connection?.remoteAddress || '';
  return normalizeIp(socketIp);
}

function firstHeaderValue(value) {
  if (Array.isArray(value)) return String(value[0] || '').trim();
  if (value == null) return '';
  return String(value).split(',')[0].trim();
}

function normalizeIp(ip) {
  if (!ip) return '';
  let value = String(ip).trim();
  if (value.startsWith('::ffff:')) {
    value = value.slice(7);
  }
  return value;
}

function isPlausibleIp(ip) {
  const value = normalizeIp(ip);
  if (!value || value.length > 45) return false;
  // IPv4 simples ou IPv6 com ':'
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) return true;
  if (value.includes(':')) return true;
  return false;
}

export function getClientUserAgent(req) {
  const ua = req?.headers?.['user-agent'];
  if (!ua) return '';
  return String(Array.isArray(ua) ? ua[0] : ua).slice(0, 512);
}

export function isValidEventId(eventId) {
  if (typeof eventId !== 'string') return false;
  const id = eventId.trim();
  if (!id || id.length > MAX_EVENT_ID_LEN) return false;
  return EVENT_ID_RE.test(id);
}

export function isAllowedEventName(name, { publicOnly = false } = {}) {
  if (typeof name !== 'string') return false;
  const set = publicOnly ? PUBLIC_EVENT_NAMES : ALLOWED_EVENT_NAMES;
  return set.has(name);
}

export function isAllowedEventSourceUrl(url, siteDomain = 'mestti.com.br') {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.length > MAX_URL_LEN) return false;

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return false;
  }

  const host = parsed.hostname.toLowerCase();
  const allowed = new Set(ALLOWED_HOSTS);
  const domain = String(siteDomain || 'mestti.com.br').toLowerCase().replace(/^www\./, '');
  if (domain) {
    allowed.add(domain);
    allowed.add(`www.${domain}`);
  }

  return allowed.has(host);
}

export function sanitizeCookieToken(value, maxLen = 256) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLen) return '';
  // _fbp / _fbc: alfanumérico, ponto, hífen, underscore
  if (!/^[\w.-]+$/.test(trimmed)) return '';
  return trimmed;
}

export function sanitizeCustomData(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const out = {};
  let count = 0;
  for (const [key, value] of Object.entries(raw)) {
    if (count >= MAX_CUSTOM_DATA_KEYS) break;
    if (typeof key !== 'string' || key.length > 64) continue;
    if (value == null) continue;
    if (typeof value === 'number' && Number.isFinite(value)) {
      out[key] = value;
      count += 1;
      continue;
    }
    if (typeof value === 'string') {
      const v = value.trim().slice(0, MAX_STRING_FIELD);
      if (v) {
        out[key] = v;
        count += 1;
      }
    }
  }
  return Object.keys(out).length ? out : undefined;
}

/** Rate limit em memória (por instância serverless). */
const rateBuckets = new Map();

export function checkRateLimit(key, { windowMs = 60_000, max = 60 } = {}) {
  const now = Date.now();
  const bucketKey = String(key || 'unknown');
  let bucket = rateBuckets.get(bucketKey);

  if (!bucket || now - bucket.start >= windowMs) {
    bucket = { start: now, count: 0 };
    rateBuckets.set(bucketKey, bucket);
  }

  bucket.count += 1;

  // Limpeza ocasional
  if (rateBuckets.size > 5000) {
    for (const [k, b] of rateBuckets) {
      if (now - b.start >= windowMs) rateBuckets.delete(k);
    }
  }

  return {
    allowed: bucket.count <= max,
    remaining: Math.max(0, max - bucket.count),
  };
}

export const META_PUBLIC_LIMITS = {
  MAX_EVENT_ID_LEN,
  MAX_URL_LEN,
  MAX_STRING_FIELD,
  ALLOWED_EVENT_NAMES,
  PUBLIC_EVENT_NAMES,
};
