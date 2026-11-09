import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function setup(storage) {
    const elements = new Map();
    const document = {
        readyState: 'loading', addEventListener() {},
        documentElement: { classList: { remove() {} } },
        getElementById: id => elements.get(id),
        createElement: () => ({ setAttribute() {}, addEventListener() {} }),
        body: { appendChild: e => elements.set(e.id, e) },
    };
    const window = { location: { reload() {} } };
    vm.runInNewContext(fs.readFileSync('js/meta-consent.js', 'utf8'), { window, document, localStorage: storage });
    return window.MesttiConsent;
}

test('permite aceitar e recusar quando o navegador bloqueia armazenamento', () => {
    const consent = setup({ getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } });
    assert.equal(consent.hasDecided(), false);
    consent.acceptMarketing();
    assert.equal(consent.hasAnalyticsConsent(), true);
    assert.equal(consent.hasMarketingConsent(), true);
    consent.declineMarketing();
    assert.equal(consent.hasAnalyticsConsent(), false);
    assert.equal(consent.hasMarketingConsent(), false);
});

test('a escolha atual prevalece sobre um valor antigo que não pôde ser sobrescrito', () => {
    const consent = setup({ getItem: () => '{"analytics":true,"marketing":true}', setItem() { throw Error('readonly'); } });
    consent.declineMarketing();
    assert.equal(consent.hasMarketingConsent(), false);
    assert.equal(consent.hasAnalyticsConsent(), false);
});
