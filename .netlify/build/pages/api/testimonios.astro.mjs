import fs from 'fs';
import path from 'path';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const TESTIMONIOS_PENDIENTES_FILE = path.join(process.cwd(), "src", "data", "testimonios-pendientes.json");
const TESTIMONIOS_APROBADOS_FILE = path.join(process.cwd(), "src", "data", "testimonios.ts");
function leerTestimoniosPendientes() {
  try {
    if (fs.existsSync(TESTIMONIOS_PENDIENTES_FILE)) {
      const data = fs.readFileSync(TESTIMONIOS_PENDIENTES_FILE, "utf8");
      return JSON.parse(data) || [];
    }
    return [];
  } catch (error) {
    console.error("Error al leer testimonios pendientes:", error);
    return [];
  }
}
async function leerTestimoniosAprobados() {
  try {
    const { testimoniosAprobados } = await import('../../chunks/testimonios_BSN4FskC.mjs');
    return testimoniosAprobados || [];
  } catch (error) {
    console.error("Error al leer testimonios aprobados:", error);
    return [];
  }
}
function guardarTestimoniosPendientes(testimonios) {
  try {
    const dir = path.dirname(TESTIMONIOS_PENDIENTES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TESTIMONIOS_PENDIENTES_FILE, JSON.stringify(testimonios, null, 2));
    return true;
  } catch (error) {
    console.error("Error al guardar testimonios pendientes:", error);
    return false;
  }
}
function agregarTestimonioAprobado(testimonio) {
  try {
    let contenido = fs.readFileSync(TESTIMONIOS_APROBADOS_FILE, "utf8");
    const matches = contenido.match(/id:\s*(\d+)/g);
    let ultimoId = 6;
    if (matches) {
      ultimoId = Math.max(...matches.map((match) => parseInt(match.match(/\d+/)[0])));
    }
    const nuevoId = ultimoId + 1;
    const fechaHoy = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const avatars = ["👩🏻", "👩🏼", "👩🏽", "👩🏾", "👩🏿", "👨🏻", "👨🏼", "👨🏽", "👨🏾", "👨🏿"];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    const nuevoTestimonio = `  {
    id: ${nuevoId},
    nombre: "${testimonio.nombre}",
    calificacion: ${testimonio.calificacion},
    comentario: "${testimonio.comentario.replace(/"/g, '\\"')}",
    servicio: "${testimonio.servicio || ""}",
    fecha: "${fechaHoy}",
    aprobado: true,
    avatar: "${avatar}"
  }`;
    const arrayEndIndex = contenido.lastIndexOf("];");
    if (arrayEndIndex !== -1) {
      const beforeArrayEnd = contenido.substring(0, arrayEndIndex);
      const afterArrayEnd = contenido.substring(arrayEndIndex);
      const needsComma = beforeArrayEnd.trim().endsWith("}");
      const coma = needsComma ? "," : "";
      contenido = beforeArrayEnd + coma + "\n" + nuevoTestimonio + "\n" + afterArrayEnd;
      fs.writeFileSync(TESTIMONIOS_APROBADOS_FILE, contenido);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al agregar testimonio aprobado:", error);
    return false;
  }
}
function eliminarTestimonioAprobado(id) {
  try {
    let contenido = fs.readFileSync(TESTIMONIOS_APROBADOS_FILE, "utf8");
    const patronTestimonio = new RegExp(`\\s*{[^}]*id:\\s*${id}[^}]*}(?:,?\\s*\\n?)?`, "g");
    if (!patronTestimonio.test(contenido)) {
      console.log(`Testimonio con ID ${id} no encontrado en aprobados`);
      return false;
    }
    const patronTestimonio2 = new RegExp(`\\s*{[^}]*id:\\s*${id}[^}]*}(?:,?\\s*\\n?)?`, "g");
    const nuevoContenido = contenido.replace(patronTestimonio2, "");
    const contenidoLimpio = nuevoContenido.replace(/,(\s*),/g, ",").replace(/,(\s*)\]/g, "\n]");
    fs.writeFileSync(TESTIMONIOS_APROBADOS_FILE, contenidoLimpio);
    console.log(`Testimonio con ID ${id} eliminado de aprobados`);
    return true;
  } catch (error) {
    console.error("Error al eliminar testimonio aprobado:", error);
    return false;
  }
}
const GET = async ({ url }) => {
  console.log("=== GET /api/testimonios ===");
  console.log("URL:", url.toString());
  try {
    const action = url.searchParams.get("action");
    console.log("Action:", action);
    if (action === "pendientes") {
      console.log("Obteniendo testimonios pendientes...");
      const testimonios = leerTestimoniosPendientes();
      console.log("Testimonios encontrados:", testimonios.length);
      console.log("Testimonios:", JSON.stringify(testimonios, null, 2));
      return new Response(JSON.stringify(testimonios), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (action === "aprobados") {
      console.log("Obteniendo testimonios aprobados...");
      try {
        const testimoniosAprobados = await leerTestimoniosAprobados();
        console.log("Testimonios aprobados encontrados:", testimoniosAprobados.length);
        return new Response(JSON.stringify(testimoniosAprobados), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (error) {
        console.error("Error leyendo testimonios aprobados:", error);
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }
    if (action === "aprobados") {
      console.log("Obteniendo testimonios aprobados...");
      try {
        const contenido = fs.readFileSync(TESTIMONIOS_APROBADOS_FILE, "utf8");
        const match = contenido.match(/export\s+const\s+testimonios\s*=\s*(\[[\s\S]*?\]);/);
        if (match) {
          const testimoniosString = match[1];
          const jsonString = testimoniosString.replace(/(\w+):/g, '"$1":').replace(/'/g, '"').replace(/,(\s*[}\]])/g, "$1");
          const testimonios = JSON.parse(jsonString);
          console.log("Testimonios aprobados encontrados:", testimonios.length);
          return new Response(JSON.stringify(testimonios), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          });
        }
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (error) {
        console.error("Error al leer testimonios aprobados:", error);
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }
    console.log("Acción no válida:", action);
    return new Response(JSON.stringify({ error: "Acción no válida" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error en GET:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    console.log("Datos recibidos:", data);
    const { action, testimonio, id } = data;
    if (action === "agregar-pendiente") {
      const testimonios = leerTestimoniosPendientes();
      const nuevoTestimonio = {
        id: Date.now(),
        nombre: testimonio.nombre,
        email: testimonio.email,
        calificacion: testimonio.calificacion,
        comentario: testimonio.comentario,
        servicio: testimonio.servicio || "",
        fechaEnvio: (/* @__PURE__ */ new Date()).toISOString(),
        estado: "pendiente"
      };
      testimonios.push(nuevoTestimonio);
      if (guardarTestimoniosPendientes(testimonios)) {
        console.log("Testimonio agregado:", nuevoTestimonio);
        return new Response(JSON.stringify({ success: true, id: nuevoTestimonio.id }), {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        });
      } else {
        throw new Error("No se pudo guardar el testimonio");
      }
    }
    if (action === "aprobar") {
      const testimonios = leerTestimoniosPendientes();
      const testimonioIndex = testimonios.findIndex((t) => t.id === id);
      if (testimonioIndex !== -1) {
        const testimonio2 = testimonios[testimonioIndex];
        if (agregarTestimonioAprobado(testimonio2)) {
          testimonios.splice(testimonioIndex, 1);
          guardarTestimoniosPendientes(testimonios);
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          });
        } else {
          throw new Error("No se pudo aprobar el testimonio");
        }
      } else {
        throw new Error("Testimonio no encontrado");
      }
    }
    if (action === "rechazar") {
      const testimonios = leerTestimoniosPendientes();
      const testimonioIndex = testimonios.findIndex((t) => t.id === id);
      if (testimonioIndex !== -1) {
        testimonios.splice(testimonioIndex, 1);
        guardarTestimoniosPendientes(testimonios);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        });
      } else {
        throw new Error("Testimonio no encontrado");
      }
    }
    if (action === "eliminar") {
      const testimoniosPendientes = leerTestimoniosPendientes();
      const indexPendiente = testimoniosPendientes.findIndex((t) => t.id === id);
      if (indexPendiente !== -1) {
        testimoniosPendientes.splice(indexPendiente, 1);
        guardarTestimoniosPendientes(testimoniosPendientes);
        return new Response(JSON.stringify({ success: true, origen: "pendientes" }), {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      if (eliminarTestimonioAprobado(id)) {
        return new Response(JSON.stringify({ success: true, origen: "aprobados" }), {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        });
      } else {
        throw new Error("Testimonio no encontrado en ninguna lista");
      }
    }
    throw new Error("Acción no válida");
  } catch (error) {
    console.error("Error en POST:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Error interno del servidor",
      details: error instanceof Error ? error.stack : "Error desconocido"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
