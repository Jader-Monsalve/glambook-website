import type { APIRoute } from 'astro';

// Configurar como server-rendered para que funcionen las APIs
export const prerender = false;

// Interfaces para los tipos de bloqueo
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

// Datos de disponibilidad del salon (días/horarios bloqueados)
let bloqueosData: Bloqueo[] = [
  {
    id: '1',
    tipo: 'dia_completo', // 'dia_completo', 'horario_especifico', 'rango_fechas'
    fecha: '2025-12-25', // Navidad
    motivo: 'Día festivo - Navidad',
    activo: true,
    createdAt: '2025-10-20T10:00:00Z'
  },
  {
    id: '2',
    tipo: 'dia_completo',
    fecha: '2025-01-01', // Año nuevo
    motivo: 'Día festivo - Año Nuevo',
    activo: true,
    createdAt: '2025-10-20T10:00:00Z'
  },
  {
    id: '3',
    tipo: 'horario_especifico',
    fecha: '2025-11-15',
    horaInicio: '14:00',
    horaFin: '16:00',
    motivo: 'Cita médica personal',
    activo: true,
    createdAt: '2025-10-20T10:00:00Z'
  },
  {
    id: '4',
    tipo: 'rango_fechas',
    fechaInicio: '2025-12-20',
    fechaFin: '2025-12-22',
    motivo: 'Vacaciones de fin de año',
    activo: true,
    createdAt: '2025-10-20T10:00:00Z'
  }
];

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

    console.log(`📥 GET /api/disponibilidad - Action: ${action}, Fecha: ${fecha}`);

    switch (action) {
      case 'verificar-disponibilidad':
        if (!fecha) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Fecha requerida para verificar disponibilidad'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }

        // Verificar si la fecha está bloqueada
        const fechaObj = new Date(fecha);
        const bloqueosActivos = bloqueosData.filter(bloqueo => bloqueo.activo);
        
        let disponible = true;
        let motivo = '';
        let bloqueosParciales = [];

        for (const bloqueo of bloqueosActivos) {
          if (bloqueo.tipo === 'dia_completo' && bloqueo.fecha === fecha) {
            disponible = false;
            motivo = bloqueo.motivo;
            break;
          } else if (bloqueo.tipo === 'rango_fechas' && bloqueo.fechaInicio && bloqueo.fechaFin) {
            const fechaInicio = new Date(bloqueo.fechaInicio);
            const fechaFin = new Date(bloqueo.fechaFin);
            if (fechaObj >= fechaInicio && fechaObj <= fechaFin) {
              disponible = false;
              motivo = bloqueo.motivo;
              break;
            }
          } else if (bloqueo.tipo === 'horario_especifico' && bloqueo.fecha === fecha) {
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
    console.log(`📥 POST /api/disponibilidad - Data:`, data);

    const { action, id, ...bloqueoData } = data;

    switch (action) {
      case 'crear-bloqueo':
        const { tipo, fecha, fechaInicio, fechaFin, horaInicio, horaFin, motivo } = bloqueoData;

        // Validaciones básicas
        if (!tipo || !motivo) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Tipo y motivo son obligatorios'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }

        // Validaciones específicas por tipo
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

        // Crear nuevo bloqueo
        const nuevoBloqueo = {
          id: Date.now().toString(),
          tipo,
          fecha: fecha || null,
          fechaInicio: fechaInicio || null,
          fechaFin: fechaFin || null,
          horaInicio: horaInicio || null,
          horaFin: horaFin || null,
          motivo: motivo.trim(),
          activo: true,
          createdAt: new Date().toISOString()
        };

        bloqueosData.push(nuevoBloqueo);

        console.log(`✅ Bloqueo creado: ${nuevoBloqueo.tipo} - ${nuevoBloqueo.motivo}`);

        return new Response(JSON.stringify({
          success: true,
          data: nuevoBloqueo,
          message: 'Bloqueo de disponibilidad creado correctamente'
        }), {
          status: 201,
          headers: corsHeaders
        });

      case 'eliminar-bloqueo':
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

        console.log(`🗑️ Bloqueo eliminado: ${bloqueoEliminado.tipo} - ${bloqueoEliminado.motivo}`);

        return new Response(JSON.stringify({
          success: true,
          data: bloqueoEliminado,
          message: 'Bloqueo eliminado correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

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