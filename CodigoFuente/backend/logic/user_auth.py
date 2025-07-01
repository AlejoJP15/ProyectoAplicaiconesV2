import os
import bcrypt
import jwt
import datetime
import smtplib
import re  # ✅ Importar para validar contraseña
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from backend.data_access.access import get_user_by_email, update_user_password
from backend.logic.config import cargar_parametros
import secrets

# 🔹 Cargar variables de entorno desde .env
load_dotenv()



# 🔹 Configuración del correo (Gmail)
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")  # 🔹 Usa la "Contraseña de Aplicación"
EMAIL_SMTP_SERVER = os.getenv("EMAIL_SMTP_SERVER", "smtp.gmail.com")  
EMAIL_SMTP_PORT = int(os.getenv("EMAIL_SMTP_PORT", 587))  # 🔹 Gmail usa el puerto 587

def validate_password(password):
    """
    Valida la seguridad de la contraseña.
    La contraseña debe cumplir con los siguientes criterios:
    - Mínimo 8 caracteres
    - Al menos 1 letra mayúscula
    - Al menos 1 letra minúscula
    - Al menos 1 número
    - Al menos 1 carácter especial (!@#$%^&* etc.)
    """
    if len(password) < 8:
        return "La contraseña debe tener al menos 8 caracteres."
    if not re.search(r'[A-Z]', password):
        return "Debe contener al menos una letra mayúscula."
    if not re.search(r'[a-z]', password):
        return "Debe contener al menos una letra minúscula."
    if not re.search(r'\d', password):
        return "Debe contener al menos un número."
    if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
        return "Debe contener al menos un carácter especial (!@#$%^&* etc.)."
    return None  # ✅ Si pasa todas las validaciones, retorna `None` (contraseña válida)

def generar_token_recuperacion(email):
    usuario = get_user_by_email(email)
    if not usuario:
        return None

    # Generar una clave secreta aleatoria por solicitud
    secret_key = secrets.token_hex(32)

    # Crear el token con esta clave temporal
    parametros = cargar_parametros()
    try:
        duracion = int(parametros.get("duracion_token_recuperacion_minutos", 60))
    except (ValueError, TypeError):
        duracion = 60

    # Crear el token con esta clave temporal
    token = jwt.encode(
        {
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=duracion)
        },
        secret_key,
        algorithm="HS256"
)

    # Guardar el token y la clave en memoria (clave: token, valor: secret_key)
    token_storage[token] = secret_key

    return token

def enviar_correo_recuperacion(email, token):
    """
    Envía un correo electrónico con el enlace de recuperación de contraseña usando Gmail.
    """
    try:
        reset_link = f"http://localhost:3000/reset-password/{token}"  # 🔹 Modifica con la URL real del frontend
        subject = "Recuperación de contraseña"
        body = f"""
        <html>
        <body>
            <h2>Recuperación de Contraseña</h2>
            <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace para continuar:</p>
            <a href="{reset_link}">Restablecer Contraseña</a>
            <p>Si no solicitaste esto, puedes ignorar este mensaje.</p>
        </body>
        </html>
        """

        # 🔹 Configurar el servidor SMTP de Gmail con STARTTLS
        msg = MIMEMultipart()
        msg["From"] = EMAIL_SENDER
        msg["To"] = email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP(EMAIL_SMTP_SERVER, EMAIL_SMTP_PORT) as server:
            server.starttls()  # 🔹 Gmail requiere STARTTLS
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, email, msg.as_string())

        print(f"[INFO] Correo de recuperación enviado a: {email}")

    except Exception as e:
        print(f"[ERROR] No se pudo enviar el correo: {e}")
token_storage = {}
def actualizar_password_con_token(token, new_password):
    try:
        # Obtener la clave secreta asociada al token
        secret_key = token_storage.get(token)
        if not secret_key:
            return False, "Token inválido o expirado"

        # Decodificar usando la clave con la que se generó el token
        data = jwt.decode(token, secret_key, algorithms=["HS256"])
        email = data.get("email")

        if not email:
            return False, "Token inválido"

        usuario = get_user_by_email(email)
        if not usuario:
            return False, "Usuario no encontrado"

        error = validate_password(new_password)
        if error:
            return False, error

        hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
        success = update_user_password(usuario.id_usuario, hashed_password.decode("utf-8"))

        if success:
            # Limpieza: eliminar la clave después del uso
            del token_storage[token]
            return True, "Contraseña actualizada correctamente"
        else:
            return False, "No se pudo actualizar la contraseña"

    except jwt.ExpiredSignatureError:
        return False, "El token ha expirado"
    except jwt.InvalidTokenError:
        return False, "Token inválido"
