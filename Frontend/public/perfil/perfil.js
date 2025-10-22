// ==================== VERIFICAR SESIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔵 Página de perfil cargada');
    
    // Primero verificar si hay sesión
    if (!verificarSesionActiva()) {
        return; // Si no hay sesión, se redirigirá
    }
    
    // Si hay sesión, cargar todo
    cargarDatosUsuario();
    inicializarTabs();
    inicializarEdicion();
    mostrarBadgeEnHeader(); // Mostrar badge en el header
});

// ==================== VERIFICAR QUE EL USUARIO ESTÉ AUTENTICADO ====================
function verificarSesionActiva() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    console.log('🔐 Verificando sesión...');
    console.log('  - Token:', token ? '✅ Existe' : '❌ No existe');
    console.log('  - UserData:', userData ? '✅ Existe' : '❌ No existe');
    
    if (!token || !userData) {
        // No hay sesión activa, redirigir a inicio
        console.log('❌ No hay sesión activa, redirigiendo...');
        mostrarMensaje('Debes iniciar sesión para acceder a tu perfil', 'error');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
        return false;
    }
    
    console.log('✅ Sesión activa encontrada');
    return true;
}

// ==================== CARGAR DATOS DEL USUARIO DESDE BASE DE DATOS ====================
async function cargarDatosUsuario() {
    const token = localStorage.getItem('auth_token');
    
    console.log('🔍 Token encontrado:', token ? 'Sí' : 'No');
    
    if (!token) {
        console.error('❌ No hay token disponible');
        cargarDatosDesdeLocalStorage();
        return;
    }
    
    try {
        console.log('📡 Haciendo petición a /api/auth/me...');
        
        // Hacer petición al backend para obtener datos actualizados
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 Respuesta recibida, status:', response.status);
        
        const data = await response.json();
        console.log('📦 Datos recibidos:', data);
        
        if (data.success && data.user) {
            const user = data.user;
            
            // Actualizar localStorage con datos frescos
            localStorage.setItem('user_data', JSON.stringify(user));
            
            // Actualizar avatar
            const avatarInitial = document.getElementById('avatarInitial');
            if (avatarInitial) {
                avatarInitial.textContent = user.nombre_completo.charAt(0).toUpperCase();
            }
            
            // Actualizar nombre y email en header
            const nombreUsuario = document.getElementById('nombreUsuario');
            const emailUsuario = document.getElementById('emailUsuario');
            
            if (nombreUsuario) nombreUsuario.textContent = user.nombre_completo;
            if (emailUsuario) emailUsuario.textContent = user.email;
            
            // Actualizar campos de formulario
            const editNombre = document.getElementById('editNombre');
            const editEmail = document.getElementById('editEmail');
            const fechaRegistro = document.getElementById('fechaRegistro');
            
            if (editNombre) editNombre.value = user.nombre_completo;
            if (editEmail) editEmail.value = user.email;
            
            // Formatear fecha de registro
            if (fechaRegistro && user.fecha_registro) {
                const fecha = new Date(user.fecha_registro);
                const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
                fechaRegistro.value = fecha.toLocaleDateString('es-ES', opciones);
            }
            
            console.log('✅ Datos de usuario cargados desde base de datos:', user);
            
        } else {
            console.error('Error al obtener datos del usuario:', data.message);
            // Si falla, intentar con localStorage
            cargarDatosDesdeLocalStorage();
        }
        
    } catch (error) {
        console.error('Error al cargar datos de usuario:', error);
        // Si falla, intentar con localStorage
        cargarDatosDesdeLocalStorage();
    }
}

// Función auxiliar para cargar desde localStorage si falla la API
function cargarDatosDesdeLocalStorage() {
    const userData = localStorage.getItem('user_data');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            
            const avatarInitial = document.getElementById('avatarInitial');
            if (avatarInitial) {
                avatarInitial.textContent = user.nombre_completo.charAt(0).toUpperCase();
            }
            
            const nombreUsuario = document.getElementById('nombreUsuario');
            const emailUsuario = document.getElementById('emailUsuario');
            
            if (nombreUsuario) nombreUsuario.textContent = user.nombre_completo;
            if (emailUsuario) emailUsuario.textContent = user.email;
            
            const editNombre = document.getElementById('editNombre');
            const editEmail = document.getElementById('editEmail');
            const fechaRegistro = document.getElementById('fechaRegistro');
            
            if (editNombre) editNombre.value = user.nombre_completo;
            if (editEmail) editEmail.value = user.email;
            
            if (fechaRegistro && user.fecha_registro) {
                const fecha = new Date(user.fecha_registro);
                const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
                fechaRegistro.value = fecha.toLocaleDateString('es-ES', opciones);
            }
            
            console.log('✅ Datos cargados desde localStorage');
            
        } catch (error) {
            console.error('Error al parsear datos de localStorage:', error);
        }
    }
}

// ==================== SISTEMA DE TABS ====================
function inicializarTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover active de todos los botones y contenidos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Agregar active al botón clickeado
            btn.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const tabName = btn.getAttribute('data-tab');
            const tabContent = document.getElementById(`tab-${tabName}`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// ==================== EDICIÓN DE INFORMACIÓN ====================
function inicializarEdicion() {
    const btnEditarInfo = document.getElementById('btnEditarInfo');
    const btnGuardarInfo = document.getElementById('btnGuardarInfo');
    const btnCancelarInfo = document.getElementById('btnCancelarInfo');
    const btnCambiarPassword = document.getElementById('btnCambiarPassword');
    
    const editNombre = document.getElementById('editNombre');
    const editEmail = document.getElementById('editEmail');
    
    let datosOriginales = {
        nombre: editNombre?.value || '',
        email: editEmail?.value || ''
    };
    
    // Botón Editar
    if (btnEditarInfo) {
        btnEditarInfo.addEventListener('click', () => {
            // Guardar datos originales
            datosOriginales.nombre = editNombre.value;
            datosOriginales.email = editEmail.value;
            
            // Habilitar campos
            editNombre.removeAttribute('readonly');
            editEmail.removeAttribute('readonly');
            
            // Cambiar botones
            btnEditarInfo.style.display = 'none';
            btnGuardarInfo.style.display = 'inline-block';
            btnCancelarInfo.style.display = 'inline-block';
        });
    }
    
    // Botón Guardar
    if (btnGuardarInfo) {
        btnGuardarInfo.addEventListener('click', async () => {
            const nuevoNombre = editNombre.value.trim();
            const nuevoEmail = editEmail.value.trim();
            
            if (!nuevoNombre || !nuevoEmail) {
                mostrarMensaje('Por favor completa todos los campos', 'error');
                return;
            }
            
            // Deshabilitar botón durante la petición
            btnGuardarInfo.disabled = true;
            btnGuardarInfo.textContent = 'Guardando...';
            
            // TODO: Implementar endpoint en el backend para actualizar usuario
            // Por ahora solo actualizamos el localStorage
            const userData = JSON.parse(localStorage.getItem('user_data'));
            userData.nombre_completo = nuevoNombre;
            userData.email = nuevoEmail;
            localStorage.setItem('user_data', JSON.stringify(userData));
            
            // Actualizar UI
            document.getElementById('nombreUsuario').textContent = nuevoNombre;
            document.getElementById('emailUsuario').textContent = nuevoEmail;
            document.getElementById('avatarInitial').textContent = nuevoNombre.charAt(0).toUpperCase();
            
            // Actualizar badge en header si existe
            const badge = document.querySelector('.user-badge');
            if (badge) {
                badge.textContent = nuevoNombre.charAt(0).toUpperCase();
            }
            
            // Deshabilitar campos
            editNombre.setAttribute('readonly', true);
            editEmail.setAttribute('readonly', true);
            
            // Cambiar botones
            btnEditarInfo.style.display = 'inline-block';
            btnGuardarInfo.style.display = 'none';
            btnCancelarInfo.style.display = 'none';
            
            // Rehabilitar botón
            btnGuardarInfo.disabled = false;
            btnGuardarInfo.textContent = 'Guardar Cambios';
            
            mostrarMensaje('Información actualizada correctamente', 'success');
        });
    }
    
    // Botón Cancelar
    if (btnCancelarInfo) {
        btnCancelarInfo.addEventListener('click', () => {
            // Restaurar datos originales
            editNombre.value = datosOriginales.nombre;
            editEmail.value = datosOriginales.email;
            
            // Deshabilitar campos
            editNombre.setAttribute('readonly', true);
            editEmail.setAttribute('readonly', true);
            
            // Cambiar botones
            btnEditarInfo.style.display = 'inline-block';
            btnGuardarInfo.style.display = 'none';
            btnCancelarInfo.style.display = 'none';
        });
    }
    
    // Botón Cambiar Contraseña
    if (btnCambiarPassword) {
        btnCambiarPassword.addEventListener('click', async () => {
            const passwordActual = document.getElementById('passwordActual').value;
            const passwordNueva = document.getElementById('passwordNueva').value;
            const passwordConfirmar = document.getElementById('passwordConfirmar').value;
            
            if (!passwordActual || !passwordNueva || !passwordConfirmar) {
                mostrarMensaje('Por favor completa todos los campos de contraseña', 'error');
                return;
            }
            
            if (passwordNueva !== passwordConfirmar) {
                mostrarMensaje('Las nuevas contraseñas no coinciden', 'error');
                return;
            }
            
            if (passwordNueva.length < 6) {
                mostrarMensaje('La nueva contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            // Aquí iría la petición al backend para cambiar la contraseña
            mostrarMensaje('Función de cambio de contraseña en desarrollo', 'error');
            
            // Limpiar campos
            document.getElementById('passwordActual').value = '';
            document.getElementById('passwordNueva').value = '';
            document.getElementById('passwordConfirmar').value = '';
        });
    }
}

// ==================== FUNCIÓN PARA MOSTRAR MENSAJES ====================
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `auth-message ${tipo}`;
    mensajeDiv.textContent = mensaje;
    
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        font-size: 0.9em;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 400px;
        ${tipo === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
    `;
    
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 300);
    }, 4000);
}

// Agregar estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== MOSTRAR BADGE EN EL HEADER ====================
function mostrarBadgeEnHeader() {
    const userData = localStorage.getItem('user_data');
    const userIconBtn = document.querySelector('.head-icons-cont .icon-link:nth-child(3)');
    
    if (userData && userIconBtn) {
        try {
            const user = JSON.parse(userData);
            
            // Verificar si ya existe el badge
            if (!userIconBtn.querySelector('.user-badge')) {
                const badge = document.createElement('span');
                badge.className = 'user-badge';
                badge.textContent = user.nombre_completo.charAt(0).toUpperCase();
                badge.style.cssText = `
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #1b1b1b;
                    color: white;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    font-size: 10px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                `;
                
                userIconBtn.style.position = 'relative';
                userIconBtn.appendChild(badge);
                
                console.log('✅ Badge agregado en perfil:', user.nombre_completo.charAt(0).toUpperCase());
            }
            
            // Cambiar comportamiento: ya estamos en perfil, no hacer nada
            userIconBtn.onclick = (e) => {
                e.preventDefault();
            };
            
        } catch (error) {
            console.error('Error al mostrar badge:', error);
        }
    }
}

console.log('✅ Sistema de perfil cargado correctamente');
