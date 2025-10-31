-- ==================== ACTUALIZACIÓN TABLA RESERVAS ====================
-- Agregar columnas para servicio adicional detallado

ALTER TABLE reservas
ADD COLUMN servicio_adicional_id INT NULL AFTER servicio_adicional,
ADD COLUMN servicio_adicional_nombre VARCHAR(255) NULL AFTER servicio_adicional_id,
ADD COLUMN servicio_adicional_tipo ENUM('corte', 'barba') NULL AFTER servicio_adicional_nombre;

-- Agregar comentarios para claridad
ALTER TABLE reservas
MODIFY COLUMN servicio_adicional_id INT NULL COMMENT 'ID del servicio adicional seleccionado',
MODIFY COLUMN servicio_adicional_nombre VARCHAR(255) NULL COMMENT 'Nombre del servicio adicional (ej: Mid Fade, Barba Completa)',
MODIFY COLUMN servicio_adicional_tipo ENUM('corte', 'barba') NULL COMMENT 'Tipo del servicio adicional';

-- Verificar la estructura actualizada
DESCRIBE reservas;
