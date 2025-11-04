// ==================== CARGAR ÚLTIMOS 4 PRODUCTOS EN HOME ====================
// Este script carga dinámicamente los últimos 4 productos agregados al sistema
// y actualiza la sección "Shop" del index.html

// Usar URL relativa para que funcione tanto en localhost como en red
const API_URL = '/api';

// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛍️ Iniciando carga de últimos productos...');
    cargarUltimosProductos();
});

// Función principal para cargar los últimos 4 productos
async function cargarUltimosProductos() {
    try {
        console.log('📡 Consultando API:', `${API_URL}/productos`);
        
        const response = await fetch(`${API_URL}/productos`);
        const data = await response.json();
        
        if (data.success && data.productos && data.productos.length > 0) {
            // Los productos ya vienen ordenados por ID DESC, tomamos los primeros 4
            const ultimosCuatro = data.productos.slice(0, 4);
            console.log('✅ Últimos productos cargados:', ultimosCuatro);
            
            actualizarSeccionProductos(ultimosCuatro);
        } else {
            console.warn('⚠️ No hay productos disponibles');
            mostrarMensajeNoProductos();
        }
        
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        mostrarMensajeError();
    }
}

// Actualizar la sección Shop del home con los productos
function actualizarSeccionProductos(productos) {
    const shopButtons = [
        document.getElementById('btn-crema-skala'),
        document.getElementById('btn-serum-natura'),
        document.getElementById('btn-shampoo-milagros'),
        document.getElementById('btn-tratamiento-caba')
    ];
    
    // Obtener todos los labels de los productos (2 por cada producto: nombre y precio)
    const shopItems = document.querySelectorAll('.shop-btn-item');
    
    productos.forEach((producto, index) => {
        if (shopButtons[index] && shopItems[index]) {
            const button = shopButtons[index];
            const labels = shopItems[index].querySelectorAll('label');
            
            // Actualizar imagen de fondo del botón
            button.style.backgroundImage = `url('${producto.imagen}')`;
            button.style.backgroundSize = 'cover';
            button.style.backgroundPosition = 'center';
            
            // Actualizar el onclick para ir a la página de detalle con el ID correcto
            button.onclick = () => {
                window.location.href = `Compra/index.html?id=${producto.id}`;
            };
            
            // Actualizar los labels (nombre y precio)
            if (labels[0]) {
                labels[0].textContent = producto.nombre;
            }
            if (labels[1]) {
                labels[1].textContent = `Desde ${formatearPrecio(producto.precio)}`;
            }
            
            console.log(`🎨 Producto ${index + 1} renderizado:`, producto.nombre);
        }
    });
    
    console.log('✅ Sección Shop actualizada con últimos productos');
}

// Formatear precio en pesos colombianos
function formatearPrecio(precio) {
    const precioNum = parseInt(precio);
    return `$${precioNum.toLocaleString('es-CO')}`;
}

// Mostrar mensaje cuando no hay productos
function mostrarMensajeNoProductos() {
    const shopContainer = document.querySelector('.shop-cont');
    if (shopContainer) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No hay productos disponibles en este momento.';
        mensaje.style.cssText = 'text-align: center; color: #666; padding: 20px;';
        shopContainer.appendChild(mensaje);
    }
}

// Mostrar mensaje de error
function mostrarMensajeError() {
    const shopContainer = document.querySelector('.shop-cont');
    if (shopContainer) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'Error al cargar productos. Por favor, intenta más tarde.';
        mensaje.style.cssText = 'text-align: center; color: #dc3545; padding: 20px;';
        shopContainer.appendChild(mensaje);
    }
}

console.log('✅ Script de últimos productos cargado');
