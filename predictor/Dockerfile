# Verwenden Sie ein offizielles Python-Image als Basis
FROM python:3.8-slim

# Setzen Sie das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

RUN pip install flask
RUN pip install numpy
RUN pip install pillow
RUN pip install pytesseract
RUN pip install ultralytics

# Kopieren Sie den Rest der Anwendung
COPY . .

# Exponieren Sie den Port
EXPOSE 5000

# Festlegen des Startbefehls
CMD ["python", "app.py"]
