export { renderers } from '../../renderers.mjs';

const prerender = false;
const testimoniosAprobados = [
  {
    id: 1,
    nombre: "María González",
    email: "maria@email.com",
    servicio: "Maquillaje",
    comentario: "Excelente servicio, quedé muy contenta con el resultado. El equipo es muy profesional.",
    calificacion: 5,
    fechaCreacion: "2024-10-15",
    estado: "aprobado"
  },
  {
    id: 2,
    nombre: "Ana López",
    email: "ana@email.com",
    servicio: "Uñas acrílicas",
    comentario: "Me encantaron mis uñas, el diseño quedó perfecto. Definitivamente vuelvo.",
    calificacion: 5,
    fechaCreacion: "2024-10-12",
    estado: "aprobado"
  },
  {
    id: 3,
    nombre: "Carmen Silva",
    email: "carmen@email.com",
    servicio: "Cejas",
    comentario: "Las cejas me quedaron hermosas, muy natural. Excelente trabajo.",
    calificacion: 5,
    fechaCreacion: "2024-10-10",
    estado: "aprobado"
  }
];
const testimoniosPendientes = [
  {
    id: 4,
    nombre: "Laura Martín",
    email: "laura@email.com",
    servicio: "Pestañas",
    comentario: "Muy buen servicio, las pestañas se ven naturales pero con volumen.",
    calificacion: 4,
    fechaCreacion: "2024-10-18",
    estado: "pendiente"
  }
];
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
};
const GET = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const action = searchParams.get("action");
    console.log(`📥 GET /api/testimonios - Action: ${action}`);
    switch (action) {
      case "aprobados":
        return new Response(JSON.stringify({
          success: true,
          data: testimoniosAprobados,
          message: "Testimonios aprobados obtenidos correctamente"
        }), {
          status: 200,
          headers: corsHeaders
        });
      case "pendientes":
        return new Response(JSON.stringify({
          success: true,
          data: testimoniosPendientes,
          message: "Testimonios pendientes obtenidos correctamente"
        }), {
          status: 200,
          headers: corsHeaders
        });
      case "todos":
        const todos = [...testimoniosAprobados, ...testimoniosPendientes];
        return new Response(JSON.stringify({
          success: true,
          data: todos,
          message: "Todos los testimonios obtenidos correctamente"
        }), {
          status: 200,
          headers: corsHeaders
        });
      default:
        return new Response(JSON.stringify({
          success: true,
          data: testimoniosAprobados,
          message: "Testimonios obtenidos correctamente (por defecto: aprobados)"
        }), {
          status: 200,
          headers: corsHeaders
        });
    }
  } catch (error) {
    console.error("❌ Error en GET /api/testimonios:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    console.log(`📥 POST /api/testimonios - Data:`, data);
    const { action, nombre, email, servicio, comentario, calificacion, consentimiento } = data;
    if (action === "crear") {
      if (!nombre || !email || !comentario || !calificacion) {
        return new Response(JSON.stringify({
          success: false,
          message: "Faltan campos obligatorios: nombre, email, comentario y calificación"
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      if (!consentimiento) {
        return new Response(JSON.stringify({
          success: false,
          message: "Debe aceptar el consentimiento para publicar el testimonio"
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      const nuevoTestimonio = {
        id: Date.now(),
        // ID simple basado en timestamp
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        servicio: servicio || "No especificado",
        comentario: comentario.trim(),
        calificacion: parseInt(calificacion),
        fechaCreacion: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        estado: "pendiente"
      };
      testimoniosPendientes.push(nuevoTestimonio);
      console.log(`✅ Testimonio creado: ${nuevoTestimonio.nombre} - ${nuevoTestimonio.servicio}`);
      return new Response(JSON.stringify({
        success: true,
        data: nuevoTestimonio,
        message: "Testimonio creado correctamente. Será revisado antes de publicarse."
      }), {
        status: 201,
        headers: corsHeaders
      });
    }
    return new Response(JSON.stringify({
      success: false,
      message: "Acción no válida"
    }), {
      status: 400,
      headers: corsHeaders
    });
  } catch (error) {
    console.error("❌ Error en POST /api/testimonios:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
