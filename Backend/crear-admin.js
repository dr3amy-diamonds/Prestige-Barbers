// Script para generar el hash de la contraseña 'admin' y crear el usuario admin
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function crearUsuarioAdmin() {
    try {
        // 1. Generar hash de la contraseña
        const password = 'admin';
        const hash = await bcrypt.hash(password, 10);
        console.log('✅ Hash generado para contraseña "admin":', hash);

        // 2. Conectar a la base de datos
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'Barberia'
        });
        console.log('✅ Conectado a MySQL');

        // 3. Verificar si la columna 'rol' existe
        try {
            await connection.query(`
                ALTER TABLE usuarios 
                ADD COLUMN rol ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario' AFTER email
            `);
            console.log('✅ Columna "rol" agregada a la tabla usuarios');
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️  Columna "rol" ya existe');
            } else {
                throw error;
            }
        }

        // 4. Verificar si el usuario admin ya existe
        const [existingAdmin] = await connection.query(
            'SELECT * FROM usuarios WHERE email = ?',
            ['admin']
        );

        if (existingAdmin.length > 0) {
            console.log('⚠️  El usuario admin ya existe. Actualizando...');
            await connection.query(
                'UPDATE usuarios SET password_hash = ?, rol = ?, activo = 1 WHERE email = ?',
                [hash, 'admin', 'admin']
            );
            console.log('✅ Usuario admin actualizado');
        } else {
            // 5. Insertar usuario admin
            await connection.query(`
                INSERT INTO usuarios (nombre_completo, email, rol, password_hash, activo)
                VALUES (?, ?, ?, ?, ?)
            `, ['Administrador', 'admin', 'admin', hash, 1]);
            console.log('✅ Usuario admin creado exitosamente');
        }

        // 6. Mostrar información del admin
        const [admin] = await connection.query(
            'SELECT id, nombre_completo, email, rol, activo FROM usuarios WHERE email = ?',
            ['admin']
        );
        console.log('\n📋 Información del usuario admin:');
        console.log('   ID:', admin[0].id);
        console.log('   Nombre:', admin[0].nombre_completo);
        console.log('   Email:', admin[0].email);
        console.log('   Rol:', admin[0].rol);
        console.log('   Activo:', admin[0].activo);

        console.log('\n🔐 Credenciales de acceso:');
        console.log('   Email: admin');
        console.log('   Contraseña: admin');

        await connection.end();
        console.log('\n✅ Proceso completado exitosamente');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar
crearUsuarioAdmin();
