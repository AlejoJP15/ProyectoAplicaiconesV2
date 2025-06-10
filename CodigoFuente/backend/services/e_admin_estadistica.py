from flask import Blueprint, jsonify, request
from backend.logic.admin_estadisticas import obtener_estadisticas
 
stats_bp = Blueprint('stats', __name__)
 
@stats_bp.route("/visualiza_estadistica", methods=["GET"])
def visualizar_datos():
    """
    Endpoint para obtener las estadísticas.
    """
    inicio = request.args.get('inicio')
    fin = request.args.get('fin')
    emociones = request.args.getlist('emocion')
    agrupacion = request.args.get('agrupacion', 'day')
 
    estadisticas = obtener_estadisticas(inicio, fin, emociones, agrupacion)
    return jsonify(estadisticas)