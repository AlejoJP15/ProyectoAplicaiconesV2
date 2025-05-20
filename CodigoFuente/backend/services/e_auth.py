from flask import Blueprint, request, jsonify
from backend.logic.user_auth import generar_token_recuperacion, enviar_correo_recuperacion, actualizar_password_con_token

auth_bp = Blueprint("auth", __name__)

### Endpoint para Solicitar Recuperación de Contraseña ###
@auth_bp.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    """
    Endpoint para solicitar recuperación de contraseña.
    """
    data = request.json
    email = data.get("email")

    if not email:
    
        return jsonify({"success": False, "message": "El correo electrónico es requerido"}), 400
    
    #  Generar un token único
    token = generar_token_recuperacion(email)
    
    if not token:
        return jsonify({"success": False, "message": "No se encontró el usuario"}), 404

    #Enviar correo con el enlace de recuperación
    enviar_correo_recuperacion(email, token)

    return jsonify({"success": True, "message": "Se ha enviado un correo con las instrucciones"}), 200

### Endpoint para Resetear la Contraseña ###
@auth_bp.route("/api/reset-password", methods=["POST"])
def reset_password():
    """
    Endpoint para cambiar la contraseña usando un token de recuperación.
    """
    data = request.json
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        return jsonify({"success": False, "message": "Token y nueva contraseña son requeridos"}), 400

    success, message = actualizar_password_con_token(token, new_password)

    if not success:
        return jsonify({"success": False, "message": message}), 400

    return jsonify({"success": True, "message": "Contraseña actualizada correctamente"}), 200
