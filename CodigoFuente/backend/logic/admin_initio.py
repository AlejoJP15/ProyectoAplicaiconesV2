# logic/admin_logic.py

from backend.data_access.access import (
    get_total_sesiones,
    get_tendencias_emocionales,
    get_emocion_predominante,
    get_usuarios_registrados,
    get_distribucion_emociones
)

def obtener_estadisticas():
    """
    Orquesta la obtención de estadísticas de la página de inicio.
    """
    total_sesiones = get_total_sesiones()
    tendencias_emocionales = get_tendencias_emocionales()
    emocion_predominante = get_emocion_predominante()
    total_usuarios = get_usuarios_registrados()
    distribucion_emociones = get_distribucion_emociones()

    return {
        "total_sesiones": total_sesiones,
        "tendencias_emocionales": tendencias_emocionales,
        "emocion_predominante": emocion_predominante,
        "total_usuarios": total_usuarios,
        "distribucion_emociones": distribucion_emociones
    }