# logic/user_logic.py

import re
import bcrypt
from backend.data_access.access import (
    get_user_id_by_session_id,
    get_user_by_id,
    update_user_password,
    update_user_data,
    delete_user_and_sessions,
    is_email_in_use
)

def validate_password(password):
    """
    Valida la seguridad de la contraseña.
    Retorna un string con el error o None si es válida.
    """
    if len(password) < 8:
        return "La contraseña debe tener al menos 8 caracteres."
    if not re.search(r'[A-Z]', password):
        return "La contraseña debe contener al menos una letra mayúscula."
    if not re.search(r'[a-z]', password):
        return "La contraseña debe contener al menos una letra minúscula."
    if not re.search(r'\d', password):
        return "La contraseña debe contener al menos un número."
    if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
        return "La contraseña debe contener al menos un carácter especial (!@#$%^&* etc.)."
    return None

def get_user_data(id_sesion):
    """
    Lógica para manejar GET: obtener datos del usuario por id_sesion.
    """
    if not id_sesion:
        return False, "Se requiere el id_sesion", None

    id_usuario = get_user_id_by_session_id(id_sesion)
    if not id_usuario:
        return False, "Sesión no encontrada", None

    user = get_user_by_id(id_usuario)
    if not user:
        return False, "Usuario no encontrado", None

    return True, "Usuario encontrado", {
        "nombre": user.nombre,
        "email": user.correo
    }

def update_user_or_password(id_sesion, data):
    """
    Lógica para manejar PUT: actualizar datos o cambiar contraseña.
    """
    if not id_sesion:
        return False, "Se requiere el id_sesion"

    id_usuario = get_user_id_by_session_id(id_sesion)
    if not id_usuario:
        return False, "Sesión no encontrada"

    # 1. Cambio de contraseña
    if "password" in data and "new_password" in data:
        current_password = data.get("password")
        new_password = data.get("new_password")

        if not current_password or not new_password:
            return False, "Faltan datos requeridos para cambiar la contraseña"

        # Validar seguridad de la nueva contraseña
        error = validate_password(new_password)
        if error:
            return False, error

        # Verificar contraseña actual
        user = get_user_by_id(id_usuario)
        if not user:
            return False, "Usuario no encontrado"

        stored_password = user.contraseña.encode("utf-8")
        if not bcrypt.checkpw(current_password.encode("utf-8"), stored_password):
            return False, "La contraseña actual es incorrecta"

        # Cifrar la nueva contraseña y actualizar
        hashed_new_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
        updated = update_user_password(id_usuario, hashed_new_password.decode("utf-8"))
        if not updated:
            return False, "Error al actualizar contraseña"

        return True, "Contraseña actualizada correctamente"

    # 2. Actualización de datos (nombre, email)
    elif "nombre" in data and "email" in data:
        nombre = data.get("nombre")
        correo = data.get("email")

        if not nombre or not correo:
            return False, "Faltan datos requeridos"

        # Verificar si el correo está en uso por otro usuario
        if is_email_in_use(correo, exclude_user_id=id_usuario):
            return False, "El correo ya está registrado con otro usuario"

        # Actualizar
        updated = update_user_data(id_usuario, nombre, correo)
        if not updated:
            return False, "Error al actualizar datos"

        return True, "Datos actualizados correctamente"

    return False, "Solicitud no válida"

def delete_user_account(id_sesion):
    """
    Lógica para manejar DELETE: eliminar usuario (y sus sesiones).
    """
    if not id_sesion:
        return False, "Se requiere el id_sesion"

    id_usuario = get_user_id_by_session_id(id_sesion)
    if not id_usuario:
        return False, "Sesión no encontrada"

    # Eliminar usuario y sus sesiones
    delete_user_and_sessions(id_usuario)
    return True, "Cuenta eliminada correctamente"