// ==================== SISTEMA DE BÚSQUEDA ELEGANTE - PRESTIGE BARBERS ====================
// Inspirado en Balenciaga - Búsqueda integrada sin modales

class SearchManager {
    constructor() {
        this.isActive = false;
        this.searchTimeout = null;
        this.documentClickHandler = null; // Guardar referencia al handler
        this.init();
    }

    init() {
        // Elementos del DOM
        this.searchIcon = document.getElementById('searchIcon') || document.querySelector('.head-icons-cont .icon-link[title="Buscar"]');
        this.headerLinks = document.querySelector('.head-lkn-cont');
        this.searchContainer = document.querySelector('.search-container');
        this.searchInput = document.querySelector('.search-input');
        this.searchClose = document.querySelector('.search-close');
        this.searchResults = document.querySelector('.search-results');

        if (!this.searchIcon || !this.headerLinks) {
            console.warn('⚠️ Elementos de búsqueda no encontrados');
            return;
        }

        // Prevenir agresivamente el autocomplete de email
        if (this.searchInput) {
            // Asegurarse que empiece deshabilitado y vacío
            this.searchInput.disabled = true;
            this.searchInput.value = '';
            
            // Atributos anti-autocomplete MÁXIMOS
            this.searchInput.setAttribute('autocomplete', 'new-password'); // Truco: confunde al navegador
            this.searchInput.setAttribute('autocorrect', 'off');
            this.searchInput.setAttribute('autocapitalize', 'off');
            this.searchInput.setAttribute('spellcheck', 'false');
            this.searchInput.setAttribute('data-form-type', 'other');
            
            // Nombre aleatorio cada vez que se carga la página
            const randomName = 'search-prestige-' + Date.now() + '-' + Math.random().toString(36).substring(7);
            this.searchInput.setAttribute('name', randomName);
            
            // ID aleatorio también
            const randomId = 'input-search-' + Date.now();
            this.searchInput.setAttribute('id', randomId);
        }

        // Event Listeners
        this.searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // Prevenir múltiples handlers
            this.openSearch();
        });

        if (this.searchClose) {
            this.searchClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeSearch();
            });
        }

        if (this.searchInput) {
            // Búsqueda en tiempo real con debounce
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            // Cerrar con ESC
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeSearch();
                }
            });
            
            // Prevenir que clicks en el input cierren la búsqueda
            this.searchInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Prevenir propagación en el contenedor de búsqueda completo
        if (this.searchContainer) {
            this.searchContainer.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Prevenir propagación en resultados
        if (this.searchResults) {
            this.searchResults.addEventListener('click', (e) => {
                // Solo propagar si es un link de resultado
                if (!e.target.closest('.search-result-item')) {
                    e.stopPropagation();
                }
            });
        }

        console.log('🔍 Sistema de búsqueda inicializado');
    }

    openSearch() {
        if (this.isActive) return; // Ya está abierta
        
        this.isActive = true;
        
        // PRIMERO: Limpiar cualquier valor residual
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.disabled = false; // Habilitar input
        }
        
        // Animar salida de links
        this.headerLinks.classList.add('search-active');
        
        // Mostrar contenedor de búsqueda
        setTimeout(() => {
            if (this.searchContainer) {
                this.searchContainer.classList.add('active');
            }
            
            // Focus en el input Y seleccionar todo (por si acaso)
            if (this.searchInput) {
                this.searchInput.focus();
                this.searchInput.select(); // Seleccionar todo el texto
                
                // Forzar limpieza después de un momento
                setTimeout(() => {
                    if (this.searchInput.value !== '') {
                        this.searchInput.value = '';
                    }
                }, 50);
            }

            // AHORA SÍ registrar el listener de cerrar al click fuera
            // Usar setTimeout para que no capture el click actual
            setTimeout(() => {
                this.addDocumentClickListener();
            }, 100);
        }, 200);
    }

    addDocumentClickListener() {
        // Remover listener anterior si existe
        this.removeDocumentClickListener();

        // Crear nuevo handler
        this.documentClickHandler = (e) => {
            // Solo procesar si está activo
            if (!this.isActive) return;

            // Verificar si el click fue fuera del área de búsqueda
            const clickedOutside = 
                !this.searchContainer.contains(e.target) && 
                !this.searchResults.contains(e.target) &&
                e.target !== this.searchIcon &&
                !this.searchIcon.contains(e.target);

            if (clickedOutside) {
                this.closeSearch();
            }
        };

        // Registrar el listener
        document.addEventListener('click', this.documentClickHandler, true); // useCapture = true
    }

    removeDocumentClickListener() {
        if (this.documentClickHandler) {
            document.removeEventListener('click', this.documentClickHandler, true);
            this.documentClickHandler = null;
        }
    }

    closeSearch() {
        if (!this.isActive) return; // Ya está cerrada
        
        this.isActive = false;
        
        // PRIMERO remover el listener de document
        this.removeDocumentClickListener();
        
        // Ocultar resultados
        if (this.searchResults) {
            this.searchResults.classList.remove('active');
            this.searchResults.innerHTML = '';
        }
        
        // Ocultar contenedor de búsqueda
        if (this.searchContainer) {
            this.searchContainer.classList.remove('active');
        }
        
        // LIMPIAR Y DESHABILITAR el input
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.disabled = true;
            this.searchInput.blur();
        }
        
        // Animar entrada de links con el mismo timing que la salida
        setTimeout(() => {
            this.headerLinks.classList.remove('search-active');
        }, 100);
    }

    async performSearch(query) {
        if (!query || query.trim().length < 2) {
            // Ocultar resultados si no hay query suficiente
            if (this.searchResults) {
                this.searchResults.classList.remove('active');
                this.searchResults.innerHTML = '';
            }
            return;
        }

        // Mostrar loader
        this.showLoader();

        try {
            // Usar el nuevo endpoint de búsqueda universal
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.success && data.results) {
                this.displayResults(data.results, query);
            } else {
                this.displayResults([], query);
            }
        } catch (error) {
            console.error('Error en búsqueda:', error);
            this.showError();
        }
    }

    showLoader() {
        if (!this.searchResults) return;

        this.searchResults.innerHTML = `
            <div class="search-loader">
                <div class="search-loader-spinner"></div>
            </div>
        `;
        this.searchResults.classList.add('active');
    }

    displayResults(results, query) {
        if (!this.searchResults) return;

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-empty">
                    <div class="search-empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                    </div>
                    <p>No se encontraron resultados para "${query}"</p>
                </div>
            `;
            this.searchResults.classList.add('active');
            return;
        }

        // Limitar a 10 resultados
        const limitedResults = results.slice(0, 10);

        const resultsHTML = limitedResults.map(item => {
            // Determinar el tipo de badge
            let typeLabel = '';
            if (item.type === 'producto') typeLabel = 'PRODUCTO';
            else if (item.type === 'corte') typeLabel = 'CORTE';
            else if (item.type === 'barba') typeLabel = 'BARBA';

            return `
                <div class="search-result-item" onclick="window.location.href='${item.url}'">
                    <div class="search-result-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="search-result-info">
                        <span class="search-result-type">${typeLabel}</span>
                        <p class="search-result-name">${item.name}</p>
                        <p class="search-result-category">${item.category}</p>
                    </div>
                    <div class="search-result-price">$${this.formatPrice(item.price)}</div>
                </div>
            `;
        }).join('');

        this.searchResults.innerHTML = resultsHTML;
        this.searchResults.classList.add('active');
    }

    showError() {
        if (!this.searchResults) return;

        this.searchResults.innerHTML = `
            <div class="search-empty">
                <p>Error al realizar la búsqueda</p>
            </div>
        `;
        this.searchResults.classList.add('active');
    }

    formatPrice(price) {
        return parseFloat(price).toLocaleString('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.searchManager = new SearchManager();
});
