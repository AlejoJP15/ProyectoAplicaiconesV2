from backend.connection.db_config import db
from backend.data_access.models.consult_users import User
from backend.data_access.models.consult_sesions import Session
from backend.data_access.models.consult_interaction import EmotionDetected
from datetime import datetime
from sqlalchemy import func, desc

## LOGIN USUARIO ADMINISTRADOR
def get_user_by_email(email):
    """Obtiene un usuario por su correo electrónico"""
    return User.query.filter_by(correo=email).first()

def create_session(id_usuario, dispositivo, canal):
    """Crea una nueva sesión para el usuario"""

    nueva_sesion = Session(
        id_usuario=id_usuario,
        dispositivo=dispositivo,
        canal=canal,
        inicio_sesion=db.func.now(),
        fin_sesion=None
    )
    db.session.add(nueva_sesion)
    db.session.commit()
    return nueva_sesion.id_sesion

## CERRAR SESION USUARIO ADMINISTRADOR
def close_session(id_sesion):
    """Cierra una sesión""" 
    session = Session.query.filter_by(id_sesion=id_sesion, fin_sesion=None).first()
    if not session:

        return False, "Sesión no encontrada o ya cerrada"

    session.fin_sesion = db.func.now()
    db.session.commit()
    return True, "Sesión cerrada correctamente"

## CREAR USUARIO 
def create_user(nombre, correo, contraseña):
    """Crea un nuevo usuario"""

    new_user = User(
        nombre=nombre,
        correo=correo,
        contraseña=contraseña
    )
    db.session.add(new_user)
    db.session.commit()
    return new_user.id_usuario

##ACTUALIZACION DE DATOS USUARIO
def get_user_id_by_session_id(id_sesion):
    """
    Dado el id_sesion, retorna el id_usuario asociado.
    Si no existe, retorna None.
    """
    sesion = Session.query.filter_by(id_sesion=id_sesion).first()
    if not sesion:
        return None
    return sesion.id_usuario

def get_user_by_id(id_usuario):
    """
    Retorna el objeto Usuario si existe, o None si no se encuentra.
    """
    return User.query.filter_by(id_usuario=id_usuario).first()

def update_user_data(id_usuario, nombre, correo):
    """
    Actualiza el nombre y correo de un usuario.
    """
    user = get_user_by_id(id_usuario)
    if not user:
        return False

    user.nombre = nombre
    user.correo = correo
    db.session.commit()
    return True

def update_user_password(id_usuario, new_hashed_password):
    """
    Actualiza la contraseña del usuario.
    """
    user = get_user_by_id(id_usuario)
    if not user:
        return False

    user.contraseña = new_hashed_password
    db.session.commit()
    return True

def delete_user_and_sessions(id_usuario):
    """
    Elimina todas las sesiones y el usuario.
    """
    Session.query.filter_by(id_usuario=id_usuario).delete()  

        # Elimina el usuario
    user = get_user_by_id(id_usuario)
    if user:
        db.session.delete(user)
    
    db.session.commit()
    success = True
    message = "Usuario eliminado correctamente"
    return success, message

def is_email_in_use(correo, exclude_user_id=None):

    """
    Verifica si el correo ya está en uso por otro usuario (opcionalmente excluyendo un usuario).
    """
    query = User.query.filter_by(correo=correo)
    if exclude_user_id:
        query = query.filter(User.id_usuario != exclude_user_id)
    return query.first() is not None

## INTERACCIONES USUARIOS
def obtener_emociones_sesion(id_sesion):
    """
    Obtiene las emociones asociadas a una sesión.
    """
    # Obtener el id_usuario de la sesión
    sesion = Session.query.filter_by(id_sesion=id_sesion).first()
    if not sesion:

        return []

    id_usuario = sesion.id_usuario

    # Obtener las emociones del usuario
    emociones = (
        db.session.query(EmotionDetected)
        .join(Session, EmotionDetected.id_sesion == Session.id_sesion)
        .filter(Session.id_usuario == id_usuario)
        .order_by(EmotionDetected.timestamp.desc())
        .all()
    )

    # Formatear las emociones
    return [
        {
            "emocion": emocion.emocion,
            "intensidad": emocion.intensidad,
            "timestamp": emocion.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }
        for emocion in emociones
    ]

## GUARDAR DATOS RECONOCIMIENTO FACIAL
def guardar_emocion_bd(session_id, emocion_predominante, confianza, origen="camara"):
    emocion = EmotionDetected(
        id_sesion=session_id,
        emocion=emocion_predominante,
        intensidad=confianza,
        timestamp=datetime.now(),
        origen=origen
    )
    db.session.add(emocion)
    db.session.commit()

## GRAFICOS ADMIN MENU
def get_total_sesiones():
    """
    Retorna la cantidad de sesiones únicas registradas en emociones_detectadas.
    Equivale a SELECT COUNT(DISTINCT id_sesion) FROM emociones_detectadas.
    """
    # Distinct de la columna id_sesion

    total = db.session.query(EmotionDetected.id_sesion).distinct().count()
    return total

def get_tendencias_emocionales():
    """
    Retorna la frecuencia de cada emoción por fecha (YYYY-MM-DD).
    Equivale a:
      SELECT DATE(timestamp) AS fecha, emocion, COUNT(*) AS frecuencia
      FROM emociones_detectadas
      GROUP BY fecha, emocion
      ORDER BY fecha;
    """
    # Usamos func.date() para agrupar por la fecha sin hora
    results = db.session.query(
        func.date(EmotionDetected.timestamp).label('fecha'),
        EmotionDetected.emocion,
        func.count('*').label('frecuencia')

    ).group_by(
        func.date(EmotionDetected.timestamp),
        EmotionDetected.emocion
    ).order_by('fecha').all()



    # Convertimos cada fila en un diccionario
    tendencias = []
    for row in results:
        tendencias.append({
            "fecha": row.fecha.strftime("%Y-%m-%d"),
            "emocion": row.emocion,
            "frecuencia": row.frecuencia
        })
    return tendencias

def get_emocion_predominante():
    """
    Retorna la emoción más frecuente (predominante) en toda la tabla.
    Equivale a:
      SELECT emocion
      FROM emociones_detectadas
      GROUP BY emocion
      ORDER BY COUNT(*) DESC
      LIMIT 1;
    """
    row = db.session.query(
        EmotionDetected.emocion,
        func.count(EmotionDetected.emocion).label("frecuencia")
    ).group_by(
        EmotionDetected.emocion 
    ).order_by(
        desc("frecuencia")
    ).first()



    if row:
        return row.emocion
    return None

def get_usuarios_registrados():
    """
    Retorna la cantidad de usuarios con rol != 'admin'.
    Equivale a SELECT COUNT(id_usuario) FROM usuarios WHERE rol != 'admin'
    """
    total = db.session.query(func.count(User.id_usuario))\
                      .filter(User.rol != 'admin')\
                      .scalar()
    return total

def get_distribucion_emociones():
    
    """
    Retorna la frecuencia de cada emoción, ordenadas desc.
    Equivale a:
      SELECT emocion, COUNT(*) AS frecuencia
      FROM emociones_detectadas
      GROUP BY emocion
      ORDER BY frecuencia DESC;
    """
    results = db.session.query(
        EmotionDetected.emocion,
        func.count(EmotionDetected.emocion).label("frecuencia")
    ).group_by(
        EmotionDetected.emocion 
    ).order_by(
        desc("frecuencia")
    ).all()


    distribucion = []
    for row in results:
        distribucion.append({
            "emocion": row.emocion,
            "frecuencia": row.frecuencia
        })
    return distribucion
##LISTA USUARIOS ADMINISTRADOR
def obtener_usuarios():
    """
    Obtiene la lista de todos los usuarios.
    """
    usuarios = User.query.all()
    return [
        {
            "id_usuario": usuario.id_usuario,
            "nombre": usuario.nombre,
            "correo": usuario.correo,
            "fecha_registro": usuario.fecha_registro.strftime("%Y-%m-%d %H:%M:%S"),
            "rol": usuario.rol,
        }
        for usuario in usuarios
    ]