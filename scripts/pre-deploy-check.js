// Script de verificación pre-despliegue
// scripts/pre-deploy-check.js

import MonitoringService from '../src/utils/monitoring.js';
import SecurityValidator from '../src/utils/security.js';

console.log('🔍 VERIFICACIÓN PRE-DESPLIEGUE - GLAMBOOK');
console.log('=========================================');

// Verificar configuración de entorno
function checkEnvironmentConfig() {
  console.log('\n📋 1. Verificando configuración de entorno...');
  
  const requiredEnvVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
  ];
  
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Variables de entorno faltantes:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    return false;
  }
  
  console.log('✅ Todas las variables de entorno están configuradas');
  return true;
}

// Verificar archivos críticos
function checkCriticalFiles() {
  console.log('\n📂 2. Verificando archivos críticos...');
  
  const criticalFiles = [
    'src/firebase.js',
    'src/utils/security.js',
    'src/utils/monitoring.js',
    'firestore-production.rules',
    '.env.prod',
    'src/services/usuariosService.js'
  ];
  
  const fs = require('fs');
  const missing = criticalFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    console.error('❌ Archivos críticos faltantes:');
    missing.forEach(file => console.error(`   - ${file}`));
    return false;
  }
  
  console.log('✅ Todos los archivos críticos están presentes');
  return true;
}

// Verificar reglas de seguridad
function checkSecurityRules() {
  console.log('\n🛡️ 3. Verificando reglas de seguridad...');
  
  try {
    const fs = require('fs');
    const rulesContent = fs.readFileSync('firestore-production.rules', 'utf8');
    
    // Verificar que las reglas no sean permisivas
    if (rulesContent.includes('allow read, write: if true')) {
      console.error('❌ Las reglas de Firestore son demasiado permisivas');
      return false;
    }
    
    // Verificar que requieran autenticación
    if (!rulesContent.includes('request.auth != null')) {
      console.error('❌ Las reglas no requieren autenticación');
      return false;
    }
    
    console.log('✅ Reglas de seguridad configuradas correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al leer reglas de seguridad:', error.message);
    return false;
  }
}

// Verificar configuración de Firebase
function checkFirebaseConfig() {
  console.log('\n🔥 4. Verificando configuración de Firebase...');
  
  try {
    const fs = require('fs');
    const firebaseContent = fs.readFileSync('src/firebase.js', 'utf8');
    
    // Verificar que use variables de entorno
    if (!firebaseContent.includes('import.meta.env')) {
      console.error('❌ Firebase no usa variables de entorno');
      return false;
    }
    
    // Verificar que no tenga claves hardcoded en producción
    const hardcodedKeys = firebaseContent.match(/apiKey:\s*["']AIza[^"']+["']/g);
    if (hardcodedKeys && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Posibles claves hardcoded detectadas');
    }
    
    console.log('✅ Configuración de Firebase correcta');
    return true;
  } catch (error) {
    console.error('❌ Error al verificar Firebase:', error.message);
    return false;
  }
}

// Verificar sistema de autenticación
function checkAuthSystem() {
  console.log('\n🔐 5. Verificando sistema de autenticación...');
  
  try {
    const fs = require('fs');
    const authContent = fs.readFileSync('src/services/usuariosService.js', 'utf8');
    
    // Verificar que tenga verificación de producción
    if (!authContent.includes('import.meta.env.PROD')) {
      console.error('❌ Sistema de auth no diferencia producción/desarrollo');
      return false;
    }
    
    // Verificar que no permita bypass en producción
    if (authContent.includes('// BYPASS') && !authContent.includes('!import.meta.env.PROD')) {
      console.error('❌ Sistema de auth tiene bypass habilitado para producción');
      return false;
    }
    
    console.log('✅ Sistema de autenticación configurado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al verificar sistema de auth:', error.message);
    return false;
  }
}

// Verificar dependencias de producción
function checkProductionDependencies() {
  console.log('\n📦 6. Verificando dependencias de producción...');
  
  try {
    const fs = require('fs');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const criticalDeps = [
      'firebase',
      'astro'
    ];
    
    const missing = criticalDeps.filter(dep => 
      !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
    );
    
    if (missing.length > 0) {
      console.error('❌ Dependencias críticas faltantes:');
      missing.forEach(dep => console.error(`   - ${dep}`));
      return false;
    }
    
    console.log('✅ Todas las dependencias críticas están presentes');
    return true;
  } catch (error) {
    console.error('❌ Error al verificar dependencias:', error.message);
    return false;
  }
}

// Generar checklist de despliegue
function generateDeploymentChecklist() {
  console.log('\n📋 CHECKLIST DE DESPLIEGUE');
  console.log('===========================');
  
  const checklist = [
    '□ Aplicar reglas de seguridad de Firestore (firestore-production.rules)',
    '□ Configurar variables de entorno en hosting (.env.prod)',
    '□ Habilitar autenticación Email/Password en Firebase Console',
    '□ Configurar dominio personalizado en Firebase Auth',
    '□ Configurar SMTP para emails (si aplica)',
    '□ Hacer backup de datos existentes',
    '□ Probar funcionalidad crítica en staging',
    '□ Configurar monitoreo de errores',
    '□ Verificar certificados SSL',
    '□ Configurar Analytics (si aplica)'
  ];
  
  checklist.forEach(item => console.log(item));
  
  console.log('\n🚀 COMANDOS DE DESPLIEGUE:');
  console.log('1. npm run build');
  console.log('2. Subir build a hosting');
  console.log('3. Configurar variables de entorno');
  console.log('4. Aplicar reglas de Firestore');
  console.log('5. Probar en producción');
}

// Ejecutar todas las verificaciones
async function runPreDeployCheck() {
  console.log('Iniciando verificación pre-despliegue...\n');
  
  const checks = [
    checkEnvironmentConfig,
    checkCriticalFiles,
    checkSecurityRules,
    checkFirebaseConfig,
    checkAuthSystem,
    checkProductionDependencies
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const result = check();
    if (!result) {
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 ¡TODAS LAS VERIFICACIONES PASARON!');
    console.log('✅ El proyecto está listo para despliegue');
    generateDeploymentChecklist();
  } else {
    console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
    console.log('🔧 Por favor, corrige los errores antes de desplegar');
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runPreDeployCheck();
}

export { runPreDeployCheck };