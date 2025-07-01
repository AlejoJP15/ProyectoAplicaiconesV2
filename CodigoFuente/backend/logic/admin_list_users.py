from backend.data_access.access import obtener_usuarios, delete_user_and_sessions, update_user_data, actualizar_rol_usuario_db
def gestionar_usuarios(method, id_usuario=None):

    """
    Maneja el proceso de obtener o eliminar usuarios.
    """
    if method == "GET":
        usuarios = obtener_usuarios()
        return usuarios, None
    elif method == "DELETE":
        if not id_usuario:
            return None, "Falta id Usuario"

        resultado = delete_user_and_sessions(id_usuario)
        if isinstance(resultado, tuple) and len(resultado) == 2:
            success, message = resultado
        else:
            success = resultado
            message = "Operación completada" if success else "Error al eliminar usuario"

        return {"mensaje": message}, None
    else:
        return None, "Método no permitido"
    


def actualizar_rol_usuario(id_usuario, nuevo_rol):
    """Lógica para actualizar el rol de un usuario."""
    if not nuevo_rol:
        return {"error": "El rol es requerido"}, 400
   
    usuario_actualizado = actualizar_rol_usuario_db(id_usuario, nuevo_rol)
   
    if not usuario_actualizado:
        return {"error": "Usuario no encontrado"}, 404
 
    return {"message": "Rol actualizado correctamente"}, 200

def actualizar_datos_usuario(id_usuario, nombre, correo):
    if not id_usuario or not nombre or not correo:
        return {"error": "Datos incompletos"}, 400

    success = update_user_data(id_usuario, nombre, correo)
    if not success:
        return {"error": "No se pudo actualizar el usuario"}, 400

    return {"message": "Datos actualizados correctamente"}, 200