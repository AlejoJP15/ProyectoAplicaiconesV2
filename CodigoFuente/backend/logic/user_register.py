import re
import bcrypt
from backend.data_access.access import get_user_by_email, create_user

def validar_contrasena(password):
    """
    Valida la seguridad de la contraseña.
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
    return None  # Si pasa todas las validaciones, retorna None

def register_user(nombre, correo, password):
    """
    Maneja el proceso de registro de un usuario.
    """
    if not nombre or not correo or not password:
        return False, "Por favor completa todos los campos"

    if "@" not in correo or "." not in correo.split("@")[-1] or not re.match(r"^[^@]+@[^@]+\.[^@]+$", correo):
        return False, "Por favor ingresa un correo válido"

    error_contrasena = validar_contrasena(password)
    if error_contrasena:
        return False, error_contrasena

    # Encriptar la contraseña
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # Verificar si el correo ya está en uso
    user = get_user_by_email(correo)
    if user:
        return False, "El correo ya está en uso"

    # Crear el nuevo usuario
    create_user(nombre, correo, hashed_password.decode("utf-8"))
    return True, "Usuario registrado exitosamente"