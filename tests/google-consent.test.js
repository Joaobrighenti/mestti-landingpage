import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import vm from 'node:vm';

const loader = readFileSync('js/google-consent.js', 'utf8');
function setup(accepted = false) {
  let current = accepted;
  let listener;
  const scripts = [];
  const window = { MesttiConsent: {
    hasMarketingConsent: () => current,
    onConsentChange: (callback) => { listener = callback; },
  } };
  const document = { createElement: () => ({}), head: { appendChild: (el) => scripts.push(el) } };
  vm.runInNewContext(loader, { window, document, Date });
  return { window, scripts, choose(value) { current = value; listener(value); } };
}
test('a tag não é carregada antes do aceite ou após recusa', () => {
  const app = setup();
  assert.equal(app.scripts.length, 0);
  app.choose(false);
  assert.equal(app.scripts.length, 0);
});
test('aceite carrega uma vez, configura consentimento e revogação', () => {
  const app = setup();
  app.choose(true);
  app.choose(true);
  assert.equal(app.scripts.length, 1);
  assert.match(app.scripts[0].src, /^https:\/\/www\.googletagmanager\.com\/gtag\/js/);
  const commands = app.window.dataLayer.map((args) => Array.from(args));
  assert.equal(commands[0][0], 'consent');
  assert.equal(commands[0][1], 'default');
  assert.equal(commands[1][0], 'consent');
  assert.equal(commands[1][1], 'update');
  assert.equal(commands[2][0], 'js');
  assert.equal(commands[0][2].analytics_storage, 'denied');
  assert.equal(commands[1][2].analytics_storage, 'granted');
  app.choose(false);
  const last = Array.from(app.window.dataLayer.at(-1));
  assert.equal(last[1], 'update');
  assert.equal(last[2].ad_storage, 'denied');
  assert.equal(app.window['ga-disable-G-9K4NZHC0WT'], true);
});
test('a decisão aceita é retomada na navegação seguinte', () => {
  assert.equal(setup(true).scripts.length, 1);
});
test('páginas com tags usam o carregador após o controle de consentimento', () => {
  function files(dir) {
    return readdirSync(dir).flatMap((entry) => {
      const path = dir === '.' ? entry : `${dir}/${entry}`;
      if (['node_modules', 'public', '.git'].includes(entry)) return [];
      return statSync(path).isDirectory() ? files(path) : path.endsWith('.html') ? [path] : [];
    });
  }
  let checked = 0;
  for (const file of files('.')) {
    const html = readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /googletagmanager\.com\/gtag\/js/);
    if (!html.includes('google-consent.js')) continue;
    checked++;
    assert.ok(html.indexOf('meta-consent.js') < html.indexOf('google-consent.js'), file);
  }
  assert.equal(checked, 22);
});
