import type { APIRoute } from 'astro';

// Simulación de base de datos de usuarios
const usuariosData = [
  {
    id: '1',
    email: 'admin@glambook.com',
    nombre: 'Administrador Principal',
    rol: 'admin',
    fechaRegistro: '2024-01-15T10:00:00Z',
    ultimoAcceso: '2024-01-20T14:30:00Z',
    activo: true,
    verificado: true
  },
  {
    id: '2',
    email: 'maria.garcia@gmail.com',
    nombre: 'María García',
    rol: 'cliente',
    fechaRegistro: '2024-01-18T09:15:00Z',
    ultimoAcceso: '2024-01-19T16:45:00Z',
    activo: true,
    verificado: true
  },
  {
    id: '3',
    email: 'carlos.rodriguez@outlook.com',
    nombre: 'Carlos Rodríguez',
    rol: 'cliente',
    fechaRegistro: '2024-01-20T11:30:00Z',
    ultimoAcceso: '2024-01-20T18:20:00Z',
    activo: true,
    verificado: false
  },
  {
    id: '4',
    email: 'ana.martinez@yahoo.com',
    nombre: 'Ana Martínez',
    rol: 'cliente',
    fechaRegistro: '2024-01-22T14:45:00Z',
    ultimoAcceso: '2024-01-22T19:10:00Z',
    activo: true,
    verificado: true
  },
  {
    id: '5',
    email: 'moderador@glambook.com',
    nombre: 'Moderador del Sistema',
    rol: 'admin',
    fechaRegistro: '2024-01-16T08:00:00Z',
    ultimoAcceso: '2024-01-21T12:15:00Z',
    activo: true,
    verificado: true
  },
  {
    id: '6',
    email: 'lucia.fernandez@gmail.com',
    nombre: 'Lucía Fernández',
    rol: 'cliente',
    fechaRegistro: '2024-01-21T16:20:00Z',
    ultimoAcceso: null,
    activo: false,
    verificado: false
  }
];

export const GET: APIRoute = async ({ request }) => {
  console.log('GET /api/usuarios - Solicitud recibida');
  
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    if (action === 'stats') {
      const total = usuariosData.length;
      const admins = usuariosData.filter(u => u.rol === 'admin').length;
      const clientes = usuariosData.filter(u => u.rol === 'cliente').length;
      const activos = usuariosData.filter(u => u.activo).length;
      const verificados = usuariosData.filter(u => u.verificado).length;
      
      const stats = {
        total,
        admins,
        clientes,
        activos,
        verificados,
        inactivos: total - activos,
        noVerificados: total - verificados
      };
      
      console.log('Estadísticas de usuarios:', stats);
      return new Response(JSON.stringify(stats), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Retornar todos los usuarios por defecto
    console.log(`Enviando ${usuariosData.length} usuarios`);
    return new Response(JSON.stringify(usuariosData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error en GET /api/usuarios:', error);
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
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
  console.log('POST /api/usuarios - Solicitud recibida');
  
  try {
    const body = await request.json();
    console.log('Datos recibidos:', body);
    
    const { action, id, ...userData } = body;
    
    switch (action) {
      case 'cambiar-rol':
        const usuarioIndex = usuariosData.findIndex(u => u.id === id);
        if (usuarioIndex === -1) {
          return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
        
        const nuevoRol = userData.rol;
        if (!['admin', 'cliente'].includes(nuevoRol)) {
          return new Response(JSON.stringify({ error: 'Rol inválido' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
        
        usuariosData[usuarioIndex].rol = nuevoRol;
        console.log(`Rol de usuario ${id} cambiado a ${nuevoRol}`);
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Rol actualizado correctamente',
          usuario: usuariosData[usuarioIndex]
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
        
      case 'cambiar-estado':
        const usuarioEstadoIndex = usuariosData.findIndex(u => u.id === id);
        if (usuarioEstadoIndex === -1) {
          return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
        
        usuariosData[usuarioEstadoIndex].activo = userData.activo;
        console.log(`Estado de usuario ${id} cambiado a ${userData.activo ? 'activo' : 'inactivo'}`);
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Estado actualizado correctamente',
          usuario: usuariosData[usuarioEstadoIndex]
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
        
      case 'eliminar':
        const usuarioEliminarIndex = usuariosData.findIndex(u => u.id === id);
        if (usuarioEliminarIndex === -1) {
          return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
        
        const usuarioEliminado = usuariosData.splice(usuarioEliminarIndex, 1)[0];
        console.log(`Usuario ${id} eliminado:`, usuarioEliminado);
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Usuario eliminado correctamente'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
        
      default:
        return new Response(JSON.stringify({ error: 'Acción no válida' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
    }
    
  } catch (error) {
    console.error('Error en POST /api/usuarios:', error);
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
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