// Fonte legível em site/routing.json; saída vercel.json tem uma única ordem explícita.
// Não misturar um fallback routes com redirects/headers/rewrites: a Vercel o antecipa.
import fs from 'node:fs';

export function routePattern(source) {
    const wildcard = source.endsWith('/(.*)');
    const literal = wildcard ? source.slice(0, -4) : source;
    if (!/^\/[\w/.-]*$/.test(literal)) throw new Error(`Padrão de rota não suportado: ${source}`);
    return '^' + literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (wildcard ? '(.*)' : '') + '$';
}

export function compileRoutes({ headers, redirects, rewrites }) {
    return [
        ...headers.map(r => ({ src: routePattern(r.source), headers: Object.fromEntries(r.headers.map(h => [h.key, h.value])), continue: true })),
        ...redirects.map(r => ({ src: routePattern(r.source), headers: { Location: r.destination }, status: r.statusCode ?? (r.permanent === false ? 307 : 308) })),
        { handle: 'filesystem' },
        ...rewrites.map(r => ({ src: routePattern(r.source), dest: r.destination, check: true })),
        { src: '^/(?!api(?:/|$)).*$', status: 404, dest: '/404.html' },
    ];
}

export function buildVercelConfig() {
    const root = new URL('../', import.meta.url);
    const config = JSON.parse(fs.readFileSync(new URL('vercel.json', root), 'utf8'));
    const routing = JSON.parse(fs.readFileSync(new URL('site/routing.json', root), 'utf8'));
    delete config.headers;
    delete config.redirects;
    delete config.rewrites;
    config.routes = compileRoutes(routing);
    // Uma linha por regra deixa a tabela gerada revisável sem esconder a precedência.
    const marker = '__GENERATED_ROUTES__';
    const routes = config.routes;
    config.routes = marker;
    return JSON.stringify(config, null, 2).replace(`"${marker}"`, '[\n' + routes.map(r => '    ' + JSON.stringify(r)).join(',\n') + '\n  ]') + '\n';
}
