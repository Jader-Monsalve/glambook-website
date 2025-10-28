// Sistema de WhatsApp y generación de imágenes para citas
// Reemplaza el sistema de emails por WhatsApp Business

// Configuración para WhatsApp Business
const WHATSAPP_NUMBER = '+573006997396';
const BUSINESS_NAME = 'GlamBook Studio';

console.log('📱 Configurando servicio de WhatsApp...');
console.log(`📞 WhatsApp Business: ${WHATSAPP_NUMBER}`);
console.log(`🏢 Nombre del negocio: ${BUSINESS_NAME}`);

export interface CitaData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
  mensaje?: string;
}

// Función para generar imagen de confirmación de cita
export function generarImagenCita(cita: CitaData): string {
  console.log(`🖼️ Generando imagen para cita: ${cita.nombre} - ${cita.fecha}`);
  
  // Generar SVG con los datos de la cita
  const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Obtener nombre del servicio completo
  const servicioCompleto = obtenerNombreServicio(cita.servicio);

  const svgContent = `<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);">
  <defs>
    <!-- Gradientes -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    
    <!-- Sombras -->
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="8" stdDeviation="15" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
    
    <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.1)"/>
    </filter>
  </defs>
  
  <!-- Fondo principal -->
  <rect width="800" height="1000" fill="url(#bgGradient)"/>
  
  <!-- Elementos decorativos de fondo -->
  <circle cx="150" cy="150" r="60" fill="rgba(255,255,255,0.1)" opacity="0.6"/>
  <circle cx="650" cy="200" r="40" fill="rgba(255,255,255,0.15)" opacity="0.4"/>
  <circle cx="100" cy="800" r="80" fill="rgba(255,255,255,0.1)" opacity="0.5"/>
  <circle cx="700" cy="850" r="50" fill="rgba(255,255,255,0.2)" opacity="0.3"/>
  
  <!-- Tarjeta principal -->
  <rect x="50" y="80" width="700" height="840" rx="25" fill="url(#cardGradient)" filter="url(#shadow)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  
  <!-- Header de la tarjeta -->
  <rect x="50" y="80" width="700" height="150" rx="25" fill="url(#headerGradient)"/>
  <rect x="50" y="205" width="700" height="25" fill="url(#headerGradient)"/>
  
  <!-- Logo/Icono -->
  <circle cx="400" cy="120" r="25" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
  <text x="400" y="130" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">✨</text>
  
  <!-- Título principal -->
  <text x="400" y="170" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold" letter-spacing="1px">
    ${BUSINESS_NAME}
  </text>
  <text x="400" y="200" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="18">
    Confirmación de Cita
  </text>
  
  <!-- Contenido principal -->
  <text x="400" y="280" text-anchor="middle" fill="#1f2937" font-family="Arial, sans-serif" font-size="28" font-weight="bold">
    Detalles de tu Cita
  </text>
  
  <!-- Línea decorativa -->
  <line x1="100" y1="300" x2="700" y2="300" stroke="#e5e7eb" stroke-width="2"/>
  
  <!-- Información del cliente -->
  <g transform="translate(100, 340)">
    <!-- Nombre -->
    <rect x="0" y="0" width="600" height="60" rx="10" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1"/>
    <circle cx="25" r="8" fill="#ec4899"/>
    <text x="50" y="20" fill="#6b7280" font-family="Arial, sans-serif" font-size="14" font-weight="600">CLIENTE</text>
    <text x="50" y="45" fill="#111827" font-family="Arial, sans-serif" font-size="20" font-weight="bold">${cita.nombre}</text>
    
    <!-- Servicio -->
    <rect x="0" y="80" width="600" height="60" rx="10" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1"/>
    <circle cx="25" cy="110" r="8" fill="#0ea5e9"/>
    <text x="50" y="100" fill="#6b7280" font-family="Arial, sans-serif" font-size="14" font-weight="600">SERVICIO</text>
    <text x="50" y="125" fill="#111827" font-family="Arial, sans-serif" font-size="20" font-weight="bold">${servicioCompleto}</text>
    
    <!-- Fecha y Hora -->
    <g transform="translate(0, 160)">
      <!-- Fecha -->
      <rect x="0" y="0" width="290" height="80" rx="10" fill="#fef7ff" stroke="#f3e8ff" stroke-width="1"/>
      <circle cx="25" cy="25" r="8" fill="#a855f7"/>
      <text x="50" y="20" fill="#6b7280" font-family="Arial, sans-serif" font-size="14" font-weight="600">FECHA</text>
      <text x="50" y="40" fill="#111827" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${fechaFormateada}</text>
      
      <!-- Hora -->
      <rect x="310" y="0" width="290" height="80" rx="10" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
      <circle cx="335" cy="25" r="8" fill="#10b981"/>
      <text x="360" y="20" fill="#6b7280" font-family="Arial, sans-serif" font-size="14" font-weight="600">HORA</text>
      <text x="360" y="40" fill="#111827" font-family="Arial, sans-serif" font-size="18" font-weight="bold">${cita.hora}</text>
      <text x="360" y="60" fill="#6b7280" font-family="Arial, sans-serif" font-size="12">¡Puntualidad es clave!</text>
    </g>
    
    <!-- ID de cita -->
    <rect x="0" y="260" width="600" height="50" rx="10" fill="#fffbeb" stroke="#fed7aa" stroke-width="1"/>
    <circle cx="25" cy="285" r="8" fill="#f59e0b"/>
    <text x="50" y="275" fill="#6b7280" font-family="Arial, sans-serif" font-size="14" font-weight="600">ID DE CITA</text>
    <text x="50" y="295" fill="#111827" font-family="Arial, sans-serif" font-size="18" font-weight="bold">#${cita.id}</text>
    
    <!-- Mensaje adicional si existe -->
    ${cita.mensaje ? `
    <rect x="0" y="330" width="600" height="70" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
    <circle cx="25" cy="350" r="8" fill="#64748b"/>
    <text x="50" y="345" fill="#6b7280" font-family="Arial, sans-serif" font-size="14" font-weight="600">NOTA ESPECIAL</text>
    <text x="50" y="365" fill="#111827" font-family="Arial, sans-serif" font-size="16">${cita.mensaje.length > 50 ? cita.mensaje.substring(0, 47) + '...' : cita.mensaje}</text>
    ${cita.mensaje.length > 50 ? `<text x="50" y="385" fill="#111827" font-family="Arial, sans-serif" font-size="16">${cita.mensaje.substring(47, 94)}${cita.mensaje.length > 94 ? '...' : ''}</text>` : ''}
    ` : ''}
  </g>
  
  <!-- Información de contacto -->
  <rect x="100" y="720" width="600" height="120" rx="15" fill="rgba(236, 72, 153, 0.1)" stroke="#ec4899" stroke-width="2"/>
  
  <!-- Icono de teléfono -->
  <circle cx="150" cy="765" r="20" fill="#ec4899"/>
  <text x="150" y="772" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16">📱</text>
  
  <text x="190" y="760" fill="#ec4899" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Contáctanos por WhatsApp</text>
  <text x="190" y="785" fill="#1f2937" font-family="Arial, sans-serif" font-size="20" font-weight="bold">${WHATSAPP_NUMBER}</text>
  
  <!-- Ubicación -->
  <circle cx="150" cy="815" r="20" fill="#8b5cf6"/>
  <text x="150" y="822" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16">📍</text>
  <text x="190" y="810" fill="#8b5cf6" font-family="Arial, sans-serif" font-size="14" font-weight="600">Nos ubicamos en el centro de la ciudad</text>
  <text x="190" y="830" fill="#6b7280" font-family="Arial, sans-serif" font-size="14">¡Te esperamos para hacer realidad tu look ideal!</text>
  
  <!-- Footer -->
  <rect x="50" y="860" width="700" height="60" rx="0 0 25 25" fill="rgba(0,0,0,0.05)"/>
  <text x="400" y="885" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="14" font-style="italic">
    Generado automáticamente por ${BUSINESS_NAME} • ${new Date().toLocaleDateString('es-ES')}
  </text>
  <text x="400" y="905" text-anchor="middle" fill="#ec4899" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
    ¡Nos vemos pronto! 💅✨
  </text>
</svg>`;

  console.log(`✅ Imagen SVG generada para cita #${cita.id}`);
  return svgContent;
}

// Función auxiliar para obtener nombre completo del servicio
function obtenerNombreServicio(servicio: string): string {
  const servicios: { [key: string]: string } = {
    'unas-naturales': 'Uñas Naturales',
    'unas-acrilicas': 'Uñas Acrílicas', 
    'maquillaje': 'Maquillaje Profesional',
    'peinados': 'Peinados y Styling',
    'cejas': 'Diseño de Cejas',
    'pestanas': 'Extensiones de Pestañas',
    'otro': 'Consulta Personalizada'
  };
  return servicios[servicio] || servicio;
}

// Función para crear enlace de descarga de imagen
export function crearEnlaceDescarga(cita: CitaData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const svgContent = generarImagenCita(cita);
      const nombreArchivo = limpiarNombreArchivo(cita.nombre);
      
      // Crear blob del SVG
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `cita-${nombreArchivo}-${cita.fecha}-${cita.hora.replace(':', '')}.svg`;
      link.style.display = 'none';
      
      // Agregar al DOM, hacer click y remover
      document.body.appendChild(link);
      link.click();
      
      // Limpiar después de un breve delay
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log(`📥 Descarga completada: ${link.download}`);
        resolve();
      }, 100);
      
    } catch (error) {
      console.error('❌ Error en descarga:', error);
      reject(error);
    }
  });
}

// Función alternativa para descargar como PNG (mayor compatibilidad)
export function descargarImagenPNG(cita: CitaData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const svgContent = generarImagenCita(cita);
      const nombreArchivo = limpiarNombreArchivo(cita.nombre);
      
      // Crear imagen temporal para convertir SVG a PNG
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('No se pudo crear contexto de canvas');
      }
      
      img.onload = function() {
        // Configurar dimensiones del canvas
        canvas.width = 800;
        canvas.height = 1000;
        
        // Dibujar imagen en canvas
        ctx.drawImage(img, 0, 0, 800, 1000);
        
        // Convertir canvas a blob PNG
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Error al generar blob PNG'));
            return;
          }
          
          // Crear enlace de descarga
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `cita-${nombreArchivo}-${cita.fecha}-${cita.hora.replace(':', '')}.png`;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log(`📥 Descarga PNG completada: ${link.download}`);
            resolve();
          }, 100);
          
        }, 'image/png', 1.0);
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar imagen SVG'));
      };
      
      // Convertir SVG a data URL
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
      
    } catch (error) {
      console.error('❌ Error en descarga PNG:', error);
      reject(error);
    }
  });
}

// Función para abrir WhatsApp con mensaje y recordatorio
export function abrirWhatsAppRecordatorio(cita: CitaData): void {
  const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mensaje = `¡Hola ${cita.nombre}!

Te recordamos tu cita en *${BUSINESS_NAME}*

*Fecha:* ${fechaFormateada}
*Hora:* ${cita.hora}
*Servicio:* ${cita.servicio}
*ID:* #${cita.id}

Recordatorios importantes:
• No olvides llegar 10 minutos antes
• Mantente hidratada
• Ven con el rostro limpio

¡Te esperamos!`;

  // Limpiar número de teléfono (solo números)
  const numeroLimpio = cita.telefono.replace(/[^\d]/g, '');
  
  // Crear enlace de WhatsApp
  const enlaceWhatsApp = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
  
  console.log(`📱 Abriendo WhatsApp para ${cita.nombre}: ${numeroLimpio}`);
  window.open(enlaceWhatsApp, '_blank');
}

// Funciones de compatibilidad (mantienen la interfaz anterior pero usan WhatsApp)
export async function enviarConfirmacionCita(cita: CitaData): Promise<boolean> {
  try {
    console.log(`✅ Cita confirmada para ${cita.nombre} - Se puede descargar imagen y enviar WhatsApp`);
    
    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  } catch (error) {
    console.error('❌ Error al procesar confirmación de cita:', error);
    return false;
  }
}

export async function enviarNotificacionAdmin(cita: CitaData): Promise<boolean> {
  try {
    console.log(`🔔 Notificación admin: Nueva cita de ${cita.nombre} para ${cita.fecha} ${cita.hora}`);
    return true;
  } catch (error) {
    console.error('❌ Error al procesar notificación admin:', error);
    return false;
  }
}

export async function enviarRecordatorioCita(cita: CitaData): Promise<boolean> {
  try {
    console.log(`📱 Recordatorio listo para ${cita.nombre} - Abrir WhatsApp desde el panel admin`);
    return true;
  } catch (error) {
    console.error('❌ Error al procesar recordatorio:', error);
    return false;
  }
}

// Mantener compatibilidad con interfaz anterior
export type CitaEmail = CitaData;
export function transporter() {
  return null; // Ya no se usa transporter
}

// Función auxiliar para generar nombre de archivo limpio
function limpiarNombreArchivo(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/[áäâà]/g, 'a')
    .replace(/[éëêè]/g, 'e')
    .replace(/[íïîì]/g, 'i')
    .replace(/[óöôò]/g, 'o')
    .replace(/[úüûù]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}