import type { APIRoute } from 'astro';
import type { Testimonio } from '../../data/testimonios';
import {
  getAprobados,
  getPendientes,
  addPendiente,
  aprobarTestimonio,
  rechazarTestimonio,
  eliminarAprobado,
  getEstadisticas
} from '../../utils/testimonios-persistence';

export const prerender = false;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-cache, no-store, must-revalidate'
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const action = url.searchParams.get('action') || 'aprobados';
    console.log(`📥 GET /api/testimonios-new - Action: ${action}`);

    switch (action) {
      case 'aprobados':
        const aprobados = await getAprobados();
        return new Response(JSON.stringify({
          success: true,
          data: aprobados,
          message: 'Testimonios aprobados obtenidos correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      case 'pendientes':
        const pendientes = await getPendientes();
        return new Response(JSON.stringify({
          success: true,
          data: pendientes,
          message: 'Testimonios pendientes obtenidos correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      case 'estadisticas':
        const stats = await getEstadisticas();
        return new Response(JSON.stringify({
          success: true,
          data: stats,
          message: 'Estadísticas obtenidas correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      default:
        const defaultAprobados = await getAprobados();
        return new Response(JSON.stringify({
          success: true,
          data: defaultAprobados,
          message: 'Testimonios obtenidos correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
    }

  } catch (error) {
    console.error('❌ Error en GET /api/testimonios-new:', error);
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
    console.log(`📥 POST /api/testimonios-new - Data:`, data);

    const { action, testimonio, id } = data;

    switch (action) {
      case 'agregar-pendiente':
        if (!testimonio?.nombre || !testimonio?.email || !testimonio?.comentario || !testimonio?.calificacion) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Faltan campos obligatorios'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const testimonioLimpio = {
          nombre: testimonio.nombre.trim(),
          email: testimonio.email.trim().toLowerCase(),
          comentario: testimonio.comentario.trim(),
          calificacion: parseInt(testimonio.calificacion),
          servicio: testimonio.servicio?.trim() || undefined
        };

        const nuevoTestimonio = await addPendiente(testimonioLimpio);

        return new Response(JSON.stringify({
          success: true,
          data: nuevoTestimonio,
          message: 'Testimonio enviado correctamente'
        }), {
          status: 201,
          headers: corsHeaders
        });

      case 'aprobar':
        const aprobado = await aprobarTestimonio(parseInt(id));
        return new Response(JSON.stringify({
          success: aprobado,
          message: aprobado ? 'Testimonio aprobado' : 'Error al aprobar'
        }), {
          status: aprobado ? 200 : 404,
          headers: corsHeaders
        });

      case 'rechazar':
        const rechazado = await rechazarTestimonio(parseInt(id));
        return new Response(JSON.stringify({
          success: rechazado,
          message: rechazado ? 'Testimonio rechazado' : 'Error al rechazar'
        }), {
          status: rechazado ? 200 : 404,
          headers: corsHeaders
        });

      case 'eliminar':
        const eliminado = await eliminarAprobado(parseInt(id));
        return new Response(JSON.stringify({
          success: eliminado,
          message: eliminado ? 'Testimonio eliminado' : 'Error al eliminar'
        }), {
          status: eliminado ? 200 : 404,
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
    console.error('❌ Error en POST /api/testimonios-new:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error interno del servidor'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};