# services/admin_service.py

from flask import Blueprint, jsonify
from backend.logic.admin_initio import obtener_estadisticas

admin_bp = Blueprint('admin_menu', __name__)

@admin_bp.route('/estadisticas', methods=['GET'])
def estadisticas():

    try:
        datos = obtener_estadisticas()
        return jsonify(datos), 200
    except Exception as e:
        print(f"Error al obtener datos de la página de inicio: {e}")
        return jsonify({"error": "Error al obtener los datos", "detalles": str(e)}), 500