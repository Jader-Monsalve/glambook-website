/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_tfsCyKgW.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Q6l5ejYg.mjs';
export { renderers } from '../renderers.mjs';

const $$Admin = createComponent(($$result, $$props, $$slots) => {
  const title = "Admin - GlamBook";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="min-h-screen flex items-center justify-center bg-gray-50 px-4"> <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"> <h1 class="text-2xl font-bold text-gray-800 mb-4 font-poppins">
Panel de Administración
</h1> <p class="text-gray-600 mb-6 font-poppins">
Esta sección está en mantenimiento. Por favor, vuelve más tarde.
</p> <a href="/" class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold font-poppins transition-colors duration-300">
Volver al inicio
</a> </div> </section> ` })}`;
}, "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/admin.astro", void 0);

const $$file = "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
