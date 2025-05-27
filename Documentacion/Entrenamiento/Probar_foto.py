import cv2
import numpy as np
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt

# Cargar modelo entrenado
modelo = load_model("mejor_modelo_xception_fer2013.keras")

# Etiquetas de clases según tu entrenamiento
clases_emociones = ["angry", "happy", "neutral", "sad", "surprise"]

def detectar_y_predecir_emocion(ruta_imagen):
    # Cargar imagen original (BGR)
    img = cv2.imread(ruta_imagen)
    if img is None:
        raise ValueError(f"No se pudo cargar la imagen: {ruta_imagen}")

    # Cargar Haar Cascade para detección de caras
    casc_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(casc_path)

    # Detectar caras
    caras = face_cascade.detectMultiScale(img, scaleFactor=1.1, minNeighbors=5)
    if len(caras) == 0:
        raise ValueError("No se detectó ninguna cara en la imagen")

    # Tomar la primera cara detectada
    (x, y, w, h) = caras[0]
    cara = img[y:y+h, x:x+w]

    # Redimensionar cara a 71x71
    cara_rgb = cv2.resize(cara, (71, 71))

    # Normalizar
    cara_rgb = cara_rgb.astype("float32") / 255.0

    # Añadir dimensión batch
    input_modelo = np.expand_dims(cara_rgb, axis=0)  # shape (1, 71, 71, 3)

    # Predecir
    predicciones = modelo.predict(input_modelo)
    indice = np.argmax(predicciones)
    emocion = clases_emociones[indice]

    # Mostrar resultados con matplotlib
    plt.imshow(cv2.cvtColor(cara, cv2.COLOR_BGR2RGB))
    plt.title(f"Emoción detectada: {emocion}")
    plt.axis('off')
    plt.show()

    return emocion, predicciones

if __name__ == "__main__":
    ruta_imagen = input("Ingresa la ruta de la imagen para detección de emoción: ")
    try:
        emocion, probs = detectar_y_predecir_emocion(ruta_imagen)
        print(f"Emoción detectada: {emocion}")
        print(f"Probabilidades: {probs}")
    except Exception as e:
        print(f"Error: {e}")
