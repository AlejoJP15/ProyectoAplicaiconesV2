from flask import Blueprint, request, jsonify
from backend.logic.config import cargar_parametros, guardar_parametros

config_bp = Blueprint("config", __name__)

@config_bp.route("/api/parametros-sistema", methods=["GET"])
def obtener_parametros():
    data = cargar_parametros()
    return jsonify(data), 200

@config_bp.route("/api/parametros-sistema", methods=["POST"])
def actualizar_parametros():
    data = request.json
    try:
        # Validar y convertir a enteros
        data["intentos_fallidos_maximos"] = int(data["intentos_fallidos_maximos"])
        data["tiempo_bloqueo_minutos"] = int(data["tiempo_bloqueo_minutos"])
        data["duracion_token_recuperacion_minutos"] = int(data["duracion_token_recuperacion_minutos"])
    except (ValueError, TypeError, KeyError):
        return jsonify({"message": "Datos inválidos"}), 400

    guardar_parametros(data)
    return jsonify({"message": "Parámetros actualizados correctamente"}), 200
