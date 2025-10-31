# Sistema de Servicio Adicional Dinámico

## ✅ Funcionalidad Implementada

Se ha implementado un sistema completo para agregar servicios adicionales a las reservas (corte + barba o barba + corte) de forma dinámica dentro del modal.

---

## 🎯 Flujo del Usuario

### **Escenario 1: Usuario dice "NO"**
1. Usuario hace clic en "Reservar"
2. Modal se abre
3. Pregunta: "¿Agregar Servicio de barba?" (si es corte) o "¿Agregar Corte de pelo?" (si es barba)
4. Usuario hace clic en **"No"**
5. ✅ **Resultado**: Nada cambia, reserva solo incluye el servicio principal

### **Escenario 2: Usuario dice "SÍ"**
1. Usuario hace clic en "Reservar"
2. Modal se abre
3. Pregunta: "¿Agregar Servicio de barba?"
4. Usuario hace clic en **"Sí"**
5. ✅ **Resultado**:
   - Aparece un selector dinámico con todos los servicios disponibles del tipo adicional
   - Usuario selecciona un servicio específico (ej: "Barba Completa")
   - Se muestra: "Seleccionado: + Barba Completa"
   - La reserva incluirá ambos servicios

---

## 💻 Implementación Frontend

### **1. Configuración de Botones Sí/No** - [modal-reserva.js:178-204](Frontend/public/Reserva/R-js/modal-reserva.js#L178-L204)

```javascript
setupAdditionalService() {
    const buttons = document.querySelectorAll('.modal-add-svc-cont-btn button');

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            // Deseleccionar todos
            buttons.forEach(btn => btn.classList.remove('selected'));

            // Seleccionar el clickeado
            button.classList.add('selected');
            this.additionalService = button.dataset.option;

            if (this.additionalService === 'no') {
                // Ocultar sección adicional
                this.hideAdditionalServiceSection();
            } else if (this.additionalService === 'si') {
                // Mostrar selector
                await this.showAdditionalServiceSelector();
            }
        });
    });
}
```

### **2. Ocultar Sección** - [modal-reserva.js:207-212](Frontend/public/Reserva/R-js/modal-reserva.js#L207-L212)

```javascript
hideAdditionalServiceSection() {
    const additionalSection = document.getElementById('modalAdditionalServiceSection');
    if (additionalSection) {
        additionalSection.remove();
    }
}
```

### **3. Mostrar Selector Dinámico** - [modal-reserva.js:215-250](Frontend/public/Reserva/R-js/modal-reserva.js#L215-L250)

```javascript
async showAdditionalServiceSelector() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemType = urlParams.get('type'); // 'corte' o 'barba'

    // Determinar qué tipo de servicio adicional mostrar
    const additionalType = itemType === 'corte' ? 'barba' : 'corte';
    const additionalTypeLabel = itemType === 'corte' ? 'Barbas' : 'Cortes de Cabello';

    try {
        // Cargar servicios desde el backend
        const endpoint = additionalType === 'barba' ? '/api/barbas/destacadas' : '/api/cortes';
        const response = await fetch(`http://localhost:3000${endpoint}`);
        const servicios = await response.json();

        // Renderizar selector
        this.renderAdditionalServiceSection(servicios, additionalType, additionalTypeLabel);

    } catch (error) {
        // Manejo de errores con modal personalizado
        await window.customModal.showAlert('Hubo un error...', '❌ Error');
    }
}
```

### **4. Renderizar Selector** - [modal-reserva.js:253-331](Frontend/public/Reserva/R-js/modal-reserva.js#L253-L331)

```javascript
renderAdditionalServiceSection(servicios, tipo, tipoLabel) {
    // Crear sección HTML dinámicamente
    const section = document.createElement('div');
    section.id = 'modalAdditionalServiceSection';

    section.innerHTML = `
        <label>Selecciona ${tipoLabel}</label>
        <div id="additionalServicesGrid">
            <!-- Botones de servicios -->
        </div>
        <div id="selectedAdditionalInfo">
            <!-- Info del servicio seleccionado -->
        </div>
    `;

    // Crear botón por cada servicio
    servicios.forEach(servicio => {
        const button = document.createElement('button');
        button.textContent = servicio.nombre;

        button.addEventListener('click', () => {
            // Guardar selección
            this.selectedAdditionalService = {
                id: servicio.id,
                nombre: servicio.nombre,
                tipo: tipo
            };

            // Mostrar confirmación
            document.getElementById('selectedAdditionalInfo').innerHTML = `
                <strong>Seleccionado:</strong> + ${servicio.nombre}
            `;
        });

        grid.appendChild(button);
    });
}
```

---

## 📦 Objeto de Reserva Actualizado

### **Sin Servicio Adicional**
```javascript
{
    usuario_id: 1,
    barbero_id: 2,
    servicio_nombre: "Low Taper Fade",
    servicio_tipo: "corte",
    servicio_adicional: false,  // Usuario dijo "No"
    servicio_adicional_id: null,
    servicio_adicional_nombre: null,
    servicio_adicional_tipo: null,
    fecha: "2025-10-26",
    hora: "14:00",
    cliente_nombre: "Juan Pérez",
    cliente_telefono: "3001234567",
    estado: "pendiente"
}
```

### **Con Servicio Adicional**
```javascript
{
    usuario_id: 1,
    barbero_id: 2,
    servicio_nombre: "Low Taper Fade",
    servicio_tipo: "corte",
    servicio_adicional: true,  // Usuario dijo "Sí"
    servicio_adicional_id: 5,
    servicio_adicional_nombre: "Barba Completa",
    servicio_adicional_tipo: "barba",
    fecha: "2025-10-26",
    hora: "14:00",
    cliente_nombre: "Juan Pérez",
    cliente_telefono: "3001234567",
    estado: "pendiente"
}
```

---

## 🗄️ Actualización de Base de Datos

### **Comando SQL** - [reservas-update-servicio-adicional.sql](Backend/database/reservas-update-servicio-adicional.sql)

```sql
ALTER TABLE reservas
ADD COLUMN servicio_adicional_id INT NULL,
ADD COLUMN servicio_adicional_nombre VARCHAR(255) NULL,
ADD COLUMN servicio_adicional_tipo ENUM('corte', 'barba') NULL;
```

### **Nuevas Columnas:**
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `servicio_adicional_id` | INT NULL | ID del servicio adicional |
| `servicio_adicional_nombre` | VARCHAR(255) | Nombre (ej: "Barba Completa") |
| `servicio_adicional_tipo` | ENUM | 'corte' o 'barba' |

---

## 🔌 Backend Actualizado

### **Endpoint POST /api/reservas** - [server.js:1321-1335](Backend/server.js#L1321-L1335)

**Parámetros Aceptados:**
```javascript
{
    usuario_id,
    barbero_id,
    servicio_nombre,
    servicio_tipo,
    servicio_adicional,           // ← Ya existía
    servicio_adicional_id,        // ← NUEVO
    servicio_adicional_nombre,    // ← NUEVO
    servicio_adicional_tipo,      // ← NUEVO
    fecha,
    hora,
    cliente_nombre,
    cliente_telefono,
    estado
}
```

### **Query de Inserción** - [server.js:1391-1423](Backend/server.js#L1391-L1423)

```javascript
const queryInsert = `
    INSERT INTO reservas (
        usuario_id,
        barbero_id,
        servicio_nombre,
        servicio_tipo,
        servicio_adicional,
        servicio_adicional_id,
        servicio_adicional_nombre,
        servicio_adicional_tipo,
        fecha,
        hora,
        cliente_nombre,
        cliente_telefono,
        estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const values = [
    usuario_id,
    barbero_id,
    servicio_nombre,
    servicio_tipo,
    servicio_adicional || false,
    servicio_adicional_id || null,      // ← Puede ser NULL
    servicio_adicional_nombre || null,  // ← Puede ser NULL
    servicio_adicional_tipo || null,    // ← Puede ser NULL
    fecha,
    hora,
    cliente_nombre,
    cliente_telefono,
    estado || 'pendiente'
];
```

---

## 🎨 Estilos del Selector

```javascript
// Botones de servicios adicionales
button.style.cssText = `
    background: #fff;
    border: 2px solid #1b1b1b;
    padding: 8px 12px;
    cursor: pointer;
    font-family: "Montserrat", sans-serif;
    font-size: 0.85em;
    transition: all 0.3s ease;
`;

// Al seleccionar
button.style.background = '#1b1b1b';
button.style.color = '#fff';
```

**Características:**
- ✅ Estética consistente (#1b1b1b)
- ✅ Fuente Montserrat
- ✅ Transiciones suaves
- ✅ Feedback visual al seleccionar

---

## 💬 Confirmación de Reserva con Servicio Adicional

### **Sin Servicio Adicional:**
```
✅ Reserva Confirmada

¡Reserva confirmada exitosamente!

📅 Fecha: 26/10/2025
⏰ Hora: 2:00 PM
💈 Barbero: ASAP Rocky
✂️ Servicio: Low Taper Fade

¡Te esperamos Juan!
```

### **Con Servicio Adicional:**
```
✅ Reserva Confirmada

¡Reserva confirmada exitosamente!

📅 Fecha: 26/10/2025
⏰ Hora: 2:00 PM
💈 Barbero: ASAP Rocky
✂️ Servicio: Low Taper Fade
➕ Servicio Adicional: Barba Completa

¡Te esperamos Juan!
```

---

## 📝 Instrucciones de Instalación

### **1. Actualizar Base de Datos:**
```bash
cd Backend/database
mysql -u root -p Barberia < reservas-update-servicio-adicional.sql
```

### **2. Reiniciar Servidor:**
```bash
cd Backend
npm run dev
```

### **3. Probar:**
1. Navegar a un servicio (corte)
2. Hacer clic en "Reservar"
3. Seleccionar un barbero
4. En "¿Agregar Servicio de barba?", hacer clic en "Sí"
5. ✅ Debe aparecer un selector con todas las barbas disponibles
6. Seleccionar una barba
7. Completar formulario y confirmar
8. ✅ La confirmación debe mostrar ambos servicios

---

## 🎯 Beneficios

1. **UX Mejorado**: Todo en un solo modal, sin redirigir
2. **Flexibilidad**: Usuario decide en el momento
3. **Visual**: Ve todos los servicios adicionales disponibles
4. **Completo**: Guarda toda la información del servicio adicional
5. **Escalable**: Fácil agregar más tipos de servicios

---

## 🔄 Flujo Visual

```
[Página de Servicio: Low Taper Fade]
           ↓
    Clic en "Reservar"
           ↓
   [Modal de Reserva se abre]
           ↓
 "¿Agregar Servicio de barba?"
    [Sí]          [No]
     ↓              ↓
Selector          Continúa sin
aparece           servicio adicional
     ↓
[Lista de Barbas]
- Barba Completa
- Barba Parcial
- ...
     ↓
Selecciona "Barba Completa"
     ↓
"Seleccionado: + Barba Completa"
     ↓
Completa formulario
     ↓
Confirma reserva
     ↓
Backend guarda:
- Servicio: Low Taper Fade (corte)
- Adicional: Barba Completa (barba)
```

---

**Autor**: Claude Code
**Fecha**: Octubre 2025
**Versión**: 3.0.0 - Servicio Adicional Dinámico
