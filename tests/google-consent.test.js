import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import vm from 'node:vm';

const loader = readFileSync('js/google-consent.js', 'utf8');
function setup(initial = { analytics: false, marketing: false }) {
  let current = initial;
  let listener;
  const scripts = [];
  const window = { MesttiConsent: {
    hasMarketingConsent: () => current.marketing,
    hasAnalyticsConsent: () => current.analytics,
    onConsentChange: (callback) => { listener = callback; },
  } };
  const document = { createElement: () => ({}), head: { appendChild: (el) => scripts.push(el) } };
  vm.runInNewContext(loader, { window, document, Date });
  return { window, scripts, choose(value) { current = value; listener(value.marketing); } };
}
test('não carrega tags sem consentimento', () => {
  const app = setup();
  app.choose({ analytics: false, marketing: false });
  assert.equal(app.scripts.length, 0);
});
for (const [name, choice, expected] of [
  ['análise', {analytics: true, marketing: false}, ['G-9K4NZHC0WT']],
  ['marketing', {analytics: false, marketing: true}, ['AW-11486484316']],
  ['ambos', {analytics: true, marketing: true}, ['G-9K4NZHC0WT','AW-11486484316']],
]) test(`configura apenas ${name}`, () => {
  const app = setup();
  app.choose(choice);
  app.choose(choice);
  assert.equal(app.scripts.length, 1);
  const commands = Array.from(app.window.dataLayer, args => Array.from(args));
  assert.equal(commands[0][1], 'default');
  assert.equal(commands[0][2].analytics_storage, 'denied');
  const configs = commands.filter(x => x[0] === 'config').map(x => x[1]);
  assert.deepEqual(configs, expected);
  const update = commands.find(x => x[0] === 'consent' && x[1] === 'update');
  assert.equal(update[2].analytics_storage, choice.analytics ? 'granted' : 'denied');
  assert.equal(update[2].ad_storage, choice.marketing ? 'granted' : 'denied');
  app.choose({ analytics: false, marketing: false });
  const last = Array.from(app.window.dataLayer.at(-1));
  assert.equal(last[2].ad_storage, 'denied');
});
test('páginas não carregam tag diretamente e usam consentimento', () => {
  function files(dir) {
    return readdirSync(dir).flatMap(entry => {
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
  assert.equal(checked, 23);
});
