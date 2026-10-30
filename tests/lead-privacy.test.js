import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('cookies da Meta não são lidos nem incluídos sem autorização de marketing', () => {
  const source = readFileSync('js/script.js', 'utf8');
  const start = source.indexOf('function attachMetaLeadFields(');
  const end = source.indexOf('\nasync function sendLeadToApi', start);
  assert.ok(start >= 0 && end > start);
  let cookieReads = 0;
  const window = { location: { href: 'https://example.test/' }, MesttiMeta: { hasConsent: () => false, getMetaCookies: () => { cookieReads++; return { fbp: 'identificador' }; } } };
  const context = { window, crypto: { randomUUID: () => 'test-id' }, getOrCreateLeadSessionId: () => 'session' };
  const fn = vm.runInNewContext(source.slice(start, end) + '\nattachMetaLeadFields', context);
  const payload = {};
  fn(payload, {});
  assert.equal(cookieReads, 0);
  assert.equal('fbp' in payload, false);
  assert.equal('fbc' in payload, false);
  assert.equal(payload.marketingConsent, false);
});
