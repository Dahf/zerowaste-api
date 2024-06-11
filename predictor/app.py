from flask import Flask, request, jsonify
from PIL import Image
import torch
import torchvision.transforms as transforms
from io import BytesIO

app = Flask(__name__)

# Laden Sie das Modell
model = torch.load('best-2.pt')

def process_image(image):
    # Preprocess image for model
    transformation = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    image_tensor = transformation(image).unsqueeze(0)
    
    return image_tensor

class_names = ["Address", "Date", "Item", "OrderId", "Subtotal", "Tax", "Title", "TotalPrice"]

@app.route('/')
def home():
    return "Welcome to the Image Prediction API"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image buffer from request
        image_data = request.data
        image = Image.open(BytesIO(image_data))

        output = model(image)

        return jsonify(output)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
