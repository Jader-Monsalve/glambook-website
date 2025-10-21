/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CqYJzEeH.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DTbGD9xe.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  const title = "Nuestros servicios - GlamBook";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="min-h-screen flex items-center justify-center bg-pink-50 px-4 xs:px-6 py-12 xs:py-16"> <div class="max-w-3xl text-center"> <h1 class="text-3xl xs:text-4xl sm:text-4xl lg:text-5xl font-bold text-pink-500 mb-4 xs:mb-6 font-poppins">
Nuestros Servicios
</h1> <p class="text-base xs:text-lg sm:text-lg lg:text-xl text-gray-700 mb-6 xs:mb-8 font-quicksand leading-relaxed">
En GlamBook, ofrecemos una amplia gama de servicios de belleza profesional para realzar tu estilo y confianza. Desde manicuras y pedicuras hasta tratamientos faciales y maquillaje para ocasiones especiales, nuestro equipo de expertos está aquí para brindarte una experiencia única y personalizada.
</p> <p class="text-base xs:text-lg sm:text-lg lg:text-xl text-gray-700 font-quicksand leading-relaxed">
Explora nuestra galería para ver ejemplos de nuestro trabajo y no dudes en contactarnos para reservar tu cita. ¡Estamos emocionados de ayudarte a lucir y sentirte increíble!
</p> <!-- Call to action adicional --> <div class="mt-8 xs:mt-10 flex flex-col xs:flex-row gap-4 xs:gap-6 justify-center items-center"> <a href="/designs" class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 xs:px-8 py-3 xs:py-4 rounded-full font-semibold font-poppins text-sm xs:text-base hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
📸 Ver Galería
</a> <a href="/contact#citas" class="bg-white text-pink-600 border-2 border-pink-500 px-6 xs:px-8 py-3 xs:py-4 rounded-full font-semibold font-poppins text-sm xs:text-base hover:bg-pink-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
🗓️ Reservar Cita
</a> </div> </div> </section> ` })}`;
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
