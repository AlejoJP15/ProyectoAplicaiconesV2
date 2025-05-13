from backend.connection.db_config import db

class Session(db.Model):
    __tablename__ = 'sesiones'

    id_sesion = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id_usuario'), nullable=False)
    dispositivo = db.Column(db.String(100), nullable=False)
    canal = db.Column(db.String(50), nullable=False)
    inicio_sesion = db.Column(db.DateTime, nullable=False)
    fin_sesion = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Session {self.id_sesion}>'