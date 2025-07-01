from flask import Blueprint, request, jsonify
from backend.logic.email_config import cargar_email_config, guardar_email_config

email_config_bp = Blueprint("email_config", __name__)

@email_config_bp.route("/api/email-config", methods=["GET"])
def obtener_email_config():
    data = cargar_email_config()
    return jsonify(data), 200

@email_config_bp.route("/api/email-config", methods=["POST"])
def actualizar_email_config():
    data = request.json
    try:
        data["EMAIL_SMTP_PORT"] = int(data["EMAIL_SMTP_PORT"])
    except (ValueError, TypeError, KeyError):
        return jsonify({"message": "Puerto inválido"}), 400

    guardar_email_config(data)
    return jsonify({"message": "Configuración actualizada correctamente"}), 200
