import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

// Configurar como server-rendered para que funcionen las APIs
export const prerender = false;

// Archivo para testimonios pendientes
const TESTIMONIOS_PENDIENTES_FILE = path.join(process.cwd(), 'src', 'data', 'testimonios-pendientes.json');
const TESTIMONIOS_APROBADOS_FILE = path.join(process.cwd(), 'src', 'data', 'testimonios.ts');

// Función para leer testimonios pendientes
function leerTestimoniosPendientes() {
  try {
    if (fs.existsSync(TESTIMONIOS_PENDIENTES_FILE)) {
      const data = fs.readFileSync(TESTIMONIOS_PENDIENTES_FILE, 'utf8');
      return JSON.parse(data) || [];
    }
    return [];
  } catch (error) {
    console.error('Error al leer testimonios pendientes:', error);
    return [];
  }
}

// Función para leer testimonios aprobados del archivo TypeScript
async function leerTestimoniosAprobados() {
  try {
    // Importar dinámicamente los testimonios aprobados
    const { testimoniosAprobados } = await import('../../data/testimonios');
    return testimoniosAprobados || [];
  } catch (error) {
    console.error('Error al leer testimonios aprobados:', error);
    return [];
  }
}

// Función para guardar testimonios pendientes
function guardarTestimoniosPendientes(testimonios: any[]) {
  try {
    // Crear directorio si no existe
    const dir = path.dirname(TESTIMONIOS_PENDIENTES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(TESTIMONIOS_PENDIENTES_FILE, JSON.stringify(testimonios, null, 2));
    return true;
  } catch (error) {
    console.error('Error al guardar testimonios pendientes:', error);
    return false;
  }
}

// Función para agregar testimonio aprobado al archivo TypeScript
function agregarTestimonioAprobado(testimonio: any) {
  try {
    // Leer el archivo actual
    let contenido = fs.readFileSync(TESTIMONIOS_APROBADOS_FILE, 'utf8');
    
    // Obtener el último ID
    const matches = contenido.match(/id:\s*(\d+)/g);
    let ultimoId = 6; // Empezar desde 6 (los que ya están)
    if (matches) {
      ultimoId = Math.max(...matches.map(match => parseInt(match.match(/\d+/)![0])));
    }
    
    // Crear nuevo testimonio
    const nuevoId = ultimoId + 1;
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    // Avatars aleatorios
    const avatars = ['👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿', '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿'];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    const nuevoTestimonio = `  {
    id: ${nuevoId},
    nombre: "${testimonio.nombre}",
    calificacion: ${testimonio.calificacion},
    comentario: "${testimonio.comentario.replace(/"/g, '\\"')}",
    servicio: "${testimonio.servicio || ''}",
    fecha: "${fechaHoy}",
    aprobado: true,
    avatar: "${avatar}"
  }`;

    // Encontrar el final del array y agregar el nuevo testimonio
    const arrayEndIndex = contenido.lastIndexOf('];');
    if (arrayEndIndex !== -1) {
      // Si ya hay testimonios, agregar coma
      const beforeArrayEnd = contenido.substring(0, arrayEndIndex);
      const afterArrayEnd = contenido.substring(arrayEndIndex);
      
      // Verificar si necesitamos agregar coma
      const needsComma = beforeArrayEnd.trim().endsWith('}');
      const coma = needsComma ? ',' : '';
      
      contenido = beforeArrayEnd + coma + '\n' + nuevoTestimonio + '\n' + afterArrayEnd;
      
      fs.writeFileSync(TESTIMONIOS_APROBADOS_FILE, contenido);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error al agregar testimonio aprobado:', error);
    return false;
  }
}

// Función para eliminar testimonio aprobado del archivo TypeScript
function eliminarTestimonioAprobado(id: number) {
  try {
    // Leer el archivo actual
    let contenido = fs.readFileSync(TESTIMONIOS_APROBADOS_FILE, 'utf8');
    
    // Crear expresión regular para encontrar el testimonio completo
    const patronTestimonio = new RegExp(`\\s*{[^}]*id:\\s*${id}[^}]*}(?:,?\\s*\\n?)?`, 'g');
    
    // Verificar si el testimonio existe antes de eliminar
    if (!patronTestimonio.test(contenido)) {
      console.log(`Testimonio con ID ${id} no encontrado en aprobados`);
      return false;
    }
    
    // Reiniciar el patrón para hacer el reemplazo
    const patronTestimonio2 = new RegExp(`\\s*{[^}]*id:\\s*${id}[^}]*}(?:,?\\s*\\n?)?`, 'g');
    
    // Eliminar el testimonio
    const nuevoContenido = contenido.replace(patronTestimonio2, '');
    
    // Limpiar comas duplicadas que puedan quedar
    const contenidoLimpio = nuevoContenido
      .replace(/,(\s*),/g, ',')  // Eliminar comas duplicadas
      .replace(/,(\s*)\]/g, '\n]'); // Eliminar coma antes del cierre del array
    
    fs.writeFileSync(TESTIMONIOS_APROBADOS_FILE, contenidoLimpio);
    console.log(`Testimonio con ID ${id} eliminado de aprobados`);
    return true;
  } catch (error) {
    console.error('Error al eliminar testimonio aprobado:', error);
    return false;
  }
}

export const GET: APIRoute = async ({ url }) => {
  console.log('=== GET /api/testimonios ===');
  console.log('URL:', url.toString());
  
  try {
    const action = url.searchParams.get('action');
    console.log('Action:', action);
    
    if (action === 'pendientes') {
      console.log('Obteniendo testimonios pendientes...');
      const testimonios = leerTestimoniosPendientes();
      console.log('Testimonios encontrados:', testimonios.length);
      console.log('Testimonios:', JSON.stringify(testimonios, null, 2));
      
      return new Response(JSON.stringify(testimonios), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (action === 'aprobados') {
      console.log('Obteniendo testimonios aprobados...');
      try {
        // Leer testimonios aprobados del archivo TypeScript
        const testimoniosAprobados = await leerTestimoniosAprobados();
        console.log('Testimonios aprobados encontrados:', testimoniosAprobados.length);
        
        return new Response(JSON.stringify(testimoniosAprobados), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        console.error('Error leyendo testimonios aprobados:', error);
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    if (action === 'aprobados') {
      console.log('Obteniendo testimonios aprobados...');
      try {
        // Leer el archivo de testimonios aprobados
        const contenido = fs.readFileSync(TESTIMONIOS_APROBADOS_FILE, 'utf8');
        
        // Extraer el array de testimonios usando regex
        const match = contenido.match(/export\s+const\s+testimonios\s*=\s*(\[[\s\S]*?\]);/);
        
        if (match) {
          // Evaluar el array de forma segura
          const testimoniosString = match[1];
          // Reemplazar las comillas simples por dobles para JSON válido
          const jsonString = testimoniosString
            .replace(/(\w+):/g, '"$1":')  // Convertir claves a strings
            .replace(/'/g, '"')           // Convertir comillas simples a dobles
            .replace(/,(\s*[}\]])/g, '$1'); // Eliminar comas finales
          
          const testimonios = JSON.parse(jsonString);
          console.log('Testimonios aprobados encontrados:', testimonios.length);
          
          return new Response(JSON.stringify(testimonios), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
        
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
        
      } catch (error) {
        console.error('Error al leer testimonios aprobados:', error);
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }
    
    console.log('Acción no válida:', action);
    return new Response(JSON.stringify({ error: 'Acción no válida' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error en GET:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log('Datos recibidos:', data);
    
    const { action, testimonio, id } = data;
    
    if (action === 'agregar-pendiente') {
      // Agregar testimonio a lista de pendientes
      const testimonios = leerTestimoniosPendientes();
      const nuevoTestimonio = {
        id: Date.now(),
        nombre: testimonio.nombre,
        email: testimonio.email,
        calificacion: testimonio.calificacion,
        comentario: testimonio.comentario,
        servicio: testimonio.servicio || '',
        fechaEnvio: new Date().toISOString(),
        estado: 'pendiente'
      };
      
      testimonios.push(nuevoTestimonio);
      
      if (guardarTestimoniosPendientes(testimonios)) {
        console.log('Testimonio agregado:', nuevoTestimonio);
        return new Response(JSON.stringify({ success: true, id: nuevoTestimonio.id }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        throw new Error('No se pudo guardar el testimonio');
      }
    }
    
    if (action === 'aprobar') {
      const testimonios = leerTestimoniosPendientes();
      const testimonioIndex = testimonios.findIndex((t: any) => t.id === id);
      
      if (testimonioIndex !== -1) {
        const testimonio = testimonios[testimonioIndex];
        
        // Agregar a testimonios aprobados
        if (agregarTestimonioAprobado(testimonio)) {
          // Remover de pendientes
          testimonios.splice(testimonioIndex, 1);
          guardarTestimoniosPendientes(testimonios);
          
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } else {
          throw new Error('No se pudo aprobar el testimonio');
        }
      } else {
        throw new Error('Testimonio no encontrado');
      }
    }
    
    if (action === 'rechazar') {
      const testimonios = leerTestimoniosPendientes();
      const testimonioIndex = testimonios.findIndex((t: any) => t.id === id);
      
      if (testimonioIndex !== -1) {
        testimonios.splice(testimonioIndex, 1);
        guardarTestimoniosPendientes(testimonios);
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        throw new Error('Testimonio no encontrado');
      }
    }

    if (action === 'eliminar') {
      // Eliminar testimonio de pendientes si está ahí
      const testimoniosPendientes = leerTestimoniosPendientes();
      const indexPendiente = testimoniosPendientes.findIndex((t: any) => t.id === id);
      
      if (indexPendiente !== -1) {
        testimoniosPendientes.splice(indexPendiente, 1);
        guardarTestimoniosPendientes(testimoniosPendientes);
        
        return new Response(JSON.stringify({ success: true, origen: 'pendientes' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      // Si no está en pendientes, eliminar de aprobados
      if (eliminarTestimonioAprobado(id)) {
        return new Response(JSON.stringify({ success: true, origen: 'aprobados' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        throw new Error('Testimonio no encontrado en ninguna lista');
      }
    }
    
    throw new Error('Acción no válida');
    
  } catch (error) {
    console.error('Error en POST:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor',
      details: error instanceof Error ? error.stack : 'Error desconocido'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};