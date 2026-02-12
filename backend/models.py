from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from database import Base

class Tarea(Base):
    __tablename__ = "tareas"
    
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)
    fecha = Column(DateTime, default=datetime.now)
    completada = Column(Boolean, default=False)
    prioridad = Column(String, default="media")  # baja, media, alta
    categoria = Column(String, nullable=True)
    
    def __repr__(self):
        return f"<Tarea(id={self.id}, titulo='{self.titulo}', completada={self.completada})>"
