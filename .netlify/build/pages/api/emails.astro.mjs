import fs from 'fs';
import path from 'path';
import { e as enviarConfirmacionCita, b as enviarRecordatorioCita } from '../../chunks/emailService_DdnSTm7x.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const CITAS_FILE = path.join(process.cwd(), "src", "data", "citas.json");
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
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    console.log("📧 Solicitud de email recibida:", data);
    const { action, citaId, tipo } = data;
    if (action === "enviar-email") {
      const citas = leerCitas();
      const cita = citas.find((c) => c.id == citaId);
      if (!cita) {
        return new Response(JSON.stringify({
          success: false,
          error: "Cita no encontrada"
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      let result;
      switch (tipo) {
        case "recordatorio":
          console.log("📧 Enviando recordatorio para cita:", citaId);
          result = await enviarRecordatorioCita(cita);
          break;
        case "confirmacion":
          console.log("📧 Reenviando confirmación para cita:", citaId);
          result = await enviarConfirmacionCita(cita);
          break;
        default:
          return new Response(JSON.stringify({
            success: false,
            error: "Tipo de email no válido. Use: recordatorio, confirmacion"
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
      }
      if (result.success) {
        console.log(`✅ Email de ${tipo} enviado exitosamente`);
        const response = {
          success: true,
          message: `Email de ${tipo} enviado exitosamente`,
          messageId: result.messageId,
          ...result.previewUrl && { previewUrl: result.previewUrl }
        };
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } else {
        console.error(`❌ Error al enviar email de ${tipo}:`, result.error);
        return new Response(JSON.stringify({
          success: false,
          error: `Error al enviar email de ${tipo}: ${result.error}`
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (action === "enviar-recordatorios-automaticos") {
      console.log("📧 Enviando recordatorios automáticos...");
      const citas = leerCitas();
      const manana = /* @__PURE__ */ new Date();
      manana.setDate(manana.getDate() + 1);
      const fechaManana = manana.toISOString().split("T")[0];
      const citasParaRecordar = citas.filter(
        (cita) => cita.fecha === fechaManana && (cita.estado === "confirmada" || cita.estado === "pendiente")
      );
      console.log(`📧 Encontradas ${citasParaRecordar.length} citas para recordar`);
      if (citasParaRecordar.length === 0) {
        return new Response(JSON.stringify({
          success: true,
          message: "No hay citas para mañana que requieran recordatorio",
          citasEnviadas: 0
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      const resultados = await Promise.allSettled(
        citasParaRecordar.map((cita) => enviarRecordatorioCita(cita))
      );
      let exitosos = 0;
      let fallidos = 0;
      const errores = [];
      resultados.forEach((resultado, index) => {
        if (resultado.status === "fulfilled" && resultado.value.success) {
          exitosos++;
          console.log(`✅ Recordatorio enviado a: ${citasParaRecordar[index].email}`);
        } else {
          fallidos++;
          const error = resultado.status === "rejected" ? resultado.reason : resultado.value.error;
          errores.push(`${citasParaRecordar[index].email}: ${error}`);
          console.error(`❌ Error al enviar a ${citasParaRecordar[index].email}:`, error);
        }
      });
      return new Response(JSON.stringify({
        success: true,
        message: `Recordatorios procesados: ${exitosos} exitosos, ${fallidos} fallidos`,
        citasEnviadas: exitosos,
        citasFallidas: fallidos,
        errores
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Acción no válida"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Error en /api/emails:", error);
    return new Response(JSON.stringify({
      success: false,
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
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
