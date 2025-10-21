import type { APIRoute } from 'astro';

export const prerender = false;

// Datos simples embebidos
const testimonios = [
  {
    id: 1,
    nombre: "María González",
    servicio: "Maquillaje de novia",
    testimonio: "¡Claudia es increíble! Me hizo sentir como una princesa en mi día especial.",
    calificacion: 5,
    fecha: "2024-11-15",
    aprobado: true
  },
  {
    id: 2,
    nombre: "Ana Rodríguez", 
    servicio: "Maquillaje de fiesta",
    testimonio: "Excelente trabajo, muy profesional y puntual. 100% recomendada.",
    calificacion: 5,
    fecha: "2024-11-10",
    aprobado: true
  }
];

export const GET: APIRoute = async () => {
  try {
    return new Response(JSON.stringify({
      success: true,
      testimonios: testimonios.filter(t => t.aprobado),
      total: testimonios.filter(t => t.aprobado).length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validación básica
    if (!data.nombre || !data.testimonio) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Nombre y testimonio son requeridos'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Testimonio recibido correctamente',
      data: data
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error al procesar la solicitud'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};