from flask import Flask
from flask_cors import CORS  # Importar CORS
from backend.connection.db_config import init_db
from backend.services.e_login import login_bp
from backend.services.e_logout import logout_bp
from backend.services.e_register import register_bp



app = Flask(__name__)

CORS(app)

init_db(app)

app.register_blueprint(login_bp)
app.register_blueprint(logout_bp)
app.register_blueprint(register_bp)




# Ruta de prueba
@app.route('/')
def hello():
    return "¡Conexión a la base de datos configurada correctamente!"


if __name__ == '__main__':
    app.run(debug=True)