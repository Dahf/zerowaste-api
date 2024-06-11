from flask import Flask, request, jsonify
from PIL import Image, ImageOps, ImageEnhance
from io import BytesIO
import pytesseract
from langdetect import detect
import cv2
import numpy as np
import re
from scipy.ndimage import gaussian_filter

app = Flask(__name__)

def preprocess_image(image):
    image_np = np.array(image)

    # Konvertiere das Bild in Graustufen
    gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)

    # Rauschunterdrückung mit Gaussian Blur
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # Adaptive Thresholding für Binarisierung
    gray = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2)

    # Morphologische Operationen zur Verbesserung der Textregionen
    kernel = np.ones((1, 1), np.uint8)
    gray = cv2.dilate(gray, kernel, iterations=1)
    gray = cv2.erode(gray, kernel, iterations=1)

    # Deskewing (Entzerrung)
    coords = np.column_stack(np.where(gray > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = gray.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    gray = cv2.warpAffine(gray, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

    return gray

@app.route('/')
def home():
    return "Welcome to the Image Prediction API"

def find_match(regex, text):
    matches = re.finditer(regex, text, re.MULTILINE)
    target = ""
    for matchNum, match in enumerate(matches):
        matchNum = matchNum + 1

        print("  Match {matchNum} was found at {start}-{end}: {match}".format(matchNum=matchNum, start=match.start(),
                                                                            end=match.end(), match=match.group()))
        target = match.group()

    return target

@app.route('/predict', methods=['POST'])
def predict():
    image_data = request.data
    image = Image.open(BytesIO(image_data)).convert('RGB')  # Ensure image is in RGB mode
    processed_image = preprocess_image(image)
    result_text = pytesseract.image_to_string(processed_image, config='--psm 6', lang='eng')
    
    return jsonify({"result": result_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
