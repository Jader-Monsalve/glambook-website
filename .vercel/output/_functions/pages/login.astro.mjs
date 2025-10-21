/* empty css                                 */
import { e as createComponent, m as maybeRenderHead, l as renderScript, r as renderTemplate, k as renderComponent } from '../chunks/astro/server_tfsCyKgW.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Q6l5ejYg.mjs';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$LoginForm = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="login-form" class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6" data-astro-cid-kl5b6njz> <div class="text-center mb-6" data-astro-cid-kl5b6njz> <h2 class="text-2xl font-bold text-gray-800 font-poppins" data-astro-cid-kl5b6njz>Acceso Administrador</h2> <p class="text-gray-600 font-poppins" data-astro-cid-kl5b6njz>Inicia sesión para gestionar testimonios</p> </div> <form id="auth-form" class="space-y-4" data-astro-cid-kl5b6njz> <div data-astro-cid-kl5b6njz> <label for="email" class="block text-sm font-medium text-gray-700 font-poppins mb-1" data-astro-cid-kl5b6njz>
Email
</label> <input type="email" id="email" name="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-poppins" placeholder="admin@glambook.com" data-astro-cid-kl5b6njz> </div> <div data-astro-cid-kl5b6njz> <label for="password" class="block text-sm font-medium text-gray-700 font-poppins mb-1" data-astro-cid-kl5b6njz>
Contraseña
</label> <input type="password" id="password" name="password" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-poppins" placeholder="••••••••" data-astro-cid-kl5b6njz> </div> <div id="error-message" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg font-poppins text-sm" data-astro-cid-kl5b6njz></div> <button type="submit" id="login-btn" class="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 font-poppins flex items-center justify-center gap-2" data-astro-cid-kl5b6njz> <span id="login-text" data-astro-cid-kl5b6njz>Iniciar Sesión</span> <div id="login-spinner" class="hidden animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-astro-cid-kl5b6njz></div> </button> </form> <!-- Enlace para resetear contraseña --> <div class="mt-4 text-center" data-astro-cid-kl5b6njz> <button id="reset-password-btn" type="button" class="text-sm text-gray-600 hover:text-pink-600 font-poppins transition-colors duration-300" data-astro-cid-kl5b6njz>
¿Olvidaste tu contraseña?
</button> </div> <!-- Mensaje de éxito para reset de contraseña --> <div id="reset-success" class="hidden mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg font-poppins text-sm" data-astro-cid-kl5b6njz>
Se ha enviado un enlace para resetear tu contraseña a tu email.
</div> </div>  ${renderScript($$result, "C:/Users/jader/OneDrive/Documents/GlamBook/src/components/LoginForm.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/jader/OneDrive/Documents/GlamBook/src/components/LoginForm.astro", void 0);

const prerender = false;
const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Acceso de Administrador - GlamBook", "data-astro-cid-sgpqyurt": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4" data-astro-cid-sgpqyurt> <div class="w-full max-w-md" data-astro-cid-sgpqyurt> <!-- Componente de login --> ${renderComponent($$result2, "LoginForm", $$LoginForm, { "data-astro-cid-sgpqyurt": true })} <!-- Información de contacto y ayuda --> <div class="mt-8 text-center space-y-4" data-astro-cid-sgpqyurt> <!-- Enlace de ayuda --> <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200" data-astro-cid-sgpqyurt> <h3 class="text-sm font-semibold text-gray-800 mb-2 font-poppins" data-astro-cid-sgpqyurt>¿Problemas para acceder?</h3> <p class="text-xs text-gray-600 mb-3 font-poppins" data-astro-cid-sgpqyurt>
Si no puedes iniciar sesión o necesitas ayuda con tu cuenta de administrador
</p> <a href="mailto:jadermonsalve9@gmail.com?subject=Problema%20de%20acceso%20-%20Panel%20Admin%20GlamBook&body=Hola,%20tengo%20problemas%20para%20acceder%20al%20panel%20de%20administración.%0A%0AMi%20email%20de%20administrador:%20%0ADescripción%20del%20problema:%20" class="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-poppins transition-colors duration-300" data-astro-cid-sgpqyurt>
📧 Contactar Soporte
</a> </div> <!-- Información adicional --> <div class="text-center" data-astro-cid-sgpqyurt> <p class="text-xs text-gray-500 font-poppins" data-astro-cid-sgpqyurt>
Solo administradores autorizados pueden acceder a este panel
</p> <div class="mt-3 flex justify-center items-center gap-4 text-xs text-gray-400" data-astro-cid-sgpqyurt> <span data-astro-cid-sgpqyurt>🔒 Acceso Seguro</span> <span data-astro-cid-sgpqyurt>•</span> <span data-astro-cid-sgpqyurt>🛡️ Protegido por Firebase</span> </div> </div> <!-- Link para volver al sitio principal --> <div class="pt-4 border-t border-gray-200" data-astro-cid-sgpqyurt> <a href="/" class="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 text-sm font-poppins transition-colors duration-300" data-astro-cid-sgpqyurt>
← Volver al sitio principal
</a> </div> </div> </div> </main>  ` })}`;
}, "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/login.astro", void 0);

const $$file = "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
