import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import {
  MetaConversionsService,
  resetMetaConversionsService,
} from '../lib/meta-conversions.js';
import {
  isAllowedEventName,
  isAllowedEventSourceUrl,
  isValidEventId,
} from '../lib/meta-request.js';
import { sha256Hex } from '../lib/meta-hash.js';

const EVENT_ID = '11111111-2222-4333-a444-555555555555';

function makeService(overrides = {}) {
  return new MetaConversionsService({
    META_CAPI_ENABLED: 'true',
    META_PIXEL_ID: '893387710059296',
    META_CAPI_ACCESS_TOKEN: 'test-token-secret',
    META_GRAPH_API_VERSION: 'v26.0',
    META_CAPI_TEST_EVENT_CODE: '',
    META_SITE_DOMAIN: 'mestti.com.br',
    META_CAPI_TIMEOUT_SECONDS: '2',
    ...overrides,
  });
}

describe('validação de eventos e URLs', () => {
  it('rejeita evento não permitido no endpoint público', () => {
    assert.equal(isAllowedEventName('Purchase', { publicOnly: true }), false);
    assert.equal(isAllowedEventName('Lead', { publicOnly: true }), false);
    assert.equal(isAllowedEventName('Contact', { publicOnly: true }), true);
    assert.equal(isAllowedEventName('ViewContent', { publicOnly: true }), true);
  });

  it('rejeita URL externa', () => {
    assert.equal(isAllowedEventSourceUrl('https://evil.com/x'), false);
    assert.equal(isAllowedEventSourceUrl('https://mestti.com.br/sensoriamento/'), true);
    assert.equal(isAllowedEventSourceUrl('http://127.0.0.1:5500/'), true);
  });

  it('valida event_id UUID', () => {
    assert.equal(isValidEventId(EVENT_ID), true);
    assert.equal(isValidEventId('not-a-uuid'), false);
    assert.equal(isValidEventId(''), false);
  });
});

describe('montagem de payloads', () => {
  it('monta payload Lead com event_id e action_source website', () => {
    const svc = makeService();
    const userData = svc.buildLeadUserData({
      email: 'a@b.com',
      phone: '14974007797',
      fullName: 'João Souza',
      externalId: 'lead-1',
      clientIpAddress: '203.0.113.5',
      clientUserAgent: 'UA',
      fbp: 'fb.1.1.1',
      fbc: 'fb.1.1.2',
    });

    const payload = svc.buildPayload({
      eventName: 'Lead',
      eventId: EVENT_ID,
      eventSourceUrl: 'https://mestti.com.br/contato/',
      userData,
      eventTime: 1700000000,
    });

    assert.equal(payload.data.length, 1);
    assert.equal(payload.data[0].event_name, 'Lead');
    assert.equal(payload.data[0].event_id, EVENT_ID);
    assert.equal(payload.data[0].action_source, 'website');
    assert.equal(payload.data[0].event_time, 1700000000);
    assert.equal(payload.data[0].event_source_url, 'https://mestti.com.br/contato/');
    assert.deepEqual(payload.data[0].user_data.em, [sha256Hex('a@b.com')]);
    assert.equal(payload.data[0].user_data.client_ip_address, '203.0.113.5');
    assert.equal(payload.data[0].user_data.fbp, 'fb.1.1.1');
    assert.equal(payload.test_event_code, undefined);
  });

  it('monta payload Contact com contact_method', () => {
    const svc = makeService();
    const userData = svc.buildContactUserData({
      clientIpAddress: '203.0.113.5',
      clientUserAgent: 'UA',
    });
    const payload = svc.buildPayload({
      eventName: 'Contact',
      eventId: EVENT_ID,
      eventSourceUrl: 'https://mestti.com.br/',
      userData,
      customData: { contact_method: 'whatsapp' },
    });
    assert.equal(payload.data[0].event_name, 'Contact');
    assert.equal(payload.data[0].custom_data.contact_method, 'whatsapp');
    assert.equal(payload.data[0].user_data.em, undefined);
  });

  it('monta payload ViewContent com custom_data de produto', () => {
    const svc = makeService();
    const payload = svc.buildPayload({
      eventName: 'ViewContent',
      eventId: EVENT_ID,
      eventSourceUrl: 'https://mestti.com.br/sensoriamento/',
      userData: { client_ip_address: '1.1.1.1', client_user_agent: 'UA' },
      customData: {
        content_name: 'Sensoriamento industrial',
        content_category: 'Solução Mestti',
        content_type: 'product',
      },
    });
    assert.equal(payload.data[0].event_name, 'ViewContent');
    assert.equal(payload.data[0].custom_data.content_type, 'product');
  });

  it('inclui test_event_code somente quando configurado', () => {
    const withCode = makeService({ META_CAPI_TEST_EVENT_CODE: 'TEST12345' });
    const payload = withCode.buildPayload({
      eventName: 'Contact',
      eventId: EVENT_ID,
      eventSourceUrl: 'https://mestti.com.br/',
      userData: {},
    });
    assert.equal(payload.test_event_code, 'TEST12345');

    const without = makeService({ META_CAPI_TEST_EVENT_CODE: '' });
    const payload2 = without.buildPayload({
      eventName: 'Contact',
      eventId: EVENT_ID,
      eventSourceUrl: 'https://mestti.com.br/',
      userData: {},
    });
    assert.equal(payload2.test_event_code, undefined);
  });

  it('usa o mesmo event_id para deduplicação (navegador/servidor)', () => {
    const svc = makeService();
    const browserEventId = EVENT_ID;
    const payload = svc.buildPayload({
      eventName: 'Lead',
      eventId: browserEventId,
      eventSourceUrl: 'https://mestti.com.br/',
      userData: {},
    });
    assert.equal(payload.data[0].event_id, browserEventId);
  });
});

describe('envio HTTP (mock)', () => {
  let originalFetch;
  let logs;

  beforeEach(() => {
    resetMetaConversionsService();
    originalFetch = globalThis.fetch;
    logs = [];
    mock.method(console, 'info', (...args) => {
      logs.push(['info', ...args]);
    });
    mock.method(console, 'error', (...args) => {
      logs.push(['error', ...args]);
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    mock.restoreAll();
  });

  it('trata timeout sem lançar', async () => {
    globalThis.fetch = async () => {
      const err = new Error('Aborted');
      err.name = 'AbortError';
      throw err;
    };

    const svc = makeService({ META_CAPI_TIMEOUT_SECONDS: '1' });
    // força 0 retries efetivos extras reduzindo — ainda tenta maxRetries+1
    svc.maxRetries = 0;
    const result = await svc.sendEvent({
      eventName: 'Contact',
      eventId: EVENT_ID,
      eventSourceUrl: 'https://mestti.com.br/',
      userData: {},
    });
    assert.equal(result.ok, false);
    assert.equal(result.error, 'timeout');
  });

  it('repete em HTTP 429 e eventualmente retorna erro', async () => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls += 1;
      return {
        ok: false,
        status: 429,
        async json() {
          return { error: { code: 4, message: 'rate' } };
        },
      };
    };

    const svc = makeService();
    svc.maxRetries = 2;
    const result = await svc.sendContact({
      eventId: EVENT_ID,
      eventSourceUrl: 'https://mestti.com.br/',
      clientIpAddress: '1.1.1.1',
      clientUserAgent: 'UA',
      contactMethod: 'phone',
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 429);
    assert.equal(calls, 3); // 1 + 2 retries
  });

  it('não registra o access token nos logs', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      async json() {
        return { events_received: 1 };
      },
    });

    const svc = makeService();
    await svc.sendViewContent({
      eventId: EVENT_ID,
      eventSourceUrl: 'https://mestti.com.br/sensoriamento/',
      clientIpAddress: '1.1.1.1',
      clientUserAgent: 'UA',
      customData: { content_name: 'Sensoriamento industrial' },
    });

    const serialized = JSON.stringify(logs);
    assert.equal(serialized.includes('test-token-secret'), false);
    assert.equal(serialized.includes('access_token'), false);
  });

  it('não envia token no body JSON', async () => {
    let sentBody = '';
    globalThis.fetch = async (_url, opts) => {
      sentBody = opts.body;
      return {
        ok: true,
        status: 200,
        async json() {
          return { events_received: 1 };
        },
      };
    };

    const svc = makeService({ META_CAPI_TEST_EVENT_CODE: 'TESTCODE' });
    await svc.sendLead({
      eventId: EVENT_ID,
      eventSourceUrl: 'https://mestti.com.br/',
      email: 'x@y.com',
      fullName: 'Test User',
      clientIpAddress: '1.1.1.1',
      clientUserAgent: 'UA',
    });

    const parsed = JSON.parse(sentBody);
    assert.equal(parsed.access_token, undefined);
    assert.equal(parsed.test_event_code, 'TESTCODE');
    assert.equal(parsed.data[0].event_id, EVENT_ID);
  });

  it('skip quando CAPI desabilitada', async () => {
    let called = false;
    globalThis.fetch = async () => {
      called = true;
      return { ok: true, status: 200, async json() { return {}; } };
    };
    const svc = makeService({ META_CAPI_ENABLED: 'false' });
    const result = await svc.sendLead({
      eventId: EVENT_ID,
      eventSourceUrl: 'https://mestti.com.br/',
    });
    assert.equal(result.skipped, true);
    assert.equal(called, false);
  });
});
