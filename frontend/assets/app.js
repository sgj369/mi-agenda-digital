const API_URL = 'http://localhost:8000';

// Elementos del DOM
const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'todas';

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarTareas();

    // Event listeners para filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            cargarTareas();
        });
    });
});

// Enviar formulario
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tarea = {
        titulo: document.getElementById('titulo').value,
        descripcion: document.getElementById('descripcion').value || null,
        prioridad: document.getElementById('prioridad').value,
        categoria: document.getElementById('categoria').value || null,
        fecha: document.getElementById('fecha').value ? new Date(document.getElementById('fecha').value).toISOString() : null,
        completada: false
    };

    try {
        const response = await fetch(`${API_URL}/tareas/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarea)
        });

        if (response.ok) {
            taskForm.reset();
            cargarTareas();
            mostrarNotificacion('Tarea creada exitosamente', 'success');
        } else {
            mostrarNotificacion('Error al crear la tarea', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error de conexión con el servidor', 'error');
    }
});

// Cargar tareas desde la API
async function cargarTareas() {
    try {
        const response = await fetch(`${API_URL}/tareas/`);
        const tareas = await response.json();

        // Filtrar tareas según el filtro actual
        let tareasFiltradas = tareas;
        if (currentFilter === 'pendientes') {
            tareasFiltradas = tareas.filter(t => !t.completada);
        } else if (currentFilter === 'completadas') {
            tareasFiltradas = tareas.filter(t => t.completada);
        }

        mostrarTareas(tareasFiltradas);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        tasksList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Error al cargar las tareas. Asegúrate de que el servidor esté corriendo.</p>';
    }
}

// Mostrar tareas en el DOM
function mostrarTareas(tareas) {
    if (tareas.length === 0) {
        tasksList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No hay tareas para mostrar.</p>';
        return;
    }

    tasksList.innerHTML = tareas.map(tarea => `
        <div class="task-card ${tarea.completada ? 'completada' : ''}" data-id="${tarea.id}">
            <div class="task-header">
                <h3 class="task-title">${tarea.titulo}</h3>
                <span class="task-priority ${tarea.prioridad}">
                    ${tarea.prioridad === 'alta' ? '🔴' : tarea.prioridad === 'media' ? '🟡' : '🟢'} 
                    ${tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1)}
                </span>
            </div>
            ${tarea.descripcion ? `<p class="task-description">${tarea.descripcion}</p>` : ''}
            <div class="task-meta">
                ${tarea.categoria ? `<span>📁 ${tarea.categoria}</span>` : ''}
                ${tarea.fecha ? `<span>📅 ${formatearFecha(tarea.fecha)}</span>` : ''}
            </div>
            <div class="task-actions">
                <button class="btn-small btn-complete" onclick="toggleCompletada(${tarea.id}, ${!tarea.completada})">
                    ${tarea.completada ? '↩️ Reabrir' : '✓ Completar'}
                </button>
                <button class="btn-small btn-delete" onclick="eliminarTarea(${tarea.id})">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Marcar tarea como completada/pendiente
async function toggleCompletada(id, completada) {
    try {
        // Primero obtener la tarea actual
        const response = await fetch(`${API_URL}/tareas/${id}`);
        const tarea = await response.json();

        // Actualizar solo el campo completada
        tarea.completada = completada;

        const updateResponse = await fetch(`${API_URL}/tareas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarea)
        });

        if (updateResponse.ok) {
            cargarTareas();
            mostrarNotificacion(completada ? 'Tarea completada' : 'Tarea reabierta', 'success');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al actualizar la tarea', 'error');
    }
}

// Eliminar tarea
async function eliminarTarea(id) {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
        const response = await fetch(`${API_URL}/tareas/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            cargarTareas();
            mostrarNotificacion('Tarea eliminada', 'success');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al eliminar la tarea', 'error');
    }
}

// Formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo) {
    // Crear elemento de notificación
    const notif = document.createElement('div');
    notif.textContent = mensaje;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${tipo === 'success' ? 'var(--success)' : 'var(--danger)'};
        color: white;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}
