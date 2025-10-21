import type { APIRoute } from 'astro';

// Configurar como server-rendered para que funcionen las APIs
export const prerender = false;

// Datos embebidos directamente en la API
const citasData = [
  {
    id: 1,
    nombre: "María González",
    email: "maria@email.com",
    telefono: "+57 300 123 4567",
    servicio: "Maquillaje",
    fecha: "2024-10-25",
    hora: "10:00",
    mensaje: "Para evento especial",
    estado: "confirmada",
    fechaCreacion: "2024-10-18"
  },
  {
    id: 2,
    nombre: "Ana López", 
    email: "ana@email.com",
    telefono: "+57 300 987 6543",
    servicio: "Uñas acrílicas",
    fecha: "2024-10-26",
    hora: "14:00",
    mensaje: "Primera vez",
    estado: "pendiente",
    fechaCreacion: "2024-10-18"
  }
];

const horariosDisponibles: Record<string, string[]> = {
  "lunes": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  "martes": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  "miercoles": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  "jueves": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  "viernes": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  "sabado": ["09:00", "10:00", "11:00", "14:00", "15:00"],
  "domingo": []
};

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

    console.log(`📥 GET /api/citas - Action: ${action}, Fecha: ${fecha}`);

    switch (action) {
      case 'horarios-disponibles':
        if (!fecha) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Fecha requerida para consultar horarios'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const fechaObj = new Date(fecha);
        const diaSemana = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
        const diaKey = diaSemana.toLowerCase();
        
        // Obtener horarios del día
        const horariosDelDia = horariosDisponibles[diaKey] || [];
        
        // Filtrar horarios ocupados
        const citasDelDia = citasData.filter(cita => cita.fecha === fecha);
        const horariosOcupados = citasDelDia.map(cita => cita.hora);
        const horariosLibres = horariosDelDia.filter((hora: string) => !horariosOcupados.includes(hora));

        return new Response(JSON.stringify({
          success: true,
          data: {
            fecha,
            dia: diaSemana,
            horariosDisponibles: horariosLibres,
            horariosOcupados: horariosOcupados
          },
          message: 'Horarios obtenidos correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      case 'todas':
        return new Response(JSON.stringify({
          success: true,
          data: citasData,
          message: 'Citas obtenidas correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      case 'pendientes':
        const citasPendientes = citasData.filter(cita => cita.estado === 'pendiente');
        return new Response(JSON.stringify({
          success: true,
          data: citasPendientes,
          message: 'Citas pendientes obtenidas correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });

      default:
        return new Response(JSON.stringify({
          success: true,
          data: citasData,
          message: 'Citas obtenidas correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
    }

  } catch (error) {
    console.error('❌ Error en GET /api/citas:', error);
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
    console.log(`📥 POST /api/citas - Data:`, data);

    const { action, nombre, email, telefono, servicio, fecha, hora, mensaje } = data;

    if (action === 'crear-cita') {
      // Validaciones básicas
      if (!nombre || !email || !telefono || !servicio || !fecha || !hora) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Faltan campos obligatorios'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Verificar si la hora está disponible
      const citaExistente = citasData.find(cita => 
        cita.fecha === fecha && cita.hora === hora && cita.estado !== 'cancelada'
      );

      if (citaExistente) {
        return new Response(JSON.stringify({
          success: false,
          message: 'La hora seleccionada ya está ocupada'
        }), {
          status: 409,
          headers: corsHeaders
        });
      }

      // Crear nueva cita
      const nuevaCita = {
        id: Date.now(),
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        telefono: telefono.trim(),
        servicio: servicio.trim(),
        fecha,
        hora,
        mensaje: mensaje?.trim() || '',
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString().split('T')[0]
      };

      // En una implementación real, aquí guardaríamos en base de datos
      citasData.push(nuevaCita);

      console.log(`✅ Cita creada: ${nuevaCita.nombre} - ${nuevaCita.fecha} ${nuevaCita.hora}`);

      // En una implementación real, aquí enviaríamos emails
      console.log(`📧 Email de confirmación enviado a: ${nuevaCita.email}`);
      console.log(`📧 Notificación admin enviada`);

      return new Response(JSON.stringify({
        success: true,
        data: nuevaCita,
        message: 'Cita agendada correctamente. Recibirás un email de confirmación.'
      }), {
        status: 201,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      success: false,
      message: 'Acción no válida'
    }), {
      status: 400,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('❌ Error en POST /api/citas:', error);
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