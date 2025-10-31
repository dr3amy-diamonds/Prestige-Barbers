# Modal de Reservas - Prestige Barbers

## Descripción

Sistema de modal interactivo para realizar reservas de servicios de barbería. El modal se despliega al hacer clic en el botón "Reservar" en la página de servicios.

## Características Principales

### ✨ Diseño y UX
- **Apertura fluida**: Animación suave al abrir y cerrar
- **Responsive**: Adaptado para dispositivos móviles y desktop
- **Overlay oscuro**: Fondo con blur para mejor enfoque
- **Botón de cierre**: Múltiples formas de cerrar (botón X, clic fuera, tecla ESC)

### 📋 Funcionalidades

1. **Información del Servicio**
   - Muestra el nombre del servicio seleccionado
   - Tipo de servicio (Corte de cabello / Barba)
   - Precio del servicio
   - Descripción de la experiencia

2. **Selección de Barbero**
   - Muestra el barbero previamente seleccionado en la página
   - Imagen circular del barbero
   - Nombre del barbero

3. **Servicio Adicional**
   - Pregunta si desea agregar servicio de barba (o viceversa)
   - Botones Sí/No con selección visual

4. **Calendario Interactivo**
   - Slider de 5 días a la vez
   - Navegación con flechas (anterior/siguiente)
   - Días bloqueados en el pasado
   - Límite de 30 días hacia el futuro
   - Animaciones de transición suaves

5. **Selección de Hora**
   - Botones de horarios disponibles
   - Selección única (solo una hora)
   - Feedback visual al seleccionar

6. **Formulario de Datos**
   - Nombre y apellidos
   - Teléfono de contacto
   - Validación de campos requeridos

7. **Confirmación de Reserva**
   - Validación completa antes de confirmar
   - Alert con resumen de la reserva
   - Preparado para integración con backend

## Archivos Creados

### 1. CSS del Modal
**Ubicación**: `Frontend/public/Reserva/R-Styles/modal-reserva.css`

Contiene:
- Estilos del overlay y contenedor del modal
- Animaciones de entrada/salida
- Diseño de 2 columnas (información + formulario)
- Estilos del calendario slider
- Botones y formularios
- Media queries para responsive

### 2. JavaScript del Modal
**Ubicación**: `Frontend/public/Reserva/R-js/modal-reserva.js`

Contiene dos clases principales:

#### `ReservaModalController`
- Controla la apertura/cierre del modal
- Gestiona la selección de todos los elementos
- Valida la información antes de confirmar
- Prepara el objeto de reserva para enviar al backend

#### `ModalCalendar`
- Gestiona el calendario de días
- Navegación entre semanas
- Selección de fechas
- Límites de fechas (hoy hasta 30 días)

## Integración

### HTML
El modal se inserta automáticamente en el DOM cuando se carga el JavaScript.

```html
<!-- En index.html, agregar estos enlaces -->
<link rel="stylesheet" href="R-Styles/modal-reserva.css">
<script src="R-js/modal-reserva.js"></script>
```

### Botón Disparador
```html
<a href="#" id="reserveButton">Reservar</a>
```

El modal escucha el clic en el elemento con `id="reserveButton"`.

## Flujo de Uso

1. **Usuario en página de servicio**
   - Ve la información del servicio
   - Selecciona un barbero (opcional pero recomendado)

2. **Clic en "Reservar"**
   - Se abre el modal con animación
   - Se carga la información del servicio y barbero

3. **Dentro del modal**
   - Usuario decide si agregar servicio adicional
   - Selecciona fecha en el calendario
   - Selecciona hora disponible
   - Ingresa nombre y teléfono

4. **Confirmación**
   - Clic en botón "Reservar"
   - Validación de campos
   - Alert de confirmación
   - Modal se cierra

## Objeto de Reserva Generado

```javascript
{
    servicio: "Mid Fade",
    tipoServicio: "corte",
    servicioAdicional: true, // Si seleccionó "Sí"
    barbero: {
        id: "1",
        nombre: "ASAP Rocky",
        imagen: "/path/to/image.png"
    },
    fecha: "2025-10-26", // ISO format
    hora: "14:00",
    cliente: {
        nombre: "Juan Pérez",
        telefono: "3001234567"
    }
}
```

## Integración con Backend (Pendiente)

En `modal-reserva.js`, existe el método `sendReservation()` preparado para enviar la reserva al backend:

```javascript
async sendReservation(reserva) {
    const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva)
    });
    // ...
}
```

### Endpoint Requerido
**POST** `/api/reservas`

**Body**:
```json
{
    "servicio": "string",
    "tipoServicio": "corte|barba",
    "servicioAdicional": boolean,
    "barbero": {
        "id": "string",
        "nombre": "string",
        "imagen": "string"
    },
    "fecha": "YYYY-MM-DD",
    "hora": "HH:MM",
    "cliente": {
        "nombre": "string",
        "telefono": "string"
    }
}
```

## Validaciones Implementadas

- ✅ Nombre del cliente no puede estar vacío
- ✅ Teléfono del cliente no puede estar vacío
- ✅ Barbero debe estar seleccionado
- ✅ Fecha debe estar seleccionada
- ✅ Hora debe estar seleccionada
- ✅ No permite fechas pasadas
- ✅ Límite de 30 días hacia el futuro

## Mejoras Futuras

### Backend Integration
- [ ] Conectar con endpoint `/api/reservas`
- [ ] Verificar disponibilidad real de barberos
- [ ] Cargar horas dinámicamente según barbero y fecha
- [ ] Guardar reserva en base de datos

### UX Improvements
- [ ] Mostrar horas ocupadas en gris
- [ ] Cargar horarios de trabajo del barbero
- [ ] Notificación de confirmación por email/SMS
- [ ] Calendario más completo (selección de mes)
- [ ] Integración con autenticación de usuarios

### Features Adicionales
- [ ] Sistema de recordatorios
- [ ] Cancelación de reservas
- [ ] Reprogramación de citas
- [ ] Historia de reservas del usuario

## Eventos del Console Log

Para debugging, el modal imprime estos logs:

```
✅ Modal de reservas inicializado
🔓 Modal abierto
💈 Barbero cargado: { id, nombre, imagen }
📅 Día seleccionado en modal: 2025-10-26
⏰ Hora seleccionada: 14:00
➕ Servicio adicional: si
📋 Reserva confirmada: { objeto completo }
🔒 Modal cerrado
```

## Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (últimas versiones)
- ✅ Mobile responsive
- ✅ Touch events en calendario
- ✅ Teclado (ESC para cerrar)

## Notas de Implementación

1. **Fuente Montserrat**: El modal usa la fuente ya cargada en el proyecto
2. **Colores**: Mantiene la paleta de colores (#1b1b1b para negro)
3. **z-index**: Modal usa `z-index: 10000` para estar sobre todo
4. **Scroll**: Previene scroll del body cuando el modal está abierto
5. **Sin dependencias**: No requiere jQuery ni librerías externas

## Troubleshooting

### El modal no se abre
- Verificar que `modal-reserva.js` esté cargado correctamente
- Verificar que el botón tenga `id="reserveButton"`
- Revisar console para errores de JavaScript

### El calendario no muestra días
- Verificar que los IDs del HTML coincidan con los del JS
- Revisar que `modalDaysContainer` exista en el DOM

### La reserva no se envía
- Verificar que todos los campos estén completos
- Revisar el endpoint `/api/reservas` en el backend
- Verificar CORS si es necesario

---

**Autor**: Claude Code
**Fecha**: Octubre 2025
**Versión**: 1.0.0
