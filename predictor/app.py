import io
import json
import os

import torch
import torchvision.transforms as transforms
from PIL import Image
from flask import Flask, jsonify, request
from torchvision.models import resnet18


app = Flask(__name__)

model = resnet18(pretrained=True)
model.eval()

class_names = ["Address", "Date", "Item", "OrderId", "Subtotal", "Tax", "Title", "TotalPrice"]



# Transform input into the form our model expects
def transform_image(image_bytes):
    input_transforms = [
        transforms.Resize(255),  # We use multiple TorchVision transforms to ready the image
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],  # Standard normalization for ImageNet model input
                             [0.229, 0.224, 0.225])
    ]
    my_transforms = transforms.Compose(input_transforms)
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')  # Open the image from bytes and ensure it's in RGB mode
    timg = my_transforms(image)  # Transform PIL image to appropriately-shaped PyTorch tensor
    timg.unsqueeze_(0)  # PyTorch models expect batched input; create a batch of 1
    return timg


# Get a prediction
def get_prediction(input_tensor):
    outputs = model(input_tensor)  # Get likelihoods for all classes
    _, y_hat = outputs.max(1)  # Extract the most likely class
    prediction = y_hat.item()  # Extract the int value from the PyTorch tensor
    return prediction


# Make the prediction human-readable
def render_prediction(prediction_idx):
    class_name = class_names[prediction_idx]

    return prediction_idx, class_name


@app.route('/', methods=['GET'])
def root():
    return jsonify({'msg': 'Try POSTing to the /predict endpoint with an RGB image byte array'})


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        try:
            image_bytes = request.data
            if image_bytes:
                input_tensor = transform_image(image_bytes)
                prediction_idx = get_prediction(input_tensor)
                class_id, class_name = render_prediction(prediction_idx)
                return jsonify({'class_id': class_id, 'class_name': class_name})
            else:
                return jsonify({'error': 'No image data received'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)