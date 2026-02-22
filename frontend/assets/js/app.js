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
        tasksList.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No hay tareas para mostrar.</p>';
        return;
    }

    const priorityIcons = {
        alta: '<svg style="width: 14px; height: 14px;" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
        media: '<svg style="width: 14px; height: 14px;" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" /></svg>',
        baja: '<svg style="width: 14px; height: 14px;" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>'
    };

    tasksList.innerHTML = tareas.map(tarea => `
        <div class="task-card ${tarea.completada ? 'completada' : ''}" data-id="${tarea.id}">
            <div class="task-header">
                <h3 class="task-title">${tarea.titulo}</h3>
                <span class="task-priority ${tarea.prioridad}">
                    ${priorityIcons[tarea.prioridad]}
                    ${tarea.prioridad}
                </span>
            </div>
            ${tarea.descripcion ? `<p class="task-description">${tarea.descripcion}</p>` : ''}
            <div class="task-meta">
                ${tarea.categoria ? `<span><svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg> ${tarea.categoria}</span>` : ''}
                ${tarea.fecha ? `<span><svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg> ${formatearFecha(tarea.fecha)}</span>` : ''}
            </div>
            <div class="task-actions">
                <button class="btn-small btn-complete" onclick="toggleCompletada(${tarea.id}, ${!tarea.completada})" title="${tarea.completada ? 'Reabrir' : 'Completar'}">
                    ${tarea.completada
            ? '<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg> Reabrir'
            : '<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> Completar'}
                </button>
                <button class="btn-small btn-delete" onclick="eliminarTarea(${tarea.id})" title="Eliminar">
                    <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    Eliminar
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
    notif.className = `notification ${tipo}`;

    // SVG icons depending on type
    const iconBase = tipo === 'success'
        ? '<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--success)"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
        : '<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--danger)"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';

    notif.innerHTML = `${iconBase} <span>${mensaje}</span>`;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'sileoPopOut 0.4s cubic-bezier(0.36, 0, 0.66, -0.56) forwards';
        setTimeout(() => notif.remove(), 400);
    }, 4000);
}

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado con éxito', reg))
            .catch(err => console.warn('Error al registrar Service Worker', err));
    });
}
