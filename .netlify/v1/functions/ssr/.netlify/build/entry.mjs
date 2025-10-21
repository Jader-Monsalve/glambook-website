import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_BjIznBov.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/api/citas.astro.mjs');
const _page5 = () => import('./pages/api/emails.astro.mjs');
const _page6 = () => import('./pages/api/test.astro.mjs');
const _page7 = () => import('./pages/api/testimonios.astro.mjs');
const _page8 = () => import('./pages/api/testimonios-aprobados.astro.mjs');
const _page9 = () => import('./pages/aviso-legal.astro.mjs');
const _page10 = () => import('./pages/blog.astro.mjs');
const _page11 = () => import('./pages/cambiar-password.astro.mjs');
const _page12 = () => import('./pages/contact.astro.mjs');
const _page13 = () => import('./pages/cookies.astro.mjs');
const _page14 = () => import('./pages/cuidado-piel.astro.mjs');
const _page15 = () => import('./pages/gracias.astro.mjs');
const _page16 = () => import('./pages/login.astro.mjs');
const _page17 = () => import('./pages/maquillaje-eventos.astro.mjs');
const _page18 = () => import('./pages/privacidad.astro.mjs');
const _page19 = () => import('./pages/tendencia-uñas.astro.mjs');
const _page20 = () => import('./pages/terminos.astro.mjs');
const _page21 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/admin.astro", _page3],
    ["src/pages/api/citas.ts", _page4],
    ["src/pages/api/emails.ts", _page5],
    ["src/pages/api/test.ts", _page6],
    ["src/pages/api/testimonios.ts", _page7],
    ["src/pages/api/testimonios-aprobados.ts", _page8],
    ["src/pages/aviso-legal.astro", _page9],
    ["src/pages/blog.astro", _page10],
    ["src/pages/cambiar-password.astro", _page11],
    ["src/pages/contact.astro", _page12],
    ["src/pages/cookies.astro", _page13],
    ["src/pages/cuidado-piel.astro", _page14],
    ["src/pages/gracias.astro", _page15],
    ["src/pages/login.astro", _page16],
    ["src/pages/maquillaje-eventos.astro", _page17],
    ["src/pages/privacidad.astro", _page18],
    ["src/pages/tendencia-uñas.astro", _page19],
    ["src/pages/terminos.astro", _page20],
    ["src/pages/index.astro", _page21]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "d8d6ea33-3547-47ba-ac1c-7b046d5eb8fc"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
