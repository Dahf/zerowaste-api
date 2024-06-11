from flask import Flask, request, jsonify
from PIL import Image
from io import BytesIO
import pytesseract
from langdetect import detect
import cv2
import numpy as np
import re
from scipy.ndimage import gaussian_filter

app = Flask(__name__)

def vorverarbeitung(image):
    image_np = np.array(image)

    # Ensure image is converted to grayscale
    gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)

    kernel = np.ones((1, 1), np.uint8)
    gray = cv2.dilate(gray, kernel, iterations=1)
    gray = cv2.erode(gray, kernel, iterations=1)

    gray = gray.astype(np.uint8)

    processed_gray = cv2.adaptiveThreshold(cv2.medianBlur(gray, 3), 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2)

    return pytesseract.image_to_string(processed_gray, lang='eng')

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
    result = vorverarbeitung(image)

    return jsonify({"matches": result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
