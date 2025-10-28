import type { APIRoute } from 'astro';
// @ts-ignore
import UsuariosService from '../../services/usuariosService.js';

export const prerender = false;

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  telefono: string;
  rol: keyof typeof rolesConfig;
  fechaRegistro: string;
  ultimoAcceso: string | null;
  activo: boolean;
  verificado: boolean;
  avatar: string;
  citas: number;
  testimonios: number;
  permisos: string[];
  notas?: string;
  fechaCreacion?: string;
}

const rolesConfig = {
  admin: {
    nombre: 'Administrador',
    color: 'red-500',
    badge: 'bg-red-100 text-red-800',
    permisos: ['gestionar_citas', 'gestionar_testimonios', 'gestionar_usuarios', 'configurar_sistema', 'ver_estadisticas']
  },
  manager: {
    nombre: 'Manager',
    color: 'purple-500',
    badge: 'bg-purple-100 text-purple-800',
    permisos: ['gestionar_citas', 'ver_estadisticas']
  },
  cliente: {
    nombre: 'Cliente',
    color: 'blue-500',
    badge: 'bg-blue-100 text-blue-800',
    permisos: ['reservar_citas', 'enviar_testimonios']
  }
};

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const GET: APIRoute = async ({ request }) => {
  console.log('📥 GET /api/usuarios - Solicitud recibida');
  
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'listar';
    
    switch (action) {
      case 'stats':
        console.log('📊 Obteniendo estadísticas desde Firebase...');
        const stats = await UsuariosService.obtenerEstadisticas();
        
        console.log('📊 Estadísticas de usuarios:', stats);
        return new Response(JSON.stringify({
          success: true,
          data: { estadisticas: stats },
          message: 'Estadísticas obtenidas correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
        
      case 'listar':
      default:
        console.log('📋 Obteniendo usuarios desde Firebase...');
        const usuarios = await UsuariosService.obtenerUsuarios();
        
        console.log(`📋 Enviando ${usuarios.length} usuarios`);
        return new Response(JSON.stringify({
          success: true,
          data: usuarios,
          message: 'Usuarios obtenidos correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
    }
    
  } catch (error) {
    console.error('❌ Error en GET /api/usuarios:', error);
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
  console.log('📥 POST /api/usuarios - Solicitud recibida');
  
  try {
    const body = await request.json();
    console.log('📝 Datos recibidos:', body);
    
    const { action, id, ...userData } = body;
    
    switch (action) {
      case 'crear':
        // Crear nuevo usuario
        if (!userData.nombre || !userData.email || !userData.password) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Faltan campos obligatorios'
          }), {
            status: 400,
            headers: corsHeaders
          });
        }
        
        const nuevoUsuario = await UsuariosService.crearUsuario(userData);
        
        return new Response(JSON.stringify({
          success: true,
          data: nuevoUsuario,
          message: 'Usuario creado exitosamente'
        }), {
          status: 201,
          headers: corsHeaders
        });
        
      case 'actualizar':
        // Actualizar usuario existente
        const usuarioActualizado = await UsuariosService.actualizarUsuario(id, userData);
        
        return new Response(JSON.stringify({
          success: true,
          data: usuarioActualizado,
          message: 'Usuario actualizado exitosamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
        
      case 'cambiar-estado':
        const usuarioEstadoActualizado = await UsuariosService.cambiarEstado(id, userData.activo);
        
        return new Response(JSON.stringify({
          success: true,
          data: usuarioEstadoActualizado,
          message: 'Estado actualizado correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
        
      case 'eliminar':
        const usuarioEliminado = await UsuariosService.eliminarUsuario(id);
        
        return new Response(JSON.stringify({
          success: true,
          data: usuarioEliminado,
          message: 'Usuario eliminado correctamente'
        }), {
          status: 200,
          headers: corsHeaders
        });
        
      case 'reset-password':
        await UsuariosService.resetearPassword(userData.email);
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Email de reset de contraseña enviado'
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
    console.error('❌ Error en POST /api/usuarios:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
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