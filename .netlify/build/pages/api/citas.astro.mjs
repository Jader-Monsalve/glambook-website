import fs from 'fs';
import path from 'path';
import { e as enviarConfirmacionCita, a as enviarNotificacionAdmin } from '../../chunks/emailService_DdnSTm7x.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const CITAS_FILE = path.join(process.cwd(), "src", "data", "citas.json");
const HORARIOS_FILE = path.join(process.cwd(), "src", "data", "horarios.json");
function leerCitas() {
  try {
    if (fs.existsSync(CITAS_FILE)) {
      const data = fs.readFileSync(CITAS_FILE, "utf8");
      return JSON.parse(data) || [];
    }
    return [];
  } catch (error) {
    console.error("Error al leer citas:", error);
    return [];
  }
}
function guardarCitas(citas) {
  try {
    const dir = path.dirname(CITAS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CITAS_FILE, JSON.stringify(citas, null, 2));
    return true;
  } catch (error) {
    console.error("Error al guardar citas:", error);
    return false;
  }
}
function leerHorarios() {
  try {
    if (fs.existsSync(HORARIOS_FILE)) {
      const data = fs.readFileSync(HORARIOS_FILE, "utf8");
      return JSON.parse(data);
    }
    return {
      horarios: {
        lunes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        martes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        miercoles: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        jueves: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        viernes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        sabado: ["09:00", "10:00", "11:00", "12:00", "13:00"],
        domingo: []
      },
      configuracion: {
        diasAdelante: 30,
        horaMinima: "09:00",
        horaMaxima: "18:00",
        duracionCita: 60
      }
    };
  } catch (error) {
    console.error("Error al leer horarios:", error);
    return null;
  }
}
function guardarHorarios(horarios) {
  try {
    const dir = path.dirname(HORARIOS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(HORARIOS_FILE, JSON.stringify(horarios, null, 2));
    return true;
  } catch (error) {
    console.error("Error al guardar horarios:", error);
    return false;
  }
}
function obtenerHorariosDisponibles(fecha) {
  const citas = leerCitas();
  const configHorarios = leerHorarios();
  if (!configHorarios) return [];
  const fechaObj = new Date(fecha);
  const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  const diaSemana = diasSemana[fechaObj.getDay()];
  const horariosBase = configHorarios.horarios[diaSemana] || [];
  const citasDelDia = citas.filter((cita) => cita.fecha === fecha && cita.estado !== "cancelada");
  const horariosOcupados = citasDelDia.map((cita) => cita.hora);
  return horariosBase.filter((hora) => !horariosOcupados.includes(hora));
}
const GET = async ({ url }) => {
  console.log("=== GET /api/citas ===");
  console.log("URL:", url.toString());
  try {
    const action = url.searchParams.get("action");
    const fecha = url.searchParams.get("fecha");
    console.log("Action:", action);
    if (action === "horarios-disponibles" && fecha) {
      console.log("Obteniendo horarios disponibles para fecha:", fecha);
      const horariosDisponibles = obtenerHorariosDisponibles(fecha);
      console.log("Horarios disponibles:", horariosDisponibles);
      return new Response(JSON.stringify(horariosDisponibles), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (action === "todas") {
      console.log("Obteniendo todas las citas...");
      const citas = leerCitas();
      console.log("Citas encontradas:", citas.length);
      return new Response(JSON.stringify(citas), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (action === "obtener-todas") {
      console.log("Obteniendo todas las citas...");
      const citas = leerCitas();
      console.log("Citas encontradas:", citas.length);
      return new Response(JSON.stringify(citas), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (action === "configuracion-horarios") {
      console.log("Obteniendo configuración de horarios...");
      const horarios = leerHorarios();
      return new Response(JSON.stringify(horarios), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
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
    const { action } = data;
    if (action === "crear-cita") {
      const { nombre, email, telefono, servicio, fecha, hora, comentarios } = data;
      const horariosDisponibles = obtenerHorariosDisponibles(fecha);
      if (!horariosDisponibles.includes(hora)) {
        return new Response(JSON.stringify({
          success: false,
          error: "El horario seleccionado ya no está disponible"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      const citas = leerCitas();
      const nuevaCita = {
        id: Date.now(),
        nombre,
        email,
        telefono,
        servicio,
        fecha,
        hora,
        comentarios: comentarios || "",
        estado: "confirmada",
        fechaCreacion: (/* @__PURE__ */ new Date()).toISOString()
      };
      citas.push(nuevaCita);
      if (guardarCitas(citas)) {
        console.log("Cita creada:", nuevaCita);
        try {
          const [confirmacionResult, notificacionResult] = await Promise.allSettled([
            enviarConfirmacionCita(nuevaCita),
            enviarNotificacionAdmin(nuevaCita)
          ]);
          if (confirmacionResult.status === "fulfilled" && confirmacionResult.value.success) {
            console.log("✅ Email de confirmación enviado al cliente");
            if (confirmacionResult.value.previewUrl) {
              console.log("🔗 Preview cliente:", confirmacionResult.value.previewUrl);
            }
          } else {
            console.error(
              "❌ Error al enviar confirmación al cliente:",
              confirmacionResult.status === "rejected" ? confirmacionResult.reason : confirmacionResult.value.error
            );
          }
          if (notificacionResult.status === "fulfilled" && notificacionResult.value.success) {
            console.log("✅ Email de notificación enviado al admin");
            if (notificacionResult.value.previewUrl) {
              console.log("🔗 Preview admin:", notificacionResult.value.previewUrl);
            }
          } else {
            console.error(
              "❌ Error al enviar notificación al admin:",
              notificacionResult.status === "rejected" ? notificacionResult.reason : notificacionResult.value.error
            );
          }
        } catch (emailError) {
          console.error("❌ Error general en envío de emails:", emailError);
        }
        return new Response(JSON.stringify({
          success: true,
          cita: nuevaCita,
          message: "Cita creada exitosamente. Se han enviado las notificaciones por email."
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } else {
        throw new Error("No se pudo guardar la cita");
      }
    }
    if (action === "actualizar-estado-cita") {
      const { id, estado } = data;
      const citas = leerCitas();
      const citaIndex = citas.findIndex((c) => c.id === id);
      if (citaIndex !== -1) {
        citas[citaIndex].estado = estado;
        citas[citaIndex].fechaModificacion = (/* @__PURE__ */ new Date()).toISOString();
        if (guardarCitas(citas)) {
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } else {
          throw new Error("No se pudo actualizar la cita");
        }
      } else {
        throw new Error("Cita no encontrada");
      }
    }
    if (action === "configurar-horarios") {
      const { horarios } = data;
      if (guardarHorarios(horarios)) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } else {
        throw new Error("No se pudo guardar la configuración");
      }
    }
    if (action === "cambiar-estado") {
      const { id, estado } = data;
      const citas = leerCitas();
      const citaIndex = citas.findIndex((c) => c.id == id);
      if (citaIndex !== -1) {
        citas[citaIndex].estado = estado;
        citas[citaIndex].fechaModificacion = (/* @__PURE__ */ new Date()).toISOString();
        if (guardarCitas(citas)) {
          return new Response(JSON.stringify({ success: true, cita: citas[citaIndex] }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } else {
          throw new Error("No se pudo actualizar la cita");
        }
      } else {
        throw new Error("Cita no encontrada");
      }
    }
    if (action === "eliminar") {
      const { id } = data;
      const citas = leerCitas();
      const citasFiltradas = citas.filter((c) => c.id != id);
      if (citasFiltradas.length < citas.length) {
        if (guardarCitas(citasFiltradas)) {
          return new Response(JSON.stringify({ success: true, message: "Cita eliminada correctamente" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } else {
          throw new Error("No se pudo eliminar la cita");
        }
      } else {
        throw new Error("Cita no encontrada");
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
      headers: { "Content-Type": "application/json" }
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
