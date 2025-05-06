import os
from flask import Flask
from flask_cors import CORS  # Importar CORS
from backend.connection.db_config import init_db
from dotenv import load_dotenv


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))
app = Flask(__name__)

CORS(app)
init_db(app)
# Ruta de prueba
@app.route('/')
def hello():
    return "¡Conexión a la base de datos configurada correctamente!"


if __name__ == '__main__':
    app.run(debug=True)