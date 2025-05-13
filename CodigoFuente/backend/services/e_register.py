from flask import Blueprint, request, jsonify
from backend.logic.user_register import register_user

register_bp = Blueprint('register', __name__)

@register_bp.route("/register", methods=["POST"])
def register():

    """
    Endpoint para el registro de usuario.
    """
    data = request.json
    nombre = data.get("name")
    correo = data.get("email")
    password = data.get("password")

    success, message = register_user(nombre, correo, password)

    if not success:
        return jsonify({"success": False, "message": message}), 400

    return jsonify({"success": True, "message": message})