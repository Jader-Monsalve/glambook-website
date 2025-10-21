// Configuración del panel de administración
export const adminConfig = {
  // URLs
  production: {
    baseUrl: 'https://glambook-website-production.up.railway.app',
    apiUrl: 'https://glambook-website-production.up.railway.app/api'
  },
  development: {
    baseUrl: 'http://localhost:4322',
    apiUrl: 'http://localhost:4322/api'
  },
  
  // Firebase Configuration
  firebase: {
    apiKey: "AIzaSyA6ZaSPJZ9sz75fvYSy1GUL0uLpth5PURQ",
    authDomain: "glambook-ac3dd.firebaseapp.com",
    projectId: "glambook-ac3dd",
    storageBucket: "glambook-ac3dd.firebasestorage.app",
    messagingSenderId: "536181803335",
    appId: "1:536181803335:web:358a751de57699eab4a462",
    measurementId: "G-6C1YMQLCR5"
  },
  
  // Admin settings
  admin: {
    defaultEmail: 'admin@glambook.com',
    sessionTimeout: 3600000, // 1 hora en millisegundos
    autoSaveInterval: 30000, // 30 segundos
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
  
  // Pagination and limits
  pagination: {
    itemsPerPage: 10,
    maxItemsPerPage: 50
  },
  
  // System settings
  system: {
    version: '2.0.0',
    buildDate: new Date().toISOString(),
    environment: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'development' : 'production'
  }
};

// Helper functions
export const getApiUrl = (endpoint: string) => {
  const config = adminConfig.system.environment === 'production' 
    ? adminConfig.production 
    : adminConfig.development;
  
  return `${config.apiUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

export const getBaseUrl = () => {
  const config = adminConfig.system.environment === 'production' 
    ? adminConfig.production 
    : adminConfig.development;
  
  return config.baseUrl;
};

export const isProduction = () => {
  return adminConfig.system.environment === 'production';
};

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('es-ES').format(num);
};

// Error handling
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Error de respuesta del servidor
    return `Error ${error.response.status}: ${error.response.data?.message || 'Error del servidor'}`;
  } else if (error.request) {
    // Error de red
    return 'Error de conexión. Verifica tu conexión a internet.';
  } else {
    // Error de configuración
    return 'Error interno. Intenta nuevamente.';
  }
};

// Local storage helpers
export const saveToLocalStorage = (key: string, data: any) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`glambook_admin_${key}`, JSON.stringify(data));
    }
  } catch (error) {
    console.warn('Could not save to localStorage:', error);
  }
};

export const getFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`glambook_admin_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    }
  } catch (error) {
    console.warn('Could not read from localStorage:', error);
    return defaultValue;
  }
  return defaultValue;
};

export const removeFromLocalStorage = (key: string) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`glambook_admin_${key}`);
    }
  } catch (error) {
    console.warn('Could not remove from localStorage:', error);
  }
};

// Session management
export const getSessionExpiry = () => {
  return Date.now() + adminConfig.admin.sessionTimeout;
};

export const isSessionExpired = (expiry: number) => {
  return Date.now() > expiry;
};

export default adminConfig;