// Firebase Connection Diagnostic Tool
// src/utils/firebaseDiagnostic.js

import { auth, db, enableFirebaseNetwork, disableFirebaseNetwork } from '../firebase.js';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export class FirebaseDiagnostic {
  
  static async runDiagnostic() {
    console.log('🔍 Iniciando diagnóstico de Firebase...');
    
    const results = {
      timestamp: new Date().toISOString(),
      tests: []
    };
    
    // Test 1: Verificar inicialización de Firebase
    results.tests.push(await this.testFirebaseInit());
    
    // Test 2: Verificar autenticación
    results.tests.push(await this.testAuth());
    
    // Test 3: Verificar conectividad de Firestore
    results.tests.push(await this.testFirestoreConnection());
    
    // Test 4: Verificar operaciones básicas de Firestore
    results.tests.push(await this.testFirestoreOperations());
    
    // Test 5: Verificar reglas de seguridad
    results.tests.push(await this.testSecurityRules());
    
    console.log('✅ Diagnóstico de Firebase completado:', results);
    return results;
  }
  
  static async testFirebaseInit() {
    const test = {
      name: 'Firebase Initialization',
      status: 'unknown',
      message: '',
      details: {}
    };
    
    try {
      if (auth && db) {
        test.status = 'success';
        test.message = 'Firebase inicializado correctamente';
        test.details = {
          authReady: !!auth,
          firestoreReady: !!db,
          projectId: db.app?.options?.projectId || 'unknown'
        };
      } else {
        test.status = 'error';
        test.message = 'Firebase no está inicializado correctamente';
      }
    } catch (error) {
      test.status = 'error';
      test.message = error.message;
    }
    
    return test;
  }
  
  static async testAuth() {
    const test = {
      name: 'Authentication State',
      status: 'unknown',
      message: '',
      details: {}
    };
    
    try {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          test.details.currentUser = user ? {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified
          } : null;
          
          test.status = 'success';
          test.message = user ? 
            `Usuario autenticado: ${user.email}` : 
            'No hay usuario autenticado';
          
          unsubscribe();
          resolve(test);
        });
        
        // Timeout después de 3 segundos
        setTimeout(() => {
          test.status = 'timeout';
          test.message = 'Timeout verificando estado de autenticación';
          unsubscribe();
          resolve(test);
        }, 3000);
      });
    } catch (error) {
      test.status = 'error';
      test.message = error.message;
      return test;
    }
  }
  
  static async testFirestoreConnection() {
    const test = {
      name: 'Firestore Connection',
      status: 'unknown',
      message: '',
      details: {}
    };
    
    try {
      // Intentar habilitar la red
      await enableFirebaseNetwork();
      
      // Realizar una consulta simple
      const testCollection = collection(db, 'diagnostic-test');
      const startTime = Date.now();
      
      await getDocs(testCollection);
      
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      test.status = 'success';
      test.message = 'Conexión a Firestore establecida correctamente';
      test.details = {
        latency: `${latency}ms`,
        networkEnabled: true
      };
      
    } catch (error) {
      test.status = 'error';
      test.message = `Error de conexión: ${error.message}`;
      test.details = {
        errorCode: error.code,
        errorType: error.name
      };
    }
    
    return test;
  }
  
  static async testFirestoreOperations() {
    const test = {
      name: 'Firestore Operations',
      status: 'unknown',
      message: '',
      details: {}
    };
    
    try {
      const testData = {
        message: 'Test de conexión Firebase',
        timestamp: serverTimestamp(),
        testId: Math.random().toString(36).substr(2, 9)
      };
      
      // Intentar escribir datos de prueba
      const testCollection = collection(db, 'diagnostic-test');
      const docRef = await addDoc(testCollection, testData);
      
      test.status = 'success';
      test.message = 'Operaciones de Firestore funcionando correctamente';
      test.details = {
        testDocId: docRef.id,
        writeOperation: 'success'
      };
      
    } catch (error) {
      test.status = 'error';
      test.message = `Error en operaciones: ${error.message}`;
      test.details = {
        errorCode: error.code,
        errorType: error.name
      };
    }
    
    return test;
  }
  
  static async testSecurityRules() {
    const test = {
      name: 'Security Rules',
      status: 'unknown', 
      message: '',
      details: {}
    };
    
    try {
      // Intentar acceder a la colección de usuarios
      const usuariosRef = collection(db, 'usuarios');
      await getDocs(usuariosRef);
      
      test.status = 'success';
      test.message = 'Reglas de seguridad permiten acceso';
      test.details = {
        usuariosAccess: 'allowed'
      };
      
    } catch (error) {
      if (error.code === 'permission-denied') {
        test.status = 'warning';
        test.message = 'Acceso denegado - verificar reglas de seguridad';
      } else {
        test.status = 'error';
        test.message = `Error verificando reglas: ${error.message}`;
      }
      
      test.details = {
        errorCode: error.code,
        errorType: error.name
      };
    }
    
    return test;
  }
  
  // Función para generar reporte de diagnóstico
  static generateReport(results) {
    let report = `
🔍 REPORTE DE DIAGNÓSTICO DE FIREBASE
===========================================
Fecha: ${results.timestamp}

`;
    
    results.tests.forEach((test, index) => {
      const statusIcon = {
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'timeout': '⏱️',
        'unknown': '❓'
      }[test.status] || '❓';
      
      report += `${index + 1}. ${statusIcon} ${test.name}
   Estado: ${test.status.toUpperCase()}
   Mensaje: ${test.message}
   Detalles: ${JSON.stringify(test.details, null, 2)}

`;
    });
    
    const errorCount = results.tests.filter(t => t.status === 'error').length;
    const warningCount = results.tests.filter(t => t.status === 'warning').length;
    
    report += `
RESUMEN:
- Total de pruebas: ${results.tests.length}
- Exitosas: ${results.tests.filter(t => t.status === 'success').length}
- Advertencias: ${warningCount}
- Errores: ${errorCount}

`;
    
    if (errorCount > 0) {
      report += `
🚨 ACCIONES RECOMENDADAS:
1. Verificar reglas de seguridad en Firebase Console
2. Verificar configuración de Firebase en src/firebase.js
3. Verificar conectividad de red
4. Verificar autenticación de usuario
`;
    }
    
    return report;
  }
}

export default FirebaseDiagnostic;