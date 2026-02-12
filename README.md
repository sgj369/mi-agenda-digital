# 📋 SGJ369 Agenda - Aplicación de Gestión de Tareas

Una aplicación moderna de gestión de tareas con backend FastAPI y frontend HTML/CSS/JS.

## 🚀 Características

- ✅ Crear, editar y eliminar tareas
- 📅 Vista de calendario interactivo
- 🎨 Interfaz moderna con modo oscuro
- 🏷️ Categorías y prioridades
- ⏰ Fechas y recordatorios
- 🔄 API RESTful con FastAPI
- 💾 Base de datos SQLite

## 📁 Estructura del Proyecto

```
sgj369-agenda/
├── backend/                # Backend FastAPI
│   ├── main.py             # Punto de entrada
│   ├── database.py         # Conexión a SQLite
│   ├── models.py           # Modelos SQLAlchemy
│   ├── schemas.py          # Esquemas Pydantic
│   └── database.db         # Base de datos (generada automáticamente)
├── frontend/               # Frontend
│   ├── index.html          # Tablero de tareas
│   ├── calendario.html     # Vista de calendario
│   └── assets/             # CSS y JavaScript
├── requirements.txt        # Dependencias Python
└── .gitignore              # Archivos ignorados por Git
```

## 🛠️ Instalación

### 1. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 2. Iniciar el servidor backend

```bash
cd backend
python main.py
```

El servidor estará disponible en `http://localhost:8000`

### 3. Abrir el frontend

Abre `frontend/index.html` en tu navegador, o usa un servidor local:

```bash
# Con Python
cd frontend
python -m http.server 8080

# Con Node.js (si tienes npx instalado)
cd frontend
npx serve
```

## 📖 Uso de la API

### Endpoints disponibles

- `GET /` - Mensaje de bienvenida
- `POST /tareas/` - Crear nueva tarea
- `GET /tareas/` - Listar todas las tareas
- `GET /tareas/{id}` - Obtener tarea específica
- `PUT /tareas/{id}` - Actualizar tarea
- `DELETE /tareas/{id}` - Eliminar tarea

### Documentación interactiva

FastAPI genera documentación automática:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🎨 Características del Frontend

### Tablero de Tareas (index.html)
- Formulario para crear nuevas tareas
- Lista de tareas con filtros (todas, pendientes, completadas)
- Tarjetas de tareas con prioridades visuales
- Acciones rápidas (completar, eliminar)

### Calendario (calendario.html)
- Vista mensual interactiva
- Navegación entre meses
- Indicadores de tareas por día
- Vista detallada de tareas al seleccionar un día

## 🔧 Tecnologías Utilizadas

### Backend
- **FastAPI** - Framework web moderno y rápido
- **SQLAlchemy** - ORM para base de datos
- **Pydantic** - Validación de datos
- **SQLite** - Base de datos ligera

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript** - Interactividad y llamadas a la API
- **Google Fonts (Inter)** - Tipografía moderna

## 📝 Modelo de Datos

### Tarea
- `id` - Identificador único
- `titulo` - Título de la tarea (requerido)
- `descripcion` - Descripción detallada (opcional)
- `fecha` - Fecha y hora de la tarea
- `completada` - Estado de completitud (boolean)
- `prioridad` - Nivel de prioridad (baja, media, alta)
- `categoria` - Categoría de la tarea (opcional)

## 🚀 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Tareas recurrentes
- [ ] Notificaciones push
- [ ] Exportar tareas a PDF/CSV
- [ ] Modo claro/oscuro configurable
- [ ] Búsqueda y filtros avanzados
- [ ] Subtareas y dependencias

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

SGJ369 - 2026
