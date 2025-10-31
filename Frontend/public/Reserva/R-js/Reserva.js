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

        // Restaurar barbero seleccionado si regresa de agregar servicio adicional
        restaurarBarberoSeleccionado();

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
        
        // NO agregar precio - solo mostrar descripción
        descripcionElement.textContent = textoDescripcion;
        
        // Inicializar funcionalidad "Ver más"
        inicializarVerMas();
    }
}

// Inicializar funcionalidad del botón "Ver más"
function inicializarVerMas() {
    const descripcionElement = document.getElementById('serviceDescription');
    const fadeElement = document.querySelector('.description-fade');
    const verMasBtn = document.getElementById('verMasBtn');
    
    if (!descripcionElement || !verMasBtn || !fadeElement) return;
    
    // Verificar si el texto necesita "Ver más" (si tiene más de 3 líneas)
    const lineHeight = parseFloat(window.getComputedStyle(descripcionElement).lineHeight);
    const maxHeight = lineHeight * 3; // 3 líneas
    
    // Verificar altura real del contenido
    descripcionElement.style.maxHeight = 'none';
    const contentHeight = descripcionElement.scrollHeight;
    descripcionElement.style.maxHeight = '';
    
    if (contentHeight <= maxHeight) {
        // Si el texto es corto, ocultar botón y fade
        verMasBtn.classList.add('hidden');
        fadeElement.classList.add('hidden');
        descripcionElement.classList.remove('collapsed');
        return;
    }
    
    // Si el texto es largo, configurar el toggle
    let isExpanded = false;
    
    verMasBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        
        if (isExpanded) {
            descripcionElement.classList.remove('collapsed');
            descripcionElement.classList.add('expanded');
            fadeElement.classList.add('hidden');
            verMasBtn.textContent = 'Ver menos';
        } else {
            descripcionElement.classList.remove('expanded');
            descripcionElement.classList.add('collapsed');
            fadeElement.classList.remove('hidden');
            verMasBtn.textContent = 'Ver más';
        }
    });
}

// Cargar barberos especializados según el tipo de servicio
async function cargarBarberosEspecializados(idServicio, tipo) {
    try {
        console.log('🌐 [CARGAR-BARBEROS] Consultando API /api/barberos');
        const response = await fetch('/api/barberos');

        if (!response.ok) throw new Error('Error al cargar barberos');

        const todosBarberos = await response.json();
        console.log('✅ [CARGAR-BARBEROS] Barberos obtenidos de API:', todosBarberos);

        // Verificar si hay un servicio adicional seleccionado
        // IMPORTANTE: Solo considerar servicio adicional si hay un contexto COMPLETO
        const addingAdditionalService = sessionStorage.getItem('addingAdditionalService');
        const additionalServiceData = sessionStorage.getItem('selectedAdditionalService');
        const reservationContext = sessionStorage.getItem('reservationContext');
        let additionalServiceType = null;

        console.log('🔍 [CARGAR-BARBEROS] Verificando servicio adicional en sessionStorage');
        console.log('📦 [CARGAR-BARBEROS] addingAdditionalService:', addingAdditionalService);
        console.log('📦 [CARGAR-BARBEROS] additionalServiceData:', additionalServiceData);
        console.log('📦 [CARGAR-BARBEROS] reservationContext:', reservationContext);

        // Solo usar servicio adicional si TODOS los datos están presentes (flujo completo)
        if (addingAdditionalService === 'true' && additionalServiceData && reservationContext) {
            try {
                const additionalService = JSON.parse(additionalServiceData);
                additionalServiceType = additionalService.tipo;
                console.log('✅ [CARGAR-BARBEROS] Servicio adicional encontrado (flujo completo):', additionalService);
                console.log('📋 [CARGAR-BARBEROS] Tipo de servicio adicional:', additionalServiceType);
            } catch (e) {
                console.error('❌ [CARGAR-BARBEROS] Error al parsear servicio adicional:', e);
            }
        } else {
            console.log('ℹ️ [CARGAR-BARBEROS] No hay servicio adicional o datos incompletos');

            // NO limpiar inmediatamente - dejar que modal-reserva.js lo procese primero
            // modal-reserva.js se encargará de limpiar en su método checkReturnFromServiceSelection()
            if (additionalServiceData || addingAdditionalService || reservationContext) {
                console.log('ℹ️ [CARGAR-BARBEROS] Hay datos parciales - se procesarán en modal-reserva.js');
            }
        }

        // Filtrar barberos según el tipo de servicio y servicio adicional
        let barberosDisponibles = [];

        console.log('🔍 [CARGAR-BARBEROS] Filtrando barberos - Servicio principal:', tipo, '| Servicio adicional:', additionalServiceType);

        // Si hay servicio adicional, necesitamos barberos que puedan hacer AMBOS servicios
        if (additionalServiceType) {
            console.log('➕ [CARGAR-BARBEROS] HAY servicio adicional - filtrando solo tipo "Ambos"');
            if ((tipo === 'corte' && additionalServiceType === 'barba') ||
                (tipo === 'barba' && additionalServiceType === 'corte')) {
                // Solo mostrar barberos que pueden hacer ambos (Peluqueros Barberos)
                barberosDisponibles = todosBarberos.filter(barbero => {
                    return barbero.tipo === 'Ambos';
                });
                console.log('✅ [CARGAR-BARBEROS] Barberos tipo "Ambos" filtrados:', barberosDisponibles);
            }
        } else {
            console.log('➖ [CARGAR-BARBEROS] NO hay servicio adicional - filtrando normalmente');
            // Sin servicio adicional, filtrar normalmente
            if (tipo === 'corte') {
                // Mostrar barberos que sean "Peluquero" o "Ambos" (Peluqueros Barberos)
                barberosDisponibles = todosBarberos.filter(barbero => {
                    return barbero.tipo === 'Peluquero' || barbero.tipo === 'Ambos';
                });
                console.log('✅ [CARGAR-BARBEROS] Barberos para corte (Peluquero o Ambos):', barberosDisponibles);
            } else if (tipo === 'barba') {
                // Mostrar barberos que sean "Barbero" o "Ambos" (Peluqueros Barberos)
                barberosDisponibles = todosBarberos.filter(barbero => {
                    return barbero.tipo === 'Barbero' || barbero.tipo === 'Ambos';
                });
                console.log('✅ [CARGAR-BARBEROS] Barberos para barba (Barbero o Ambos):', barberosDisponibles);
            }
        }

        // Actualizar el label de barberos
        const labelBarberos = document.getElementById('barbersLabel');
        if (labelBarberos) {
            if (additionalServiceType) {
                // Si hay servicio adicional, mostrar "Peluqueros Barberos"
                labelBarberos.textContent = barberosDisponibles.length > 0
                    ? 'Peluqueros Barberos Disponibles'
                    : 'No hay peluqueros barberos disponibles para ambos servicios';
            } else {
                // Sin servicio adicional, mostrar según tipo
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
            console.log('📝 [CARGAR-BARBEROS] Label actualizado:', labelBarberos.textContent);
        }

        // Renderizar botones de barberos
        console.log('🖼️ [CARGAR-BARBEROS] Renderizando barberos en la página');
        renderizarBarberos(barberosDisponibles);

    } catch (error) {
        console.error('❌ [CARGAR-BARBEROS] Error:', error);
        throw error;
    }
}

// Renderizar botones de barberos
function renderizarBarberos(barberos) {
    console.log('🖼️ [RENDER-BARBEROS] Iniciando renderizado de barberos');
    console.log('📋 [RENDER-BARBEROS] Cantidad de barberos a renderizar:', barberos.length);

    const container = document.getElementById('barbersContainer');

    if (!container) {
        console.error('❌ [RENDER-BARBEROS] No se encontró #barbersContainer');
        return;
    }

    // Limpiar botones existentes
    container.innerHTML = '';
    console.log('🧹 [RENDER-BARBEROS] Contenedor limpiado');

    if (barberos.length === 0) {
        container.innerHTML = '<p style="color: #666; font-size: 0.9em;">No hay barberos disponibles para este servicio.</p>';
        console.log('⚠️ [RENDER-BARBEROS] No hay barberos para mostrar');
        return;
    }

    // Crear un botón por cada barbero (sin límite, mostrar todos)
    barberos.forEach((barbero, index) => {
        console.log(`🎨 [RENDER-BARBEROS] Creando botón ${index + 1} para:`, barbero);
        const button = document.createElement('button');
        button.setAttribute('data-barbero-id', barbero.id);
        button.setAttribute('data-barbero-nombre', barbero.nombre);
        button.setAttribute('data-barbero-imagen', barbero.imagen);
        button.setAttribute('data-horario-manana', barbero.horario_manana);
        button.setAttribute('data-horario-tarde', barbero.horario_tarde);
        button.style.backgroundImage = `url(${barbero.imagen})`;
        button.title = barbero.nombre;

        container.appendChild(button);
    });
    console.log('✅ [RENDER-BARBEROS] Todos los botones renderizados');
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

// Restaurar barbero seleccionado si regresa de agregar servicio adicional
async function restaurarBarberoSeleccionado() {
    const reservationContext = sessionStorage.getItem('reservationContext');
    const additionalServiceData = sessionStorage.getItem('selectedAdditionalService');

    if (reservationContext) {
        try {
            const context = JSON.parse(reservationContext);

            // Verificar que el contexto corresponde al servicio actual
            const urlParams = new URLSearchParams(window.location.search);
            const currentServiceId = urlParams.get('id');

            if (context.serviceId === currentServiceId && context.selectedBarberId) {
                // Si hay servicio adicional, validar que el barbero pueda hacer ambos
                if (additionalServiceData) {
                    try {
                        // Obtener información del barbero seleccionado
                        const response = await fetch(`/api/barberos/${context.selectedBarberId}`);
                        if (!response.ok) throw new Error('Error al obtener barbero');

                        const barbero = await response.json();

                        // Solo restaurar si el barbero puede hacer ambos servicios
                        if (barbero.tipo !== 'Ambos') {
                            console.log(`Barbero "${barbero.nombre}" (${barbero.tipo}) no puede hacer ambos servicios. No se restaurará.`);
                            return; // No restaurar el barbero
                        }
                    } catch (error) {
                        console.error('Error al validar barbero:', error);
                        return; // No restaurar si hay error
                    }
                }

                // Buscar y seleccionar el barbero que estaba seleccionado previamente
                setTimeout(() => {
                    const barbersContainer = document.getElementById('barbersContainer');
                    if (barbersContainer) {
                        const barberButton = barbersContainer.querySelector(`button[data-barbero-id="${context.selectedBarberId}"]`);

                        if (barberButton) {
                            // Deseleccionar todos
                            barbersContainer.querySelectorAll('button').forEach(btn => {
                                btn.classList.remove('selected');
                            });

                            // Seleccionar el barbero restaurado
                            barberButton.classList.add('selected');
                            console.log('Barbero restaurado:', context.selectedBarberName);
                        } else {
                            console.log('Barbero no disponible en la lista actual (puede ser que no sea tipo "Ambos")');
                        }
                    }
                }, 100); // Pequeño delay para asegurar que los botones estén renderizados
            }
        } catch (error) {
            console.error('Error al restaurar barbero:', error);
        }
    }
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
