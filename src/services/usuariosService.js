// Servicio de usuarios con Firebase
import SecurityValidator from '../utils/security.js';
import MonitoringService from '../utils/monitoring.js';
import { 
  auth, 
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile,
  deleteUser,
  sendPasswordResetEmail,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from '../firebase.js';

// Estructura de usuario en Firestore
const USUARIOS_COLLECTION = 'usuarios';

// Configuración de roles
const rolesConfig = {
  admin: {
    nombre: 'Administrador',
    permisos: ['gestionar_citas', 'gestionar_testimonios', 'gestionar_usuarios', 'configurar_sistema', 'ver_estadisticas']
  },
  manager: {
    nombre: 'Manager',
    permisos: ['gestionar_citas', 'ver_estadisticas']
  },
  cliente: {
    nombre: 'Cliente',
    permisos: ['reservar_citas', 'enviar_testimonios']
  }
};

// Servicio de usuarios con Firebase
export class UsuariosService {
  
  // Obtener todos los usuarios
  static async obtenerUsuarios() {
    try {
      console.log('🔥 Obteniendo usuarios desde Firebase...');
      
      // Verificar autenticación en producción
      if (import.meta.env.PROD && !auth.currentUser) {
        throw new Error('Acceso no autorizado. Debe iniciar sesión.');
      }
      
      // Solo en desarrollo: bypass de autenticación
      if (import.meta.env.DEV) {
        try {
          await import('../utils/firebaseDevBypass.js').then(async (module) => {
            await module.default.ensureAuthenticated();
          });
        } catch (authError) {
          console.warn('⚠️ No se pudo autenticar en desarrollo, continuando...', authError.message);
        }
      }
      
      // Crear admin por defecto si no existe
      await this.verificarYCrearAdminPorDefecto();
      
      const usuariosRef = collection(db, USUARIOS_COLLECTION);
      const q = query(usuariosRef, orderBy('fechaCreacion', 'desc'));
      
      // Retry logic para manejar errores de red
      const maxRetries = 3;
      let lastError = null;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Intento ${attempt}/${maxRetries} para obtener usuarios...`);
          const snapshot = await getDocs(q);
          
          const usuarios = [];
          snapshot.forEach((doc) => {
            usuarios.push({
              id: doc.id,
              ...doc.data(),
              fechaCreacion: doc.data().fechaCreacion?.toDate?.()?.toISOString() || new Date().toISOString(),
              ultimoAcceso: doc.data().ultimoAcceso?.toDate?.()?.toISOString() || null
            });
          });
          
          console.log(`✅ ${usuarios.length} usuarios obtenidos desde Firebase`);
          return usuarios;
        } catch (error) {
          lastError = error;
          console.warn(`⚠️ Error en intento ${attempt}:`, error.message);
          
          if (attempt < maxRetries) {
            // Esperar antes del siguiente intento
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
      
      // Si llegamos aquí, todos los intentos fallaron
      console.error('❌ Error obteniendo usuarios después de todos los intentos:', lastError);
      
      // Retornar datos de fallback si está disponible
      return this.obtenerUsuariosFallback();
      
    } catch (error) {
      console.error('❌ Error crítico obteniendo usuarios:', error);
      return this.obtenerUsuariosFallback();
    }
  }

  // Método de fallback para cuando Firebase no está disponible
  static obtenerUsuariosFallback() {
    console.warn('🔄 Usando datos de fallback para usuarios');
    return [{
      id: 'admin-fallback',
      nombre: 'Administrador',
      email: 'admin@glambook.com',
      rol: 'admin',
      activo: true,
      fechaCreacion: new Date().toISOString(),
      ultimoAcceso: null,
      telefono: '+57 300 999 0000',
      notas: 'Usuario de fallback (Firebase no disponible)'
    }];
  }

  // Verificar y crear admin por defecto
  static async verificarYCrearAdminPorDefecto() {
    try {
      // Solo ejecutar si no hay usuarios
      const usuariosRef = collection(db, USUARIOS_COLLECTION);
      const snapshot = await getDocs(usuariosRef);
      
      if (snapshot.empty) {
        console.log('🔧 No hay usuarios, creando admin por defecto...');
        await this.crearAdminPorDefecto();
      }
    } catch (error) {
      console.warn('⚠️ No se pudo verificar usuarios existentes:', error.message);
    }
  }

  // Crear nuevo usuario con Firebase Auth completo (SEGURO)
  static async crearUsuario(datosUsuario) {
    try {
      console.log('🔥 Creando usuario con Firebase Auth:', datosUsuario.email);
      
      // Validar datos de entrada con SecurityValidator
      const datosValidados = SecurityValidator.validateUserData(datosUsuario);
      
      // Log de seguridad
      SecurityValidator.logSecurityEvent('USER_CREATION_ATTEMPT', {
        email: datosUsuario.email,
        rol: datosUsuario.rol,
        currentUser: auth.currentUser?.email || 'anonymous'
      });
      
      // Verificar permisos en producción
      if (import.meta.env.PROD && auth.currentUser) {
        if (!SecurityValidator.isAdmin(auth.currentUser.email)) {
          throw new Error('Solo los administradores pueden crear usuarios');
        }
      }
      
      // Verificar que no existe el email
      const emailExiste = await this.verificarEmailExiste(datosValidados.email);
      if (emailExiste) {
        throw new Error('Este email ya está registrado');
      }
      
      // Crear usuario en Firebase Auth (SEGURO - maneja contraseñas con hash)
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        datosValidados.email, 
        datosUsuario.password // Password no se incluye en datosValidados por seguridad
      );
      
      const firebaseUser = userCredential.user;
      
      // Actualizar perfil de Firebase Auth
      await updateProfile(firebaseUser, {
        displayName: datosValidados.nombre
      });
      
      // Crear documento en Firestore con UID de Firebase Auth
      const usuarioData = {
        uid: firebaseUser.uid, // UID seguro de Firebase Auth
        email: datosValidados.email,
        nombre: datosValidados.nombre,
        telefono: datosValidados.telefono,
        rol: datosValidados.rol,
        activo: datosValidados.activo,
        verificado: firebaseUser.emailVerified || false,
        avatar: datosValidados.nombre.charAt(0).toUpperCase(),
        citas: 0,
        testimonios: 0,
        notas: datosValidados.notas,
        permisos: rolesConfig[datosValidados.rol].permisos,
        fechaCreacion: serverTimestamp(),
        ultimoAcceso: null
      };
      
      const docRef = await addDoc(collection(db, USUARIOS_COLLECTION), usuarioData);
      
      console.log('✅ Usuario creado con Firebase Auth seguro:', docRef.id);
      
      // Log de éxito
      SecurityValidator.logSecurityEvent('USER_CREATED_SUCCESS', {
        userId: docRef.id,
        email: datosValidados.email,
        rol: datosValidados.rol
      });
      
      return {
        id: docRef.id,
        ...usuarioData,
        fechaCreacion: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      
      // Log de error de seguridad
      SecurityValidator.logSecurityEvent('USER_CREATION_ERROR', {
        email: datosUsuario.email,
        error: error.message,
        code: error.code
      });
      
      // Limpiar Firebase Auth si falló Firestore
      if (error.code !== 'auth/email-already-in-use' && error.code !== 'auth/operation-not-allowed') {
        try {
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.email === datosUsuario.email) {
            await deleteUser(currentUser);
            console.log('🧹 Firebase Auth limpiado por error en Firestore');
          }
        } catch (cleanupError) {
          console.error('❌ Error limpiando Firebase Auth:', cleanupError);
        }
      }
      
      throw error;
    }
  }

  // Actualizar usuario
  static async actualizarUsuario(id, datosUsuario) {
    try {
      console.log('🔥 Actualizando usuario:', id);
      
      // Validar permisos en producción
      if (import.meta.env.PROD && auth.currentUser) {
        if (!SecurityValidator.checkUserPermissions(auth.currentUser.email, 'admin')) {
          throw new Error('Solo los administradores pueden actualizar usuarios');
        }
      }
      
      // Log de seguridad
      SecurityValidator.logSecurityEvent('USER_UPDATE_ATTEMPT', {
        userId: id,
        currentUser: auth.currentUser?.email || 'anonymous',
        changes: Object.keys(datosUsuario)
      });
      
      // Validar datos (excluyendo password que se maneja aparte)
      const datosParaValidar = { ...datosUsuario };
      delete datosParaValidar.password;
      
      const datosValidados = SecurityValidator.validateUserData({
        nombre: datosParaValidar.nombre || '',
        email: datosParaValidar.email || '',
        telefono: datosParaValidar.telefono || '',
        rol: datosParaValidar.rol || 'cliente',
        activo: datosParaValidar.activo !== undefined ? datosParaValidar.activo : true,
        notas: datosParaValidar.notas || ''
      });
      
      // Verificar email único (si se está cambiando)
      if (datosValidados.email) {
        const emailConflicto = await this.verificarEmailExiste(datosValidados.email, id);
        if (emailConflicto) {
          throw new Error('Este email ya está en uso por otro usuario');
        }
      }
      
      // Convertir ID a string para Firebase
      const docId = String(id);
      const userRef = doc(db, USUARIOS_COLLECTION, docId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }
      
      const datosActuales = userDoc.data();
      
      // Preparar datos de actualización
      const datosActualizacion = {
        ...datosActuales,
        nombre: datosUsuario.nombre || datosActuales.nombre,
        email: datosUsuario.email?.toLowerCase() || datosActuales.email,
        telefono: datosUsuario.telefono !== undefined ? datosUsuario.telefono : datosActuales.telefono,
        rol: datosUsuario.rol || datosActuales.rol,
        activo: datosUsuario.activo !== undefined ? datosUsuario.activo : datosActuales.activo,
        notas: datosUsuario.notas !== undefined ? datosUsuario.notas : datosActuales.notas,
        permisos: datosUsuario.rol ? rolesConfig[datosUsuario.rol].permisos : datosActuales.permisos
      };
      
      await updateDoc(userRef, datosActualizacion);
      
      // Si hay cambio de contraseña, actualizar en Firebase Auth
      if (datosUsuario.password && datosActuales.uid) {
        try {
          // Nota: En producción, esto requeriría reautenticación del usuario
          console.log('⚠️ Cambio de contraseña pendiente de implementación completa');
        } catch (authError) {
          console.error('❌ Error actualizando contraseña:', authError);
        }
      }
      
      console.log('✅ Usuario actualizado exitosamente');
      
      // Log de éxito
      SecurityValidator.logSecurityEvent('USER_UPDATED_SUCCESS', {
        userId: docId,
        updatedFields: Object.keys(datosUsuario),
        currentUser: auth.currentUser?.email || 'anonymous'
      });
      
      return {
        id: docId,
        ...datosActualizacion
      };
      
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      
      // Log de error
      SecurityValidator.logSecurityEvent('USER_UPDATE_ERROR', {
        userId: id,
        error: error.message,
        currentUser: auth.currentUser?.email || 'anonymous'
      });
      throw error;
    }
  }

  // Eliminar usuario
  static async eliminarUsuario(id) {
    try {
      // Convertir ID a string para Firebase
      const docId = String(id);
      console.log('🔥 Eliminando usuario:', docId);
      
      const userRef = doc(db, USUARIOS_COLLECTION, docId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }
      
      const userData = userDoc.data();
      
      // Verificar que no sea el admin principal
      if (userData.email === 'admin@glambook.com') {
        throw new Error('No se puede eliminar el usuario administrador principal');
      }
      
      // Eliminar documento de Firestore
      await deleteDoc(userRef);
      
      // Eliminar de Firebase Auth (requiere más configuración en producción)
      console.log('⚠️ Eliminación de Firebase Auth pendiente de configuración');
      
      console.log('✅ Usuario eliminado exitosamente');
      return userData;
      
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error);
      throw error;
    }
  }

  // Cambiar estado del usuario
  static async cambiarEstado(id, nuevoEstado) {
    try {
      // Convertir ID a string para Firebase
      const docId = String(id);
      console.log('🔥 Cambiando estado usuario:', docId, 'a', nuevoEstado);
      
      const userRef = doc(db, USUARIOS_COLLECTION, docId);
      await updateDoc(userRef, {
        activo: nuevoEstado
      });
      
      console.log('✅ Estado del usuario actualizado');
      return { id: docId, activo: nuevoEstado };
      
    } catch (error) {
      console.error('❌ Error cambiando estado:', error);
      throw error;
    }
  }

  // Resetear contraseña
  static async resetearPassword(email) {
    try {
      console.log('🔥 Enviando reset de contraseña a:', email);
      
      await sendPasswordResetEmail(auth, email);
      
      console.log('✅ Email de reset enviado');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Error enviando reset:', error);
      throw error;
    }
  }

  // Obtener estadísticas
  static async obtenerEstadisticas() {
    try {
      const usuarios = await this.obtenerUsuarios();
      
      const stats = {
        total: usuarios.length,
        activos: usuarios.filter(u => u.activo).length,
        inactivos: usuarios.filter(u => !u.activo).length,
        admins: usuarios.filter(u => u.rol === 'admin').length,
        clientes: usuarios.filter(u => u.rol === 'cliente').length,
        managers: usuarios.filter(u => u.rol === 'manager').length,
        verificados: usuarios.filter(u => u.verificado).length,
        noVerificados: usuarios.filter(u => !u.verificado).length
      };
      
      return stats;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  // Verificar si el email existe (excluyendo un ID específico)
  static async verificarEmailExiste(email, excluirId = null) {
    try {
      const usuariosRef = collection(db, USUARIOS_COLLECTION);
      const q = query(usuariosRef, where('email', '==', email.toLowerCase()));
      const snapshot = await getDocs(q);
      
      if (excluirId) {
        // Si estamos excluyendo un ID, verificar que no sea el mismo documento
        let existe = false;
        snapshot.forEach((doc) => {
          if (doc.id !== excluirId) {
            existe = true;
          }
        });
        return existe;
      }
      
      return !snapshot.empty;
    } catch (error) {
      console.error('❌ Error verificando email:', error);
      return false;
    }
  }

  // Inicializar admin principal si no existe
  // Crear admin por defecto sin autenticación
  static async crearAdminPorDefecto() {
    try {
      console.log('🔧 Creando admin por defecto...');
      
      const adminData = {
        nombre: 'Administrador Principal',
        email: 'admin@glambook.com', 
        rol: 'admin',
        activo: true,
        telefono: '+57 300 999 0000',
        fechaCreacion: serverTimestamp(),
        ultimoAcceso: null,
        notas: 'Usuario administrador principal del sistema - creado automáticamente'
      };
      
      const usuariosRef = collection(db, USUARIOS_COLLECTION);
      const docRef = await addDoc(usuariosRef, adminData);
      
      console.log('✅ Admin por defecto creado con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando admin por defecto:', error);
      throw error;
    }
  }

  static async inicializarAdminPrincipal() {
    try {
      console.log('🔥 Verificando admin principal...');
      
      // Usar retry logic para manejar errores de conectividad
      const maxRetries = 3;
      let lastError = null;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const usuariosRef = collection(db, USUARIOS_COLLECTION);
          const q = query(usuariosRef, where('email', '==', 'admin@glambook.com'));
          const snapshot = await getDocs(q);
          
          if (snapshot.empty) {
            console.log('🔥 Creando admin principal...');
            
            await this.crearUsuario({
              nombre: 'Administrador Principal',
              email: 'admin@glambook.com',
              password: 'admin123456', // En producción, usar password segura
              rol: 'admin',
              activo: true,
              telefono: '+57 300 999 0000',
              notas: 'Usuario administrador principal del sistema'
            });
            
            console.log('✅ Admin principal creado');
            return; // Salir del bucle de retry
          } else {
            console.log('✅ Admin principal ya existe');
            return; // Salir del bucle de retry
          }
        } catch (error) {
          lastError = error;
          console.warn(`⚠️ Error en intento ${attempt} de inicialización admin:`, error.message);
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
      
      // Si llegamos aquí, todos los intentos fallaron
      console.error('❌ Error inicializando admin después de todos los intentos:', lastError);
      
    } catch (error) {
      console.error('❌ Error crítico inicializando admin:', error);
    }
  }
}

// Función auxiliar para inicializar datos de ejemplo
export async function inicializarDatosEjemplo() {
  try {
    console.log('🔥 Inicializando datos de ejemplo...');
    
    const usuarios = await UsuariosService.obtenerUsuarios();
    
    if (usuarios.length === 0) {
      // Crear usuarios de ejemplo
      const usuariosEjemplo = [
        {
          nombre: 'María García',
          email: 'maria.garcia@gmail.com',
          password: 'password123',
          telefono: '+57 300 123 4567',
          rol: 'cliente'
        },
        {
          nombre: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@outlook.com',
          password: 'password123',
          telefono: '+57 301 987 6543',
          rol: 'cliente'
        },
        {
          nombre: 'Ana Martínez',
          email: 'ana.martinez@yahoo.com',
          password: 'password123',
          telefono: '+57 312 555 7890',
          rol: 'cliente'
        }
      ];
      
      for (const usuario of usuariosEjemplo) {
        try {
          await UsuariosService.crearUsuario(usuario);
        } catch (error) {
          console.error('Error creando usuario ejemplo:', error);
        }
      }
    }
    
    console.log('✅ Datos de ejemplo inicializados');
  } catch (error) {
    console.error('❌ Error inicializando datos:', error);
  }
}

export default UsuariosService;