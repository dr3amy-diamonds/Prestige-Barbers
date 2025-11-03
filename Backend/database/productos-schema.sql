-- Tabla de productos para la tienda
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria ENUM('Cuidado Capilar', 'Skincare', 'Barba', 'Accesorios') NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    tamano VARCHAR(50) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(500) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_stock (stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar productos de ejemplo
INSERT INTO productos (marca, nombre, descripcion, categoria, tipo, tamano, precio, stock, imagen) VALUES
('SKALA', 'Crema de Tratamiento Expert', 'Crema de tratamiento profundo para cabello dañado, proporciona hidratación intensa y reparación', 'Cuidado Capilar', 'Crema de Tratamiento', '1000g', 38800, 50, '/uploads/placeholder-product.jpg'),
('Natura', 'Aceite Reparador Capilar', 'Aceite natural que repara y nutre el cabello desde la raíz, con extractos botánicos', 'Cuidado Capilar', 'Aceite', '100ml', 45000, 30, '/uploads/placeholder-product.jpg'),
('Milagros', 'Kit de Cuidado Facial', 'Kit completo de cuidado facial con limpiador, tónico y crema hidratante', 'Skincare', 'Kit de Cuidado', '3 productos', 89900, 20, '/uploads/placeholder-product.jpg'),
('Barber Pro', 'Aceite para Barba Premium', 'Aceite nutritivo para barba con aroma masculino, suaviza y da brillo', 'Barba', 'Aceite', '50ml', 35000, 40, '/uploads/placeholder-product.jpg'),
('Style Master', 'Peine de Carbono Profesional', 'Peine profesional de carbono antiestático, ideal para todo tipo de cabello', 'Accesorios', 'Peine', 'Unitario', 25000, 100, '/uploads/placeholder-product.jpg');
