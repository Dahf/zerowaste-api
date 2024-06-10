import sys
import json
import numpy as np
from PIL import Image
import pytesseract
from io import BytesIO
from ultralytics import YOLO

def load_and_predict(image_path):
    # Load the YOLOv5 model
    model = YOLO('best-2.pt')

    # Load the image
    image = Image.open(image_path)
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
    try:
        image_path = sys.argv[1]
        predictions = load_and_predict(image_path)
        print(json.dumps(predictions))
    except Exception as e:
        print(f"An error occurred: {e}", file=sys.stderr)
        sys.exit(1)
