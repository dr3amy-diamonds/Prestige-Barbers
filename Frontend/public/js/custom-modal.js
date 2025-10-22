// Sistema de modales personalizados para Prestige Barbers
// Mantiene la estética blanco y negro (#1b1b1b)

class CustomModal {
    constructor() {
        this.createModalContainer();
    }

    createModalContainer() {
        // Crear el contenedor del modal si no existe
        if (!document.getElementById('custom-modal-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'custom-modal-overlay';
            overlay.className = 'custom-modal-overlay';
            
            const modalBox = document.createElement('div');
            modalBox.id = 'custom-modal-box';
            modalBox.className = 'custom-modal-box';
            
            overlay.appendChild(modalBox);
            document.body.appendChild(overlay);
        }
    }

    // Modal de confirmación (reemplaza confirm())
    showConfirm(message, title = 'Confirmación') {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-modal-overlay');
            const modalBox = document.getElementById('custom-modal-box');
            
            modalBox.innerHTML = `
                <div class="custom-modal-header">
                    <h3>${title}</h3>
                </div>
                <div class="custom-modal-body">
                    <p>${message}</p>
                </div>
                <div class="custom-modal-footer">
                    <button class="custom-modal-btn custom-modal-btn-cancel" id="modal-cancel">Cancelar</button>
                    <button class="custom-modal-btn custom-modal-btn-confirm" id="modal-confirm">Aceptar</button>
                </div>
            `;
            
            overlay.style.display = 'flex';
            
            // Enfocar el botón de aceptar
            setTimeout(() => {
                document.getElementById('modal-confirm').focus();
            }, 100);
            
            // Manejar clicks
            document.getElementById('modal-confirm').onclick = () => {
                overlay.style.display = 'none';
                resolve(true);
            };
            
            document.getElementById('modal-cancel').onclick = () => {
                overlay.style.display = 'none';
                resolve(false);
            };
            
            // Cerrar con ESC
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    overlay.style.display = 'none';
                    resolve(false);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    }

    // Modal de prompt (reemplaza prompt())
    showPrompt(message, title = 'Ingresa información', type = 'text', placeholder = '') {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-modal-overlay');
            const modalBox = document.getElementById('custom-modal-box');
            
            modalBox.innerHTML = `
                <div class="custom-modal-header">
                    <h3>${title}</h3>
                </div>
                <div class="custom-modal-body">
                    <p>${message}</p>
                    <input type="${type}" id="modal-input" class="custom-modal-input" placeholder="${placeholder}" />
                </div>
                <div class="custom-modal-footer">
                    <button class="custom-modal-btn custom-modal-btn-cancel" id="modal-cancel">Cancelar</button>
                    <button class="custom-modal-btn custom-modal-btn-confirm" id="modal-confirm">Aceptar</button>
                </div>
            `;
            
            overlay.style.display = 'flex';
            
            const input = document.getElementById('modal-input');
            
            // Enfocar el input
            setTimeout(() => {
                input.focus();
            }, 100);
            
            // Manejar Enter en el input
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    overlay.style.display = 'none';
                    resolve(input.value || null);
                }
            });
            
            // Manejar clicks
            document.getElementById('modal-confirm').onclick = () => {
                overlay.style.display = 'none';
                resolve(input.value || null);
            };
            
            document.getElementById('modal-cancel').onclick = () => {
                overlay.style.display = 'none';
                resolve(null);
            };
            
            // Cerrar con ESC
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    overlay.style.display = 'none';
                    resolve(null);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    }

    // Modal de alerta (reemplaza alert())
    showAlert(message, title = 'Aviso') {
        return new Promise((resolve) => {
            const overlay = document.getElementById('custom-modal-overlay');
            const modalBox = document.getElementById('custom-modal-box');
            
            modalBox.innerHTML = `
                <div class="custom-modal-header">
                    <h3>${title}</h3>
                </div>
                <div class="custom-modal-body">
                    <p>${message}</p>
                </div>
                <div class="custom-modal-footer">
                    <button class="custom-modal-btn custom-modal-btn-confirm" id="modal-ok">Aceptar</button>
                </div>
            `;
            
            overlay.style.display = 'flex';
            
            // Enfocar el botón
            setTimeout(() => {
                document.getElementById('modal-ok').focus();
            }, 100);
            
            // Manejar click
            document.getElementById('modal-ok').onclick = () => {
                overlay.style.display = 'none';
                resolve(true);
            };
            
            // Cerrar con ESC o Enter
            const keyHandler = (e) => {
                if (e.key === 'Escape' || e.key === 'Enter') {
                    overlay.style.display = 'none';
                    resolve(true);
                    document.removeEventListener('keydown', keyHandler);
                }
            };
            document.addEventListener('keydown', keyHandler);
        });
    }
}

// Crear instancia global
window.customModal = new CustomModal();
