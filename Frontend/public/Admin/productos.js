// URL base del backend - Usar URL relativa para que funcione en cualquier entorno
const API_URL = '/api';

// Estado global
let productos = [];
let productoEditando = null;
let imagenSeleccionada = null;

// Elementos del DOM
const productoForm = document.getElementById('productoForm');
const productosTableBody = document.getElementById('productosTableBody');
const filterCategoria = document.getElementById('filter-categoria');
const filterSearch = document.getElementById('filter-search');
const cancelBtn = document.getElementById('cancelBtn');
const btnText = document.getElementById('btnText');
const productoImagenInput = document.getElementById('producto-imagen');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const removeImageBtn = document.getElementById('removeImageBtn');

// Modal de eliminación
const deleteModal = document.getElementById('deleteModal');
const deleteProductName = document.getElementById('deleteProductName');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
let productoAEliminar = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    configurarEventos();
});

function configurarEventos() {
    // Envío del formulario
    productoForm.addEventListener('submit', handleFormSubmit);

    // Cancelar edición
    cancelBtn.addEventListener('click', cancelarEdicion);

    // Filtros
    filterCategoria.addEventListener('change', filtrarProductos);
    filterSearch.addEventListener('input', filtrarProductos);

    // Modal de eliminación
    cancelDeleteBtn.addEventListener('click', cerrarModalEliminar);
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            cerrarModalEliminar();
        }
    });
    confirmDeleteBtn.addEventListener('click', confirmarEliminacion);

    // Vista previa de imagen
    productoImagenInput.addEventListener('change', handleImageChange);
    removeImageBtn.addEventListener('click', removeImage);
}

// Manejar cambio de imagen
function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
        // Validar tamaño (5MB máximo)
        if (file.size > 5 * 1024 * 1024) {
            mostrarMensaje('La imagen no debe superar los 5MB', 'error');
            e.target.value = '';
            return;
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
            mostrarMensaje('Solo se permiten archivos de imagen', 'error');
            e.target.value = '';
            return;
        }

        // Mostrar vista previa
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreviewContainer.style.display = 'block';
            imagenSeleccionada = file;
        };
        reader.readAsDataURL(file);
    }
}

// Remover imagen
function removeImage() {
    productoImagenInput.value = '';
    imagePreviewContainer.style.display = 'none';
    imagePreview.src = '';
    imagenSeleccionada = null;
}

// Cargar productos desde el backend
async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        const data = await response.json();

        if (data.success) {
            productos = data.productos;
            renderizarProductos(productos);
        } else {
            mostrarMensaje('Error al cargar productos', 'error');
            productosTableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #dc3545;">
                        Error al cargar productos
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        productosTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #dc3545;">
                    No se pudo conectar con el servidor
                </td>
            </tr>
        `;
    }
}

// Renderizar tabla de productos
function renderizarProductos(productosArray) {
    if (productosArray.length === 0) {
        productosTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #666;">
                    No hay productos registrados
                </td>
            </tr>
        `;
        return;
    }

    productosTableBody.innerHTML = productosArray.map(producto => `
        <tr>
            <td>${producto.id}</td>
            <td><img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='../I-img/placeholder.png'"></td>
            <td><strong>${producto.marca}</strong></td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td><strong>${formatearPrecio(producto.precio)}</strong></td>
            <td>${renderizarStock(producto.stock)}</td>
            <td class="actions">
                <button class="btn-small btn-edit" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="btn-small btn-delete" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// Renderizar badge de stock
function renderizarStock(stock) {
    let clase = 'stock-disponible';
    let texto = `${stock} unidades`;

    if (stock === 0) {
        clase = 'stock-agotado';
        texto = 'Agotado';
    } else if (stock < 10) {
        clase = 'stock-bajo';
        texto = `${stock} unidades`;
    }

    return `<span class="stock-badge ${clase}">${texto}</span>`;
}

// Formatear precio
function formatearPrecio(precio) {
    return `$${parseInt(precio).toLocaleString('es-CO')}`;
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();

    // Validar imagen
    if (!productoEditando && !imagenSeleccionada) {
        mostrarMensaje('Debes seleccionar una imagen', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('marca', document.getElementById('producto-marca').value.trim());
    formData.append('nombre', document.getElementById('producto-nombre').value.trim());
    formData.append('descripcion', document.getElementById('producto-descripcion').value.trim());
    formData.append('categoria', document.getElementById('producto-categoria').value);
    formData.append('tipo', document.getElementById('producto-tipo').value.trim());
    formData.append('tamano', document.getElementById('producto-tamano').value.trim());
    formData.append('precio', document.getElementById('producto-precio').value);
    formData.append('stock', document.getElementById('producto-stock').value);
    
    if (imagenSeleccionada) {
        formData.append('imagen', imagenSeleccionada);
    }

    try {
        const url = productoEditando
            ? `${API_URL}/productos/${productoEditando}`
            : `${API_URL}/productos`;

        const method = productoEditando ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            mostrarMensaje(
                productoEditando ? 'Producto actualizado exitosamente' : 'Producto registrado exitosamente',
                'success'
            );
            productoForm.reset();
            removeImage();
            cancelarEdicion();
            cargarProductos();
        } else {
            mostrarMensaje(data.message || 'Error al guardar producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    }
}

// Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    productoEditando = id;

    // Llenar el formulario
    document.getElementById('producto-marca').value = producto.marca;
    document.getElementById('producto-nombre').value = producto.nombre;
    document.getElementById('producto-descripcion').value = producto.descripcion;
    document.getElementById('producto-categoria').value = producto.categoria;
    document.getElementById('producto-tipo').value = producto.tipo;
    document.getElementById('producto-tamano').value = producto.tamano;
    document.getElementById('producto-precio').value = producto.precio;
    document.getElementById('producto-stock').value = producto.stock;

    // Mostrar imagen actual
    if (producto.imagen) {
        imagePreview.src = producto.imagen;
        imagePreviewContainer.style.display = 'block';
    }

    // Cambiar texto del botón
    btnText.textContent = 'Actualizar Producto';

    // Scroll al formulario
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

// Cancelar edición
function cancelarEdicion() {
    productoEditando = null;
    productoForm.reset();
    removeImage();
    btnText.textContent = 'Registrar Producto';
}

// Eliminar producto
function eliminarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    productoAEliminar = id;
    deleteProductName.textContent = `${producto.marca} - ${producto.nombre}`;
    deleteModal.classList.add('active');
}

// Confirmar eliminación
async function confirmarEliminacion() {
    if (!productoAEliminar) return;

    try {
        const response = await fetch(`${API_URL}/productos/${productoAEliminar}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            mostrarMensaje('Producto eliminado exitosamente', 'success');
            cerrarModalEliminar();
            cargarProductos();
        } else {
            mostrarMensaje(data.message || 'Error al eliminar producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    }
}

// Cerrar modal de eliminar
function cerrarModalEliminar() {
    deleteModal.classList.remove('active');
    productoAEliminar = null;
}

// Filtrar productos
function filtrarProductos() {
    const categoria = filterCategoria.value.toLowerCase();
    const busqueda = filterSearch.value.toLowerCase();

    const productosFiltrados = productos.filter(producto => {
        const matchCategoria = !categoria || producto.categoria.toLowerCase() === categoria;
        const matchBusqueda = !busqueda ||
            producto.nombre.toLowerCase().includes(busqueda) ||
            producto.marca.toLowerCase().includes(busqueda);

        return matchCategoria && matchBusqueda;
    });

    renderizarProductos(productosFiltrados);
}

// Mostrar mensaje temporal
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje-toast ${tipo}`;
    mensajeDiv.textContent = mensaje;

    const color = tipo === 'success' ? '#10b981' : '#ef4444';
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${color};
        color: white;
        font-weight: 600;
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        border-radius: 0.75rem;
    `;

    document.body.appendChild(mensajeDiv);

    setTimeout(() => {
        mensajeDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 300);
    }, 3000);
}

// Hacer funciones globales para los botones inline
window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;
