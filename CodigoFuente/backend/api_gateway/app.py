from flask import Flask
from flask_cors import CORS  # Importar CORS
from backend.connection.db_config import init_db
from backend.services.e_login import login_bp
from backend.services.e_logout import logout_bp
from backend.services.e_register import register_bp
from backend.services.e_update import user_bp
from backend.services.e_auth import auth_bp
from backend.services.e_emotion_table import emotion_bp
from backend.services.e_facial_recognition import emotion_recognition_bp
from backend.services.e_admin_inition import admin_bp
from backend.services.e_admin_list_users import admin_list_users_bp
from backend.services.e_admin_estadistica import stats_bp

from dotenv import load_dotenv

app = Flask(__name__)

CORS(app)

init_db(app)

app.register_blueprint(login_bp)
app.register_blueprint(logout_bp)
app.register_blueprint(register_bp)
app.register_blueprint(user_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(emotion_bp)
app.register_blueprint(emotion_recognition_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(admin_list_users_bp)
app.register_blueprint(stats_bp)

# Ruta de prueba
@app.route('/')
def hello():
    return "¡Conexión a la base de datos configurada correctamente!"


if __name__ == '__main__':
    app.run(debug=True)