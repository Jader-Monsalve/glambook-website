// Firebase Development Bypass
// This creates a temporary anonymous authentication to bypass security rules
// src/utils/firebaseDevBypass.js

import { auth, db } from '../firebase.js';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export class FirebaseDevBypass {
  
  static async ensureAuthenticated() {
    return new Promise((resolve, reject) => {
      console.log('🔧 Verificando autenticación para bypass...');
      
      // Verificar si ya está autenticado
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Limpiar el listener
        
        if (user) {
          console.log('✅ Usuario ya autenticado:', user.uid);
          resolve(user);
        } else {
          try {
            console.log('🔐 Creando sesión anónima para desarrollo...');
            const userCredential = await signInAnonymously(auth);
            console.log('✅ Sesión anónima creada:', userCredential.user.uid);
            resolve(userCredential.user);
          } catch (error) {
            console.error('❌ Error creando sesión anónima:', error);
            reject(error);
          }
        }
      });
      
      // Timeout después de 10 segundos
      setTimeout(() => {
        unsubscribe();
        reject(new Error('Timeout en autenticación'));
      }, 10000);
    });
  }
  
  static async initializeWithAuth() {
    try {
      // Asegurar autenticación antes de cualquier operación Firestore
      await this.ensureAuthenticated();
      console.log('✅ Firebase listo con autenticación');
      return true;
    } catch (error) {
      console.error('❌ Error inicializando Firebase con auth:', error);
      return false;
    }
  }
}

export default FirebaseDevBypass;