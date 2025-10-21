import { c as createComponent, m as maybeRenderHead, j as renderScript, r as renderTemplate, d as createAstro, f as addAttribute, k as renderHead, i as renderComponent, l as renderSlot } from './astro/server_2rH-mhHW.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */
/* empty css                         */

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-white shadow-md lg:px-8 xl:px-12 z-50 backdrop-blur-sm"> <!-- LOGO CON TEXTO NORMAL --> <div class="flex items-center"> <a href="/" class="font-vibes text-2xl sm:text-3xl lg:text-5xl text-pink-500">
GlamBook
</a> </div> <!-- MENÚ HAMBURGUESA (MÓVIL) --> <button id="mobile-menu-btn" class="md:hidden text-gray-800 text-2xl focus:outline-none">
☰
</button> <!-- MENÚ DESKTOP --> <ul class="hidden md:flex gap-4 lg:gap-6 xl:gap-8 font-quicksand text-gray-800 text-base lg:text-lg"> <li><a href="/" class="hover:text-pink-500 transition">Inicio</a></li> <li><a href="/about" class="hover:text-pink-500 transition">Servicios</a></li> <li class="relative group"> <a href="/blog" class="hover:text-pink-500 transition flex items-center">
Blog
<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </a> <!-- Dropdown Menu --> <div class="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"> <div class="py-2"> <a href="/blog" class="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition">
Todos los Artículos
</a> <a href="/cuidado-piel" class="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition">
Cuidado de la Piel
</a> <a href="/maquillaje-eventos" class="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition">
Maquillaje para Eventos
</a> <a href="/tendencia-uñas" class="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition">
Tendencias de Uñas
</a> </div> </div> </li> <li><a href="/contact" class="hover:text-pink-500 transition">Contacto</a></li> <li><a href="/login" class="hover:text-pink-500 transition">Login-admin</a></li> </ul> <!-- BOTÓN --> <a href="/" class="hidden sm:block bg-pink-500 text-white px-3 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-3 rounded-xl text-sm sm:text-base lg:text-lg hover:bg-pink-600 transition"> <span class="hidden sm:inline lg:hidden">Cita</span> <span class="hidden lg:inline">Reservar cita</span> </a> </nav> <!-- MENÚ MÓVIL --> <div id="mobile-menu" class="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out md:hidden z-50"> <!-- Botón de cerrar --> <button id="close-menu-btn" class="absolute top-4 right-4 text-gray-800 text-2xl focus:outline-none">
✕
</button> <ul class="flex flex-col p-4 pt-20 font-quicksand text-gray-800 text-lg"> <li class="py-2"><a href="/" class="hover:text-pink-500 transition">Inicio</a></li> <li class="py-2"><a href="/about" class="hover:text-pink-500 transition">Servicios</a></li> <li class="py-2"> <div class="group"> <button id="mobile-blog-toggle" class="hover:text-pink-500 transition w-full text-left flex items-center justify-between">
Blog
<svg class="w-4 h-4 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <div id="mobile-blog-submenu" class="ml-4 mt-2 hidden"> <a href="/blog" class="block py-1 text-gray-600 hover:text-pink-500 transition">Todos los Artículos</a> <a href="/cuidado-piel" class="block py-1 text-gray-600 hover:text-pink-500 transition">Cuidado de la Piel</a> <a href="/maquillaje-eventos" class="block py-1 text-gray-600 hover:text-pink-500 transition">Maquillaje para Eventos</a> <a href="/tendencia-uñas" class="block py-1 text-gray-600 hover:text-pink-500 transition">Tendencias de Uñas</a> </div> </div> </li> <li class="py-2"><a href="/contact" class="hover:text-pink-500 transition">Contacto</a></li> <li class="py-2"><a href="/login" class="hover:text-pink-500 transition">Login-admin</a></li> <a href="/" class="bg-pink-500 text-white px-4 py-2 rounded-xl text-base hover:bg-pink-600 transition inline-block">
Reservar cita
</a> </ul> </div> ${renderScript($$result, "C:/Users/jader/OneDrive/Documents/GlamBook/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/jader/OneDrive/Documents/GlamBook/src/components/Navbar.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-gray-900 text-white py-12"> <div class="container mx-auto px-4"> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> <!-- Logo y descripción --> <div class="lg:col-span-1"> <h3 class="text-2xl font-bold text-pink-400 mb-4 font-poppins">GlamBook</h3> <p class="text-gray-300 mb-4 font-poppins">
Tu salón de belleza de confianza. Especialistas en uñas, maquillaje y cuidado personal.
</p> <div class="flex space-x-4"> <a href="#" class="text-pink-400 hover:text-pink-300 transition">📱</a> <a href="#" class="text-pink-400 hover:text-pink-300 transition">📘</a> <a href="#" class="text-pink-400 hover:text-pink-300 transition">📸</a> <a href="#" class="text-pink-400 hover:text-pink-300 transition">🐦</a> </div> </div> <!-- Enlaces rápidos --> <div> <h4 class="text-lg font-semibold mb-4 font-poppins">Enlaces</h4> <ul class="space-y-2 font-poppins"> <li><a href="/" class="text-gray-300 hover:text-pink-400 transition">Inicio</a></li> <li><a href="/about" class="text-gray-300 hover:text-pink-400 transition">Servicios</a></li> <li><a href="/designs" class="text-gray-300 hover:text-pink-400 transition">Galería</a></li> <li><a href="/contact" class="text-gray-300 hover:text-pink-400 transition">Contacto</a></li> <li><a href="/contact#citas" class="text-gray-300 hover:text-pink-400 transition">Reservar Cita</a></li> </ul> </div> <!-- Legal --> <div> <h4 class="text-lg font-semibold mb-4 font-poppins">Legal</h4> <ul class="space-y-2 font-poppins"> <li><a href="/terminos" class="text-gray-300 hover:text-pink-400 transition">Términos y Condiciones</a></li> <li><a href="/privacidad" class="text-gray-300 hover:text-pink-400 transition">Política de Privacidad</a></li> <li><a href="/aviso-legal" class="text-gray-300 hover:text-pink-400 transition">Aviso Legal</a></li> <li><a href="/cookies" class="text-gray-300 hover:text-pink-400 transition">Política de Cookies</a></li> </ul> </div> <!-- Contacto --> <div> <h4 class="text-lg font-semibold mb-4 font-poppins">Contacto</h4> <div class="space-y-2 text-gray-300 font-poppins"> <p>📍 Medellín, Colombia</p> <p>📞 +57 300 699 7396</p> <p>✉️ jadermonsalve9@gmail.com</p> <div class="mt-4"> <p class="font-semibold">Horarios:</p> <p class="text-sm">Lun-Vie: 9AM-7PM</p> <p class="text-sm">Sáb: 9AM-5PM</p> <p class="text-sm">Dom: Cerrado</p> </div> </div> </div> </div> <!-- Copyright --> <div class="border-t border-gray-700 mt-8 pt-8"> <!-- Enlaces legales en línea --> <div class="text-center mb-4"> <div class="flex flex-wrap justify-center gap-4 text-sm"> <a href="/terminos" class="text-gray-400 hover:text-pink-400 transition font-poppins">
Términos y Condiciones
</a> <span class="text-gray-600">|</span> <a href="/privacidad" class="text-gray-400 hover:text-pink-400 transition font-poppins">
Política de Privacidad
</a> <span class="text-gray-600">|</span> <a href="/aviso-legal" class="text-gray-400 hover:text-pink-400 transition font-poppins">
Aviso Legal
</a> <span class="text-gray-600">|</span> <a href="/cookies" class="text-gray-400 hover:text-pink-400 transition font-poppins">
Cookies
</a> </div> </div> <!-- Copyright y créditos --> <div class="text-center space-y-2"> <p class="text-gray-400 font-poppins">
© 2025 GlamBook Studio. Todos los derechos reservados.
</p> <p class="text-sm text-gray-500 font-poppins">
Desarrollado con ❤️ por <span class="text-pink-400 font-semibold">M-Technology</span> </p> <!-- Enlace discreto al admin --> <div class="mt-3"> <a href="/admin" class="text-xs text-gray-600 hover:text-gray-400 transition font-poppins">
Panel de Administración
</a> </div> </div> </div> </div> </footer>`;
}, "C:/Users/jader/OneDrive/Documents/GlamBook/src/components/Footer.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="es" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Quicksand:wght@400;600&display=swap" rel="stylesheet"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- SEO Meta Tags --><title>${title}</title><meta name="description" content="GlamBook - Salón de belleza profesional especializado en uñas, maquillaje y cuidado personal. Servicios de calidad con los mejores productos."><meta name="keywords" content="salón de belleza, uñas, maquillaje, peinados, cejas, pestañas, cuidado personal, manicura, pedicura"><meta name="author" content="GlamBook"><!-- Open Graph Meta Tags --><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description" content="Salón de belleza profesional especializado en uñas, maquillaje y cuidado personal."><meta property="og:type" content="website"><meta property="og:url" content="https://glambook-jader.netlify.app"><meta property="og:image" content="https://glambook-jader.netlify.app/Images/Maquillaje.jpg"><!-- Twitter Meta Tags --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description" content="Salón de belleza profesional especializado en uñas, maquillaje y cuidado personal."><meta name="twitter:image" content="https://glambook-jader.netlify.app/Images/Maquillaje.jpg"><!-- Additional Meta Tags --><meta name="robots" content="index, follow"><meta name="theme-color" content="#ec4899"><link rel="canonical" href="https://glambook-jader.netlify.app">${renderHead()}</head> <body data-astro-cid-sckkx6r4> ${renderComponent($$result, "Navbar", $$Navbar, { "data-astro-cid-sckkx6r4": true })} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-sckkx6r4": true })} </body></html>`;
}, "C:/Users/jader/OneDrive/Documents/GlamBook/src/layouts/Layout.astro", void 0);

export { $$Layout as $, $$Navbar as a, $$Footer as b };
