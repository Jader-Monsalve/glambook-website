# 📧 Configuración de Gmail para GlamBook

## Pasos para configurar Gmail con contraseña de aplicación:

### 1. Habilitar autenticación de 2 factores en Gmail
- Ve a tu cuenta de Google: https://myaccount.google.com/
- Selecciona "Seguridad" en el menú lateral
- En "Acceso a Google", habilita la "Verificación en 2 pasos"

### 2. Crear contraseña de aplicación
- Una vez habilitada la verificación en 2 pasos
- Ve a "Contraseñas de aplicaciones" (App passwords)
- Selecciona "Aplicación personalizada" y ponle un nombre como "GlamBook"
- Copia la contraseña generada (16 caracteres)

### 3. Configurar en tu proyecto
- Crea un archivo `.env` en la raíz del proyecto
- Agrega la línea: `GMAIL_APP_PASSWORD=tu_contraseña_de_16_caracteres`
- Guarda el archivo

### 4. Reiniciar el servidor
- Para que las variables de entorno se carguen correctamente
- Ejecuta: `npm run dev`

## Ejemplo del archivo .env:
```
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
BUSINESS_EMAIL=jadermonsalve9@gmail.com
NODE_ENV=production
```

## ⚠️ Importante:
- **NUNCA** subas el archivo `.env` a GitHub
- El archivo `.env.example` es solo una plantilla
- La contraseña de app es específica para esta aplicación
- Si cambias la contraseña de Gmail, debes generar una nueva contraseña de app

## 🧪 Modo de prueba:
Si no configuras la contraseña de Gmail, el sistema usará Ethereal Email (emails de prueba) y te mostrará URLs para ver los emails enviados en la consola.

## 📞 Soporte:
Si tienes problemas con la configuración, revisa los logs del servidor para ver mensajes de error específicos.