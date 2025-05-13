from flask import Blueprint, request, jsonify
from backend.logic.user_logout import logout_user


logout_bp = Blueprint('logout', __name__)

@logout_bp.route("/logout", methods=["POST"])
def logout():
    """

    Endpoint para el cierre de sesión.
    """
    data = request.json
    id_sesion = data.get("id_sesion")

    success, message = logout_user(id_sesion)

    if not success:
        return jsonify({"success": False, "message": message}), 400 if message == "Se requiere el id_sesion" else 404

    return jsonify({"success": True, "message": message})