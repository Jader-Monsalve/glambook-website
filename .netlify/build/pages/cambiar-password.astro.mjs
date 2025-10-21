/* empty css                                 */
import { c as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead, j as renderScript } from '../chunks/astro/server_2rH-mhHW.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_FnCyna3-.mjs';
/* empty css                                            */
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$CambiarPassword = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Cambiar Contrase\xF1a - Admin", "data-astro-cid-e7djscel": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div id="auth-loading" class="fixed inset-0 bg-gray-100 flex items-center justify-center z-50" data-astro-cid-e7djscel> <div class="text-center" data-astro-cid-e7djscel> <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" data-astro-cid-e7djscel></div> <p class="text-gray-600 font-poppins" data-astro-cid-e7djscel>Verificando acceso...</p> </div> </div>  <div id="login-required" class="fixed inset-0 bg-gray-100 items-center justify-center z-50 hidden" data-astro-cid-e7djscel> <div class="text-center max-w-md mx-auto p-6" data-astro-cid-e7djscel> <div class="text-6xl mb-4" data-astro-cid-e7djscel>🔒</div> <h2 class="text-2xl font-bold text-gray-800 mb-4 font-poppins" data-astro-cid-e7djscel>Acceso Restringido</h2> <p class="text-gray-600 mb-6 font-poppins" data-astro-cid-e7djscel>Necesitas iniciar sesión como administrador.</p> <a href="/login" class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-poppins transition-colors duration-300 inline-block" data-astro-cid-e7djscel>
Iniciar Sesión
</a> </div> </div>  <main id="change-password-content" class="hidden min-h-screen bg-gray-50 py-12" data-astro-cid-e7djscel> <div class="max-w-md mx-auto px-4" data-astro-cid-e7djscel> <!-- Header --> <div class="text-center mb-8" data-astro-cid-e7djscel> <h1 class="text-3xl font-bold text-gray-800 mb-2 font-poppins" data-astro-cid-e7djscel>
Cambiar Contraseña
</h1> <p class="text-gray-600 font-poppins" data-astro-cid-e7djscel>
Actualiza tu contraseña de administrador
</p> <p id="admin-info" class="text-sm text-gray-500 font-poppins mt-2" data-astro-cid-e7djscel> <!-- Info del admin --> </p> </div> <!-- Formulario de cambio de contraseña --> <div class="bg-white rounded-lg shadow-lg p-6" data-astro-cid-e7djscel> <form id="change-password-form" class="space-y-4" data-astro-cid-e7djscel> <div data-astro-cid-e7djscel> <label for="current-password" class="block text-sm font-medium text-gray-700 font-poppins mb-1" data-astro-cid-e7djscel>
Contraseña Actual
</label> <input type="password" id="current-password" name="currentPassword" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-poppins" placeholder="••••••••" data-astro-cid-e7djscel> </div> <div data-astro-cid-e7djscel> <label for="new-password" class="block text-sm font-medium text-gray-700 font-poppins mb-1" data-astro-cid-e7djscel>
Nueva Contraseña
</label> <input type="password" id="new-password" name="newPassword" required minlength="6" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-poppins" placeholder="••••••••" data-astro-cid-e7djscel> <p class="text-xs text-gray-500 mt-1 font-poppins" data-astro-cid-e7djscel>Mínimo 6 caracteres</p> </div> <div data-astro-cid-e7djscel> <label for="confirm-password" class="block text-sm font-medium text-gray-700 font-poppins mb-1" data-astro-cid-e7djscel>
Confirmar Nueva Contraseña
</label> <input type="password" id="confirm-password" name="confirmPassword" required minlength="6" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-poppins" placeholder="••••••••" data-astro-cid-e7djscel> </div> <div id="error-message" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg font-poppins text-sm" data-astro-cid-e7djscel></div> <div id="success-message" class="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg font-poppins text-sm" data-astro-cid-e7djscel>
Contraseña cambiada exitosamente
</div> <button type="submit" id="change-btn" class="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 font-poppins flex items-center justify-center gap-2" data-astro-cid-e7djscel> <span id="change-text" data-astro-cid-e7djscel>Cambiar Contraseña</span> <div id="change-spinner" class="hidden animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-astro-cid-e7djscel></div> </button> </form> <!-- Enlaces --> <div class="mt-6 text-center space-y-3" data-astro-cid-e7djscel> <a href="/admin" class="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 text-sm font-poppins transition-colors duration-300" data-astro-cid-e7djscel>
← Volver al Panel Admin
</a> <div class="pt-3 border-t border-gray-200" data-astro-cid-e7djscel> <button id="logout-btn" class="text-red-600 hover:text-red-700 text-sm font-poppins transition-colors duration-300" data-astro-cid-e7djscel>
Cerrar Sesión
</button> </div> </div> </div> </div> </main>  ${renderScript($$result2, "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/cambiar-password.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/cambiar-password.astro", void 0);

const $$file = "C:/Users/jader/OneDrive/Documents/GlamBook/src/pages/cambiar-password.astro";
const $$url = "/cambiar-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CambiarPassword,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
