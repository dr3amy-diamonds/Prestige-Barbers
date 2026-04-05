// ==================== PROTECCIÓN DE AUTENTICACIÓN DEL PANEL ADMIN ====================

/**
 * Verifica si el usuario tiene sesión activa y es administrador
 * Si no, redirige al login o a la página principal
 */
function checkAdminAuthentication() {
    try {
        console.log('🔐 Verificando autenticación de admin...');
        
        // 1. Obtener token JWT del localStorage
        const token = localStorage.getItem('auth_token');
        console.log('Token encontrado:', token ? '✅' : '❌');
        
        if (!token) {
            console.warn('⚠️  No hay sesión activa. Redirigiendo a login...');
            redirectToLogin();
            return false;
        }

        // 2. Obtener datos del usuario del localStorage
        const userData = localStorage.getItem('user_data');
        console.log('User data encontrado:', userData ? '✅' : '❌');
        
        if (!userData) {
            console.warn('⚠️  No hay datos de usuario. Redirigiendo a login...');
            redirectToLogin();
            return false;
        }
        
        let userObj;
        try {
            userObj = JSON.parse(userData);
        } catch (e) {
            console.error('❌ Error al parsear user_data:', e);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            redirectToLogin();
            return false;
        }
        
        console.log('Usuario:', userObj.nombre_completo);
        console.log('Rol:', userObj.rol);
        
        // 3. Verificar si el usuario es administrador
        if (userObj.rol !== 'admin') {
            console.error('❌ Acceso denegado. Solo administradores pueden acceder a esta página.');
            console.error('   Rol del usuario:', userObj.rol);
            redirectToHome();
            return false;
        }

        console.log('✅ Acceso permitido. Bienvenido,', userObj.nombre_completo);
        addLogoutButton();
        return true;

    } catch (error) {
        console.error('❌ Error al verificar autenticación:', error);
        redirectToLogin();
        return false;
    }
}

/**
 * Redirige a la página de perfil (donde pueden iniciar sesión como admin)
 */
function redirectToLogin() {
    // Redirigir a la página de perfil para que inicie sesión
    window.location.href = '/perfil/?redirectToAdmin=true';
}

/**
 * Redirige a la página principal
 */
function redirectToHome() {
    window.location.href = '/';
}

/**
 * Muestra el modal de autenticación (login)
 * Asume que existe en el HTML principal
 */
function showAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'flex';
    } else {
        // Si no existe el modal, redirigir a home
        window.location.href = '/';
    }
}

/**
 * Añade un enlace de logout al nav
 */
function addLogoutButton() {
    if (document.getElementById('logoutBtn')) return;

    const nav = document.querySelector('.nav-buttons');
    if (nav) {
        const link = document.createElement('a');
        link.id = 'logoutBtn';
        link.href = '#';
        link.textContent = 'Cerrar Sesión';
        link.style.cssText = 'border-left: 1px solid #1B1B1B;';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            window.location.href = '/';
        });
        nav.appendChild(link);
    }
}

// Ejecutar verificación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = checkAdminAuthentication();
    
    if (isAuthenticated) {
        addLogoutButton();
    }
});
