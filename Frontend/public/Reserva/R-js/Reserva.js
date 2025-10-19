// ==================== SISTEMA DE RESERVAS ====================
document.addEventListener('DOMContentLoaded', async () => {
    // Referencias a elementos del DOM
    const loader = document.getElementById('pageLoader');
    const mainContent = document.getElementById('mainContent');
    
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    const itemType = urlParams.get('type'); // 'corte' o 'barba'

    if (!itemId || !itemType) {
        console.error('Faltan parámetros en la URL');
        ocultarLoader();
        mostrarError('No se especificó qué servicio deseas reservar.');
        return;
    }

    try {
        // Cargar información del corte o barba
        await cargarInformacionServicio(itemId, itemType);
        
        // Cargar barberos disponibles
        await cargarBarberosEspecializados(itemId, itemType);
        
        // Configurar manejo de selección de barberos
        configurarSeleccionBarberos();
        
        // Ocultar loader y mostrar contenido con animación
        ocultarLoader();
        mostrarContenido();
        
    } catch (error) {
        console.error('Error al cargar la página de reserva:', error);
        ocultarLoader();
        mostrarError('Hubo un error al cargar la información del servicio.');
    }
});

// Ocultar loader
function ocultarLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

// Mostrar contenido principal con animación
function mostrarContenido() {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        // Pequeño delay para transición suave
        setTimeout(() => {
            mainContent.classList.add('loaded');
        }, 50);
    }
}

// Cargar información del servicio (corte o barba)
async function cargarInformacionServicio(id, tipo) {
    try {
        const endpoint = tipo === 'corte' ? `/api/cortes_admin/${id}` : `/api/barbas_admin/${id}`;
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Servicio no encontrado');
            }
            throw new Error('Error al cargar el servicio');
        }
        
        const servicio = await response.json();
        
        // Actualizar el DOM con la información del servicio
        actualizarInformacionServicio(servicio, tipo);
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Actualizar la información en la página
function actualizarInformacionServicio(servicio, tipo) {
    // Actualizar imagen
    const imgElement = document.getElementById('serviceImage');
    if (imgElement) {
        imgElement.src = servicio.imagen;
        imgElement.alt = servicio.nombre;
        imgElement.style.display = 'block'; // Mostrar imagen una vez cargada
    }
    
    // Actualizar tipo de servicio
    const tipoLabel = document.getElementById('serviceType');
    if (tipoLabel) {
        tipoLabel.textContent = tipo === 'corte' ? 'Corte de Cabello' : 'Corte de Barba';
    }
    
    // Actualizar título del documento
    document.title = `${servicio.nombre} - Prestige Barbers`;
    
    // Actualizar nombre del servicio
    const nombreElement = document.getElementById('serviceName');
    if (nombreElement) {
        nombreElement.textContent = servicio.nombre;
    }
    
    // Actualizar descripción con precio
    const descripcionElement = document.getElementById('serviceDescription');
    if (descripcionElement) {
        let textoDescripcion = servicio.descripcion || 'Descripción no disponible.';
        
        // Agregar precio si existe
        if (servicio.precio) {
            const precioFormatted = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(servicio.precio);
            
            textoDescripcion += ` Precio: ${precioFormatted}`;
        }
        
        descripcionElement.textContent = textoDescripcion;
    }
}

// Cargar barberos especializados según el tipo de servicio
async function cargarBarberosEspecializados(idServicio, tipo) {
    try {
        const response = await fetch('/api/barberos');
        
        if (!response.ok) throw new Error('Error al cargar barberos');
        
        const todosBarberos = await response.json();
        
        // Filtrar barberos SOLO según el tipo de servicio (sin validar cortes asignados)
        let barberosDisponibles = [];
        
        if (tipo === 'corte') {
            // Mostrar barberos que sean "Peluquero" o "Ambos" (Peluqueros Barberos)
            barberosDisponibles = todosBarberos.filter(barbero => {
                return barbero.tipo === 'Peluquero' || barbero.tipo === 'Ambos';
            });
        } else if (tipo === 'barba') {
            // Mostrar barberos que sean "Barbero" o "Ambos" (Peluqueros Barberos)
            barberosDisponibles = todosBarberos.filter(barbero => {
                return barbero.tipo === 'Barbero' || barbero.tipo === 'Ambos';
            });
        }
        
        // Actualizar el label de barberos
        const labelBarberos = document.getElementById('barbersLabel');
        if (labelBarberos) {
            if (tipo === 'corte') {
                labelBarberos.textContent = barberosDisponibles.length > 0 
                    ? 'Peluqueros Disponibles' 
                    : 'No hay peluqueros disponibles';
            } else {
                labelBarberos.textContent = barberosDisponibles.length > 0 
                    ? 'Barberos Disponibles' 
                    : 'No hay barberos disponibles';
            }
        }
        
        // Renderizar botones de barberos
        renderizarBarberos(barberosDisponibles);
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Renderizar botones de barberos
function renderizarBarberos(barberos) {
    const container = document.getElementById('barbersContainer');
    
    if (!container) return;
    
    // Limpiar botones existentes
    container.innerHTML = '';
    
    if (barberos.length === 0) {
        container.innerHTML = '<p style="color: #666; font-size: 0.9em;">No hay barberos disponibles para este servicio.</p>';
        return;
    }
    
    // Crear un botón por cada barbero (sin límite, mostrar todos)
    barberos.forEach(barbero => {
        const button = document.createElement('button');
        button.setAttribute('data-barbero-id', barbero.id);
        button.setAttribute('data-barbero-nombre', barbero.nombre);
        button.style.backgroundImage = `url(${barbero.imagen})`;
        button.title = barbero.nombre;
        
        container.appendChild(button);
    });
}

// Configurar selección de barberos (solo uno a la vez)
function configurarSeleccionBarberos() {
    // Usar delegación de eventos para botones dinámicos
    const container = document.getElementById('barbersContainer');
    
    if (!container) return;
    
    container.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        
        if (!button) return;
        
        // Si el botón ya está seleccionado, lo deselecciona
        if (button.classList.contains('selected')) {
            button.classList.remove('selected');
        } else {
            // Deselecciona todos los demás botones
            container.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('selected');
            });
            // Selecciona el botón clickeado
            button.classList.add('selected');
        }
    });
}

// Función auxiliar para mostrar errores
function mostrarError(mensaje) {
    // Mostrar el contenido principal primero
    mostrarContenido();
    
    const mainContainer = document.getElementById('mainContent');
    if (mainContainer) {
        mainContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 60vh; padding: 40px; text-align: center;">
                <h2 style="color: #dc3545; margin-bottom: 20px;">⚠️ Error</h2>
                <p style="color: #333; font-size: 1.1em; margin-bottom: 30px;">${mensaje}</p>
                <a href="../index.html" style="display: inline-block; padding: 15px 40px; background: #1b1b1b; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 600; transition: background 0.3s;">
                    Volver al inicio
                </a>
            </div>
        `;
    }
}
