# 🚀 Guía de Deploy en Netlify - GlamBook Studio

## 📋 Pre-requisitos
- Cuenta de Netlify conectada al repositorio GitHub
- Variables de entorno configuradas

## 🔧 Configuración de Variables de Entorno en Netlify

### 1. Acceder al Panel de Netlify
1. Ve a tu sitio en Netlify
2. Navega a: **Site settings > Environment variables**

### 2. Configurar Variables Requeridas
Agrega las siguientes variables de entorno:

```
GMAIL_APP_PASSWORD = islj xbmx bpzl ocpt
BUSINESS_EMAIL = jadermonsalve9@gmail.com
BUSINESS_PHONE = +57 300 699 7396
BUSINESS_ADDRESS = Medellín, Colombia
NODE_ENV = production
```

### 3. Variables de Firebase (Si no están configuradas)
```
FIREBASE_API_KEY = tu_api_key_aqui
FIREBASE_AUTH_DOMAIN = glambook-ac3dd.firebaseapp.com
FIREBASE_PROJECT_ID = glambook-ac3dd
```

## 🌐 URLs del Sistema Desplegado

### Páginas Principales
- **Inicio:** `https://tu-sitio.netlify.app/`
- **Panel Admin:** `https://tu-sitio.netlify.app/admin`
- **Login:** `https://tu-sitio.netlify.app/login`
- **Contacto:** `https://tu-sitio.netlify.app/contact`

### Páginas Legales
- **Términos:** `https://tu-sitio.netlify.app/terminos`
- **Privacidad:** `https://tu-sitio.netlify.app/privacidad`
- **Aviso Legal:** `https://tu-sitio.netlify.app/aviso-legal`
- **Cookies:** `https://tu-sitio.netlify.app/cookies`

### APIs Disponibles
- **Testimonios:** `https://tu-sitio.netlify.app/api/testimonios`
- **Citas:** `https://tu-sitio.netlify.app/api/citas`
- **Emails:** `https://tu-sitio.netlify.app/api/emails`

## 📧 Sistema de Emails en Producción

### Configuración Gmail
- **Email:** jadermonsalve9@gmail.com
- **App Password:** Configurada en variables de entorno
- **Estado:** ✅ Listo para producción

### Funcionalidades de Email
- ✅ Confirmación de citas automática
- ✅ Recordatorios de citas
- ✅ Notificaciones al administrador
- ✅ Templates profesionales HTML

## 🔐 Panel de Administración

### Acceso
- **URL:** `https://tu-sitio.netlify.app/admin`
- **Usuario:** jadermonsalve9@gmail.com
- **Rol:** Super Admin

### Funcionalidades
- ✅ Gestión de testimonios
- ✅ Administración de citas
- ✅ Envío de emails
- ✅ Estadísticas del negocio

## 🏗️ Proceso de Deploy Automático

### Trigger de Deploy
El deploy se activa automáticamente cuando:
1. Se hace push a la rama `master`
2. Netlify detecta cambios en el repositorio
3. Se ejecuta el build automáticamente

### Comandos de Build
```bash
npm install
npm run build
```

### Estructura de Deploy
```
dist/
├── index.html
├── admin/
├── api/
├── assets/
└── _astro/
```

## 🔍 Verificación Post-Deploy

### Checklist
- [ ] Sitio principal carga correctamente
- [ ] Panel de admin accesible
- [ ] Sistema de login funcional
- [ ] APIs responden correctamente
- [ ] Emails se envían exitosamente
- [ ] Páginas legales visibles
- [ ] Testimonios dinámicos funcionan
- [ ] Sistema de citas operativo

### URLs de Prueba
1. **Homepage:** Verificar testimonios y formulario de contacto
2. **Admin Panel:** Probar login y gestión
3. **API Test:** `GET /api/testimonios?action=aprobados`
4. **Email Test:** Crear una cita de prueba

## 🐛 Troubleshooting

### Problemas Comunes
1. **Error 404 en APIs:** Verificar configuración de redirects en netlify.toml
2. **Emails no se envían:** Verificar variables de entorno Gmail
3. **Login no funciona:** Verificar configuración Firebase
4. **Estilos rotos:** Verificar build de Tailwind CSS

### Logs de Deploy
Revisar en Netlify: **Deploys > Ver logs de build**

## 📱 Responsive & Performance

### Optimizaciones Incluidas
- ✅ Responsive design para todos los dispositivos
- ✅ Imágenes optimizadas
- ✅ CSS minificado
- ✅ JavaScript optimizado
- ✅ SEO optimizado

## 🎯 Próximos Pasos

### Configuraciones Adicionales
1. Configurar dominio personalizado
2. Configurar SSL/HTTPS
3. Configurar analytics
4. Configurar monitoreo

---

**Desarrollado por M-Technology para GlamBook Studio**