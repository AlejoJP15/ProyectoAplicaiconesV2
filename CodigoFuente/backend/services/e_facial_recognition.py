# services/emotion_recognition_service.py

from flask import Blueprint, Response, jsonify, request
from flask_cors import CORS
from backend.logic.user_facial_recognition import (
    start_stream,
    generate_frames,
    stop_stream,
    get_predominant_emotion
)

from backend.data_access.access import guardar_emocion_bd

emotion_recognition_bp = Blueprint("reconocimiento_facial", __name__)
CORS(emotion_recognition_bp)

@emotion_recognition_bp.route('/stream', methods=['GET'])
def stream():

    """
    Transmite video en tiempo real con detección de emociones.
    """
    start_stream()
    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@emotion_recognition_bp.route('/detectar_emocion', methods=['POST'])
def detectar_emocion_api():
    """
    Devuelve la emoción predominante y su porcentaje de confianza.
    """
    emocion_predominante, confianza = get_predominant_emotion()

    if emocion_predominante is None:
        return jsonify({"emocion_predominante": "No detectado", "confianza": 0.0})

    return jsonify({
        "emocion_predominante": emocion_predominante,
        "confianza": confianza
    })

@emotion_recognition_bp.route('/stop_stream', methods=['POST'])
def stop_stream_endpoint():
    """
    Detiene la transmisión de la cámara y guarda la emoción predominante en la BD.
    """
    stop_stream()

    data = request.get_json() or {}
    session_id = data.get("id_sesion")
    origen = data.get("origen", "facial")

    emocion_predominante, confianza = get_predominant_emotion()
    if emocion_predominante:
        guardar_emocion_bd(session_id, emocion_predominante, confianza, origen)

    return jsonify({"message": "Cámara apagada"})