import re
import bcrypt
from backend.data_access.access import get_user_by_email, create_session


def validate_email(email):
    """
    Valida el formato del correo electrónico.
    """
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def validate_credentials(email, password):
    """
    Valida las credenciales del usuario.
    """
    user = get_user_by_email(email)
    if not user:
        return None, "Correo o contraseña incorrecta"

    if not bcrypt.checkpw(password.encode("utf-8"), user.contraseña.encode("utf-8")):
        return None, "Correo o contraseña incorrecta"

    return user, None

def login_user(email, password, dispositivo, canal):
    """
    Maneja el proceso de inicio de sesión.
    """
    if not email or not password:
        return None, "Por favor completa todos los campos"

    if not validate_email(email):
        return None, "Por favor ingresa un correo válido"

    user, error = validate_credentials(email, password)
    if error:
        return None, error

    id_sesion = create_session(user.id_usuario, dispositivo, canal)
    return {"id_sesion": id_sesion, "nombre": user.nombre, "rol": user.rol}, None