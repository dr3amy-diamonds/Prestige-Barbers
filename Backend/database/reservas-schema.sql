-- ==================== TABLA DE RESERVAS - PRESTIGE BARBERS ====================
-- Esquema de base de datos para el sistema de reservas

CREATE TABLE IF NOT EXISTS reservas (
    -- Identificador único de la reserva
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Relación con el usuario que hace la reserva
    usuario_id INT NOT NULL,

    -- Relación con el barbero asignado
    barbero_id INT NOT NULL,

    -- Información del servicio
    servicio_nombre VARCHAR(255) NOT NULL,
    servicio_tipo ENUM('corte', 'barba') NOT NULL,
    servicio_adicional BOOLEAN DEFAULT FALSE COMMENT 'Si agrega servicio adicional (barba si es corte, o corte si es barba)',

    -- Fecha y hora de la reserva
    fecha DATE NOT NULL,
    hora TIME NOT NULL,

    -- Información del cliente (puede diferir del usuario registrado)
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(20) NOT NULL,

    -- Estado de la reserva
    estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',

    -- Motivo de cancelación (opcional)
    motivo_cancelacion TEXT NULL,

    -- Timestamps
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Índices para mejorar el rendimiento
    INDEX idx_usuario (usuario_id),
    INDEX idx_barbero (barbero_id),
    INDEX idx_fecha (fecha),
    INDEX idx_estado (estado),
    INDEX idx_fecha_hora (fecha, hora),

    -- Claves foráneas
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (barbero_id) REFERENCES barberos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== COMENTARIOS Y NOTAS ====================
--
-- Estados posibles:
--   - pendiente: Reserva creada, esperando confirmación
--   - confirmada: Reserva confirmada por el sistema/admin
--   - completada: Servicio realizado
--   - cancelada: Reserva cancelada por el usuario o admin
--
-- servicio_adicional:
--   - Si servicio_tipo = 'corte' y servicio_adicional = true: también quiere servicio de barba
--   - Si servicio_tipo = 'barba' y servicio_adicional = true: también quiere corte de pelo
--
-- Restricciones de negocio (implementar en backend):
--   1. No permitir reservas en fechas pasadas
--   2. No permitir más de una reserva para el mismo barbero a la misma hora
--   3. Horario de trabajo: 8:00 AM - 8:00 PM
--   4. Duración aproximada de cada servicio: 1 hora
--   5. Validar que el barbero esté disponible en la fecha/hora seleccionada
