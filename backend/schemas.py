from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TareaBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    fecha: Optional[datetime] = None
    completada: bool = False
    prioridad: str = "media"
    categoria: Optional[str] = None

class TareaCreate(TareaBase):
    pass

class Tarea(TareaBase):
    id: int
    
    class Config:
        from_attributes = True
