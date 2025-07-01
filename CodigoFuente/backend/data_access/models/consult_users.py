from backend.connection.db_config import db
from datetime import datetime
class User(db.Model):
    __tablename__ = 'usuarios'
    id_usuario = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), unique=True, nullable=False)
    contraseña = db.Column(db.String(100), nullable=False)
    rol = db.Column(db.String(50), nullable=False, default='usuario')
    fecha_registro = db.Column(db.DateTime, default=datetime.now)
    intentos_fallidos = db.Column(db.Integer, default=0, nullable=False)  # Contador de intentos
    bloqueo_hasta = db.Column(db.DateTime, nullable=True)  # Fecha de desbloqueo si el usuario es bloqueado
    def __repr__(self):
        return f'<User {self.correo}>'