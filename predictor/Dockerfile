# Verwenden Sie ein offizielles Python-Image als Basis
FROM python:3.8-slim

# Setzen Sie das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopieren Sie die Anforderungen in das Arbeitsverzeichnis
COPY requirements.txt .

# Installieren Sie die Python-Abhängigkeiten
RUN pip3 install --no-cache-dir -r flask numpy pillow pytesseract torchvision torch


# Kopieren Sie den Rest der Anwendung
COPY . .

# Exponieren Sie den Port
EXPOSE 5000

# Festlegen des Startbefehls
CMD ["python", "app.py"]
