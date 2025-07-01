import json
import os

CONFIG_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "parametros_sistema.json"))
def cargar_parametros():
    """
    Lee los parámetros del sistema desde un archivo JSON.
    Si no existe, devuelve valores por defecto.
    """
    if not os.path.exists(CONFIG_FILE):
        # Valores por defecto iniciales
        return {
            "intentos_fallidos_maximos": 3,
            "tiempo_bloqueo_minutos": 1,
            "duracion_token_recuperacion_minutos": 60
        }
    with open(CONFIG_FILE, "r") as f:
        return json.load(f)

def guardar_parametros(data):
    """
    Guarda los parámetros del sistema en el archivo JSON.
    """
    with open(CONFIG_FILE, "w") as f:
        json.dump(data, f, indent=4)
