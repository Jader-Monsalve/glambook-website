import nodemailer from 'nodemailer';

// Configuración de Gmail para producción
const GMAIL_USER = 'jadermonsalve9@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'islj xbmx bpzl ocpt';

console.log('🔧 Iniciando configuración de email service...');
console.log(`📧 Gmail user: ${GMAIL_USER}`);
console.log(`🔑 Gmail password disponible: ${GMAIL_APP_PASSWORD ? '✅ SÍ' : '❌ NO'}`);

let transporter: nodemailer.Transporter;

// Usar Gmail directamente para producción
console.log('✅ Configurando Gmail para producción');
transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: 'islj xbmx bpzl ocpt'
  }
});
console.log('✅ Transporter Gmail configurado correctamente para producción');

// Verificar conexión
transporter.verify()
  .then(() => {
    console.log('✅ Conexión con Gmail verificada exitosamente');
  })
  .catch((error) => {
    console.error('❌ Error al verificar conexión con Gmail:', error);
  });

export interface CitaEmail {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
  mensaje?: string;
}

// Función para enviar confirmación de cita al cliente
export async function enviarConfirmacionCita(cita: CitaEmail): Promise<boolean> {
  try {
    console.log(`📧 Enviando confirmación de cita a: ${cita.email}`);
    
    const mailOptions = {
      from: `"GlamBook Studio" <${GMAIL_USER}>`,
      to: cita.email,
      subject: '✨ Confirmación de tu cita en GlamBook Studio',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Cita - GlamBook Studio</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 30px 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 300;
            }
            .content {
              padding: 30px;
            }
            .cita-card {
              background-color: #f8f9fa;
              border-left: 4px solid #667eea;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
              color: #667eea;
            }
            .detail-value {
              text-align: right;
            }
            .footer {
              background-color: #f8f9fa;
              text-align: center;
              padding: 20px;
              border-top: 1px solid #eee;
            }
            .btn {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 25px;
              text-decoration: none;
              border-radius: 25px;
              margin: 15px 0;
              font-weight: bold;
            }
            .contact-info {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ GlamBook Studio ✨</h1>
              <p>Tu cita ha sido confirmada</p>
            </div>
            
            <div class="content">
              <h2>¡Hola ${cita.nombre}! 👋</h2>
              <p>Nos complace confirmar que tu cita ha sido agendada exitosamente. Aquí tienes todos los detalles:</p>
              
              <div class="cita-card">
                <h3>📅 Detalles de tu cita</h3>
                <div class="detail-row">
                  <span class="detail-label">Cliente:</span>
                  <span class="detail-value">${cita.nombre}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Servicio:</span>
                  <span class="detail-value">${cita.servicio}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Fecha:</span>
                  <span class="detail-value">${new Date(cita.fecha).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Hora:</span>
                  <span class="detail-value">${cita.hora}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">ID de cita:</span>
                  <span class="detail-value">#${cita.id}</span>
                </div>
              </div>

              ${cita.mensaje ? `
                <div class="contact-info">
                  <h4>📝 Mensaje adicional:</h4>
                  <p>${cita.mensaje}</p>
                </div>
              ` : ''}
              
              <div class="contact-info">
                <h4>📞 Información de contacto</h4>
                <p><strong>WhatsApp:</strong> +57 123 456 7890</p>
                <p><strong>Email:</strong> jadermonsalve9@gmail.com</p>
                <p><strong>Dirección:</strong> Tu ubicación de estudio</p>
              </div>
              
              <p><strong>Recordatorios importantes:</strong></p>
              <ul>
                <li>✨ Llega 10 minutos antes de tu cita</li>
                <li>🧴 Ven con el rostro limpio (sin maquillaje)</li>
                <li>📱 Si necesitas reprogramar, contáctanos con 24h de anticipación</li>
                <li>💧 Mantente hidratada antes del servicio</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>¡Estamos emocionadas de verte pronto!</p>
              <p>Con amor, el equipo de GlamBook Studio 💄✨</p>
              <p style="font-size: 12px; color: #666;">
                Este es un email automático, por favor no responder directamente.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmación enviado exitosamente:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar confirmación de cita:', error);
    return false;
  }
}

// Función para enviar notificación al administrador
export async function enviarNotificacionAdmin(cita: CitaEmail): Promise<boolean> {
  try {
    console.log('📧 Enviando notificación al administrador');
    
    const mailOptions = {
      from: `"GlamBook Studio" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: '🔔 Nueva cita agendada - GlamBook Studio',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Cita - GlamBook Studio</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
              color: white;
              text-align: center;
              padding: 30px 20px;
            }
            .content {
              padding: 30px;
            }
            .cita-card {
              background-color: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
              color: #28a745;
            }
            .alert {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Nueva Cita Agendada</h1>
              <p>GlamBook Studio</p>
            </div>
            
            <div class="content">
              <h2>¡Nueva cita registrada!</h2>
              <p>Se ha agendado una nueva cita en el sistema. Aquí están los detalles:</p>
              
              <div class="cita-card">
                <h3>👤 Información del cliente</h3>
                <div class="detail-row">
                  <span class="detail-label">Nombre:</span>
                  <span>${cita.nombre}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span>${cita.email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Teléfono:</span>
                  <span>${cita.telefono}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Servicio:</span>
                  <span>${cita.servicio}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Fecha:</span>
                  <span>${new Date(cita.fecha).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Hora:</span>
                  <span>${cita.hora}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">ID:</span>
                  <span>#${cita.id}</span>
                </div>
              </div>

              ${cita.mensaje ? `
                <div class="alert">
                  <h4>💬 Mensaje del cliente:</h4>
                  <p>${cita.mensaje}</p>
                </div>
              ` : ''}
              
              <div class="alert">
                <p><strong>⏰ Recordatorio:</strong> Revisa tu calendario y confirma la disponibilidad.</p>
                <p><strong>📞 Acción requerida:</strong> Contacta al cliente si es necesario.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Notificación al admin enviada exitosamente:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar notificación al admin:', error);
    return false;
  }
}

// Función para enviar recordatorio de cita
export async function enviarRecordatorioCita(cita: CitaEmail): Promise<boolean> {
  try {
    console.log(`📧 Enviando recordatorio de cita a: ${cita.email}`);
    
    const mailOptions = {
      from: `"GlamBook Studio" <${GMAIL_USER}>`,
      to: cita.email,
      subject: '⏰ Recordatorio de tu cita mañana - GlamBook Studio',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recordatorio de Cita - GlamBook Studio</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%);
              color: white;
              text-align: center;
              padding: 30px 20px;
            }
            .content {
              padding: 30px;
            }
            .reminder-card {
              background-color: #fff3cd;
              border: 2px solid #ffc107;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
              color: #ffc107;
            }
            .tips {
              background-color: #e8f5e8;
              border: 1px solid #28a745;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ ¡No olvides tu cita!</h1>
              <p>GlamBook Studio</p>
            </div>
            
            <div class="content">
              <h2>¡Hola ${cita.nombre}! 👋</h2>
              
              <div class="reminder-card">
                <h3>🗓️ Tu cita es mañana</h3>
                <p style="font-size: 18px; margin: 0;"><strong>${new Date(cita.fecha).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} a las ${cita.hora}</strong></p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>📋 Detalles de tu cita</h3>
                <div class="detail-row">
                  <span class="detail-label">Servicio:</span>
                  <span>${cita.servicio}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Fecha:</span>
                  <span>${new Date(cita.fecha).toLocaleDateString('es-ES')}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Hora:</span>
                  <span>${cita.hora}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">ID de cita:</span>
                  <span>#${cita.id}</span>
                </div>
              </div>
              
              <div class="tips">
                <h4>✨ Consejos para mañana:</h4>
                <ul>
                  <li>🕒 Llega 10 minutos antes</li>
                  <li>🧼 Ven con el rostro limpio</li>
                  <li>💧 Mantente bien hidratada</li>
                  <li>📱 Trae tu teléfono cargado para fotos</li>
                </ul>
              </div>
              
              <p><strong>📞 ¿Necesitas reprogramar?</strong></p>
              <p>Si surge algún imprevisto, contáctanos lo antes posible:</p>
              <p>📱 WhatsApp: +57 123 456 7890</p>
              <p>📧 Email: jadermonsalve9@gmail.com</p>
              
              <p style="text-align: center; margin-top: 30px;">
                <strong>¡Estamos emocionadas de verte mañana! ✨</strong>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Recordatorio enviado exitosamente:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar recordatorio:', error);
    return false;
  }
}

export { transporter };