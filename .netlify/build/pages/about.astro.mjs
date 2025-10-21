/* empty css                                 */
import { c as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_2rH-mhHW.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_FnCyna3-.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  const title = "Nuestros servicios - GlamBook";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="min-h-screen flex items-center justify-center bg-pink-50 px-4"> <div class="max-w-3xl text-center"> <h1 class="text-4xl lg:text-5xl font-bold text-pink-500 mb-6 font-poppins">
Nuestros Servicios
</h1> <p class="text-lg lg:text-xl text-gray-700 mb-8 font-quicksand">
En GlamBook, ofrecemos una amplia gama de servicios de belleza profesional para realzar tu estilo y confianza. Desde manicuras y pedicuras hasta tratamientos faciales y maquillaje para ocasiones especiales, nuestro equipo de expertos está aquí para brindarte una experiencia única y personalizada.
</p> <p class="text-lg lg:text-xl text-gray-700 font-quicksand">
Explora nuestra galería para ver ejemplos de nuestro trabajo y no dudes en contactarnos para reservar tu cita. ¡Estamos emocionados de ayudarte a lucir y sentirte increíble!
</p> </div> </section> ` })}`;
}, "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/about.astro", void 0);

const $$file = "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
