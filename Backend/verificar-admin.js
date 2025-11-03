const mysql = require('mysql2');

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Barberia'
});

// Conectar y verificar usuario admin
db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err);
        return;
    }
    console.log('✅ Conectado a la base de datos');

    // Consultar el usuario admin
    db.query('SELECT id, email, nombre_completo, rol, activo FROM usuarios WHERE email = ?', ['admin'], (err, results) => {
        if (err) {
            console.error('❌ Error en la consulta:', err);
            db.end();
            return;
        }

        if (results.length === 0) {
            console.log('❌ No se encontró usuario con email "admin"');
        } else {
            console.log('\n📋 Datos del usuario admin:');
            console.log('================================');
            console.table(results);
            console.log('================================\n');
        }

        db.end();
    });
});
