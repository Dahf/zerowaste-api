from flask import Flask, request, jsonify
import numpy as np
from PIL import Image
from io import BytesIO
from ultralytics import YOLO
import pytesseract

app = Flask(__name__)

def load_and_predict(image):
    # Load the YOLOv5 model
    model = YOLO('best-2.pt')

    # Convert image to numpy array
    img_array = np.array(image)

    # Make predictions
    results = model.predict(img_array)
    return results

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Read image data from request
        image_data = request.data
        image = Image.open(BytesIO(image_data))

        # Predict
        predictions = load_and_predict(image)
        return jsonify(predictions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
