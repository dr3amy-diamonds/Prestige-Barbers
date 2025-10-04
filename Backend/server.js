// 💡 LÍNEA CORREGIDA: Requiere el módulo 'mysql'
const mysql = require('mysql');

// MySQL conexión
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Barberia'
});

db.connect(err => {
    if (err) throw err;
    console.log("🟢 Conectado a MySQL");
});

