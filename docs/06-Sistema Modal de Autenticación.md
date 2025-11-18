# 🔐 Documentación del Modal de Autenticación

## 📋 Resumen

Sistema de modal de autenticación **universal y reutilizable** que funciona en todas las páginas del sitio web de Prestige Barbers, incluyendo páginas dinámicas como Reservas.

---

## 🏗️ Arquitectura

### **Archivos Involucrados:**

1. **CSS**: `Frontend/public/I-style/auth-modal.css`
2. **JavaScript**: `Frontend/public/js/auth-modal.js`
3. **HTML**: Estructura estandarizada en todas las páginas

---

## 📂 Páginas que Implementan el Modal

✅ **index.html** (Página principal)  
✅ **Cortes/index.html** (Galería de servicios)  
✅ **Barberos/index.html** (Página de barberos)  
✅ **Reserva/index.html** (Sistema de reservas - **página dinámica**)

---

## 🔧 Implementación

### **1. Incluir CSS en el `<head>`**

```html
<link rel="stylesheet" href="../I-style/auth-modal.css">
```

### **2. Incluir estructura HTML antes de cerrar `</body>`**

```html
<!-- Modal de autenticación -->
<div class="auth-modal-overlay" id="authModal">
    <div class="auth-modal-content">
        <button class="auth-modal-close" id="closeModalBtn">&times;</button>
        
        <!-- Formulario de Login -->
        <div class="log-cont" id="loginForm">
            <label for="">Iniciar Sesión</label>
            <label for="">Correo Electrónico</label>
            <input type="email" id="login-email" required>
            <label for="">Contraseña</label>
            <input type="password" id="login-password" required>
            <button type="submit">Iniciar Sesión</button>
            <div class="reg-cont">
                <label>¿No tienes una cuenta?</label>
                <button type="button" id="showRegister">Regístrate</button>
            </div>
        </div>

        <!-- Formulario de Registro -->
        <div class="log-cont" id="registerForm" style="display: none;">
            <label for="">Registro</label>
            <label for="">Nombre Completo</label>
            <input type="text" id="register-name" required>
            <label for="">Correo Electrónico</label>
            <input type="email" id="register-email" required>
            <label for="">Contraseña</label>
            <input type="password" id="register-password" required>
            <label for="">Confirmar Contraseña</label>
            <input type="password" id="register-confirm" required>
            <button type="submit">Registrarse</button>
            <div class="reg-cont">
                <label>¿Ya tienes una cuenta?</label>
                <button type="button" id="showLogin">Iniciar Sesión</button>
            </div>
        </div>
    </div>
</div>
```

### **3. Incluir JavaScript antes de cerrar `</body>`**

```html
<script src="../js/auth-modal.js"></script>
```

---

## ⚙️ Funcionamiento del JavaScript

### **Detección Automática**

El script `auth-modal.js` **detecta automáticamente** qué estructura de modal está presente en la página usando:

```javascript
const authModal = document.getElementById('authModal') || document.getElementById('authModalOverlay');
```

Esto permite compatibilidad con diferentes versiones del modal.

### **Event Listeners**

1. **Abrir Modal**: Click en ícono de usuario (`.head-icons-cont .icon-link:nth-child(3)`)
2. **Cerrar Modal**:
   - Click en botón `×` 
   - Click fuera del modal (overlay oscuro)
   - Tecla `ESC`
3. **Cambiar entre Login/Registro**: Botones internos del modal

### **Prevención de Scroll**

Cuando el modal está abierto:
- Se bloquea el scroll del `<body>`
- Se compensa el ancho del scrollbar para evitar saltos visuales

---

## 🎨 Estilos CSS

### **Características:**

- ✅ Modal deslizante desde la derecha
- ✅ Overlay oscuro con transparencia
- ✅ Animaciones suaves (300ms)
- ✅ Responsive (50% del ancho en desktop)
- ✅ Diseño minimalista con bordes negros
- ✅ Transiciones entre login/registro

### **Clases Principales:**

- `.auth-modal-overlay` - Fondo oscuro
- `.auth-modal-content` - Contenedor blanco del modal
- `.auth-modal-close` - Botón de cerrar (×)
- `.log-cont` - Formularios de login/registro
- `.reg-cont` - Sección de cambio entre formularios

---

## 🐛 Solución de Problemas

### **Problema: Modal no aparece en página de Reservas**

**Causa**: Página dinámica con carga asíncrona de contenido.

**Solución Implementada**:
1. ✅ Estandarización de estructura HTML del modal
2. ✅ JavaScript con `DOMContentLoaded` para asegurar carga completa
3. ✅ Detección automática de IDs del modal

### **Problema: JavaScript no encuentra elementos**

**Causa**: Script se ejecuta antes de que el DOM esté listo.

**Solución**: Todo el código está envuelto en:
```javascript
document.addEventListener('DOMContentLoaded', () => { ... });
```

### **Problema: Modal no se cierra correctamente**

**Verificar**:
1. Que el ID del modal sea `authModal` (estandarizado)
2. Que el botón de cerrar tenga ID `closeModalBtn`
3. Que el archivo `auth-modal.js` esté cargado

---

## 🚀 Próximos Pasos (Backend)

### **Funcionalidad Pendiente:**

1. **Autenticación JWT**
   - Endpoint `/api/auth/login`
   - Endpoint `/api/auth/register`
   - Validación de credenciales

2. **Manejo de Formularios**
   ```javascript
   // Agregar en auth-modal.js
   loginForm.addEventListener('submit', async (e) => {
       e.preventDefault();
       const email = document.getElementById('login-email').value;
       const password = document.getElementById('login-password').value;
       
       // Enviar a backend
       const response = await fetch('/api/auth/login', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email, password })
       });
       
       // Manejar respuesta...
   });
   ```

3. **Persistencia de Sesión**
   - LocalStorage/SessionStorage para token JWT
   - Actualizar UI según estado de autenticación

---

## 📝 Notas de Desarrollo

- **Versión actual**: Compatible con todas las páginas
- **Última actualización**: 21/10/2025
- **Estado**: ✅ Funcional en páginas estáticas y dinámicas
- **Pendiente**: Integración con backend para autenticación real

---

## 📞 Soporte

Para problemas o preguntas sobre el modal de autenticación:
1. Verificar que la estructura HTML sea idéntica en todas las páginas
2. Revisar consola del navegador para errores JavaScript
3. Comprobar que los IDs de elementos sean consistentes

---

**Desarrollado para**: Prestige Barbers  
**Proyecto**: Arquitectura de Software - Séptimo Semestre
