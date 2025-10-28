# 🚀 CONFIGURACIÓN PARA PRODUCCIÓN - GlamBook

## ⚠️ ESTADO ACTUAL: DESARROLLO
Tu aplicación está configurada para desarrollo con:
- ❌ **Reglas de Firebase permisivas** (allow read, write: if true)
- ❌ **Bypass de autenticación** para desarrollo
- ❌ **Configuraciones inseguras** para producción

## 📋 LISTA DE VERIFICACIÓN PARA PRODUCCIÓN

### 🔐 1. SEGURIDAD DE FIREBASE (CRÍTICO)

#### A. Actualizar Reglas de Firestore
**ACTUAL (Inseguro para producción):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ❌ PELIGROSO
    }
  }
}
```

**PRODUCCIÓN (Seguro):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer/escribir sus propios datos
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Administradores pueden gestionar usuarios
    match /usuarios/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in [
          'admin@glambook.com',
          'jadermonsalve9@gmail.com'
        ];
    }
    
    // Citas: solo el usuario propietario y admins
    match /citas/{citaId} {
      allow read, write: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        request.auth.token.email in [
          'admin@glambook.com', 
          'jadermonsalve9@gmail.com'
        ]
      );
    }
    
    // Testimonios: lectura pública, escritura autenticada
    match /testimonios/{testimonioId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### B. Configurar Variables de Entorno
Crear `.env` en la raíz del proyecto:
```env
# Firebase Configuration (PRODUCCIÓN)
FIREBASE_PROJECT_ID=glambook-ac3dd
FIREBASE_API_KEY=AIzaSyA6ZaSPJZ9sz75fvYSy1GUL0uLpth5PURQ
FIREBASE_AUTH_DOMAIN=glambook-ac3dd.firebaseapp.com
FIREBASE_STORAGE_BUCKET=glambook-ac3dd.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=536181803335
FIREBASE_APP_ID=1:536181803335:web:358a751de57699eab4a462

# Environment
NODE_ENV=production
```

### 🔧 2. CÓDIGO PARA PRODUCCIÓN

#### A. Deshabilitar Bypass de Desarrollo
Modificar `src/services/usuariosService.js`:
```javascript
// REMOVER ESTAS LÍNEAS EN PRODUCCIÓN:
try {
  await import('../utils/firebaseDevBypass.js').then(async (module) => {
    await module.default.ensureAuthenticated();
  });
} catch (authError) {
  console.warn('⚠️ No se pudo autenticar, continuando...', authError.message);
}
```

#### B. Configurar Firebase para Producción
Actualizar `src/firebase.js`:
```javascript
// Configuración condicional según ambiente
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY || "AIzaSyA6ZaSPJZ9sz75fvYSy1GUL0uLpth5PURQ",
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN || "glambook-ac3dd.firebaseapp.com",
  projectId: import.meta.env.FIREBASE_PROJECT_ID || "glambook-ac3dd",
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET || "glambook-ac3dd.firebasestorage.app",
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID || "536181803335",
  appId: import.meta.env.FIREBASE_APP_ID || "1:536181803335:web:358a751de57699eab4a462",
  measurementId: "G-6C1YMQLCR5"
};
```

### 🌐 3. DEPLOYMENT

#### A. Netlify Deployment
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### B. Variables de Entorno en Netlify
En el panel de Netlify, configurar:
- `FIREBASE_PROJECT_ID` = glambook-ac3dd
- `FIREBASE_API_KEY` = [tu API key]
- `NODE_ENV` = production

### 🔒 4. SEGURIDAD ADICIONAL

#### A. HTTPS Obligatorio
```javascript
// Forzar HTTPS en producción
if (import.meta.env.PROD && location.protocol !== 'https:') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

#### B. Validación de Entrada
```javascript
// Validar datos en el servidor
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validar campos obligatorios
    if (!body.email || !body.nombre) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Campos obligatorios faltantes'
      }), { status: 400 });
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email inválido'
      }), { status: 400 });
    }
    
    // Continuar con la lógica...
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Error del servidor'
    }), { status: 500 });
  }
};
```

### 📊 5. MONITOREO Y LOGS

#### A. Error Logging
```javascript
// src/utils/logger.js
export class Logger {
  static error(message, error = null) {
    if (import.meta.env.PROD) {
      // Enviar a servicio de monitoreo (ej: Sentry)
      console.error('[PROD ERROR]:', message, error);
    } else {
      console.error('[DEV ERROR]:', message, error);
    }
  }
  
  static info(message, data = null) {
    if (!import.meta.env.PROD) {
      console.log('[INFO]:', message, data);
    }
  }
}
```

## 🎯 PASOS INMEDIATOS PARA PRODUCCIÓN

### 1. **Firebase Console (AHORA MISMO)**
- Ir a Firebase Console > Firestore > Reglas
- Reemplazar reglas actuales con las reglas seguras de arriba
- Publicar cambios

### 2. **Código (ANTES DE DEPLOY)**
- Remover `firebaseDevBypass.js` imports del código
- Configurar variables de entorno
- Probar localmente con `npm run build`

### 3. **Testing (OBLIGATORIO)**
- Probar autenticación real (sin bypass)
- Verificar que solo admins pueden gestionar usuarios
- Confirmar que las reglas de seguridad funcionan

### 4. **Deployment**
- Configurar Netlify con variables de entorno
- Deploy y verificar funcionalidad completa

## ⚠️ ADVERTENCIAS CRÍTICAS

1. **NO hacer deploy con reglas permisivas actuales**
2. **SIEMPRE probar en staging antes de producción**
3. **Configurar backup de Firestore antes del deploy**
4. **Monitorear logs después del deploy**

---

¿Quieres que empiece implementando estos cambios paso a paso?