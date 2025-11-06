#!/usr/bin/env node

/**
 * Script de Verificación de Seguridad - Prestige Barbers
 * Verifica que todas las medidas de seguridad estén implementadas correctamente
 */

const https = require('https');
const http = require('http');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

console.log('🔐 VERIFICACIÓN DE SEGURIDAD - PRESTIGE BARBERS');
console.log('================================================\n');

// Lista de verificación
const checks = {
    headers: {
        name: 'Headers de Seguridad',
        tests: [
            { header: 'x-frame-options', expected: 'DENY', critical: true },
            { header: 'x-content-type-options', expected: 'nosniff', critical: true },
            { header: 'x-xss-protection', expected: '1; mode=block', critical: true },
            { header: 'strict-transport-security', expected: 'max-age=', critical: false },
            { header: 'content-security-policy', expected: 'default-src', critical: true },
            { header: 'referrer-policy', expected: 'strict-origin', critical: false },
            { header: 'permissions-policy', expected: 'geolocation=', critical: false }
        ]
    },
    missingHeaders: {
        name: 'Headers que NO deben estar presentes',
        tests: [
            { header: 'x-powered-by', shouldNotExist: true, critical: true },
            { header: 'server', shouldNotExist: false, critical: false }
        ]
    }
};

let passedTests = 0;
let failedTests = 0;
let criticalFailures = 0;

// Función para hacer request y verificar headers
function checkSecurity() {
    const protocol = SERVER_URL.startsWith('https') ? https : http;
    
    console.log(`📡 Conectando a: ${SERVER_URL}\n`);
    
    protocol.get(SERVER_URL, (res) => {
        console.log('✅ Conexión establecida\n');
        console.log('═══════════════════════════════════════════════════\n');
        
        // Verificar headers de seguridad
        console.log('🔍 VERIFICANDO HEADERS DE SEGURIDAD:\n');
        checks.headers.tests.forEach(test => {
            const headerValue = res.headers[test.header];
            const passed = headerValue && headerValue.includes(test.expected);
            
            if (passed) {
                console.log(`✅ ${test.header}: ${headerValue}`);
                passedTests++;
            } else {
                const icon = test.critical ? '🔴' : '🟡';
                console.log(`${icon} ${test.header}: ${headerValue || 'NO PRESENTE'} (esperado: ${test.expected})`);
                failedTests++;
                if (test.critical) criticalFailures++;
            }
        });
        
        console.log('\n═══════════════════════════════════════════════════\n');
        
        // Verificar headers que NO deben estar
        console.log('🔍 VERIFICANDO HEADERS QUE NO DEBEN ESTAR:\n');
        checks.missingHeaders.tests.forEach(test => {
            const headerValue = res.headers[test.header];
            const passed = !headerValue;
            
            if (passed) {
                console.log(`✅ ${test.header}: Correctamente ausente`);
                passedTests++;
            } else {
                const icon = test.critical ? '🔴' : '🟡';
                console.log(`${icon} ${test.header}: ${headerValue} (NO debería estar presente)`);
                failedTests++;
                if (test.critical) criticalFailures++;
            }
        });
        
        console.log('\n═══════════════════════════════════════════════════\n');
        
        // Resumen
        console.log('📊 RESUMEN DE VERIFICACIÓN:\n');
        console.log(`✅ Pruebas Pasadas: ${passedTests}`);
        console.log(`❌ Pruebas Fallidas: ${failedTests}`);
        console.log(`🔴 Fallos Críticos: ${criticalFailures}`);
        
        const percentage = ((passedTests / (passedTests + failedTests)) * 100).toFixed(1);
        console.log(`\n📈 Score de Seguridad: ${percentage}%`);
        
        console.log('\n═══════════════════════════════════════════════════\n');
        
        if (criticalFailures > 0) {
            console.log('🔴 CRÍTICO: Hay fallos de seguridad críticos que deben corregirse');
            console.log('   Revisa el archivo INFORME-SEGURIDAD-COMPLETO.md para más detalles\n');
            process.exit(1);
        } else if (failedTests > 0) {
            console.log('🟡 ADVERTENCIA: Hay algunas mejoras de seguridad recomendadas');
            console.log('   Revisa el archivo INFORME-SEGURIDAD-COMPLETO.md para más detalles\n');
            process.exit(0);
        } else {
            console.log('🎉 EXCELENTE: Todas las verificaciones de seguridad pasaron');
            console.log('   Tu aplicación está correctamente protegida\n');
            process.exit(0);
        }
        
    }).on('error', (err) => {
        console.error('❌ Error al conectar al servidor:', err.message);
        console.log('\n💡 Asegúrate de que el servidor esté corriendo:');
        console.log('   cd Backend && npm start\n');
        process.exit(1);
    });
}

// Ejecutar verificación
checkSecurity();
