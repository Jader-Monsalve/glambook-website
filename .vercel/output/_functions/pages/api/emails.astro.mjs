import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
export { renderers } from '../../renderers.mjs';

({
  // true para 465, false para 587
  auth: {
    pass: process.env.GMAIL_APP_PASSWORD || "tu_contraseña_de_app"
  }
});
const BUSINESS_INFO = {
  name: "GlamBook",
  email: "jadermonsalve9@gmail.com",
  phone: "+57 300 699 7396",
  address: "Medellín, Colombia"
};
let transporter = null;
async function createTransporter() {
  if (transporter) return transporter;
  try {
    console.log("📧 Configurando transporter de Gmail para producción...");
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jadermonsalve9@gmail.com",
        pass: "islj xbmx bpzl ocpt"
      }
    });
    console.log("✅ Transporter Gmail configurado correctamente para producción");
    console.log("📧 Emails se enviarán desde: jadermonsalve9@gmail.com");
    return transporter;
  } catch (error) {
    console.error("❌ Error al crear transporter de email:", error);
    throw error;
  }
}
function createEmailTemplate(content, title = "GlamBook Notification") {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Arial', sans-serif;
                background-color: #f8f9fa;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
            }
            .header p {
                margin: 5px 0 0 0;
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 30px 20px;
                line-height: 1.6;
            }
            .appointment-card {
                background-color: #f8f9fa;
                border-left: 4px solid #ec4899;
                padding: 20px;
                margin: 20px 0;
                border-radius: 5px;
            }
            .appointment-detail {
                margin: 10px 0;
                display: flex;
                align-items: center;
            }
            .appointment-detail strong {
                min-width: 120px;
                color: #be185d;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
                color: white;
                padding: 12px 25px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #666;
                border-top: 1px solid #e9ecef;
            }
            .footer a {
                color: #ec4899;
                text-decoration: none;
            }
            .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .status-confirmada { background-color: #d4edda; color: #155724; }
            .status-pendiente { background-color: #fff3cd; color: #856404; }
            .status-cancelada { background-color: #f8d7da; color: #721c24; }
            .status-completada { background-color: #d1ecf1; color: #0c5460; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💅 ${BUSINESS_INFO.name}</h1>
                <p>Tu salón de belleza de confianza</p>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p><strong>${BUSINESS_INFO.name}</strong></p>
                <p>📍 ${BUSINESS_INFO.address}</p>
                <p>📞 ${BUSINESS_INFO.phone} | 📧 <a href="mailto:${BUSINESS_INFO.email}">${BUSINESS_INFO.email}</a></p>
                <p style="margin-top: 15px;">
                    <small>Este es un email automático, por favor no respondas a este mensaje.</small>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}
async function enviarConfirmacionCita(cita) {
  try {
    const emailTransporter = await createTransporter();
    const fechaFormateada = new Date(cita.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const servicios = {
      "unas-naturales": "Uñas Naturales",
      "unas-acrilicas": "Uñas Acrílicas",
      "unas-gel": "Uñas en Gel",
      "manicure": "Manicure",
      "pedicure": "Pedicure",
      "diseno-unas": "Diseño de Uñas",
      "otros": "Otros Servicios"
    };
    const servicioNombre = servicios[cita.servicio] || cita.servicio;
    const emailContent = `
      <h2>¡Hola ${cita.nombre}! 👋</h2>
      <p>Hemos recibido tu solicitud de cita y estamos emocionados de atenderte. Aquí tienes los detalles de tu reserva:</p>
      
      <div class="appointment-card">
        <h3 style="margin-top: 0; color: #be185d;">📅 Detalles de tu Cita</h3>
        <div class="appointment-detail">
          <strong>📍 Servicio:</strong> ${servicioNombre}
        </div>
        <div class="appointment-detail">
          <strong>📅 Fecha:</strong> ${fechaFormateada}
        </div>
        <div class="appointment-detail">
          <strong>⏰ Hora:</strong> ${cita.hora}
        </div>
        <div class="appointment-detail">
          <strong>📧 Email:</strong> ${cita.email}
        </div>
        <div class="appointment-detail">
          <strong>📞 Teléfono:</strong> ${cita.telefono}
        </div>
        <div class="appointment-detail">
          <strong>🏷️ Estado:</strong> <span class="status-badge status-${cita.estado}">${cita.estado}</span>
        </div>
        ${cita.comentarios ? `
        <div class="appointment-detail">
          <strong>💭 Comentarios:</strong> ${cita.comentarios}
        </div>
        ` : ""}
      </div>
      
      <h3>📋 Información Importante:</h3>
      <ul>
        <li>Por favor llega 10 minutos antes de tu cita</li>
        <li>Si necesitas cancelar o reprogramar, contáctanos con al menos 24 horas de anticipación</li>
        <li>Trae una identificación válida</li>
        <li>Si tienes alguna alergia o condición especial, por favor infórmanos</li>
      </ul>
      
      <p>Si tienes alguna pregunta o necesitas hacer cambios en tu cita, no dudes en contactarnos:</p>
      <p>📞 WhatsApp: <a href="https://wa.me/573006997396">${BUSINESS_INFO.phone}</a></p>
      
      <p style="margin-top: 30px;">
        <strong>¡Estamos ansiosos de verte y hacer que luzcas increíble! ✨</strong>
      </p>
    `;
    const info = await emailTransporter.sendMail({
      from: `"${BUSINESS_INFO.name}" <${BUSINESS_INFO.email}>`,
      to: cita.email,
      subject: `✅ Confirmación de Cita - ${servicioNombre} | ${BUSINESS_INFO.name}`,
      html: createEmailTemplate(emailContent, "Confirmación de Cita")
    });
    console.log("✅ Email de confirmación enviado:", info.messageId);
    if (process.env.NODE_ENV !== "production") {
      console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
    }
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: process.env.NODE_ENV !== "production" ? nodemailer.getTestMessageUrl(info) : null
    };
  } catch (error) {
    console.error("❌ Error al enviar email de confirmación:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido"
    };
  }
}
async function enviarRecordatorioCita(cita) {
  try {
    const emailTransporter = await createTransporter();
    const fechaFormateada = new Date(cita.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const servicios = {
      "unas-naturales": "Uñas Naturales",
      "unas-acrilicas": "Uñas Acrílicas",
      "unas-gel": "Uñas en Gel",
      "manicure": "Manicure",
      "pedicure": "Pedicure",
      "diseno-unas": "Diseño de Uñas",
      "otros": "Otros Servicios"
    };
    const servicioNombre = servicios[cita.servicio] || cita.servicio;
    const emailContent = `
      <h2>⏰ Recordatorio de Cita - ¡Te esperamos mañana! 💅</h2>
      <p>Hola ${cita.nombre}, este es un recordatorio amigable de que tienes una cita programada para mañana.</p>
      
      <div class="appointment-card">
        <h3 style="margin-top: 0; color: #be185d;">📅 Detalles de tu Cita</h3>
        <div class="appointment-detail">
          <strong>📍 Servicio:</strong> ${servicioNombre}
        </div>
        <div class="appointment-detail">
          <strong>📅 Fecha:</strong> ${fechaFormateada}
        </div>
        <div class="appointment-detail">
          <strong>⏰ Hora:</strong> ${cita.hora}
        </div>
      </div>
      
      <h3>✅ Lista de Verificación:</h3>
      <ul>
        <li>Llega 10 minutos antes de tu cita</li>
        <li>Trae una identificación válida</li>
        <li>Si usas esmalte, ven con uñas limpias</li>
        <li>Informa sobre alergias o condiciones especiales</li>
      </ul>
      
      <p><strong>¿Necesitas reprogramar o cancelar?</strong></p>
      <p>Por favor contáctanos lo antes posible:</p>
      <p>📞 WhatsApp: <a href="https://wa.me/573006997396">${BUSINESS_INFO.phone}</a></p>
      
      <p style="margin-top: 30px;">
        <strong>¡Estamos emocionados de verte mañana! ✨</strong>
      </p>
    `;
    const info = await emailTransporter.sendMail({
      from: `"${BUSINESS_INFO.name}" <${BUSINESS_INFO.email}>`,
      to: cita.email,
      subject: `⏰ Recordatorio: Tu cita es mañana - ${servicioNombre} | ${BUSINESS_INFO.name}`,
      html: createEmailTemplate(emailContent, "Recordatorio de Cita")
    });
    console.log("✅ Recordatorio de cita enviado:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: process.env.NODE_ENV !== "production" ? nodemailer.getTestMessageUrl(info) : null
    };
  } catch (error) {
    console.error("❌ Error al enviar recordatorio:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido"
    };
  }
}

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
