// Servicio de monitoreo y diagnóstico de producción
// src/utils/monitoring.js

export class MonitoringService {
  
  static isProduction = import.meta.env.PROD;
  static appVersion = import.meta.env.APP_VERSION || '1.0.0';
  
  // Inicializar monitoreo
  static init() {
    if (this.isProduction) {
      this.setupErrorHandling();
      this.setupPerformanceMonitoring();
      this.checkSystemHealth();
    }
    
    console.log(`🚀 GlamBook iniciado en modo ${this.isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'} v${this.appVersion}`);
  }
  
  // Configurar manejo global de errores
  static setupErrorHandling() {
    window.addEventListener('error', (event) => {
      this.logError('JAVASCRIPT_ERROR', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('UNHANDLED_PROMISE_REJECTION', {
        reason: event.reason
      });
    });
  }
  
  // Monitoreo de rendimiento
  static setupPerformanceMonitoring() {
    // Web Vitals básicos
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.logMetric('PAGE_LOAD_TIME', entry.loadEventEnd - entry.loadEventStart);
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        console.warn('Performance observer no soportado');
      }
    }
  }
  
  // Verificar salud del sistema
  static async checkSystemHealth() {
    const healthChecks = {
      firebase: await this.checkFirebaseConnection(),
      localStorage: this.checkLocalStorage(),
      internetConnection: navigator.onLine,
      browserSupport: this.checkBrowserSupport()
    };
    
    this.logMetric('SYSTEM_HEALTH', healthChecks);
    
    return healthChecks;
  }
  
  // Verificar conexión con Firebase
  static async checkFirebaseConnection() {
    try {
      const { auth } = await import('../firebase.js');
      return auth.app !== null;
    } catch (error) {
      this.logError('FIREBASE_CONNECTION_ERROR', { error: error.message });
      return false;
    }
  }
  
  // Verificar localStorage
  static checkLocalStorage() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Verificar soporte del navegador
  static checkBrowserSupport() {
    const features = {
      fetch: typeof fetch !== 'undefined',
      promises: typeof Promise !== 'undefined',
      localStorage: this.checkLocalStorage(),
      modules: 'import' in window || typeof require !== 'undefined',
      webComponents: typeof customElements !== 'undefined'
    };
    
    const supported = Object.values(features).every(feature => feature);
    
    if (!supported) {
      console.warn('Algunas características no están soportadas:', features);
    }
    
    return supported;
  }
  
  // Log de errores
  static logError(type, details) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      type,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      version: this.appVersion,
      userId: this.getCurrentUserId()
    };
    
    console.error(`[${type}]:`, errorLog);
    
    if (this.isProduction) {
      // En producción, enviar a servicio de monitoreo
      this.sendToMonitoringService('error', errorLog);
    }
  }
  
  // Log de métricas
  static logMetric(metric, value) {
    const metricLog = {
      timestamp: new Date().toISOString(),
      metric,
      value,
      version: this.appVersion,
      userId: this.getCurrentUserId()
    };
    
    console.log(`[METRIC ${metric}]:`, value);
    
    if (this.isProduction) {
      this.sendToMonitoringService('metric', metricLog);
    }
  }
  
  // Obtener ID del usuario actual
  static getCurrentUserId() {
    try {
      return window.auth?.currentUser?.uid || 'anonymous';
    } catch {
      return 'unknown';
    }
  }
  
  // Enviar datos a servicio de monitoreo
  static async sendToMonitoringService(type, data) {
    try {
      // Implementar envío a servicio real (Sentry, LogRocket, etc.)
      await fetch('/api/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      });
    } catch (error) {
      console.warn('No se pudo enviar datos de monitoreo:', error);
    }
  }
  
  // Diagnóstico completo del sistema
  static async runDiagnostics() {
    console.log('🔍 Ejecutando diagnóstico completo...');
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: this.isProduction ? 'production' : 'development',
      version: this.appVersion,
      systemHealth: await this.checkSystemHealth(),
      firebaseConfig: await this.checkFirebaseConfig(),
      apiEndpoints: await this.checkAPIEndpoints(),
      userSession: this.checkUserSession()
    };
    
    console.table(diagnostics.systemHealth);
    console.log('📊 Diagnóstico completo:', diagnostics);
    
    return diagnostics;
  }
  
  // Verificar configuración de Firebase
  static async checkFirebaseConfig() {
    try {
      const { auth, db } = await import('../firebase.js');
      return {
        auth: !!auth,
        firestore: !!db,
        config: {
          apiKey: !!auth.app.options.apiKey,
          authDomain: !!auth.app.options.authDomain,
          projectId: !!auth.app.options.projectId
        }
      };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  // Verificar endpoints de API
  static async checkAPIEndpoints() {
    const endpoints = ['/api/health', '/api/usuarios', '/api/testimonios'];
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { method: 'HEAD' });
        results[endpoint] = {
          status: response.status,
          ok: response.ok
        };
      } catch (error) {
        results[endpoint] = {
          error: error.message
        };
      }
    }
    
    return results;
  }
  
  // Verificar sesión de usuario
  static checkUserSession() {
    try {
      const user = window.auth?.currentUser;
      return {
        authenticated: !!user,
        email: user?.email || null,
        uid: user?.uid || null,
        emailVerified: user?.emailVerified || false
      };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  // Crear reporte de estado
  static async generateStatusReport() {
    const diagnostics = await this.runDiagnostics();
    
    const report = {
      status: 'OK',
      issues: [],
      warnings: [],
      recommendations: []
    };
    
    // Analizar resultados y generar recomendaciones
    if (!diagnostics.systemHealth.firebase) {
      report.issues.push('Firebase no conectado');
      report.status = 'ERROR';
    }
    
    if (!diagnostics.systemHealth.internetConnection) {
      report.warnings.push('Sin conexión a internet');
    }
    
    if (!diagnostics.systemHealth.browserSupport) {
      report.warnings.push('Navegador no completamente soportado');
    }
    
    if (report.issues.length === 0 && report.warnings.length === 0) {
      report.status = 'HEALTHY';
    } else if (report.issues.length > 0) {
      report.status = 'ERROR';
    } else {
      report.status = 'WARNING';
    }
    
    console.log(`🏥 Estado del sistema: ${report.status}`);
    if (report.issues.length > 0) {
      console.error('❌ Problemas:', report.issues);
    }
    if (report.warnings.length > 0) {
      console.warn('⚠️ Advertencias:', report.warnings);
    }
    
    return report;
  }
}

// Inicializar monitoreo al cargar
if (typeof window !== 'undefined') {
  MonitoringService.init();
}

export default MonitoringService;