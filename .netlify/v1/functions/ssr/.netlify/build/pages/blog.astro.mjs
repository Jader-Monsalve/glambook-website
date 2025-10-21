/* empty css                                 */
import { c as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_2rH-mhHW.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_FnCyna3-.mjs';
export { renderers } from '../renderers.mjs';

const $$Blog = createComponent(($$result, $$props, $$slots) => {
  const title = "Blog de Belleza - GlamBook";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-20 bg-white"> <div class="container mx-auto px-4"> <!-- Título --> <div class="text-center mb-12"> <h1 class="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 font-poppins">
Blog de Belleza
</h1> <p class="text-gray-600 text-lg font-poppins">
Tips, tendencias y consejos de belleza profesional
</p> </div> <!-- Grid de artículos --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"> <!-- Artículo 1 --> <article class="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"> <div class="h-48 bg-gradient-to-br from-pink-300 to-rose-300 flex items-center justify-center"> <img class="text-white font-bold font-poppins" src="/Images/Uñas-tendencia.jpg" alt="Uñas Acrílicas"> </div> <div class="p-6"> <h3 class="text-xl font-semibold text-gray-800 mb-3 font-poppins">
Tendencias en Uñas 2025
</h3> <p class="text-gray-600 mb-4 font-poppins">
Descubre los colores y diseños que están marcando tendencia este año...
</p> <a href="/tendencia-uñas" class="text-pink-500 text-sm font-poppins">Próximamente</a> </div> </article> <!-- Artículo 2 --> <article class="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"> <div class="h-48 bg-gradient-to-br from-purple-300 to-indigo-300 flex items-center justify-center"> <span class="text-white font-bold text-6xl font-poppins">🌿</span> </div> <div class="p-6"> <h3 class="text-xl font-semibold text-gray-800 mb-3 font-poppins">
Cuidado de la Piel
</h3> <p class="text-gray-600 mb-4 font-poppins">
Rutinas básicas para mantener tu piel radiante y saludable...
</p> <a href="/cuidado-piel" class="text-pink-500 text-sm font-poppins hover:text-pink-700 transition-colors">Leer artículo →</a> </div> </article> <!-- Artículo 3 --> <article class="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"> <div class="h-48 bg-gradient-to-br from-yellow-300 to-orange-300 flex items-center justify-center"> <span class="text-white font-bold text-6xl font-poppins">💄</span> </div> <div class="p-6"> <h3 class="text-xl font-semibold text-gray-800 mb-3 font-poppins">
Maquillaje para Eventos
</h3> <p class="text-gray-600 mb-4 font-poppins">
Consejos para lucir perfecta en bodas, graduaciones y celebraciones...
</p> <a href="/maquillaje-eventos" class="text-pink-500 text-sm font-poppins hover:text-pink-700 transition-colors">Leer artículo →</a> </div> </article> </div> </div> </section> ` })}`;
}, "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/blog.astro", void 0);

const $$file = "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
