const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000; 

app.use(express.static(path.join(__dirname, '..', 'Frontend', 'public')));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Barberia'
});

db.connect(err => {
    if (err) {
        console.error('🔴 Error al conectar a MySQL:', err);
        return;
    }
    console.log("🟢 Conectado a MySQL");
});


app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});