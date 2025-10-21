import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { enviarRecordatorioCita, enviarConfirmacionCita } from '../../utils/emailService';

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
          console.log('📧 Enviando recordatorio para cita:', citaId);
          result = await enviarRecordatorioCita(cita);
          break;
          
        case 'confirmacion':
          console.log('📧 Reenviando confirmación para cita:', citaId);
          result = await enviarConfirmacionCita(cita);
          break;
          
        default:
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Tipo de email no válido. Use: recordatorio, confirmacion' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
      }
      
      if (result.success) {
        console.log(`✅ Email de ${tipo} enviado exitosamente`);
        
        const response = {
          success: true,
          message: `Email de ${tipo} enviado exitosamente`,
          messageId: result.messageId,
          ...(result.previewUrl && { previewUrl: result.previewUrl })
        };
        
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        console.error(`❌ Error al enviar email de ${tipo}:`, result.error);
        
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Error al enviar email de ${tipo}: ${result.error}` 
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
      
      // Enviar recordatorios en paralelo
      const resultados = await Promise.allSettled(
        citasParaRecordar.map((cita: any) => enviarRecordatorioCita(cita))
      );
      
      let exitosos = 0;
      let fallidos = 0;
      const errores: string[] = [];
      
      resultados.forEach((resultado, index) => {
        if (resultado.status === 'fulfilled' && resultado.value.success) {
          exitosos++;
          console.log(`✅ Recordatorio enviado a: ${citasParaRecordar[index].email}`);
        } else {
          fallidos++;
          const error = resultado.status === 'rejected' 
            ? resultado.reason 
            : resultado.value.error;
          errores.push(`${citasParaRecordar[index].email}: ${error}`);
          console.error(`❌ Error al enviar a ${citasParaRecordar[index].email}:`, error);
        }
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Recordatorios procesados: ${exitosos} exitosos, ${fallidos} fallidos`,
        citasEnviadas: exitosos,
        citasFallidas: fallidos,
        errores: errores
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Acción no válida' 
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