from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine

# Importar las rutas
from routers import tareas

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SGJ369 Agenda API",
    description="API para gestionar una agenda digital de tareas.",
    version="1.0.0"
)

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas de tareas
app.include_router(tareas.router, prefix="/tareas", tags=["tareas"])

@app.get("/", tags=["root"])
def read_root():
    """
    Endpoint base de bienvenida API.
    """
    return {"message": "Bienvenido a SGJ369 Agenda API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
