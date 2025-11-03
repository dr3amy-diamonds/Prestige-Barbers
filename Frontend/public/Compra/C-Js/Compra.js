// Datos estáticos del producto Crema Skala
const productoSkala = {
    id: 1,
    marca: "SKALA",
    nombre: "Crema Skala Expert",
    descripcion: "La Crema Skala Expert es un tratamiento capilar de alta calidad diseñado para nutrir, hidratar y restaurar el cabello dañado. Con una fórmula enriquecida con ingredientes naturales, esta crema proporciona una hidratación profunda, dejando el cabello suave, brillante y manejable. Ideal para todo tipo de cabello, especialmente para cabello seco, maltratado o con frizz. Su textura cremosa se absorbe rápidamente sin dejar residuos grasos, aportando vitalidad y fuerza desde la raíz hasta las puntas.",
    tamano: "1000g",
    categoria: "Cuidado Capilar",
    tipo: "Crema de Tratamiento",
    precio: "38.800$",
    imagen: "../I-img/Skala.png"
};

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
    cargarProducto();
    configurarEventos();
});

// Función para cargar el producto
function cargarProducto() {
    try {
        // Simular carga
        setTimeout(() => {
            // Configurar imagen
            productImage.src = productoSkala.imagen;
            productImage.alt = productoSkala.nombre;
            productImage.style.display = 'block';

            // Configurar información del producto
            productBrand.textContent = productoSkala.marca;
            productName.textContent = productoSkala.nombre;
            productDescription.textContent = productoSkala.descripcion;
            productSize.textContent = productoSkala.tamano;
            productCategory.textContent = productoSkala.categoria;
            productType.textContent = productoSkala.tipo;
            productPrice.textContent = productoSkala.precio;

            // Ocultar loader y mostrar contenido
            pageLoader.classList.add('hidden');
            mainContent.classList.add('loaded');
        }, 800);
    } catch (error) {
        console.error('Error al cargar el producto:', error);
        pageLoader.innerHTML = '<p>Error al cargar el producto. Por favor, intenta nuevamente.</p>';
    }
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
