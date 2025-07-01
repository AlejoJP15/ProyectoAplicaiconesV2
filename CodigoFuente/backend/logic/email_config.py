import json
import os

EMAIL_CONFIG_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "email_config.json")
)

def cargar_email_config():
    if not os.path.exists(EMAIL_CONFIG_FILE):
        return {
            "EMAIL_SENDER": "",
            "EMAIL_PASSWORD": "",
            "EMAIL_SMTP_SERVER": "smtp.gmail.com",
            "EMAIL_SMTP_PORT": 587
        }
    with open(EMAIL_CONFIG_FILE, "r") as f:
        return json.load(f)

def guardar_email_config(data):
    with open(EMAIL_CONFIG_FILE, "w") as f:
        json.dump(data, f, indent=4)
