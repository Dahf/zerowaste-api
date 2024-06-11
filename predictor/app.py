from flask import Flask, request, jsonify
from PIL import Image
from io import BytesIO
import pytesseract
from langdetect import detect
import cv2
import numpy as np

app = Flask(__name__)


def vorverarbeitung(image):
    # Konvertiere das Bild in ein NumPy-Array
    image_np = np.array(image)
    
    # Konvertierung in Graustufen
    gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
    
    # Rauschunterdrückung mit GaussianBlur
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Erhöhung des Kontrasts mit Adaptive Thresholding
    gray = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    
    return gray

@app.route('/')
def home():
    return "Welcome to the Image Prediction API"

@app.route('/predict', methods=['POST'])
def predict():
    # Get image buffer from request
    image_data = request.data
    image = Image.open(BytesIO(image_data))

    text = pytesseract.image_to_string(vorverarbeitung(image))
    
    return {"text": text}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
