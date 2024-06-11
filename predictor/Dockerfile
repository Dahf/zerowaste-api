# Ultralytics YOLO 🚀, AGPL-3.0 license
# Builds ultralytics/ultralytics:latest-cpu image on DockerHub https://hub.docker.com/r/ultralytics/ultralytics
# Image is CPU-optimized for ONNX, OpenVINO and PyTorch YOLOv8 deployments

# Use the official Python 3.10 slim-bookworm as base image
FROM python:3.10-slim-bookworm

# Set environment variables
ENV APP_HOME /usr/src/app

# Downloads to user config dir
ADD https://github.com/ultralytics/assets/releases/download/v0.0.0/Arial.ttf \
    https://github.com/ultralytics/assets/releases/download/v0.0.0/Arial.Unicode.ttf \
    /root/.config/Ultralytics/

# Install linux packages
# g++ required to build 'tflite_support' and 'lap' packages, libusb-1.0-0 required for 'tflite_support' package
RUN apt update \
    && apt install --no-install-recommends -y python3-pip git zip curl htop libgl1 libglib2.0-0 libpython3-dev gnupg g++ libusb-1.0-0

# Create working directory
WORKDIR $APP_HOME

# Copy application contents and assign permissions
COPY . $APP_HOME

# Install pip packages
RUN python3 -m pip install --upgrade pip wheel
RUN pip install --no-cache-dir ultralytics
RUN pip install flask numpy pillow pytesseract

# Expose the application port
EXPOSE 5000

# Set entry point to run the Flask application
CMD ["python", "app.py"]


