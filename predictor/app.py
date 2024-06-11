from flask import Flask, request, jsonify
from PIL import image
from io import BytesIO
import pytesseract
from langdetect import detect

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Image Prediction API"

@app.route('/predict', methods=['POST'])
def predict():
    # Get image buffer from request
    image_data = request.data
    image = Image.open(BytesIO(image_data))

    text = pytesseract.image_to_string(image)
    
    return {"text": text}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
