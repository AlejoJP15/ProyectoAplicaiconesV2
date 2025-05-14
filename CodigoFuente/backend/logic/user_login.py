import re

import bcrypt
from datetime import datetime, timedelta

from backend.data_access.access import (
    get_user_by_email, 
    create_session, 
    verificar_si_usuario_bloqueado,
    registrar_intento_fallido,
    resetear_intentos_fallidos
)


def validate_email(email):
    """
    Valida el formato del correo electrónico.
    """
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

from datetime import datetime, timedelta
import bcrypt
from backend.data_access.access import get_user_by_email, registrar_intento_fallido, resetear_intentos_fallidos, verificar_si_usuario_bloqueado

def validate_credentials(email, password):
    """
    Valida las credenciales del usuario, verificando intentos fallidos.
    """
    # Verificar si el usuario está bloqueado
    bloqueado, tiempo_restante = verificar_si_usuario_bloqueado(email)
    
    if bloqueado:
        return None, {
            "message": f"Cuenta bloqueada. Intenta de nuevo en {tiempo_restante // 60} min {tiempo_restante % 60} s",
            "tiempo_restante": tiempo_restante  # Asegurar que se envía como número entero
        }

    user = get_user_by_email(email)
    if not user:
        registrar_intento_fallido(email)  # Incrementar intentos si no existe el usuario
        return None, "Correo o contraseña incorrecta"

    if not bcrypt.checkpw(password.encode("utf-8"), user.contraseña.encode("utf-8")):
        registrar_intento_fallido(email)  # Incrementar intentos si la contraseña es incorrecta
        return None, "Correo o contraseña incorrecta"

    resetear_intentos_fallidos(email)  # Si el login es exitoso, resetear intentos
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