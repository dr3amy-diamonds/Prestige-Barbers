-- Agregar columna 'rol' a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN rol ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario' AFTER email;

-- Crear usuario administrador
-- Contraseña: admin (hasheada con bcrypt)
INSERT INTO usuarios (nombre_completo, email, rol, password_hash, activo) 
VALUES (
    'Administrador',
    'admin',
    'admin',
    '$2b$10$rQZ9vXqK5YJH4gKxYZGZ0eqWJYqKZX8L0wZ1qJQXqJZ1qJQXqJZ1q',
    1
);

-- Nota: La contraseña hasheada de arriba es solo un placeholder.
-- Necesitas generar el hash real ejecutando el siguiente código en Node.js:
-- 
-- const bcrypt = require('bcrypt');
-- const password = 'admin';
-- bcrypt.hash(password, 10, (err, hash) => {
--     console.log('Hash para admin:', hash);
-- });
--
-- Luego reemplaza el password_hash en el INSERT de arriba.
