import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Lista de emails de administradores por defecto (fallback)
const DEFAULT_ADMIN_EMAILS = [
  'jadermonsalve9@gmail.com',
  'admin@glambook.com',
];

// Función para obtener la lista completa de administradores activos
function getActiveAdminEmails(): string[] {
  try {
    // Obtener administradores desde localStorage
    const stored = localStorage.getItem('glambook_administradores');
    if (stored) {
      const administradores = JSON.parse(stored);
      if (Array.isArray(administradores)) {
        // Filtrar solo administradores activos y extraer emails
        const activeEmails = administradores
          .filter((admin: any) => admin.estado === 'activo' && admin.email)
          .map((admin: any) => admin.email.toLowerCase());
        
        // Combinar con emails por defecto
        const allEmails = [...new Set([...DEFAULT_ADMIN_EMAILS, ...activeEmails])];
        console.log('📧 Emails de administradores activos:', allEmails);
        return allEmails;
      }
    }
  } catch (error) {
    console.error('❌ Error al cargar administradores desde localStorage:', error);
  }
  
  // Fallback: usar solo emails por defecto
  console.log('📧 Usando emails por defecto:', DEFAULT_ADMIN_EMAILS);
  return DEFAULT_ADMIN_EMAILS;
}

export class AuthService {
  // Iniciar sesión con email y contraseña
  static async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Verificar si el usuario es administrador
      if (!this.isAdmin(user.email)) {
        await signOut(auth);
        throw new Error('No tienes permisos de administrador');
      }
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }
  
  // Cerrar sesión
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
  
  // Refrescar lista de administradores (útil cuando se agregan nuevos)
  static refreshAdminList(): void {
    // Esta función fuerza a que la próxima verificación de isAdmin
    // recargue la lista desde localStorage
    console.log('🔄 Lista de administradores actualizada');
  }
  
  // Verificar si un email es administrador
  static isAdmin(email: string | null): boolean {
    if (!email) return false;
    const activeAdminEmails = getActiveAdminEmails();
    return activeAdminEmails.includes(email.toLowerCase());
  }
  
  // Obtener usuario actual
  static getCurrentUser(): Promise<AuthUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user && this.isAdmin(user.email)) {
          resolve({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          });
        } else {
          resolve(null);
        }
      });
    });
  }
  
  // Escuchar cambios en el estado de autenticación
  static onAuthStateChanged(callback: (user: AuthUser | null) => void) {
    return onAuthStateChanged(auth, (user) => {
      if (user && this.isAdmin(user.email)) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
      } else {
        callback(null);
      }
    });
  }
  
  // Enviar email para resetear contraseña
  static async sendPasswordReset(email: string): Promise<void> {
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }
  
  // Cambiar contraseña del usuario actual
  static async changePassword(newPassword: string): Promise<void> {
    try {
      const { updatePassword } = await import('firebase/auth');
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }
      
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }
  
  // Obtener mensaje de error en español
  private static getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No se encontró una cuenta con este email',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Este email ya está registrado',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/invalid-login-credentials': 'Email o contraseña incorrectos',
      'auth/requires-recent-login': 'Necesitas volver a iniciar sesión para cambiar la contraseña'
    };
    
    return errorMessages[errorCode] || 'Error desconocido. Intenta nuevamente';
  }
}

export default AuthService;