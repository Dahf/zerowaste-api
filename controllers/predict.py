import sys
import json
import numpy as np
from PIL import Image
import pytesseract
from io import BytesIO
from ultralytics import YOLO

def load_and_predict(image):
    # Load the YOLOv5 model
    model = YOLO('best-2.pt')

    # Convert image to numpy array
    img_array = np.array(image)

    # Make predictions
    results = model.predict(img_array)
    return results

def extract_text_from_image(image, boxes, threshold=0.7):
    items = []
    for box in boxes:
        if box['confidence'] > threshold:
            cropped_img = image.crop((box['x1'], box['y1'], box['x2'], box['y2']))
            text = pytesseract.image_to_string(cropped_img)
            items.append({
                'box': [box['x1'], box['y1'], box['x2'], box['y2']],
                'score': box['confidence'],
                'text': text
            })
    return items

if __name__ == "__main__":
    # Read image data from stdin
    image_data = sys.stdin.buffer.read()

    # Load image from bytes
    image = Image.open(BytesIO(image_data))

    # Predict
    predictions = load_and_predict(image)
    print(predictions)
    
    # Extract bounding boxes and confidence scores
    boxes = []
    for pred in predictions:
        for box in pred.boxes:
            boxes.append({
                'x1': box.xyxy[0].item(),
                'y1': box.xyxy[1].item(),
                'x2': box.xyxy[2].item(),
                'y2': box.xyxy[3].item(),
                'confidence': box.conf.item()
            })

    items = extract_text_from_image(image, boxes)
    print(json.dumps(items))
