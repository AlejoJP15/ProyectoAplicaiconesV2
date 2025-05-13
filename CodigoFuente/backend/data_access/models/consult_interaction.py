from backend.connection.db_config import db
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey

class EmotionDetected(db.Model):
    __tablename__ = 'emociones_detectadas'
    id_emocion = db.Column(db.Integer, primary_key=True)
    id_sesion = db.Column(db.Integer, db.ForeignKey('sesiones.id_sesion'), nullable=False)
    emocion = db.Column(db.String(50), nullable=False)
    intensidad = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    origen = db.Column(db.String(50), nullable=True)

    def __repr__(self):
        return f'<EmotionDetected {self.id_emocion}>'
