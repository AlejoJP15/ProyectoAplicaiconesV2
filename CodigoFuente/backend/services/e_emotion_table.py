from flask import Blueprint, jsonify, request
from backend.logic.user_emotion_table import obtener_emociones_usuario


emotion_bp = Blueprint('emotion', __name__)

@emotion_bp.route("/emotions", methods=["GET"])
def obtener_emociones_usuario_endpoint():
    """
    Endpoint para obtener las emociones asociadas a una sesión.
    """
    id_sesion = request.args.get("id_sesion")
    if not id_sesion:
        return jsonify({"error": "Se requiere el id_sesion"}), 400

    emociones, error = obtener_emociones_usuario(id_sesion)
    if error:
        return jsonify({"error": error}), 404

    return jsonify({"emociones": emociones})