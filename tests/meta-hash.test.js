import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeEmail,
  hashEmail,
  normalizePhone,
  hashPhone,
  normalizeNamePart,
  hashNamePart,
  hashExternalId,
  sha256Hex,
  buildHashedUserData,
  splitFullName,
} from '../lib/meta-hash.js';

describe('normalizeEmail', () => {
  it('remove espaços e converte para minúsculas', () => {
    assert.equal(normalizeEmail('  Joao@Mestti.COM.BR '), 'joao@mestti.com.br');
  });

  it('retorna vazio para null/undefined', () => {
    assert.equal(normalizeEmail(null), '');
    assert.equal(normalizeEmail(undefined), '');
  });
});

describe('normalizePhone (BR)', () => {
  it('remove máscara e adiciona 55 para DDD+número', () => {
    assert.equal(normalizePhone('(14) 97400-7797'), '5514974007797');
  });

  it('não duplica 55 se já existir', () => {
    assert.equal(normalizePhone('+55 14 97400-7797'), '5514974007797');
  });

  it('mantém apenas dígitos', () => {
    assert.equal(normalizePhone('14.97400.7797'), '5514974007797');
  });
});

describe('normalizeNamePart', () => {
  it('minúsculas, trim e remove acentos', () => {
    assert.equal(normalizeNamePart('  José   Ângelo '), 'jose angelo');
  });
});

describe('SHA-256', () => {
  it('é determinístico', () => {
    const a = sha256Hex('teste');
    const b = sha256Hex('teste');
    assert.equal(a, b);
    assert.equal(a.length, 64);
  });

  it('hashEmail bate com normalização + sha256', () => {
    assert.equal(hashEmail('  A@B.COM '), sha256Hex('a@b.com'));
  });

  it('hashPhone usa telefone normalizado', () => {
    assert.equal(hashPhone('(14) 97400-7797'), sha256Hex('5514974007797'));
  });

  it('hashNamePart usa nome normalizado', () => {
    assert.equal(hashNamePart('José'), sha256Hex('jose'));
  });

  it('hashExternalId normaliza id', () => {
    assert.equal(hashExternalId(' ABC-123 '), sha256Hex('abc-123'));
  });
});

describe('buildHashedUserData', () => {
  it('monta Lead com hashes e sem hashear IP/UA/fbp/fbc', () => {
    const data = buildHashedUserData({
      email: 'lead@mestti.com.br',
      phone: '14974007797',
      fullName: 'Maria Silva',
      externalId: 'sess-1',
      clientIpAddress: '203.0.113.10',
      clientUserAgent: 'TestAgent/1.0',
      fbp: 'fb.1.123.456',
      fbc: 'fb.1.123.789',
    });

    assert.deepEqual(data.em, [sha256Hex('lead@mestti.com.br')]);
    assert.deepEqual(data.ph, [sha256Hex('5514974007797')]);
    assert.deepEqual(data.fn, [sha256Hex('maria')]);
    assert.deepEqual(data.ln, [sha256Hex('silva')]);
    assert.deepEqual(data.external_id, [sha256Hex('sess-1')]);
    assert.equal(data.client_ip_address, '203.0.113.10');
    assert.equal(data.client_user_agent, 'TestAgent/1.0');
    assert.equal(data.fbp, 'fb.1.123.456');
    assert.equal(data.fbc, 'fb.1.123.789');
  });

  it('remove campos vazios', () => {
    const data = buildHashedUserData({
      email: '  ',
      phone: '',
      fullName: '',
      clientIpAddress: '1.2.3.4',
    });
    assert.equal(data.em, undefined);
    assert.equal(data.ph, undefined);
    assert.equal(data.fn, undefined);
    assert.equal(data.ln, undefined);
    assert.equal(data.client_ip_address, '1.2.3.4');
  });

  it('splitFullName separa sobrenome', () => {
    assert.deepEqual(splitFullName('Ana Paula Costa'), {
      firstName: 'Ana Paula',
      lastName: 'Costa',
    });
  });
});
