# services/user_service.py

from flask import Blueprint, jsonify, request
from backend.logic.user_update import (
    get_user_data,
    update_user_or_password,
    delete_user_account
)


user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/update", methods=["GET", "PUT", "DELETE"])
def gestionar_usuario():
    if request.method == "GET":
        id_sesion = request.args.get("id_sesion")
        success, message, user_data = get_user_data(id_sesion)
        if not success:
            return jsonify({"error": message}), 400
        return jsonify({"usuario": user_data})

    elif request.method == "PUT":
        data = request.json or {}
        id_sesion = data.get("id_sesion")
        success, message = update_user_or_password(id_sesion, data)
        if not success:
            return jsonify({"error": message}), 400
        return jsonify({"message": message})

    elif request.method == "DELETE":
        id_sesion = request.args.get("id_sesion") or (request.json and request.json.get("id_sesion"))
        success, message = delete_user_account(id_sesion)
        if not success:
            return jsonify({"error": message}), 400
        return jsonify({"message": message})