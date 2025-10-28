// Script de inicialización de Firebase para desarrollo
// Este script se ejecuta al cargar la aplicación por primera vez

import UsuariosService from '../services/usuariosService.js';

export async function inicializarAplicacion() {
  try {
    console.log('🚀 Inicializando aplicación GlamBook...');
    
    // 1. Verificar y crear admin principal
    console.log('👑 Verificando usuario administrador...');
    await UsuariosService.inicializarAdminPrincipal();
    
    // 2. Verificar si hay usuarios existentes
    const usuarios = await UsuariosService.obtenerUsuarios();
    console.log(`📊 Usuarios existentes: ${usuarios.length}`);
    
    // 3. Crear datos de ejemplo si es necesario
    if (usuarios.length <= 1) { // Solo admin
      console.log('📝 Creando datos de ejemplo...');
      await crearDatosEjemplo();
    }
    
    console.log('✅ Aplicación inicializada correctamente');
    return { success: true, message: 'Aplicación inicializada' };
    
  } catch (error) {
    console.error('❌ Error inicializando aplicación:', error);
    throw error;
  }
}

async function crearDatosEjemplo() {
  const usuariosEjemplo = [
    {
      nombre: 'María García',
      email: 'maria.garcia@gmail.com',
      password: 'demo123456',
      telefono: '+57 300 123 4567',
      rol: 'cliente',
      notas: 'Cliente frecuente, prefiere citas en la mañana'
    },
    {
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@outlook.com',
      password: 'demo123456',
      telefono: '+57 301 987 6543',
      rol: 'cliente',
      notas: 'Nuevo cliente, interesado en servicios de spa'
    },
    {
      nombre: 'Ana Martínez',
      email: 'ana.martinez@yahoo.com',
      password: 'demo123456',
      telefono: '+57 312 555 7890',
      rol: 'cliente',
      notas: 'Cliente VIP, tratamientos especiales'
    },
    {
      nombre: 'Manager Sistema',
      email: 'manager@glambook.com',
      password: 'manager123',
      telefono: '+57 315 777 8888',
      rol: 'manager',
      notas: 'Supervisor del sistema, acceso limitado'
    },
    {
      nombre: 'Sofia Rodríguez',
      email: 'sofia.rodriguez@gmail.com',
      password: 'demo123456',
      telefono: '+57 314 666 7777',
      rol: 'cliente',
      notas: 'Cliente activa en redes sociales'
    }
  ];
  
  for (const usuario of usuariosEjemplo) {
    try {
      await UsuariosService.crearUsuario(usuario);
      console.log(`✅ Usuario de ejemplo creado: ${usuario.nombre}`);
    } catch (error) {
      console.error(`❌ Error creando usuario ${usuario.nombre}:`, error.message);
      // Continuar con el siguiente usuario
    }
  }
}

// Función de verificación del estado de Firebase
export async function verificarFirebase() {
  try {
    const stats = await UsuariosService.obtenerEstadisticas();
    console.log('🔥 Firebase conectado correctamente:', stats);
    return { connected: true, stats };
  } catch (error) {
    console.error('❌ Error conectando a Firebase:', error);
    return { connected: false, error: error.message };
  }
}

export default { inicializarAplicacion, verificarFirebase };