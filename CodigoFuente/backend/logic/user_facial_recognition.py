# logic/emotion_recognition_logic.py
import cv2
import numpy as np
import threading
from tensorflow.keras.models import load_model # type: ignore
from tensorflow.keras.preprocessing.image import img_to_array # type: ignore
from collections import Counter



MODEL_PATH = r"C:\Users\alejo\OneDrive\Documentos\EntrenamientoTesis\mejor_modelo_xception_fer2013.keras"


# Variables globales. Se puede refinar el manejo con una clase/objeto si prefieres.
streaming_activo = False
emociones_historial = []
confianza_historial = {}
cap = None

# Config
IMAGE_SIZE = (71, 71)
CLASS_LABELS = ['enojado', 'feliz', 'neutro', 'triste', 'sorprendido']

# Cargar el modelo (se carga una sola vez)
model = load_model(MODEL_PATH)

# Haarcascade para detección de rostros
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def preprocess_image(image):
    """Preprocesa una imagen para el modelo."""
    image = cv2.resize(image, IMAGE_SIZE)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = image / 255.0
    return image

def procesar_emocion(frame):
    """Detecta la emoción en un frame y guarda su porcentaje de confianza."""
    global emociones_historial, confianza_historial

    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1,
                                          minNeighbors=5, minSize=(30, 30))
    for (x, y, w, h) in faces:
        face = rgb_frame[y:y+h, x:x+w]
        preprocessed_face = preprocess_image(face)
        predictions = model.predict(preprocessed_face)

        emotion_index = np.argmax(predictions)
        emotion = CLASS_LABELS[emotion_index]
        confidence = predictions[0][emotion_index] * 100  # %

        # Actualizar históricos
        emociones_historial.append(emotion)
        if emotion not in confianza_historial or confianza_historial[emotion] < confidence:
            confianza_historial[emotion] = confidence

        # Dibujar en el frame (debug visual)
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        label = f"{emotion} ({confidence:.2f}%)"
        cv2.putText(frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX,
                    0.8, (0, 255, 0), 2)

    return frame

def start_stream():
    """Inicia variables y la captura de video."""
    global streaming_activo, emociones_historial, confianza_historial, cap
    streaming_activo = True
    emociones_historial = []
    confianza_historial = {}

    if cap is not None:
        cap.release()
    cap = cv2.VideoCapture(1)  # Ajusta si no es la cámara 0

def generate_frames():
    """Genera frames codificados JPEG para el streaming."""
    global streaming_activo, cap
    while streaming_activo and cap is not None:
        success, frame = cap.read()
        if not success:
            break
        frame = procesar_emocion(frame)

        ret, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
    if cap is not None:
        cap.release()

def stop_stream():
    """Detiene el streaming y libera la cámara."""
    global streaming_activo, cap
    streaming_activo = False
    if cap is not None:
        cap.release()
        cap = None

def get_predominant_emotion():
    """Devuelve la emoción predominante y su confianza."""
    if not emociones_historial:
        return None, 0.0
    emocion_predominante = Counter(emociones_historial).most_common(1)[0][0]
    confianza = float(confianza_historial.get(emocion_predominante, 0.0))
    return emocion_predominante, confianza