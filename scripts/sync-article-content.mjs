// O HTML entregue deve conter o mesmo português que a interface traduz.
// Edite o dicionário existente e rode npm run content:sync; o build detecta drift.
import fs from 'node:fs';
import vm from 'node:vm';

const check = process.argv.includes('--check');
const articles = [
  ['rkw', 'como-calcular-preco-venda-industria-rkw-custo-processo'],
  ['sensoriamento', 'sensoriamento-industrial-apontamento-manual-dados-tempo-real'],
];
let changed = false;
for (const [name, slug] of articles) {
  const context = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(`js/i18n-${name}-content.js`, 'utf8'), context);
  const pt = context.window.MESTTI_PAGE_I18N.pt;
  const file = `blog/${slug}/index.html`;
  const html = fs.readFileSync(file, 'utf8');
  const next = html.replace(/(<div[^>]*data-i18n="([^"]+)"[^>]*data-i18n-html[^>]*>)(?:\s*<!-- static-content -->[\s\S]*?<!-- \/static-content -->)?\s*<\/div>/g,
    (match, open, key) => {
      if (typeof pt[key] !== 'string') throw new Error(`Tradução ausente: ${file} ${key}`);
      return `${open}<!-- static-content -->${pt[key]}<!-- /static-content --></div>`;
    });
  if (html !== next) {
    changed = true;
    if (check) console.error(`HTML desatualizado: ${file}. Rode npm run content:sync.`);
    else fs.writeFileSync(file, next);
  }
}
if (check && changed) process.exitCode = 1;
else console.log(check ? 'Conteúdo estático sincronizado.' : 'Conteúdo dos artigos sincronizado.');
