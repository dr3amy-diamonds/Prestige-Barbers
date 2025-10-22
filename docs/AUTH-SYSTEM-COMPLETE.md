# 🔐 SISTEMA DE AUTENTICACIÓN COMPLETO - PRESTIGE BARBERS

## 📋 Resumen de Implementación

Sistema de autenticación completo con:
- ✅ **Registro de usuarios** con validaciones
- ✅ **Login con email y contraseña**
- ✅ **Tokens JWT** con validez de 7 días
- ✅ **Hash de contraseñas** con bcrypt
- ✅ **Persistencia de sesión** en localStorage
- ✅ **Notificaciones visuales** (éxito/error)

---

## 🏗️ Arquitectura

### **Backend (Node.js + Express)**

#### **Dependencias Nuevas:**
```json
{
  "bcrypt": "^5.1.1",          // Hash de contraseñas
  "jsonwebtoken": "^9.0.2"     // Generación de tokens JWT
}
```

#### **Endpoints Creados:**

| Método | Endpoint            | Descripción                    | Auth Requerida |
|--------|---------------------|--------------------------------|----------------|
| POST   | `/api/auth/register`| Registrar nuevo usuario        | ❌ No          |
| POST   | `/api/auth/login`   | Iniciar sesión                 | ❌ No          |
| GET    | `/api/auth/me`      | Obtener datos del usuario      | ✅ Sí (JWT)    |
| POST   | `/api/auth/logout`  | Cerrar sesión                  | ❌ No          |

---

## 🗄️ Base de Datos

### **Nueva Tabla: `usuarios`**

```sql
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email)
);
```

### **Campos:**
- `id`: Identificador único
- `nombre_completo`: Nombre completo del usuario
- `email`: Email único (usado para login)
- `password_hash`: Contraseña hasheada con bcrypt (NUNCA en texto plano)
- `fecha_registro`: Fecha de creación de la cuenta
- `ultimo_acceso`: Última vez que inició sesión
- `activo`: Estado de la cuenta (permite desactivar sin eliminar)

---

## 📝 API Endpoints - Documentación Detallada

### **1. POST `/api/auth/register` - Registrar Usuario**

#### **Request:**
```json
{
  "nombre_completo": "Juan Diego Pérez",
  "email": "juan@ejemplo.com",
  "password": "miContraseña123",
  "confirm_password": "miContraseña123"
}
```

#### **Response Exitoso (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre_completo": "Juan Diego Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

#### **Posibles Errores:**
- `400`: Campos faltantes o inválidos
- `409`: Email ya registrado
- `500`: Error del servidor

#### **Validaciones:**
- ✅ Todos los campos son obligatorios
- ✅ Email con formato válido
- ✅ Contraseñas coinciden
- ✅ Contraseña mínimo 6 caracteres
- ✅ Email único en la base de datos

---

### **2. POST `/api/auth/login` - Iniciar Sesión**

#### **Request:**
```json
{
  "email": "juan@ejemplo.com",
  "password": "miContraseña123"
}
```

#### **Response Exitoso (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre_completo": "Juan Diego Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

#### **Posibles Errores:**
- `400`: Campos faltantes
- `401`: Email o contraseña incorrectos
- `500`: Error del servidor

#### **Validaciones:**
- ✅ Email y contraseña requeridos
- ✅ Usuario debe estar activo
- ✅ Contraseña verificada con bcrypt

---

### **3. GET `/api/auth/me` - Obtener Datos del Usuario Actual**

#### **Headers Requeridos:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Response Exitoso (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "nombre_completo": "Juan Diego Pérez",
    "email": "juan@ejemplo.com",
    "fecha_registro": "2025-10-21T10:30:00.000Z"
  }
}
```

#### **Posibles Errores:**
- `401`: Token no proporcionado
- `403`: Token inválido o expirado
- `404`: Usuario no encontrado
- `500`: Error del servidor

---

### **4. POST `/api/auth/logout` - Cerrar Sesión**

#### **Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

**Nota:** Con JWT, el cierre de sesión se maneja principalmente en el frontend eliminando el token.

---

## 💻 Frontend - JavaScript

### **Funciones Principales:**

#### **1. Registro de Usuario**
```javascript
// Al hacer submit en el formulario de registro
const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        nombre_completo: "Juan Diego",
        email: "juan@ejemplo.com",
        password: "contraseña",
        confirm_password: "contraseña"
    })
});

const data = await response.json();

if (data.success) {
    // Guardar token y datos de usuario
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
}
```

#### **2. Inicio de Sesión**
```javascript
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: "juan@ejemplo.com",
        password: "contraseña"
    })
});

const data = await response.json();

if (data.success) {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
}
```

#### **3. Verificar Sesión Activa**
```javascript
function verificarSesion() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
        const user = JSON.parse(userData);
        console.log('Usuario autenticado:', user);
        return user;
    }
    return null;
}
```

#### **4. Hacer Peticiones Autenticadas**
```javascript
const token = localStorage.getItem('auth_token');

const response = await fetch('/api/auth/me', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

#### **5. Cerrar Sesión**
```javascript
function cerrarSesion() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/';
}
```

---

## 🔒 Seguridad Implementada

### **1. Hash de Contraseñas (bcrypt)**
```javascript
// Backend - Al registrar
const passwordHash = await bcrypt.hash(password, 10);

// Backend - Al iniciar sesión
const passwordValida = await bcrypt.compare(password, usuario.password_hash);
```

**Características:**
- 10 rounds de salt (recomendado)
- Irreversible (no se puede obtener la contraseña original)
- Protege contra rainbow tables

### **2. JSON Web Tokens (JWT)**
```javascript
const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '7d' }
);
```

**Características:**
- Token válido por 7 días
- Contiene id y email del usuario
- Firmado con clave secreta
- Verificado en cada petición protegida

### **3. Validaciones en Backend**
- ✅ Sanitización de inputs
- ✅ Validación de formato de email
- ✅ Verificación de contraseñas coincidentes
- ✅ Longitud mínima de contraseña (6 caracteres)
- ✅ Email único en base de datos
- ✅ Usuario debe estar activo para login

### **4. Middleware de Autenticación**
```javascript
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    });
};
```

---

## 🎨 UX/UI - Notificaciones

### **Mensajes de Éxito (Verde)**
```javascript
mostrarMensaje('¡Registro exitoso! Bienvenido Juan Diego', 'success');
```

### **Mensajes de Error (Rojo)**
```javascript
mostrarMensaje('Las contraseñas no coinciden', 'error');
```

### **Características:**
- Animación de entrada desde la derecha
- Se muestran durante 4 segundos
- Posición fija en esquina superior derecha
- Múltiples mensajes apilados
- Auto-destrucción después de mostrar

---

## 🧪 Cómo Probar

### **1. Crear la tabla de usuarios**
```bash
# Abre phpMyAdmin y ejecuta el SQL de Backend/database/usuarios.sql
```

### **2. Iniciar el servidor**
```bash
cd Backend
npm start
```

### **3. Abrir la aplicación**
```
http://localhost:3000
```

### **4. Probar Registro**
1. Click en ícono de usuario
2. Click en "Regístrate"
3. Llenar formulario:
   - Nombre: Juan Diego Pérez
   - Email: juan@ejemplo.com
   - Contraseña: 123456
   - Confirmar: 123456
4. Click en "Registrarse"
5. Deberías ver: "¡Registro exitoso! Bienvenido Juan Diego Pérez"

### **5. Probar Login**
1. Click en ícono de usuario
2. Llenar formulario:
   - Email: juan@ejemplo.com
   - Contraseña: 123456
3. Click en "Iniciar Sesión"
4. Deberías ver: "¡Bienvenido de nuevo, Juan Diego Pérez!"

### **6. Verificar en Base de Datos**
```sql
SELECT * FROM usuarios;
```

Deberías ver tu usuario registrado con:
- `password_hash` (texto largo cifrado, NO la contraseña en texto plano)
- `fecha_registro` (timestamp actual)
- `activo` (1)

### **7. Verificar Token en localStorage**
1. Abre DevTools (F12)
2. Tab "Application" o "Almacenamiento"
3. localStorage > http://localhost:3000
4. Deberías ver:
   - `auth_token`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - `user_data`: {"id":1,"nombre_completo":"Juan Diego Pérez","email":"juan@ejemplo.com"}

---

## 🐛 Troubleshooting

### **Error: "Cannot find module 'bcrypt'"**
```bash
cd Backend
npm install bcrypt jsonwebtoken
```

### **Error: "Table 'Barberia.usuarios' doesn't exist"**
```bash
# Ejecuta el SQL en phpMyAdmin:
# Backend/database/usuarios.sql
```

### **Error: "Error de conexión. Intenta nuevamente."**
- Verifica que el servidor Node.js esté corriendo
- Revisa la consola del navegador (F12) para ver detalles
- Verifica que el puerto 3000 esté libre

### **El modal no se cierra después de registrarse**
- Revisa la consola del navegador
- Verifica que `auth-modal.js` esté cargado
- Asegúrate de que el response del backend tenga `success: true`

---

## 📊 Próximas Mejoras (Opcional)

1. **Recuperación de contraseña**
   - Envío de email con token de reseteo
   - Formulario para nueva contraseña

2. **Verificación de email**
   - Email de confirmación al registrarse
   - Activación de cuenta mediante link

3. **Roles de usuario**
   - Admin, Cliente, Barbero
   - Permisos diferenciados

4. **Perfil de usuario**
   - Página para editar datos
   - Cambiar contraseña
   - Historial de reservas

5. **Límite de intentos fallidos**
   - Bloqueo temporal después de X intentos
   - Prevención de fuerza bruta

---

## 📞 Soporte

Para problemas o preguntas:
1. Verifica la consola del navegador (F12)
2. Revisa los logs del servidor Node.js
3. Confirma que la tabla `usuarios` exista en MySQL

---

**Desarrollado para**: Prestige Barbers  
**Fecha**: Octubre 2025  
**Estado**: ✅ Funcional y listo para producción
