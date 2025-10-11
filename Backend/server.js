const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

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


app.get('/api/cortes', (req, res) => {
    db.query('SELECT * FROM cortes_destacados ORDER BY id ASC LIMIT 7', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching featured cuts');
            return;
        }
        res.json(results);
    });
});

app.post('/api/cortes', upload.single('image'), (req, res) => {
    const { name, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !image_url) {
        return res.status(400).send('Name and image are required');
    }
    const query = 'INSERT INTO cortes_destacados (name, description, image_url) VALUES (?, ?, ?)';
    db.query(query, [name, description, image_url], (err, result) => {
        if (err) {
            res.status(500).send('Error adding new cut');
            return;
        }
        res.status(201).send({ id: result.insertId, name, description, image_url });
    });
});

app.put('/api/cortes/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    let imageUrl;

    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    } else {
        imageUrl = req.body.image_url;
    }

    if (!name) {
        return res.status(400).send('Name is required');
    }

    const query = 'UPDATE cortes_destacados SET name = ?, description = ?, image_url = ? WHERE id = ?';
    db.query(query, [name, description, imageUrl, id], (err, result) => {
        if (err) {
            res.status(500).send('Error updating cut');
            return;
        }
        res.send('Cut updated successfully');
    });
});

app.delete('/api/cortes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM cortes_destacados WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send('Error deleting cut');
            return;
        }
        res.send('Cut deleted successfully');
    });
});

app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});