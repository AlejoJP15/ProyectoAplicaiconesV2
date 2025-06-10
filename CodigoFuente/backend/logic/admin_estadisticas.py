from datetime import datetime, timedelta

from backend.data_access.access import (
    obtener_tendencias_emocionales,
    obtener_usuarios_por_emocion,
    obtener_distribucion_origen,
    obtener_intensidad_promedio,
    obtener_distribucion_intensidad

)

def obtener_estadisticas(inicio, fin, emociones, agrupacion):
    """
    Obtiene todas las estadísticas necesarias.
    """
    tendencias = obtener_tendencias_emocionales(inicio, fin, emociones)
    usuarios_por_emocion = obtener_usuarios_por_emocion(inicio, fin, emociones)
    distribucion_origen = obtener_distribucion_origen(inicio, fin, emociones)
    intensidad_promedio = obtener_intensidad_promedio(inicio, fin, emociones, agrupacion)
    distribucion_intensidad = obtener_distribucion_intensidad(inicio, fin, emociones, agrupacion)
    return {
        "tendencias_emocionales": [
            {
                "fecha": tendencia.fecha.strftime("%Y-%m-%d"),
                "emocion": tendencia.emocion,
                "frecuencia": tendencia.frecuencia
            }
            for tendencia in tendencias
        ],
        "usuarios_por_emocion": [
            {
                "emocion_predominante": usuario.emocion,
                "usuarios": usuario.usuarios
            }
            for usuario in usuarios_por_emocion
        ],
        "distribucion_origen": [
            {
                "origen": origen.origen,
                "total": origen.total,
                "porcentaje": origen.porcentaje
            }
            for origen in distribucion_origen
        ],
        "line_chart_data": [
            {
                "fecha_agrupada": intensidad.fecha_agrupada.strftime("%Y-%m-%d"),
                "intensidad_promedio": intensidad.intensidad_promedio
            }
            for intensidad in intensidad_promedio
        ],
        "distribucion_intensidad": distribucion_intensidad
        
    }
