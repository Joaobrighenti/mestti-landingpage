/**
 * Vercel: copia os arquivos estáticos da raiz para `public/`.
 * Sem isso, projetos com package.json muitas vezes deployam vazio (Not Found).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildCorpus, purgeCss } from "./css-purge.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public");

const SKIP = new Set([
  "README.md",
  "AGENTS.md",
  "CLAUDE.md",
  "PRODUCT.md",
  "DESIGN.md",
  ".env.example",
  "node_modules",
  ".git",
  "public",
  ".vercel",
  "api",
  "lib",
  "scripts",
  "site",
  "tests",
  "docs",
  "content",
  "server.js",
  "package.json",
  "package-lock.json",
  ".gitignore",
  "vercel.json",
]);

/** Itens na raiz que não entram no deploy estático */
function skipRootOnly(name) {
  if (SKIP.has(name)) return true;
  if (name.startsWith(".")) return true;
  return false;
}

function copyRecursive(src, dest) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      if (src === root && skipRootOnly(name)) continue;
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const name of fs.readdirSync(root)) {
  if (skipRootOnly(name)) continue;
  const src = path.join(root, name);
  const dest = path.join(outDir, name);
  copyRecursive(src, dest);
}

console.log("Vercel build: static files copied to public/");

// CSS no ar: só as regras que alguma página usa, minificado (os arquivos do repositório não mudam).
const corpus = buildCorpus(root);
let before = 0;
let after = 0;
const purgeDir = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) purgeDir(p);
    else if (name.endsWith(".css")) {
      const css = fs.readFileSync(p, "utf8");
      const out = purgeCss(css, corpus);
      before += css.length;
      after += out.length;
      fs.writeFileSync(p, out);
    }
  }
};
purgeDir(outDir);
console.log(`Vercel build: CSS ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB`);
