from backend.data_access.access import close_session

def logout_user(id_sesion):
    """
    Maneja el proceso de cierre de sesión.

    """
    if not id_sesion:
        return False, "Se requiere el id_sesion"

    success, message = close_session(id_sesion)
    return success, message