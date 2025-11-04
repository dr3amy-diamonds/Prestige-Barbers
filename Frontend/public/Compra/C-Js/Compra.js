// ==================== PÁGINA DE DETALLE DE PRODUCTO DINÁMICA ====================
const API_URL = 'http://localhost:3000/api';

// Obtener ID del producto desde la URL
const urlParams = new URLSearchParams(window.location.search);
const productoId = urlParams.get('id');

// Elementos del DOM
const pageLoader = document.getElementById('pageLoader');
const mainContent = document.getElementById('mainContent');
const productImage = document.getElementById('productImage');
const productBrand = document.getElementById('productBrand');
const productName = document.getElementById('productName');
const productDescription = document.getElementById('productDescription');
const productSize = document.getElementById('productSize');
const productCategory = document.getElementById('productCategory');
const productType = document.getElementById('productType');
const productPrice = document.getElementById('productPrice');
const verMasBtn = document.getElementById('verMasBtn');
const descriptionFade = document.querySelector('.description-fade');
const buyButton = document.getElementById('buyButton');
const compraModal = document.getElementById('compraModal');
const closeCompraModalBtn = document.getElementById('closeCompraModalBtn');
const continueBtn = document.getElementById('continueBtn');

// Cargar información del producto al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛍️ Inicializando página de producto...');
    console.log('📦 ID del producto:', productoId);
    
    if (!productoId) {
        mostrarError('No se especificó un producto válido');
        return;
    }
    
    cargarProducto(productoId);
    configurarEventos();
});

// ==================== CARGAR PRODUCTO DESDE LA API ====================
async function cargarProducto(id) {
    try {
        console.log('📡 Consultando API:', `${API_URL}/productos/${id}`);
        
        const response = await fetch(`${API_URL}/productos/${id}`);
        const data = await response.json();
        
        console.log('📥 Respuesta recibida:', data);
        
        if (data.success && data.producto) {
            console.log('✅ Producto cargado:', data.producto);
            mostrarProducto(data.producto);
        } else {
            console.error('❌ Producto no encontrado');
            mostrarError('Producto no encontrado');
        }
        
    } catch (error) {
        console.error('❌ Error al cargar producto:', error);
        mostrarError('Error al cargar el producto. Verifica tu conexión.');
    }
}

// ==================== MOSTRAR PRODUCTO EN LA PÁGINA ====================
function mostrarProducto(producto) {
    // Configurar imagen
    productImage.src = producto.imagen;
    productImage.alt = producto.nombre;
    productImage.style.display = 'block';
    
    // Configurar información del producto
    productBrand.textContent = producto.marca;
    productName.textContent = producto.nombre;
    productDescription.textContent = producto.descripcion;
    productSize.textContent = producto.tamano;
    productCategory.textContent = producto.categoria;
    productType.textContent = producto.tipo;
    
    // Formatear precio
    const precioFormateado = formatearPrecio(producto.precio);
    productPrice.textContent = precioFormateado;
    
    // Ocultar loader y mostrar contenido
    pageLoader.classList.add('hidden');
    mainContent.classList.add('loaded');
    
    console.log('✅ Producto mostrado en la página');
}

// ==================== MOSTRAR ERROR ====================
function mostrarError(mensaje) {
    pageLoader.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3em; margin-bottom: 20px;">❌</div>
            <p style="font-size: 1.2em; color: #dc3545; margin-bottom: 20px;">${mensaje}</p>
            <a href="../Tienda/index.html" style="display: inline-block; padding: 12px 24px; background: #1b1b1b; color: white; text-decoration: none; border-radius: 4px;">
                Volver a la Tienda
            </a>
        </div>
    `;
}

// ==================== FORMATEAR PRECIO ====================
function formatearPrecio(precio) {
    const precioNum = parseInt(precio);
    return `$${precioNum.toLocaleString('es-CO')}`;
}

// Configurar todos los eventos
function configurarEventos() {
    // Botón "Ver más" de la descripción
    if (verMasBtn) {
        verMasBtn.addEventListener('click', toggleDescription);
    }

    // Botón de compra
    if (buyButton) {
        buyButton.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarModalCompra();
        });
    }

    // Cerrar modal de compra
    if (closeCompraModalBtn) {
        closeCompraModalBtn.addEventListener('click', cerrarModalCompra);
    }

    // Botón continuar en modal
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            cerrarModalCompra();
            // Opcionalmente redirigir a la tienda
            // window.location.href = '../Tienda/index.html';
        });
    }

    // Cerrar modal al hacer click fuera
    if (compraModal) {
        compraModal.addEventListener('click', (e) => {
            if (e.target === compraModal) {
                cerrarModalCompra();
            }
        });
    }

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && compraModal.classList.contains('active')) {
            cerrarModalCompra();
        }
    });
}

// Función para expandir/colapsar descripción
function toggleDescription() {
    if (productDescription.classList.contains('collapsed')) {
        // Expandir
        productDescription.classList.remove('collapsed');
        productDescription.classList.add('expanded');
        descriptionFade.classList.add('hidden');
        verMasBtn.textContent = 'Ver menos';
    } else {
        // Colapsar
        productDescription.classList.remove('expanded');
        productDescription.classList.add('collapsed');
        descriptionFade.classList.remove('hidden');
        verMasBtn.textContent = 'Ver más';
    }
}

// Mostrar modal de compra
function mostrarModalCompra() {
    if (compraModal) {
        compraModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }
}

// Cerrar modal de compra
function cerrarModalCompra() {
    if (compraModal) {
        compraModal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll del body
    }
}

// Log para debugging
console.log('Producto cargado:', productoSkala);
