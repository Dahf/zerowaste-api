from flask import Flask, request, jsonify
from PIL import Image
import torch
import torchvision.transforms as transforms
from io import BytesIO
from ultralytics import YOLO

app = Flask(__name__)

# Laden Sie das Modell
model = YOLO('best-2.pt')

class_names = ["Address", "Date", "Item", "OrderId", "Subtotal", "Tax", "Title", "TotalPrice"]

@app.route('/')
def home():
    return "Welcome to the Image Prediction API"

@app.route('/predict', methods=['POST'])
def predict():
    # Get image buffer from request
    image_data = request.data
    image = Image.open(BytesIO(image_data))

    results = model([image], save=False)
    results_json = {"boxes":results[0].boxes.xyxy.tolist(),"classes":results[0].boxes.cls.tolist()}
    return {"result": results_json}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
