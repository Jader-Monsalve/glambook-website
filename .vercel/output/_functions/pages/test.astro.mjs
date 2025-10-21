/* empty css                                 */
import { e as createComponent, n as renderHead, r as renderTemplate } from '../chunks/astro/server_CqYJzEeH.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Test = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Test - GlamBook</title>${renderHead()}</head> <body> <h1>🚀 Vercel Test Funcionando!</h1> <p>Si ves esto, el sitio está funcionando correctamente en Vercel.</p> <p>Timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}</p> <h2>APIs de prueba:</h2> <ul> <li><a href="/api/health">Health Check</a></li> <li><a href="/api/edge-test">Edge Test</a></li> <li><a href="/api/testimonios-simple">Testimonios Simple</a></li> </ul> </body></html>`;
}, "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/test.astro", void 0);

const $$file = "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/test.astro";
const $$url = "/test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Test,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
