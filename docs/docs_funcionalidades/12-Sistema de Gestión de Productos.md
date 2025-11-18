# 🛍️ SISTEMA DE GESTIÓN DE PRODUCTOS - PRESTIGE BARBERS

## 📋 Resumen de Implementación

Sistema completo de administración de productos con diseño moderno, carga de imágenes y gestión de inventario.

---

## ✨ Características Implementadas

### **Frontend**
- ✅ Diseño moderno y minimalista con sistema de colores profesional
- ✅ Tipografía del sistema (sin dependencias externas como Montserrat)
- ✅ Carga de imágenes con vista previa en tiempo real
- ✅ Validación de archivos (tamaño y tipo)
- ✅ Formulario responsivo con grid layout
- ✅ Tabla de productos con filtros por categoría y búsqueda
- ✅ Badges de stock (Disponible, Bajo, Agotado)
- ✅ Modal de confirmación para eliminación
- ✅ Animaciones suaves y transiciones
- ✅ Modo edición de productos
- ✅ Notificaciones toast elegantes

### **Backend**
- ✅ Endpoints RESTful completos (GET, POST, PUT, DELETE)
- ✅ Carga de archivos con Multer
- ✅ Validaciones de datos
- ✅ Almacenamiento en MySQL
- ✅ Manejo de errores robusto

---

## 🗄️ Base de Datos

### **Tabla `productos`**

```sql
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
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### **GET `/api/productos`** - Obtener todos los productos
**Response:**
```json
{
    "success": true,
    "productos": [
        {
            "id": 1,
            "marca": "SKALA",
            "nombre": "Crema Expert",
            "descripcion": "...",
            "categoria": "Cuidado Capilar",
            "tipo": "Crema",
            "tamano": "1000g",
            "precio": 38800,
            "stock": 50,
            "imagen": "/uploads/filename.jpg"
        }
    ]
}
```

### **GET `/api/productos/:id`** - Obtener producto específico
**Response:**
```json
{
    "success": true,
    "producto": { ... }
}
```

### **POST `/api/productos`** - Crear nuevo producto
**Request:** FormData con:
- marca (string)
- nombre (string)
- descripcion (string)
- categoria (enum)
- tipo (string)
- tamano (string)
- precio (number)
- stock (number)
- imagen (file)

**Response:**
```json
{
    "success": true,
    "message": "Producto registrado exitosamente",
    "producto_id": 1
}
```

### **PUT `/api/productos/:id`** - Actualizar producto
**Request:** FormData (imagen opcional)

**Response:**
```json
{
    "success": true,
    "message": "Producto actualizado exitosamente"
}
```

### **DELETE `/api/productos/:id`** - Eliminar producto
**Response:**
```json
{
    "success": true,
    "message": "Producto eliminado exitosamente"
}
```

---

## 📝 Instalación

### **1. Crear la tabla en MySQL**

Ejecuta el archivo SQL en tu base de datos:

```bash
# Opción 1: Desde terminal
mysql -u root -p Barberia < Backend/database/productos-schema.sql

# Opción 2: En phpMyAdmin
# Copiar y pegar el contenido del archivo productos-schema.sql
```

### **2. Verificar estructura de carpetas**

Asegúrate de que existe la carpeta `uploads` en el Backend:

```
Backend/
├── uploads/          ← Debe existir
├── server.js
└── ...
```

Si no existe, créala:

```bash
cd Backend
mkdir uploads
```

### **3. Reiniciar servidor**

```bash
cd Backend
npm start
# o
node server.js
```

---

## 🎨 Sistema de Diseño

### **Paleta de Colores**

- **Primary**: `#2563eb` (Azul profesional)
- **Success**: `#10b981` (Verde)
- **Danger**: `#ef4444` (Rojo)
- **Warning**: `#f59e0b` (Ámbar)
- **Grays**: De `#f9fafb` a `#111827`

### **Tipografía**

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

Sistema de fuentes nativo para máximo rendimiento y legibilidad.

### **Espaciado y Bordes**

- Border radius: `0.375rem` a `1rem`
- Shadows: Sistema de 4 niveles (sm, md, lg, xl)
- Spacing: Múltiplos de `0.5rem`

---

## 🖼️ Manejo de Imágenes

### **Formatos Aceptados**
- JPG, JPEG
- PNG
- WEBP

### **Tamaño Máximo**
- 5 MB por imagen

### **Ubicación**
Las imágenes se guardan en:
```
Backend/uploads/[timestamp]-[nombre-original]
```

Y se sirven en:
```
http://localhost:3000/uploads/[nombre-archivo]
```

---

## 🔧 Funcionalidades

### **1. Agregar Producto**
1. Llenar formulario con todos los campos
2. Seleccionar imagen (aparece vista previa)
3. Click en "Registrar Producto"
4. Notificación de éxito/error

### **2. Editar Producto**
1. Click en botón "Editar" en la tabla
2. Formulario se llena automáticamente
3. Modificar campos deseados
4. Opcionalmente cambiar imagen
5. Click en "Actualizar Producto"

### **3. Eliminar Producto**
1. Click en botón "Eliminar"
2. Confirmar en modal
3. Producto eliminado de BD

### **4. Filtrar Productos**
- **Por categoría**: Dropdown de categorías
- **Por búsqueda**: Campo de texto (busca en nombre y marca)

---

## 🎯 Badges de Stock

| Stock | Badge | Color |
|-------|-------|-------|
| > 10 unidades | Disponible | Verde |
| 1-9 unidades | Bajo | Ámbar |
| 0 unidades | Agotado | Rojo |

---

## 📱 Responsive Design

- **Desktop**: Grid de 2 columnas en formulario
- **Tablet** (≤768px): Grid de 1 columna
- **Mobile** (≤480px): Diseño optimizado con botones full-width

---

## 🧪 Cómo Probar

### **1. Acceder al panel**
```
http://localhost:3000/Admin/productos.html
```

### **2. Registrar un producto de prueba**
- Marca: SKALA
- Nombre: Crema de Tratamiento Expert
- Descripción: Crema hidratante profunda
- Categoría: Cuidado Capilar
- Tipo: Crema
- Tamaño: 1000g
- Precio: 38800
- Stock: 50
- Imagen: [Seleccionar cualquier imagen]

### **3. Verificar en base de datos**
```sql
SELECT * FROM productos;
```

### **4. Probar filtros**
- Filtrar por "Cuidado Capilar"
- Buscar por "SKALA"

### **5. Probar edición**
- Editar producto
- Cambiar stock a 5 (verás badge "Bajo")
- Cambiar stock a 0 (verás badge "Agotado")

---

## 🐛 Troubleshooting

### **Error: "No se pudo conectar con el servidor"**
- Verifica que el servidor Node.js esté corriendo
- Confirma que el puerto 3000 esté libre

### **Error: "Debes subir una imagen del producto"**
- Asegúrate de seleccionar un archivo
- Verifica que el formato sea válido (JPG, PNG, WEBP)
- Confirma que el tamaño sea menor a 5MB

### **Error: "Table 'Barberia.productos' doesn't exist"**
- Ejecuta el archivo `productos-schema.sql` en tu base de datos

### **La imagen no se muestra**
- Verifica que la carpeta `Backend/uploads/` exista
- Confirma que el servidor esté sirviendo archivos estáticos:
  ```javascript
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  ```

### **La vista previa no aparece**
- Abre la consola del navegador (F12)
- Busca errores de JavaScript
- Verifica que los IDs de los elementos coincidan

---

## 🚀 Mejoras Futuras (Opcional)

- [ ] Compresión automática de imágenes
- [ ] Múltiples imágenes por producto
- [ ] Categorías y marcas dinámicas desde BD
- [ ] Historial de cambios de stock
- [ ] Alertas de stock bajo
- [ ] Exportar productos a CSV/Excel
- [ ] Búsqueda avanzada con filtros múltiples
- [ ] Ordenamiento de tabla por columnas
- [ ] Paginación de resultados

---

## 📊 Archivos Modificados/Creados

```
Frontend/public/Admin/
├── productos.html ✏️ (actualizado - sin Montserrat, input file)
├── productos-styles.css ✏️ (rediseño completo)
└── productos.js ✏️ (manejo de archivos)

Backend/
├── server.js ✏️ (endpoints de productos agregados)
└── database/
    └── productos-schema.sql ⭐ NUEVO
```

---

**Desarrollado para**: Prestige Barbers  
**Fecha**: Noviembre 2025  
**Versión**: 2.0.0 - Sistema Moderno de Productos  
**Estado**: ✅ Funcional y listo para producción
