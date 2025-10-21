// Utilidad para manejar URLs de API en desarrollo y producción
export function getApiUrl(endpoint: string): string {
  // En desarrollo usar rutas relativas
  if (typeof window !== 'undefined') {
    // Estamos en el cliente
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return endpoint;
    }
    // En producción también usar rutas relativas ya que están en el mismo dominio
    return endpoint;
  }
  
  // En el servidor (SSR)
  return endpoint;
}

// Función helper para realizar fetch con manejo de errores mejorado
export async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error(`Error en fetch a ${url}:`, error);
    throw error;
  }
}