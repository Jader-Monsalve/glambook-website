import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';

export const prerender = false;

interface BloqueoBase {
  id: string;
  tipo: 'dia_completo' | 'horario_especifico' | 'rango_fechas';
  motivo: string;
  activo: boolean;
  createdAt: string;
}
interface BloqueoDiaCompleto extends BloqueoBase {
  tipo: 'dia_completo';
  fecha: string;
  fechaInicio?: undefined;
  fechaFin?: undefined;
  horaInicio?: undefined;
  horaFin?: undefined;
}
interface BloqueoHorarioEspecifico extends BloqueoBase {
  tipo: 'horario_especifico';
  fecha: string;
  horaInicio: string;
  horaFin: string;
  fechaInicio?: undefined;
  fechaFin?: undefined;
}
interface BloqueoRangoFechas extends BloqueoBase {
  tipo: 'rango_fechas';
  fechaInicio: string;
  fechaFin: string;
  fecha?: undefined;
  horaInicio?: undefined;
  horaFin?: undefined;
}
type Bloqueo = BloqueoDiaCompleto | BloqueoHorarioEspecifico | BloqueoRangoFechas;

const bloqueosPath = path.resolve(process.cwd(), 'src/data/bloqueos.json');

async function leerBloqueos(): Promise<Bloqueo[]> {
  try {
    const data = await fs.readFile(bloqueosPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
async function guardarBloqueos(bloqueos: Bloqueo[]) {
  await fs.writeFile(bloqueosPath, JSON.stringify(bloqueos, null, 2), 'utf-8');
}

// Headers CORS para todas las respuestas
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const action = searchParams.get('action');
    const fecha = searchParams.get('fecha');
    const bloqueosData = await leerBloqueos();

    switch (action) {
      case 'verificar-disponibilidad': {
        if (!fecha) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Fecha requerida para verificar disponibilidad'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }
        const fechaStr = fecha.split('T')[0];
        const bloqueosActivos = bloqueosData.filter(bloqueo => bloqueo.activo);
        let disponible = true;
        let motivo = '';
        let bloqueosParciales = [];
        for (const bloqueo of bloqueosActivos) {
          if (bloqueo.tipo === 'dia_completo' && bloqueo.fecha === fechaStr) {
            disponible = false;
            motivo = bloqueo.motivo;
            break;
          } else if (bloqueo.tipo === 'rango_fechas' && bloqueo.fechaInicio && bloqueo.fechaFin) {
            if (fechaStr >= bloqueo.fechaInicio && fechaStr <= bloqueo.fechaFin) {
              disponible = false;
              motivo = bloqueo.motivo;
              break;
            }
          } else if (bloqueo.tipo === 'horario_especifico' && bloqueo.fecha === fechaStr) {
            bloqueosParciales.push({
              horaInicio: bloqueo.horaInicio,
              horaFin: bloqueo.horaFin,
              motivo: bloqueo.motivo
            });
          }
        }
        return new Response(JSON.stringify({
          success: true,
          data: {
            fecha,
            disponible,
            motivo,
            bloqueosParciales
          },
          message: 'Disponibilidad verificada correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
      }
      case 'listar':
        return new Response(JSON.stringify({
          success: true,
          data: bloqueosData.filter(bloqueo => bloqueo.activo),
          message: 'Bloqueos obtenidos correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
      default:
        return new Response(JSON.stringify({
          success: true,
          data: bloqueosData,
          message: 'Disponibilidad obtenida correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
    }

  } catch (error) {
    console.error('❌ Error en GET /api/disponibilidad:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, id, ...bloqueoData } = data;
    let bloqueosData = await leerBloqueos();

    switch (action) {
      case 'actualizar-horarios': {
        // Guardar los horarios enviados (en memoria, para demo)
        if (!data.horarios || typeof data.horarios !== 'object') {
          return new Response(JSON.stringify({
            success: false,
            message: 'Horarios no enviados o formato incorrecto'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }
        // Aquí podrías guardar en base de datos, por ahora solo simula éxito
        console.log('✅ Horarios actualizados:', data.horarios);
        return new Response(JSON.stringify({
          success: true,
          data: data.horarios,
          message: 'Horarios actualizados correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
      }
      case 'crear-bloqueo': {
        const { tipo, fecha, fechaInicio, fechaFin, horaInicio, horaFin, motivo } = bloqueoData;
        if (!tipo || !motivo) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Tipo y motivo son obligatorios'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }
        if (tipo === 'dia_completo' && !fecha) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Fecha es obligatoria para bloqueo de día completo'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }
        if (tipo === 'rango_fechas' && (!fechaInicio || !fechaFin)) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Fecha de inicio y fin son obligatorias para rango de fechas'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }
        if (tipo === 'horario_especifico' && (!fecha || !horaInicio || !horaFin)) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Fecha, hora de inicio y fin son obligatorias para bloqueo de horario específico'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }
        let fechaBloqueo = fecha;
        if (tipo === 'dia_completo' && fecha) {
          fechaBloqueo = fecha.split('T')[0];
        }
        const nuevoBloqueo = {
          id: Date.now().toString(),
          tipo,
          fecha: tipo === 'dia_completo' ? fechaBloqueo : (fecha || null),
          fechaInicio: fechaInicio || null,
          fechaFin: fechaFin || null,
          horaInicio: horaInicio || null,
          horaFin: horaFin || null,
          motivo: motivo.trim(),
          activo: true,
          createdAt: new Date().toISOString()
        };
        bloqueosData.push(nuevoBloqueo);
        await guardarBloqueos(bloqueosData);
        return new Response(JSON.stringify({
          success: true,
          data: nuevoBloqueo,
          message: 'Bloqueo de disponibilidad creado correctamente'
        }), {
          status: 201,
          headers: corsHeaders
        });
      }

      case 'eliminar-bloqueo': {
        if (!id) {
          return new Response(JSON.stringify({
            success: false,
            message: 'ID del bloqueo requerido'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }
        const bloqueoIndex = bloqueosData.findIndex(bloqueo => bloqueo.id === id);
        if (bloqueoIndex === -1) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Bloqueo no encontrado'
          }), {
            status: 404,
            headers: corsHeaders
          });
        }
        const bloqueoEliminado = bloqueosData.splice(bloqueoIndex, 1)[0];
        await guardarBloqueos(bloqueosData);
        return new Response(JSON.stringify({
          success: true,
          data: bloqueoEliminado,
          message: 'Bloqueo eliminado correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
      }

      case 'toggle-bloqueo':
        if (!id) {
          return new Response(JSON.stringify({
            success: false,
            message: 'ID del bloqueo requerido'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const bloqueoToggleIndex = bloqueosData.findIndex(bloqueo => bloqueo.id === id);
        
        if (bloqueoToggleIndex === -1) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Bloqueo no encontrado'
          }), {
            status: 404,
            headers: corsHeaders
          });
        }

        bloqueosData[bloqueoToggleIndex].activo = !bloqueosData[bloqueoToggleIndex].activo;

        console.log(`🔄 Estado de bloqueo cambiado: ${bloqueosData[bloqueoToggleIndex].id} - Activo: ${bloqueosData[bloqueoToggleIndex].activo}`);

        return new Response(JSON.stringify({
          success: true,
          data: bloqueosData[bloqueoToggleIndex],
          message: `Bloqueo ${bloqueosData[bloqueoToggleIndex].activo ? 'activado' : 'desactivado'} correctamente`
        }), {
          status: 200,
          headers: corsHeaders
        });

      default:
        return new Response(JSON.stringify({
          success: false,
          message: 'Acción no válida'
        }), {
          status: 400,
          headers: corsHeaders
        });
    }

  } catch (error) {
    console.error('❌ Error en POST /api/disponibilidad:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};