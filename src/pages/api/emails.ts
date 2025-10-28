import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { enviarRecordatorioCita, enviarConfirmacionCita, enviarNotificacionAdmin } from '../../utils/emailService';

export const prerender = false;

// Archivos de datos
const CITAS_FILE = path.join(process.cwd(), 'src', 'data', 'citas.json');

// Función para leer citas
function leerCitas() {
  try {
    if (fs.existsSync(CITAS_FILE)) {
      const data = fs.readFileSync(CITAS_FILE, 'utf8');
      return JSON.parse(data) || [];
    }
    return [];
  } catch (error) {
    console.error('Error al leer citas:', error);
    return [];
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log('📧 Solicitud de email recibida:', data);
    
    const { action, citaId, tipo } = data;
    
    if (action === 'enviar-email') {
      const citas = leerCitas();
      const cita = citas.find((c: any) => c.id == citaId);
      
      if (!cita) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Cita no encontrada' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      let result;
      
      switch (tipo) {
        case 'recordatorio':
          console.log('📱 Preparando recordatorio WhatsApp para cita:', citaId);
          result = await enviarRecordatorioCita(cita);
          break;
          
        case 'confirmacion':
        case 'confirmacionCita':
          console.log('✅ Procesando confirmación para cita:', citaId);
          result = await enviarConfirmacionCita(cita);
          break;
          
        case 'nuevaCita':
          console.log('🔔 Procesando notificación de nueva cita:', citaId);
          result = await enviarNotificacionAdmin(cita);
          break;
          
        default:
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Tipo no válido. Use: recordatorio, confirmacion, nuevaCita' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
      }
      
      // El nuevo sistema siempre retorna boolean
      if (result === true) {
        console.log(`✅ ${tipo} procesado exitosamente`);
        
        const response = {
          success: true,
          message: `${tipo} procesado exitosamente - Listo para WhatsApp`,
          whatsappReady: true
        };
        
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        console.error(`❌ Error al procesar ${tipo}`);
        
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Error al procesar ${tipo}` 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    
    if (action === 'enviar-recordatorios-automaticos') {
      console.log('📧 Enviando recordatorios automáticos...');
      
      const citas = leerCitas();
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      const fechaManana = manana.toISOString().split('T')[0];
      
      // Buscar citas para mañana que estén confirmadas
      const citasParaRecordar = citas.filter((cita: any) => 
        cita.fecha === fechaManana && 
        (cita.estado === 'confirmada' || cita.estado === 'pendiente')
      );
      
      console.log(`📧 Encontradas ${citasParaRecordar.length} citas para recordar`);
      
      if (citasParaRecordar.length === 0) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'No hay citas para mañana que requieran recordatorio',
          citasEnviadas: 0
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Preparar recordatorios (ahora son para WhatsApp)
      const resultados = await Promise.allSettled(
        citasParaRecordar.map((cita: any) => enviarRecordatorioCita(cita))
      );
      
      let exitosos = 0;
      let fallidos = 0;
      const errores: string[] = [];
      
      resultados.forEach((resultado, index) => {
        if (resultado.status === 'fulfilled' && resultado.value === true) {
          exitosos++;
          console.log(`✅ Recordatorio preparado para: ${citasParaRecordar[index].nombre}`);
        } else {
          fallidos++;
          const error = resultado.status === 'rejected' 
            ? resultado.reason 
            : 'Error al procesar recordatorio';
          errores.push(`${citasParaRecordar[index].nombre}: ${error}`);
          console.error(`❌ Error al preparar recordatorio para ${citasParaRecordar[index].nombre}:`, error);
        }
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Recordatorios preparados: ${exitosos} listos para WhatsApp, ${fallidos} fallidos`,
        citasPreparadas: exitosos,
        citasFallidas: fallidos,
        errores: errores,
        nota: 'Los recordatorios están listos para enviarse por WhatsApp desde el panel admin'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Manejar solicitudes simples que solo necesitan respuesta positiva
    if (data.tipo) {
      console.log('📧 Solicitud de procesamiento:', data.tipo);
      
      // Para compatibilidad con formularios que llaman a emails
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Procesado exitosamente - Sistema actualizado a WhatsApp',
        whatsappReady: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Acción no válida. Parámetros requeridos: action o tipo' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('❌ Error en /api/emails:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error interno del servidor',
      details: error instanceof Error ? error.stack : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};