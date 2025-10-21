import type { APIRoute } from 'astro';
import { getAprobados } from '../../utils/testimonios-persistence';

// Configurar como server-rendered
export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const testimonios = await getAprobados();
    
    return new Response(JSON.stringify(testimonios), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('Error obteniendo testimonios:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};