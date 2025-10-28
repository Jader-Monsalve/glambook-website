// Security utilities for production
// src/utils/security.js

export class SecurityValidator {
  
  // Lista de emails de administradores
  static ADMIN_EMAILS = [
    'admin@glambook.com',
    'jadermonsalve9@gmail.com'
  ];
  
  // Verificar si el usuario es administrador
  static isAdmin(email) {
    return this.ADMIN_EMAILS.includes(email?.toLowerCase());
  }
  
  // Validar email
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validar contraseña segura
  static validatePassword(password) {
    // Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
  
  // Validar teléfono
  static validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  }
  
  // Sanitizar entrada de texto
  static sanitizeText(text) {
    if (typeof text !== 'string') return '';
    return text.trim().substring(0, 1000); // Limitar a 1000 caracteres
  }
  
  // Verificar rate limiting (prevenir spam)
  static checkRateLimit(key, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const windowKey = `rate_limit_${key}_${Math.floor(now / windowMs)}`;
    
    let count = parseInt(localStorage.getItem(windowKey) || '0');
    
    if (count >= maxRequests) {
      throw new Error('Demasiadas solicitudes. Intenta nuevamente más tarde.');
    }
    
    localStorage.setItem(windowKey, (count + 1).toString());
    
    // Limpiar ventanas anteriores
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('rate_limit_') && 
          parseInt(key.split('_')[3]) < Math.floor(now / windowMs) - 5) {
        localStorage.removeItem(key);
      }
    }
    
    return true;
  }
  
  // Validar datos de usuario para creación/actualización
  static validateUserData(userData) {
    const errors = [];
    
    if (!userData.nombre || userData.nombre.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!this.validateEmail(userData.email)) {
      errors.push('Email inválido');
    }
    
    if (userData.password && !this.validatePassword(userData.password)) {
      errors.push('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números');
    }
    
    if (userData.telefono && !this.validatePhone(userData.telefono)) {
      errors.push('Número de teléfono inválido');
    }
    
    if (!['admin', 'cliente', 'manager'].includes(userData.rol)) {
      errors.push('Rol inválido');
    }
    
    if (errors.length > 0) {
      throw new Error(`Datos inválidos: ${errors.join(', ')}`);
    }
    
    // Sanitizar datos
    return {
      nombre: this.sanitizeText(userData.nombre),
      email: userData.email.toLowerCase().trim(),
      telefono: userData.telefono?.trim() || '',
      rol: userData.rol,
      activo: Boolean(userData.activo),
      notas: this.sanitizeText(userData.notas || '')
    };
  }
  
  // Verificar permisos de usuario
  static checkUserPermissions(userEmail, requiredRole = 'cliente') {
    const roleHierarchy = {
      'cliente': 1,
      'manager': 2,
      'admin': 3
    };
    
    let userRole = 'cliente';
    if (this.isAdmin(userEmail)) {
      userRole = 'admin';
    }
    
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }
  
  // Log de seguridad (para auditoría)
  static logSecurityEvent(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: auth.currentUser?.uid || 'anonymous'
    };
    
    console.log('[SECURITY LOG]:', logEntry);
    
    // En producción, enviar a servicio de logging
    if (import.meta.env.PROD) {
      // TODO: Enviar a servicio de monitoreo (ej: Sentry, LogRocket)
    }
  }
  
  // Verificar integridad de datos
  static verifyDataIntegrity(data, expectedFields) {
    for (const field of expectedFields) {
      if (!(field in data)) {
        throw new Error(`Campo requerido faltante: ${field}`);
      }
    }
    
    // Verificar que no hay campos inesperados
    const allowedFields = [...expectedFields, 'id', 'fechaCreacion', 'fechaActualizacion'];
    for (const field in data) {
      if (!allowedFields.includes(field)) {
        console.warn(`Campo inesperado detectado: ${field}`);
      }
    }
    
    return true;
  }
}

// Middleware de seguridad para APIs
export class APISecurityMiddleware {
  
  static async validateRequest(request, requiredRole = 'cliente') {
    try {
      // Verificar autenticación
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No autenticado');
      }
      
      // Verificar permisos
      if (!SecurityValidator.checkUserPermissions(user.email, requiredRole)) {
        throw new Error('Permisos insuficientes');
      }
      
      // Rate limiting
      SecurityValidator.checkRateLimit(user.uid);
      
      // Log de acceso
      SecurityValidator.logSecurityEvent('API_ACCESS', {
        endpoint: request.url,
        method: request.method,
        userEmail: user.email
      });
      
      return user;
    } catch (error) {
      SecurityValidator.logSecurityEvent('SECURITY_VIOLATION', {
        endpoint: request.url,
        error: error.message
      });
      throw error;
    }
  }
}

export default SecurityValidator;