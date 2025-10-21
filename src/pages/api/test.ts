import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  console.log('API Test endpoint called');
  
  return new Response(
    JSON.stringify({ 
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
      url: request.url
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};