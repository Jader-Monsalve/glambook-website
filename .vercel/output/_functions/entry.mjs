import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_mswV-ZmU.mjs';
import { manifest } from './manifest_CfeO8HM_.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/api/citas.astro.mjs');
const _page4 = () => import('./pages/api/edge-test.astro.mjs');
const _page5 = () => import('./pages/api/health.astro.mjs');
const _page6 = () => import('./pages/api/test.astro.mjs');
const _page7 = () => import('./pages/api/test-simple.astro.mjs');
const _page8 = () => import('./pages/api/testimonios.astro.mjs');
const _page9 = () => import('./pages/api/testimonios-aprobados.astro.mjs');
const _page10 = () => import('./pages/api/testimonios-simple.astro.mjs');
const _page11 = () => import('./pages/aviso-legal.astro.mjs');
const _page12 = () => import('./pages/blog.astro.mjs');
const _page13 = () => import('./pages/contact.astro.mjs');
const _page14 = () => import('./pages/cookies.astro.mjs');
const _page15 = () => import('./pages/cuidado-piel.astro.mjs');
const _page16 = () => import('./pages/gracias.astro.mjs');
const _page17 = () => import('./pages/maquillaje-eventos.astro.mjs');
const _page18 = () => import('./pages/privacidad.astro.mjs');
const _page19 = () => import('./pages/tendencia-uñas.astro.mjs');
const _page20 = () => import('./pages/terminos.astro.mjs');
const _page21 = () => import('./pages/test.astro.mjs');
const _page22 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/api/citas.ts", _page3],
    ["src/pages/api/edge-test.ts", _page4],
    ["src/pages/api/health.ts", _page5],
    ["src/pages/api/test.ts", _page6],
    ["src/pages/api/test-simple.ts", _page7],
    ["src/pages/api/testimonios.ts", _page8],
    ["src/pages/api/testimonios-aprobados.ts", _page9],
    ["src/pages/api/testimonios-simple.ts", _page10],
    ["src/pages/aviso-legal.astro", _page11],
    ["src/pages/blog.astro", _page12],
    ["src/pages/contact.astro", _page13],
    ["src/pages/cookies.astro", _page14],
    ["src/pages/cuidado-piel.astro", _page15],
    ["src/pages/gracias.astro", _page16],
    ["src/pages/maquillaje-eventos.astro", _page17],
    ["src/pages/privacidad.astro", _page18],
    ["src/pages/tendencia-uñas.astro", _page19],
    ["src/pages/terminos.astro", _page20],
    ["src/pages/test.astro", _page21],
    ["src/pages/index.astro", _page22]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "ffcaed82-ad14-4ca7-a8bc-1b0c837448b8",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
