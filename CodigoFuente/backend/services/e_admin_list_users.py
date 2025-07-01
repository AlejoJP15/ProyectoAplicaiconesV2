from flask import Blueprint, jsonify, request
from backend.logic.admin_list_users import gestionar_usuarios, actualizar_rol_usuario, actualizar_datos_usuario
admin_list_users_bp = Blueprint('admin_list_users', __name__)

@admin_list_users_bp.route("/lista_usuarios", methods=["GET", "DELETE"])
def gestionar_usuarios_endpoint():

    """
    Endpoint para obtener la lista de usuarios o eliminar un usuario.
    """
    method = request.method
    id_usuario = None

    if method == "DELETE":
        data = request.get_json()
        id_usuario = data.get("id_usuario")

    resultado, error = gestionar_usuarios(method, id_usuario)
    if error:
        return jsonify({"error": error}), 400 if method == "DELETE" else 500

    return jsonify(resultado)


    
@admin_list_users_bp.route("/usuarios/<int:id_usuario>/rol", methods=["PUT"])
def actualizar_rol_usuario_endpoint(id_usuario):
    """Endpoint para actualizar el rol de un usuario."""
    try:
        data = request.json
        nuevo_rol = data.get("rol") or data.get("nuevo_rol")
        response, status_code = actualizar_rol_usuario(id_usuario, nuevo_rol)
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_list_users_bp.route("/usuarios/<int:id_usuario>/datos", methods=["PUT"])
def actualizar_datos_usuario_endpoint(id_usuario):
    data = request.get_json()
    nombre = data.get("nombre")
    correo = data.get("email")
    response, status = actualizar_datos_usuario(id_usuario, nombre, correo)
    return jsonify(response), status