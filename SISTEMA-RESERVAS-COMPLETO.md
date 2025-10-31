# Sistema de Reservas Completo - Prestige Barbers

## ✅ Implementación Completada

Se ha implementado un sistema completo de reservas con todas las funcionalidades necesarias.

---

## 📋 Resumen de Cambios

### **Frontend - JavaScript**

#### 1. **Verificación de Sesión** - [modal-reserva.js:215-235](Frontend/public/Reserva/R-js/modal-reserva.js#L215-L235)
- ✅ Verifica que el usuario esté autenticado antes de abrir el modal
- ✅ Muestra alerta si no hay sesión activa
- ✅ Abre automáticamente el modal de autenticación si el usuario no está logueado

#### 2. **Servicio Adicional Dinámico** - [modal-reserva.js:257-267](Frontend/public/Reserva/R-js/modal-reserva.js#L257-L267)
- ✅ Si es un corte: Pregunta "¿Agregar Servicio de barba?"
- ✅ Si es una barba: Pregunta "¿Agregar Corte de pelo?"
- ✅ Texto dinámico según el tipo de servicio

#### 3. **Gestión de Imagen de Barbero** - [modal-reserva.js:284-298](Frontend/public/Reserva/R-js/modal-reserva.js#L284-L298)
- ✅ Oculta la imagen cuando no hay barbero seleccionado
- ✅ Muestra mensaje "Ningún barbero seleccionado" en gris
- ✅ Muestra imagen y nombre cuando hay barbero seleccionado

#### 4. **Validaciones Mejoradas** - [modal-reserva.js:330-368](Frontend/public/Reserva/R-js/modal-reserva.js#L330-L368)
- ✅ Valida que haya barbero seleccionado (PRIMERO)
- ✅ Valida fecha seleccionada
- ✅ Valida hora seleccionada
- ✅ Valida nombre del cliente
- ✅ Valida teléfono (10 dígitos)

#### 5. **Objeto de Reserva Completo** - [modal-reserva.js:370-386](Frontend/public/Reserva/R-js/modal-reserva.js#L370-L386)
```javascript
{
    usuario_id: 1,
    barbero_id: 2,
    servicio_nombre: "Low Fade",
    servicio_tipo: "corte",
    servicio_adicional: true,
    fecha: "2025-10-26",
    hora: "14:00",
    cliente_nombre: "Juan Pérez",
    cliente_telefono: "3001234567",
    estado: "pendiente"
}
```

#### 6. **Envío al Backend** - [modal-reserva.js:424-452](Frontend/public/Reserva/R-js/modal-reserva.js#L424-L452)
- ✅ Envía petición POST a `/api/reservas`
- ✅ Incluye token JWT en headers
- ✅ Maneja errores apropiadamente
- ✅ Muestra confirmación con datos formateados

---

## 🗄️ Base de Datos

### **Tabla `reservas`** - [reservas-schema.sql](Backend/database/reservas-schema.sql)

```sql
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    barbero_id INT NOT NULL,
    servicio_nombre VARCHAR(255) NOT NULL,
    servicio_tipo ENUM('corte', 'barba') NOT NULL,
    servicio_adicional BOOLEAN DEFAULT FALSE,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(20) NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
    motivo_cancelacion TEXT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (barbero_id) REFERENCES barberos(id) ON DELETE CASCADE
);
```

### **Estados de Reserva:**
- **pendiente**: Reserva creada, esperando confirmación
- **confirmada**: Reserva confirmada por el sistema/admin
- **completada**: Servicio realizado
- **cancelada**: Reserva cancelada

---

## 🔌 API Endpoints

### **POST `/api/reservas`** - Crear reserva
**Autenticación**: Requerida (JWT)

**Request Body:**
```json
{
    "usuario_id": 1,
    "barbero_id": 2,
    "servicio_nombre": "Low Fade",
    "servicio_tipo": "corte",
    "servicio_adicional": true,
    "fecha": "2025-10-26",
    "hora": "14:00",
    "cliente_nombre": "Juan Pérez",
    "cliente_telefono": "3001234567"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Reserva creada exitosamente",
    "reserva_id": 15
}
```

**Validaciones:**
- ✅ Usuario autenticado coincide con `usuario_id`
- ✅ Todos los campos obligatorios presentes
- ✅ Fecha no está en el pasado
- ✅ Barbero disponible en fecha/hora seleccionada

---

### **GET `/api/reservas/usuario/:id`** - Obtener reservas del usuario
**Autenticación**: Requerida (JWT)

**Response:**
```json
{
    "success": true,
    "reservas": [
        {
            "id": 15,
            "usuario_id": 1,
            "barbero_id": 2,
            "barbero_nombre": "ASAP Rocky",
            "barbero_imagen": "/uploads/...",
            "servicio_nombre": "Low Fade",
            "servicio_tipo": "corte",
            "servicio_adicional": true,
            "fecha": "2025-10-26",
            "hora": "14:00:00",
            "cliente_nombre": "Juan Pérez",
            "cliente_telefono": "3001234567",
            "estado": "pendiente",
            "fecha_creacion": "2025-10-25T...",
            "fecha_actualizacion": "2025-10-25T..."
        }
    ]
}
```

---

### **GET `/api/reservas/:id`** - Obtener una reserva específica
**Autenticación**: Requerida (JWT)

**Response:**
```json
{
    "success": true,
    "reserva": {
        "id": 15,
        "usuario_id": 1,
        "usuario_nombre": "Juan Diego",
        "usuario_email": "juan@email.com",
        "barbero_id": 2,
        "barbero_nombre": "ASAP Rocky",
        "barbero_imagen": "/uploads/...",
        ...
    }
}
```

---

### **PUT `/api/reservas/:id/cancelar`** - Cancelar reserva
**Autenticación**: Requerida (JWT)

**Request Body:**
```json
{
    "motivo_cancelacion": "Tengo un compromiso urgente"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Reserva cancelada exitosamente"
}
```

**Validaciones:**
- ✅ Usuario es dueño de la reserva
- ✅ Reserva no está ya cancelada
- ✅ Reserva no está completada

---

### **GET `/api/reservas/barbero/:id`** - Obtener reservas de un barbero
**Query Params:**
- `fecha` (opcional): Filtrar por fecha específica

**Response:**
```json
{
    "success": true,
    "reservas": [...]
}
```

---

## 🔒 Seguridad Implementada

### **Frontend:**
1. ✅ Verificación de sesión antes de abrir modal
2. ✅ Token JWT almacenado en localStorage
3. ✅ Validación de formato de teléfono (10 dígitos)
4. ✅ Validación de campos requeridos

### **Backend:**
1. ✅ Middleware `verificarToken` en todos los endpoints protegidos
2. ✅ Verificación de propiedad (usuario solo puede ver/modificar sus reservas)
3. ✅ Validación de fechas pasadas
4. ✅ Verificación de disponibilidad del barbero
5. ✅ SQL injection protection (parámetros preparados)
6. ✅ Validación de estados de reserva

---

## 📝 Instrucciones de Instalación

### **1. Crear la tabla en MySQL:**

```bash
cd Backend/database
mysql -u root -p Barberia < reservas-schema.sql
```

O ejecutar manualmente el SQL en phpMyAdmin/MySQL Workbench.

### **2. Reiniciar el servidor:**

```bash
cd Backend
npm run dev
```

### **3. Probar el sistema:**

1. Navega a un servicio (corte o barba)
2. **Sin sesión**: Al hacer clic en "Reservar" mostrará alerta y abrirá modal de login
3. **Con sesión**:
   - Selecciona un barbero (opcional pero recomendado)
   - Haz clic en "Reservar"
   - Completa el formulario del modal
   - Confirma la reserva

---

## 🎯 Flujo Completo de Reserva

```
1. Usuario en página de servicio
   ↓
2. Clic en "Reservar"
   ↓
3. ¿Tiene sesión activa?
   NO → Alerta + Abrir modal de login
   SÍ → Continuar ↓
4. Abrir modal de reserva
   ↓
5. Cargar info del servicio y barbero seleccionado
   ↓
6. Usuario completa formulario:
   - Servicio adicional (Sí/No)
   - Fecha (calendario)
   - Hora (botones)
   - Nombre y teléfono
   ↓
7. Clic en "Reservar"
   ↓
8. Validaciones frontend
   ↓
9. Envío a backend con JWT
   ↓
10. Validaciones backend:
    - Token válido
    - Usuario coincide
    - Campos completos
    - Fecha no pasada
    - Barbero disponible
   ↓
11. Insertar en BD
   ↓
12. Response exitoso
   ↓
13. Alert de confirmación
   ↓
14. Cerrar modal
```

---

## 🐛 Manejo de Errores

### **Frontend:**
- Sin sesión → Alerta + Abrir login
- Sin barbero → Alerta específica
- Sin fecha/hora → Alertas específicas
- Campos vacíos → Alertas con focus
- Teléfono inválido → Alerta con ejemplo
- Error de red → Alerta genérica

### **Backend:**
- Token inválido → 401 Unauthorized
- Fecha pasada → 400 Bad Request
- Barbero ocupado → 409 Conflict
- No es dueño → 403 Forbidden
- Error de BD → 500 Internal Server Error

---

## 📊 Consultas Útiles

### Ver todas las reservas:
```sql
SELECT * FROM reservas ORDER BY fecha DESC, hora DESC;
```

### Ver reservas de hoy:
```sql
SELECT * FROM reservas WHERE fecha = CURDATE();
```

### Ver reservas de un barbero:
```sql
SELECT r.*, u.nombre_completo
FROM reservas r
JOIN usuarios u ON r.usuario_id = u.id
WHERE r.barbero_id = 1;
```

### Ver reservas pendientes:
```sql
SELECT * FROM reservas WHERE estado = 'pendiente';
```

---

## 🚀 Próximas Mejoras (Opcionales)

1. **Horas dinámicas según horario del barbero**
2. **Notificaciones por email/SMS**
3. **Panel de administración de reservas**
4. **Recordatorios automáticos**
5. **Reprogramación de citas**
6. **Historial de reservas en perfil de usuario**
7. **Valoraciones post-servicio**

---

## ✅ Checklist de Funcionalidades

- [x] Verificación de sesión activa
- [x] Texto dinámico de servicio adicional
- [x] Ocultamiento de imagen sin barbero
- [x] Validaciones completas
- [x] Objeto de reserva completo
- [x] Envío al backend con JWT
- [x] Tabla en base de datos
- [x] Endpoint POST crear reserva
- [x] Endpoint GET obtener reservas de usuario
- [x] Endpoint GET obtener reserva específica
- [x] Endpoint PUT cancelar reserva
- [x] Endpoint GET obtener reservas de barbero
- [x] Verificación de disponibilidad
- [x] Validación de fechas pasadas
- [x] Manejo de errores completo

---

**Desarrollado por**: Claude Code
**Fecha**: Octubre 2025
**Versión**: 1.0.0 - Sistema Completo de Reservas
