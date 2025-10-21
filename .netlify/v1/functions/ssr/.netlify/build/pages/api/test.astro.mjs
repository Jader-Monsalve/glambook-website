export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  console.log("API Test endpoint called");
  return new Response(
    JSON.stringify({
      message: "API funcionando correctamente",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      url: request.url
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
