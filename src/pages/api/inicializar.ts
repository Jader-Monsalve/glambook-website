import type { APIRoute } from 'astro';
// @ts-ignore
import { inicializarAplicacion, verificarFirebase } from '../../utils/inicializacion.js';

export const prerender = false;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const GET: APIRoute = async ({ request }) => {
  console.log('📥 GET /api/inicializar - Solicitud recibida');
  
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'verificar';
    
    switch (action) {
      case 'inicializar':
        console.log('🚀 Inicializando aplicación...');
        const resultado = await inicializarAplicacion();
        
        return new Response(JSON.stringify({
          success: true,
          data: resultado,
          message: 'Aplicación inicializada correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
        
      case 'verificar':
      default:
        console.log('🔍 Verificando estado de Firebase...');
        const estado = await verificarFirebase();
        
        return new Response(JSON.stringify({
          success: estado.connected,
          data: estado,
          message: estado.connected ? 'Firebase conectado' : 'Error de conexión'
        }), {
          status: estado.connected ? 200 : 500,
          headers: corsHeaders
        });
    }
    
  } catch (error) {
    console.error('❌ Error en /api/inicializar:', error);
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
  console.log('📥 POST /api/inicializar - Solicitud recibida');
  
  try {
    const body = await request.json();
    const { action } = body;
    
    switch (action) {
      case 'reset':
        console.log('🔄 Reinicializando aplicación...');
        const resultado = await inicializarAplicacion();
        
        return new Response(JSON.stringify({
          success: true,
          data: resultado,
          message: 'Aplicación reinicializada correctamente'
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
    console.error('❌ Error en POST /api/inicializar:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};