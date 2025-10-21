import nodemailer from 'nodemailer';

// Configuración del servicio de email para producción (Gmail)
const EMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para 587
  auth: {
    user: 'jadermonsalve9@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'tu_contraseña_de_app'
  }
};

// Información del negocio
const BUSINESS_INFO = {
  name: 'GlamBook',
  email: 'jadermonsalve9@gmail.com',
  phone: '+57 300 699 7396',
  address: 'Medellín, Colombia'
};

// Crear el transportador de email
let transporter: nodemailer.Transporter | null = null;

async function createTransporter() {
  if (transporter) return transporter;
  
  try {
    // Configurar Gmail directamente para producción
    console.log('📧 Configurando transporter de Gmail para producción...');
    
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jadermonsalve9@gmail.com',
        pass: 'islj xbmx bpzl ocpt'
      }
    });
    console.log('✅ Transporter Gmail configurado correctamente para producción');
    console.log('📧 Emails se enviarán desde: jadermonsalve9@gmail.com');
    
    return transporter;
  } catch (error) {
    console.error('❌ Error al crear transporter de email:', error);
    throw error;
  }
}

// Plantilla base para emails
function createEmailTemplate(content: string, title: string = 'GlamBook Notification') {
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

// Función para enviar confirmación de cita al cliente
export async function enviarConfirmacionCita(cita: any) {
  try {
    const emailTransporter = await createTransporter();
    
    const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const servicios = {
      'unas-naturales': 'Uñas Naturales',
      'unas-acrilicas': 'Uñas Acrílicas',
      'unas-gel': 'Uñas en Gel',
      'manicure': 'Manicure',
      'pedicure': 'Pedicure',
      'diseno-unas': 'Diseño de Uñas',
      'otros': 'Otros Servicios'
    };
    
    const servicioNombre = servicios[cita.servicio as keyof typeof servicios] || cita.servicio;
    
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
        ` : ''}
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
      html: createEmailTemplate(emailContent, 'Confirmación de Cita')
    });
    
    console.log('✅ Email de confirmación enviado:', info.messageId);
    
    // En desarrollo, mostrar URL de previsualización
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: process.env.NODE_ENV !== 'production' ? nodemailer.getTestMessageUrl(info) : null
    };
    
  } catch (error) {
    console.error('❌ Error al enviar email de confirmación:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// Función para enviar notificación al administrador
export async function enviarNotificacionAdmin(cita: any) {
  try {
    const emailTransporter = await createTransporter();
    
    const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const servicios = {
      'unas-naturales': 'Uñas Naturales',
      'unas-acrilicas': 'Uñas Acrílicas',
      'unas-gel': 'Uñas en Gel',
      'manicure': 'Manicure',
      'pedicure': 'Pedicure',
      'diseno-unas': 'Diseño de Uñas',
      'otros': 'Otros Servicios'
    };
    
    const servicioNombre = servicios[cita.servicio as keyof typeof servicios] || cita.servicio;
    
    const emailContent = `
      <h2>🆕 Nueva Cita Reservada</h2>
      <p>Se ha registrado una nueva cita en el sistema. Aquí tienes los detalles:</p>
      
      <div class="appointment-card">
        <h3 style="margin-top: 0; color: #be185d;">👤 Información del Cliente</h3>
        <div class="appointment-detail">
          <strong>👤 Nombre:</strong> ${cita.nombre}
        </div>
        <div class="appointment-detail">
          <strong>📧 Email:</strong> ${cita.email}
        </div>
        <div class="appointment-detail">
          <strong>📞 Teléfono:</strong> ${cita.telefono}
        </div>
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
          <strong>🏷️ Estado:</strong> <span class="status-badge status-${cita.estado}">${cita.estado}</span>
        </div>
        ${cita.comentarios ? `
        <div class="appointment-detail">
          <strong>💭 Comentarios:</strong> ${cita.comentarios}
        </div>
        ` : ''}
        <div class="appointment-detail">
          <strong>📅 Fecha de Registro:</strong> ${new Date(cita.fechaCreacion).toLocaleString('es-ES')}
        </div>
      </div>
      
      <p>
        <a href="http://localhost:4326/admin" class="button" style="color: white;">
          🔧 Gestionar Cita en Panel Admin
        </a>
      </p>
      
      <p><strong>Acciones recomendadas:</strong></p>
      <ul>
        <li>Confirmar la cita con el cliente</li>
        <li>Verificar disponibilidad de productos/materiales</li>
        <li>Preparar el espacio de trabajo</li>
        <li>Enviar recordatorio 24 horas antes</li>
      </ul>
    `;
    
    const info = await emailTransporter.sendMail({
      from: `"${BUSINESS_INFO.name} - Sistema" <${BUSINESS_INFO.email}>`,
      to: BUSINESS_INFO.email,
      subject: `🆕 Nueva Cita: ${cita.nombre} - ${servicioNombre} | ${fechaFormateada}`,
      html: createEmailTemplate(emailContent, 'Nueva Cita Registrada')
    });
    
    console.log('✅ Email de notificación al admin enviado:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: process.env.NODE_ENV !== 'production' ? nodemailer.getTestMessageUrl(info) : null
    };
    
  } catch (error) {
    console.error('❌ Error al enviar notificación al admin:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// Función para enviar recordatorio de cita
export async function enviarRecordatorioCita(cita: any) {
  try {
    const emailTransporter = await createTransporter();
    
    const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const servicios = {
      'unas-naturales': 'Uñas Naturales',
      'unas-acrilicas': 'Uñas Acrílicas',
      'unas-gel': 'Uñas en Gel',
      'manicure': 'Manicure',
      'pedicure': 'Pedicure',
      'diseno-unas': 'Diseño de Uñas',
      'otros': 'Otros Servicios'
    };
    
    const servicioNombre = servicios[cita.servicio as keyof typeof servicios] || cita.servicio;
    
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
      html: createEmailTemplate(emailContent, 'Recordatorio de Cita')
    });
    
    console.log('✅ Recordatorio de cita enviado:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: process.env.NODE_ENV !== 'production' ? nodemailer.getTestMessageUrl(info) : null
    };
    
  } catch (error) {
    console.error('❌ Error al enviar recordatorio:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

export default {
  enviarConfirmacionCita,
  enviarNotificacionAdmin,
  enviarRecordatorioCita
};