from flask import Blueprint, request, jsonify
from backend.logic.user_login import login_user

# Crear un Blueprint para el servicio de autenticación
login_bp = Blueprint('login', __name__)

@login_bp.route("/login", methods=["GET", "POST"])
def login():
    """
    Endpoint para el inicio de sesión con verificación de usuario bloqueado.
    """
    if request.method == "GET":
        return jsonify({"success": False, "message": "Por favor usa POST para enviar datos JSON"}), 405

    data = request.json
    if not data:
        return jsonify({"success": False, "message": "El cuerpo de la solicitud no contiene JSON válido"}), 400

    email = data.get("email")
    password = data.get("password")
    dispositivo = data.get("dispositivo")
    canal = data.get("canal")

    result, error = login_user(email, password, dispositivo, canal)

    if error:
        # Si el error es un dict, significa que la cuenta está bloqueada
        if isinstance(error, dict) and "tiempo_restante" in error:
            return jsonify({"success": False, "message": error["message"], "tiempo_restante": error["tiempo_restante"]}), 403

        return jsonify({"success": False, "message": error}), 400 if error == "Por favor completa todos los campos" else 401

    return jsonify({"success": True, **result})
