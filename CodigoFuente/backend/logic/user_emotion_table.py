from backend.data_access.access import obtener_emociones_sesion

ETIQUETAS_MAP = {
    "angry": "enojado",
    "happy": "feliz",
    "neutral": "neutro",
    "sad": "triste",
    "surprise": "sorprendido",
    "enojado": "enojado",
    "feliz": "feliz",
    "neutro": "neutro",
    "triste": "triste",
    "sorprendido": "sorprendido",
}

def normalizar_emocion(etiqueta):
    return ETIQUETAS_MAP.get(etiqueta.lower(), etiqueta)

def obtener_emociones_usuario(id_sesion):
    if not id_sesion:
        return None, "Se requiere el id_sesion"

    emociones = obtener_emociones_sesion(id_sesion)
    if not emociones:
        return None, "No se encontraron emociones para esta sesión"

    # Normalizar etiquetas aquí
    emociones_normalizadas = [
        {
            "emocion": normalizar_emocion(em["emocion"]),
            "intensidad": em["intensidad"],
            "timestamp": em["timestamp"],
        }
        for em in emociones
    ]

    return emociones_normalizadas, None
