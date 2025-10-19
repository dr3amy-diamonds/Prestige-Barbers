document.addEventListener('DOMContentLoaded', async () => {
    await loadBarberos();
});

async function loadBarberos() {
    try {
        const response = await fetch('/api/barberos');
        const barberos = await response.json();
        
        const container = document.getElementById('barberos-container');
        container.innerHTML = '';
        
        if (barberos.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 50px; font-size: 1.5rem;">No hay barberos registrados</p>';
            return;
        }
        
        // Cargar datos de cortes y barbas para cada barbero
        for (const barbero of barberos) {
            // Obtener las imágenes y nombres de cortes/barbas
            const cortes = await getCortesBarbero(barbero);
            const barbas = await getBarbasBarbero(barbero);
            
            // Determinar si es ID impar (imp-barb-cont) o par (par-barb-cont)
            const esImpar = barbero.id % 2 !== 0;
            
            if (esImpar) {
                container.innerHTML += createImparbBarberoHTML(barbero, cortes, barbas);
            } else {
                container.innerHTML += createParBarberoHTML(barbero, cortes, barbas);
            }
        }
    } catch (error) {
        console.error('Error al cargar barberos:', error);
        document.getElementById('barberos-container').innerHTML = 
            '<p style="text-align: center; padding: 50px; color: red;">Error al cargar los barberos</p>';
    }
}

// Obtener cortes del barbero
async function getCortesBarbero(barbero) {
    const cortes = [];
    const corteIds = [
        barbero.corte1_id,
        barbero.corte2_id,
        barbero.corte3_id,
        barbero.corte4_id
    ].filter(id => id != null);
    
    if (corteIds.length === 0) return cortes;
    
    try {
        const response = await fetch('/api/cortes_admin');
        const todosCortes = await response.json();
        
        corteIds.forEach(id => {
            const corte = todosCortes.find(c => c.id === id);
            if (corte) cortes.push(corte);
        });
    } catch (error) {
        console.error('Error al cargar cortes:', error);
    }
    
    return cortes;
}

// Obtener barbas del barbero
async function getBarbasBarbero(barbero) {
    const barbas = [];
    const barbaIds = [
        barbero.barba1_id,
        barbero.barba2_id,
        barbero.barba3_id,
        barbero.barba4_id
    ].filter(id => id != null);
    
    if (barbaIds.length === 0) return barbas;
    
    try {
        const response = await fetch('/api/barbas_admin');
        const todasBarbas = await response.json();
        
        barbaIds.forEach(id => {
            const barba = todasBarbas.find(b => b.id === id);
            if (barba) barbas.push(barba);
        });
    } catch (error) {
        console.error('Error al cargar barbas:', error);
    }
    
    return barbas;
}

// Formatear horarios
function formatHorarios(manana, tarde) {
    const horarios = [];
    if (manana) horarios.push(manana);
    if (tarde) horarios.push(tarde);
    return horarios.length > 0 ? horarios.join(' & ') : 'Sin horarios definidos';
}

// Función para seleccionar elementos aleatorios de un array
function seleccionarAleatorios(array, cantidad) {
    if (!array || array.length === 0) return [];
    if (array.length <= cantidad) return array;
    
    // Crear una copia del array para no modificar el original
    const copia = [...array];
    const seleccionados = [];
    
    for (let i = 0; i < cantidad; i++) {
        const indiceAleatorio = Math.floor(Math.random() * copia.length);
        seleccionados.push(copia[indiceAleatorio]);
        copia.splice(indiceAleatorio, 1);
    }
    
    return seleccionados;
}

// Función para intercalar dos arrays (corte, barba, corte, barba)
function intercalarArrays(array1, array2) {
    const resultado = [];
    const maxLength = Math.max(array1.length, array2.length);
    
    for (let i = 0; i < maxLength; i++) {
        if (i < array1.length) resultado.push(array1[i]);
        if (i < array2.length) resultado.push(array2[i]);
    }
    
    return resultado;
}

// Crear HTML para barbero IMPAR (fondo negro, foto derecha)
function createImparbBarberoHTML(barbero, cortes, barbas) {
    const tipoLabel = barbero.tipo === 'Peluquero' ? 'Peluquero' : 
                      barbero.tipo === 'Barbero' ? 'Barbero' : 'Barbero y Peluquero';
    
    const horarios = formatHorarios(barbero.horario_manana, barbero.horario_tarde);
    
    // Determinar qué mostrar según el tipo
    let trabajosHTML = '';
    if (barbero.tipo === 'Ambos') {
        // Seleccionar 2 cortes y 2 barbas aleatorios
        const cortesSeleccionados = seleccionarAleatorios(cortes, 2);
        const barbasSeleccionadas = seleccionarAleatorios(barbas, 2);
        const todosTrabajos = intercalarArrays(cortesSeleccionados, barbasSeleccionadas);
        
        trabajosHTML = `
            <h2>Cortes y Barbas Realizadas</h2>
            <div class="cort-cont">
                ${todosTrabajos.map(trabajo => `
                    <img src="${trabajo.imagen}" alt="${trabajo.nombre}" title="${trabajo.nombre}">
                `).join('')}
            </div>
        `;
    } else if (barbero.tipo === 'Peluquero') {
        trabajosHTML = `
            <h2>Cortes Hechos</h2>
            <div class="cort-cont">
                ${cortes.map(corte => `
                    <img src="${corte.imagen}" alt="${corte.nombre}" title="${corte.nombre}">
                `).join('')}
            </div>
        `;
    } else if (barbero.tipo === 'Barbero') {
        trabajosHTML = `
            <h2>Barbas Realizadas</h2>
            <div class="cort-cont">
                ${barbas.map(barba => `
                    <img src="${barba.imagen}" alt="${barba.nombre}" title="${barba.nombre}">
                `).join('')}
            </div>
        `;
    }
    
    return `
        <div class="imp-barb-cont">
            <div class="inf-cont">
                <div class="res-lab-cont">
                    <a href="">reserva ahora</a>
                    <label for="">${tipoLabel}</label>
                </div>
                <div class="info-cont">
                    <h2>${barbero.nombre}</h2>
                    <p>${barbero.descripcion || 'Sin descripción'}</p>
                    ${trabajosHTML}
                    <div class="labs-divs">
                        <label for="">Disponibilidad</label>
                        <label for="">${horarios}</label>
                    </div>
                </div>
            </div>
            <div class="img-barb-cont">
                <img src="${barbero.imagen || '../Cortes/C-Imgs/Barberos/Balbero.png'}" alt="${barbero.nombre}">
            </div>
        </div>
    `;
}

// Crear HTML para barbero PAR (fondo blanco, foto izquierda)
function createParBarberoHTML(barbero, cortes, barbas) {
    const tipoLabel = barbero.tipo === 'Peluquero' ? 'Peluquero' : 
                      barbero.tipo === 'Barbero' ? 'Barbero' : 'Barbero y Peluquero';
    
    const horarios = formatHorarios(barbero.horario_manana, barbero.horario_tarde);
    
    // Determinar qué mostrar según el tipo
    let trabajosHTML = '';
    if (barbero.tipo === 'Ambos') {
        // Seleccionar 2 cortes y 2 barbas aleatorios
        const cortesSeleccionados = seleccionarAleatorios(cortes, 2);
        const barbasSeleccionadas = seleccionarAleatorios(barbas, 2);
        const todosTrabajos = intercalarArrays(cortesSeleccionados, barbasSeleccionadas);
        
        trabajosHTML = `
            <h2>Cortes y Barbas Realizadas</h2>
            <div class="cort-cont-par">
                ${todosTrabajos.map(trabajo => `
                    <img src="${trabajo.imagen}" alt="${trabajo.nombre}" title="${trabajo.nombre}">
                `).join('')}
            </div>
        `;
    } else if (barbero.tipo === 'Peluquero') {
        trabajosHTML = `
            <h2>Cortes Hechos</h2>
            <div class="cort-cont-par">
                ${cortes.map(corte => `
                    <img src="${corte.imagen}" alt="${corte.nombre}" title="${corte.nombre}">
                `).join('')}
            </div>
        `;
    } else if (barbero.tipo === 'Barbero') {
        trabajosHTML = `
            <h2>Barbas Realizadas</h2>
            <div class="cort-cont-par">
                ${barbas.map(barba => `
                    <img src="${barba.imagen}" alt="${barba.nombre}" title="${barba.nombre}">
                `).join('')}
            </div>
        `;
    }
    
    return `
        <div class="par-barb-cont">
            <div class="img-barb-cont-par">
                <img src="${barbero.imagen || '../Cortes/C-Imgs/Barberos/Black Barber.png'}" alt="${barbero.nombre}">
            </div>
            <div class="inf-cont-par">
                <div class="res-lab-cont-par">
                    <a href="">reserva ahora</a>
                    <label for="">${tipoLabel}</label>
                </div>
                <div class="info-cont-par">
                    <h2>${barbero.nombre}</h2>
                    <p>${barbero.descripcion || 'Sin descripción'}</p>
                    ${trabajosHTML}
                    <div class="labs-divs-par">
                        <label for="">Disponibilidad</label>
                        <label for="">${horarios}</label>
                    </div>
                </div>
            </div>
        </div>
    `;
}
