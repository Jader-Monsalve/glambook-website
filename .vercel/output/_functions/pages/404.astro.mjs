/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_tfsCyKgW.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Q6l5ejYg.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  const title = "P\xE1gina no encontrada - GlamBook";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 px-4"> <div class="max-w-md text-center"> <div class="text-6xl mb-8">💄</div> <h1 class="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 font-poppins">
¡Ups! Página no encontrada
</h1> <p class="text-lg text-gray-600 mb-8 font-poppins">
Parece que esta página se fue a hacerse las uñas y no regresó.
</p> <a href="/" class="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors duration-300 font-poppins font-medium">
Volver al inicio
</a> </div> </section> ` })}`;
}, "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/404.astro", void 0);

const $$file = "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
