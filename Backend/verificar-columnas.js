const mysql = require('mysql2');

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Barberia'
});

// Conectar y verificar estructura de la tabla
db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err);
        return;
    }
    console.log('✅ Conectado a la base de datos\n');

    // Mostrar estructura de la tabla usuarios
    db.query('DESCRIBE usuarios', (err, results) => {
        if (err) {
            console.error('❌ Error al obtener estructura:', err);
            db.end();
            return;
        }

        console.log('📋 Estructura de la tabla "usuarios":');
        console.log('=====================================');
        console.table(results);
        console.log('=====================================\n');

        // Ahora consultar el usuario admin con todas sus columnas
        db.query('SELECT * FROM usuarios WHERE email = ?', ['admin'], (err, results) => {
            if (err) {
                console.error('❌ Error al consultar admin:', err);
                db.end();
                return;
            }

            if (results.length === 0) {
                console.log('❌ No se encontró usuario admin');
            } else {
                console.log('👤 Datos completos del usuario admin:');
                console.log('======================================');
                console.log(results[0]);
                console.log('======================================\n');
                
                console.log('🔍 Campos disponibles:', Object.keys(results[0]));
                console.log('🔍 Campo "rol":', results[0].rol);
            }

            db.end();
        });
    });
});
