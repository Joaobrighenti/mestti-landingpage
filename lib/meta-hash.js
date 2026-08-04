import { createHash } from 'node:crypto';

/**
 * Normalização e SHA-256 para Meta Conversions API (user_data).
 * Campos client_ip_address, client_user_agent, fbp e fbc NÃO devem ser hasheados.
 */

export function sha256Hex(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

export function normalizeEmail(email) {
  if (email == null) return '';
  return String(email).trim().toLowerCase();
}

export function hashEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return '';
  return sha256Hex(normalized);
}

/**
 * Telefone: apenas dígitos; BR com DDD sem país → prefixo 55.
 */
export function normalizePhone(phone, { defaultCountryCode = '55' } = {}) {
  if (phone == null) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  // BR: 10–11 dígitos (DDD + número) sem código do país
  if (
    defaultCountryCode === '55' &&
    (digits.length === 10 || digits.length === 11) &&
    !digits.startsWith('55')
  ) {
    digits = `55${digits}`;
  }

  return digits;
}

export function hashPhone(phone, options) {
  const normalized = normalizePhone(phone, options);
  if (!normalized) return '';
  return sha256Hex(normalized);
}

function stripDiacritics(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalizeNamePart(value) {
  if (value == null) return '';
  return stripDiacritics(String(value).trim().toLowerCase().replace(/\s+/g, ' '));
}

export function hashNamePart(value) {
  const normalized = normalizeNamePart(value);
  if (!normalized) return '';
  return sha256Hex(normalized);
}

/**
 * Divide nome completo em first / last (último token = sobrenome).
 */
export function splitFullName(fullName) {
  const normalized = String(fullName || '')
    .trim()
    .replace(/\s+/g, ' ');
  if (!normalized) {
    return { firstName: '', lastName: '' };
  }
  const parts = normalized.split(' ');
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts[parts.length - 1],
  };
}

export function normalizeExternalId(id) {
  if (id == null) return '';
  return String(id).trim().toLowerCase();
}

export function hashExternalId(id) {
  const normalized = normalizeExternalId(id);
  if (!normalized) return '';
  return sha256Hex(normalized);
}

/**
 * Monta user_data da Meta: hasheia em/ph/fn/ln/external_id; não hasheia IP/UA/fbp/fbc.
 * Omite campos vazios.
 */
export function buildHashedUserData({
  email,
  phone,
  firstName,
  lastName,
  fullName,
  externalId,
  clientIpAddress,
  clientUserAgent,
  fbp,
  fbc,
} = {}) {
  const userData = {};

  let fn = firstName;
  let ln = lastName;
  if ((!fn || !ln) && fullName) {
    const split = splitFullName(fullName);
    fn = fn || split.firstName;
    ln = ln || split.lastName;
  }

  const em = hashEmail(email);
  if (em) userData.em = [em];

  const ph = hashPhone(phone);
  if (ph) userData.ph = [ph];

  const fnHash = hashNamePart(fn);
  if (fnHash) userData.fn = [fnHash];

  const lnHash = hashNamePart(ln);
  if (lnHash) userData.ln = [lnHash];

  const ext = hashExternalId(externalId);
  if (ext) userData.external_id = [ext];

  const ip = typeof clientIpAddress === 'string' ? clientIpAddress.trim() : '';
  if (ip) userData.client_ip_address = ip;

  const ua = typeof clientUserAgent === 'string' ? clientUserAgent.trim() : '';
  if (ua) userData.client_user_agent = ua;

  const fbpVal = typeof fbp === 'string' ? fbp.trim() : '';
  if (fbpVal) userData.fbp = fbpVal;

  const fbcVal = typeof fbc === 'string' ? fbc.trim() : '';
  if (fbcVal) userData.fbc = fbcVal;

  return userData;
}
