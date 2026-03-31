/**
 * Vercel: copia os arquivos estáticos da raiz para `public/`.
 * Sem isso, projetos com package.json muitas vezes deployam vazio (Not Found).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public");

const SKIP = new Set([
  "node_modules",
  ".git",
  "public",
  ".vercel",
  "api",
  "scripts",
  "server.js",
  "package.json",
  "package-lock.json",
  ".gitignore",
  "vercel.json",
]);

/** Itens na raiz que não entram no deploy estático */
function skipRootOnly(name) {
  if (SKIP.has(name)) return true;
  if (name.startsWith(".env") && name !== ".env.example") return true;
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
