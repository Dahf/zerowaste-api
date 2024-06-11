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

regex = r"P\d{17}"

def apply_threshold(img, argument):
    if argument in [1, 2, 3]:
        sigma = {1: 9, 2: 7, 3: 5}[argument]
        img = gaussian_filter(img, sigma=sigma)
        _, img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    elif argument in [4, 5]:
        ksize = {4: 5, 5: 3}[argument]
        img = cv2.medianBlur(img, ksize)
        _, img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    elif argument == 6:
        img = gaussian_filter(img, sigma=5)
        img = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2)
    elif argument == 7:
        img = cv2.medianBlur(img, 3)
        img = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2)
    else:
        return "Invalid method"
    return img

def vorverarbeitung(image, method):
    # Konvertiere das Bild in ein NumPy-Array


    image_np = np.array(image)
    
    gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)

    gray = cv2.resize(image_np, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)
    # Konvertierung in Graustufen
    
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
    for i in range(1, 8):
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

    return found

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
