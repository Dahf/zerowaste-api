from flask import Flask, request, jsonify
from PIL import Image
from io import BytesIO
import pytesseract
from langdetect import detect
import cv2
import numpy as np
import re

app = Flask(__name__)

regex = r"P\d{17}"

def apply_threshold(img, argument):
    switcher = {
        1: cv2.threshold(cv2.GaussianBlur(img, (9, 9), 0), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
        2: cv2.threshold(cv2.GaussianBlur(img, (7, 7), 0), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
        3: cv2.threshold(cv2.GaussianBlur(img, (5, 5), 0), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
        4: cv2.threshold(cv2.medianBlur(img, 5), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
        5: cv2.threshold(cv2.medianBlur(img, 3), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
        6: cv2.adaptiveThreshold(cv2.GaussianBlur(img, (5, 5), 0), 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2),
        7: cv2.adaptiveThreshold(cv2.medianBlur(img, 3), 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2),
    }
    return switcher.get(argument, "Invalid method")

def vorverarbeitung(image, method):
    # Konvertiere das Bild in ein NumPy-Array


    image_np = np.array(image)

    gray = cv2.resize(image_np, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)
    # Konvertierung in Graustufen
    gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)

    kernel = np.ones((1, 1), np.uint8)
    gray = cv2.dilate(image_np, kernel, iterations=1)
    gray = cv2.erode(image_np, kernel, iterations=1)

    gray = gray.astype(np.uint8)
    gray = apply_threshold(gray, method)

    return pytesseract.image_to_string(gray, lang='eng')

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
    # Get image buffer from request
    image_data = request.data
    image = Image.open(BytesIO(image_data))
    found = {}
    i = 1
    while i < 8:
        print("> The filter method " + str(i) + " is now being applied.")
        result = vorverarbeitung(image, i)
        match = find_match(regex, result)
        if match:
            if file_name in found:
                found[file_name].append(match)
            else:
                list = []
                list.append(match)
                found[file_name] = list
        
        i += 1

    return found

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
