// ==================== PROTECCIÓN DE AUTENTICACIÓN DEL PANEL ADMIN ====================

/**
 * Verifica si el usuario tiene sesión activa y es administrador
 * Si no, redirige al login o a la página principal
 */
async function checkAdminAuthentication() {
    try {
        // Obtener token JWT del localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.warn('⚠️  No hay sesión activa. Redirigiendo al login...');
            redirectToLogin();
            return false;
        }

        // Verificar autenticación con la API
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.warn('⚠️  Token inválido o expirado. Redirigiendo al login...');
            localStorage.removeItem('authToken');
            redirectToLogin();
            return false;
        }

        const user = await response.json();

        // Verificar si el usuario es administrador
        if (user.rol !== 'admin') {
            console.error('❌ Acceso denegado. Solo administradores pueden acceder a esta página.');
            redirectToHome();
            return false;
        }

        console.log('✅ Acceso permitido. Bienvenido,', user.nombre_completo);
        return true;

    } catch (error) {
        console.error('❌ Error al verificar autenticación:', error);
        redirectToLogin();
        return false;
    }
}

/**
 * Redirige a la página de login
 */
function redirectToLogin() {
    showAuthModal();
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
 * Añade un botón de logout a la página
 */
function addLogoutButton() {
    const header = document.querySelector('header') || document.querySelector('body');
    
    if (!document.getElementById('logoutBtn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logoutBtn';
        logoutBtn.textContent = '🚪 Cerrar Sesión';
        logoutBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #dc3545;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
            font-weight: bold;
        `;
        
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            window.location.href = '/';
        });
        
        document.body.appendChild(logoutBtn);
    }
}

// Ejecutar verificación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkAdminAuthentication();
    
    if (isAuthenticated) {
        addLogoutButton();
    }
});
