const API_URL = 'http://localhost:8000';

let currentDate = new Date();
let selectedDate = null;
let tareas = [];

// Elementos del DOM
const currentMonthEl = document.getElementById('currentMonth');
const calendarDaysEl = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const selectedDateEl = document.getElementById('selectedDate');
const dayTasksEl = document.getElementById('dayTasks');

// Inicializar
document.addEventListener('DOMContentLoaded', async () => {
    await cargarTareas();
    renderCalendar();

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});

// Cargar tareas
async function cargarTareas() {
    try {
        const response = await fetch(`${API_URL}/tareas/`);
        tareas = await response.json();
    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
}

// Renderizar calendario
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Actualizar título
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    currentMonthEl.textContent = `${meses[month]} ${year}`;

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const firstDayIndex = firstDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDayDate = prevLastDay.getDate();

    let days = '';

    // Días del mes anterior
    for (let i = firstDayIndex; i > 0; i--) {
        const day = prevLastDayDate - i + 1;
        const date = new Date(year, month - 1, day);
        days += createDayElement(day, date, true);
    }

    // Días del mes actual
    for (let day = 1; day <= lastDayDate; day++) {
        const date = new Date(year, month, day);
        days += createDayElement(day, date, false);
    }

    // Días del siguiente mes
    const totalCells = firstDayIndex + lastDayDate;
    const nextDays = 7 - (totalCells % 7);
    if (nextDays < 7) {
        for (let day = 1; day <= nextDays; day++) {
            const date = new Date(year, month + 1, day);
            days += createDayElement(day, date, true);
        }
    }

    calendarDaysEl.innerHTML = days;
}

// Crear elemento de día
function createDayElement(day, date, otherMonth) {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

    // Contar tareas para este día
    const tasksCount = tareas.filter(t => {
        if (!t.fecha) return false;
        const taskDate = new Date(t.fecha);
        return taskDate.toDateString() === date.toDateString();
    }).length;

    const classes = [
        'calendar-day',
        otherMonth ? 'other-month' : '',
        isToday ? 'today' : '',
        isSelected ? 'selected' : ''
    ].filter(Boolean).join(' ');

    return `
        <div class="${classes}" onclick="selectDate(new Date(${date.getTime()}))">
            <span class="calendar-day-number">${day}</span>
            ${tasksCount > 0 ? `<span class="calendar-day-tasks">${tasksCount} tarea${tasksCount > 1 ? 's' : ''}</span>` : ''}
        </div>
    `;
}

// Seleccionar fecha
function selectDate(date) {
    selectedDate = date;
    renderCalendar();
    mostrarTareasDia(date);
}

// Mostrar tareas del día
function mostrarTareasDia(date) {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    selectedDateEl.textContent = `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`;

    const tareasDia = tareas.filter(t => {
        if (!t.fecha) return false;
        const taskDate = new Date(t.fecha);
        return taskDate.toDateString() === date.toDateString();
    });

    if (tareasDia.length === 0) {
        dayTasksEl.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No hay tareas para este día.</p>';
        return;
    }

    dayTasksEl.innerHTML = tareasDia.map(tarea => `
        <div class="task-card ${tarea.completada ? 'completada' : ''}" style="margin-bottom: 0.75rem;">
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
                <span>🕐 ${formatearHora(tarea.fecha)}</span>
            </div>
        </div>
    `).join('');
}

// Formatear hora
function formatearHora(fecha) {
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
