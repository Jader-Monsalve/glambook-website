import type { APIRoute } from 'astro';

// Configurar como server-rendered para que funcionen las APIs
export const prerender = false;

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

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('🧪 Test API - Recibiendo request POST');
    
    const data = await request.json();
    console.log('📥 Datos recibidos:', data);

    const { action, id } = data;

    if (action === 'enviar-recordatorio') {
      console.log(`📧 Simulando envío de recordatorio para cita ID: ${id}`);
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Recordatorio enviado exitosamente (simulado)',
        data: { id, action }
      }), {
        status: 200,
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
    console.error('❌ Error en test API:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};