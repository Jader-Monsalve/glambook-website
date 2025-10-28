#!/usr/bin/env node
// Ejecutar verificaciones finales antes del despliegue
// Node.js ES module script - scripts/final-check.js

import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICACIÓN FINAL DEL SISTEMA GLAMBOOK');
console.log('==========================================\n');

let errorsFound = 0;
let warningsFound = 0;

// Función helper para logging
function logError(message) {
    console.error('❌ ERROR:', message);
    errorsFound++;
}

function logWarning(message) {
    console.warn('⚠️  WARNING:', message);
    warningsFound++;
}

function logSuccess(message) {
    console.log('✅', message);
}

// 1. Verificar estructura de archivos críticos
function checkFileStructure() {
    console.log('📂 1. Verificando estructura de archivos...');
    
    const criticalFiles = [
        'src/firebase.js',
        'src/utils/security.js',
        'src/utils/monitoring.js',
        'src/services/usuariosService.js',
        'firestore-production.rules',
        '.env.prod',
        'DEPLOY_PRODUCTION_GUIDE.md'
    ];
    
    criticalFiles.forEach(file => {
        if (fs.existsSync(file)) {
            logSuccess(`${file} existe`);
        } else {
            logError(`${file} no encontrado`);
        }
    });
}

// 2. Verificar configuración de Firebase
function checkFirebaseConfig() {
    console.log('\n🔥 2. Verificando configuración de Firebase...');
    
    try {
        const firebaseContent = fs.readFileSync('src/firebase.js', 'utf8');
        
        // Verificar uso de variables de entorno
        if (firebaseContent.includes('import.meta.env.FIREBASE_API_KEY')) {
            logSuccess('Firebase usa variables de entorno');
        } else {
            logError('Firebase no configurado para variables de entorno');
        }
        
        // Verificar que tiene fallbacks
        if (firebaseContent.includes('||') && firebaseContent.includes('API_KEY')) {
            logSuccess('Firebase tiene fallbacks de desarrollo');
        } else {
            logWarning('Firebase podría no tener fallbacks apropiados');
        }
        
        // Verificar importaciones de seguridad
        if (firebaseContent.includes('Analytics')) {
            logSuccess('Analytics configurado');
        } else {
            logWarning('Analytics no detectado');
        }
        
    } catch (error) {
        logError(`No se pudo leer firebase.js: ${error.message}`);
    }
}

// 3. Verificar reglas de seguridad
function checkSecurityRules() {
    console.log('\n🛡️ 3. Verificando reglas de seguridad...');
    
    try {
        const rulesContent = fs.readFileSync('firestore-production.rules', 'utf8');
        
        // Verificar que no sean permisivas
        if (rulesContent.includes('allow read, write: if true;')) {
            logError('Reglas de Firestore son permisivas (desarrollo)');
        } else {
            logSuccess('Reglas de Firestore no son permisivas');
        }
        
        // Verificar autenticación requerida
        if (rulesContent.includes('request.auth != null')) {
            logSuccess('Reglas requieren autenticación');
        } else {
            logError('Reglas no requieren autenticación');
        }
        
        // Verificar roles de admin
        if (rulesContent.includes('isAdmin')) {
            logSuccess('Reglas incluyen verificación de admin');
        } else {
            logWarning('Reglas podrían no tener verificación de admin');
        }
        
        // Verificar colecciones protegidas
        const collections = ['usuarios', 'citas', 'testimonios'];
        collections.forEach(collection => {
            if (rulesContent.includes(`match /${collection}/{`)) {
                logSuccess(`Colección '${collection}' tiene reglas específicas`);
            } else {
                logWarning(`Colección '${collection}' podría no tener reglas`);
            }
        });
        
    } catch (error) {
        logError(`No se pudo leer firestore-production.rules: ${error.message}`);
    }
}

// 4. Verificar servicio de usuarios
function checkUserService() {
    console.log('\n👥 4. Verificando servicio de usuarios...');
    
    try {
        const serviceContent = fs.readFileSync('src/services/usuariosService.js', 'utf8');
        
        // Verificar importación de SecurityValidator
        if (serviceContent.includes('import SecurityValidator')) {
            logSuccess('SecurityValidator importado');
        } else {
            logError('SecurityValidator no importado');
        }
        
        // Verificar importación de MonitoringService
        if (serviceContent.includes('import MonitoringService')) {
            logSuccess('MonitoringService importado');
        } else {
            logWarning('MonitoringService no importado');
        }
        
        // Verificar validación de datos
        if (serviceContent.includes('validateUserData')) {
            logSuccess('Validación de datos implementada');
        } else {
            logError('Validación de datos no implementada');
        }
        
        // Verificar logs de seguridad
        if (serviceContent.includes('logSecurityEvent')) {
            logSuccess('Logs de seguridad implementados');
        } else {
            logWarning('Logs de seguridad no implementados');
        }
        
        // Verificar verificación de permisos
        if (serviceContent.includes('checkUserPermissions') || serviceContent.includes('isAdmin')) {
            logSuccess('Verificación de permisos implementada');
        } else {
            logWarning('Verificación de permisos no detectada');
        }
        
    } catch (error) {
        logError(`No se pudo leer usuariosService.js: ${error.message}`);
    }
}

// 5. Verificar archivo de entorno de producción
function checkProductionEnv() {
    console.log('\n⚙️ 5. Verificando configuración de producción...');
    
    try {
        const envContent = fs.readFileSync('.env.prod', 'utf8');
        
        const requiredVars = [
            'FIREBASE_API_KEY',
            'FIREBASE_AUTH_DOMAIN', 
            'FIREBASE_PROJECT_ID',
            'FIREBASE_STORAGE_BUCKET',
            'FIREBASE_MESSAGING_SENDER_ID',
            'FIREBASE_APP_ID',
            'ADMIN_EMAIL'
        ];
        
        requiredVars.forEach(varName => {
            if (envContent.includes(varName)) {
                logSuccess(`Variable ${varName} configurada`);
            } else {
                logError(`Variable ${varName} no encontrada`);
            }
        });
        
        // Verificar que no tenga valores placeholder
        if (envContent.includes('tu_') || envContent.includes('your_')) {
            logWarning('Posibles valores placeholder detectados en .env.prod');
        }
        
    } catch (error) {
        logError(`No se pudo leer .env.prod: ${error.message}`);
    }
}

// 6. Verificar package.json
function checkPackageJson() {
    console.log('\n📦 6. Verificando package.json...');
    
    try {
        const packageContent = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        // Verificar dependencias críticas
        const criticalDeps = ['firebase', 'astro'];
        criticalDeps.forEach(dep => {
            if (packageContent.dependencies[dep] || packageContent.devDependencies[dep]) {
                logSuccess(`Dependencia '${dep}' encontrada`);
            } else {
                logError(`Dependencia crítica '${dep}' no encontrada`);
            }
        });
        
        // Verificar scripts de build
        if (packageContent.scripts && packageContent.scripts.build) {
            logSuccess('Script de build configurado');
        } else {
            logError('Script de build no encontrado');
        }
        
        // Verificar versión de Node
        if (packageContent.engines && packageContent.engines.node) {
            logSuccess(`Versión de Node especificada: ${packageContent.engines.node}`);
        } else {
            logWarning('Versión de Node no especificada en engines');
        }
        
    } catch (error) {
        logError(`No se pudo leer package.json: ${error.message}`);
    }
}

// 7. Verificar guías de documentación
function checkDocumentation() {
    console.log('\n📚 7. Verificando documentación...');
    
    const docs = [
        'DEPLOY_PRODUCTION_GUIDE.md',
        'README.md'
    ];
    
    docs.forEach(doc => {
        if (fs.existsSync(doc)) {
            logSuccess(`Documentación ${doc} existe`);
            
            try {
                const content = fs.readFileSync(doc, 'utf8');
                if (content.length > 100) {
                    logSuccess(`${doc} tiene contenido sustancial`);
                } else {
                    logWarning(`${doc} parece tener poco contenido`);
                }
            } catch (error) {
                logWarning(`No se pudo verificar contenido de ${doc}`);
            }
        } else {
            logWarning(`Documentación ${doc} no encontrada`);
        }
    });
}

// Ejecutar todas las verificaciones
function runAllChecks() {
    checkFileStructure();
    checkFirebaseConfig();
    checkSecurityRules();
    checkUserService();
    checkProductionEnv();
    checkPackageJson();
    checkDocumentation();
    
    // Resumen final
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE VERIFICACIÓN');
    console.log('='.repeat(50));
    
    if (errorsFound === 0 && warningsFound === 0) {
        console.log('🎉 ¡PERFECTO! El sistema está completamente listo para producción.');
        console.log('✨ No se encontraron errores ni advertencias.');
    } else if (errorsFound === 0) {
        console.log(`🟡 LISTO CON ADVERTENCIAS: ${warningsFound} advertencia(s) encontrada(s).`);
        console.log('⚠️  Revisa las advertencias pero el despliegue puede proceder.');
    } else {
        console.log(`🔴 NO LISTO: ${errorsFound} error(es) crítico(s) encontrado(s).`);
        console.log('❌ Debes corregir los errores antes del despliegue.');
        
        if (warningsFound > 0) {
            console.log(`⚠️  También hay ${warningsFound} advertencia(s).`);
        }
    }
    
    console.log('\n📋 PRÓXIMOS PASOS:');
    if (errorsFound === 0) {
        console.log('1. 🔥 Aplicar reglas de Firestore en Firebase Console');
        console.log('2. ⚙️  Configurar variables de entorno en hosting');
        console.log('3. 🚀 Ejecutar build y desplegar');
        console.log('4. 🧪 Probar funcionalidad en producción');
    } else {
        console.log('1. 🔧 Corregir errores críticos mostrados arriba');
        console.log('2. 🔄 Ejecutar esta verificación nuevamente');
        console.log('3. 📖 Revisar DEPLOY_PRODUCTION_GUIDE.md');
    }
    
    // Exit code para CI/CD
    process.exit(errorsFound > 0 ? 1 : 0);
}

// Ejecutar verificaciones
runAllChecks();