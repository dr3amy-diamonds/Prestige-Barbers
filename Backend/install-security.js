#!/usr/bin/env node

/**
 * Script de Instalación de Seguridad - Prestige Barbers
 * Instala todas las dependencias de seguridad y configura el entorno
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔐 INSTALACIÓN DE SEGURIDAD - PRESTIGE BARBERS');
console.log('================================================\n');

// Paso 1: Instalar dependencias
console.log('📦 Paso 1: Instalando dependencias de seguridad...\n');
try {
    execSync('npm install helmet cors express-rate-limit express-validator winston dotenv', { stdio: 'inherit' });
    console.log('\n✅ Dependencias instaladas correctamente\n');
} catch (error) {
    console.error('❌ Error al instalar dependencias:', error.message);
    process.exit(1);
}

// Paso 2: Crear archivo .env si no existe
console.log('📝 Paso 2: Configurando archivo .env...\n');
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
        // Generar JWT secret fuerte
        const jwtSecret = crypto.randomBytes(64).toString('hex');
        
        // Leer .env.example
        let envContent = fs.readFileSync(envExamplePath, 'utf8');
        
        // Reemplazar el JWT_SECRET con uno generado
        envContent = envContent.replace(
            'JWT_SECRET=prestige_barbers_secret_key_2025_CHANGE_IN_PRODUCTION_WITH_STRONG_RANDOM_KEY',
            `JWT_SECRET=${jwtSecret}`
        );
        
        // Escribir .env
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Archivo .env creado con JWT_SECRET seguro');
        console.log(`   JWT_SECRET generado: ${jwtSecret.substring(0, 20)}...`);
    } else {
        console.log('⚠️  .env.example no encontrado, creando .env básico...');
        
        const jwtSecret = crypto.randomBytes(64).toString('hex');
        const envContent = `
# Generado automáticamente por install-security.js
NODE_ENV=development
PORT=3000
JWT_SECRET=${jwtSecret}
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=Barberia
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
        `.trim();
        
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Archivo .env básico creado');
    }
} else {
    console.log('ℹ️  Archivo .env ya existe, no se modificará');
    console.log('   Si deseas regenerar el JWT_SECRET, elimina .env y vuelve a ejecutar este script');
}

console.log('');

// Paso 3: Crear carpeta de logs
console.log('📁 Paso 3: Creando carpeta de logs...\n');
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
    console.log('✅ Carpeta logs/ creada');
} else {
    console.log('ℹ️  Carpeta logs/ ya existe');
}

// Crear .gitkeep en logs
fs.writeFileSync(path.join(logsDir, '.gitkeep'), '');

// Crear .gitkeep en uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
    fs.writeFileSync(path.join(uploadsDir, '.gitkeep'), '');
}

console.log('');

// Paso 4: Verificar .gitignore
console.log('🔒 Paso 4: Verificando .gitignore...\n');
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
    let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    
    const requiredEntries = ['.env', 'logs/', '*.log', 'node_modules/'];
    let modified = false;
    
    requiredEntries.forEach(entry => {
        if (!gitignoreContent.includes(entry)) {
            gitignoreContent += `\n${entry}`;
            modified = true;
        }
    });
    
    if (modified) {
        fs.writeFileSync(gitignorePath, gitignoreContent);
        console.log('✅ .gitignore actualizado con entradas de seguridad');
    } else {
        console.log('ℹ️  .gitignore ya contiene las entradas necesarias');
    }
} else {
    console.log('⚠️  .gitignore no encontrado, creando...');
    const gitignoreContent = `
# Dependencias
node_modules/

# Variables de entorno - NUNCA subir
.env

# Logs
logs/
*.log

# Uploads (opcional)
uploads/
!uploads/.gitkeep
    `.trim();
    
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log('✅ .gitignore creado');
}

console.log('');

// Paso 5: Resumen
console.log('═══════════════════════════════════════════════════');
console.log('✅ INSTALACIÓN COMPLETADA CON ÉXITO');
console.log('═══════════════════════════════════════════════════\n');

console.log('📋 Siguientes pasos:\n');
console.log('1. Revisa el archivo .env y ajusta los valores según tu entorno');
console.log('2. Inicia el servidor: npm start');
console.log('3. Verifica la seguridad: node verificar-seguridad.js');
console.log('4. Lee INFORME-SEGURIDAD-COMPLETO.md para más detalles\n');

console.log('⚠️  IMPORTANTE en producción:');
console.log('   - Cambia DB_PASSWORD con una contraseña fuerte');
console.log('   - Actualiza ALLOWED_ORIGINS con tu dominio real');
console.log('   - Establece NODE_ENV=production');
console.log('   - Habilita HTTPS/SSL\n');

console.log('🎉 ¡Tu aplicación ahora está protegida con las mejores prácticas de seguridad!\n');
