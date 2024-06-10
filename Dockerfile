# Schritt 1: Verwenden Sie ein Basis-Image mit Python für den mehrstufigen Build
FROM python:3.9-slim as python-base

# Installieren Sie Systemabhängigkeiten für Tesseract
RUN apt-get update && \
    apt-get install -y \
    tesseract-ocr \
    libtesseract-dev

# Erstellen Sie ein Arbeitsverzeichnis für die Python-Abhängigkeiten
WORKDIR /python_app

# Kopieren Sie die requirements.txt und installieren Sie die Python-Abhängigkeiten
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Schritt 2: Verwenden Sie das Node.js-Basis-Image
FROM node:18

# Erstellen Sie das Arbeitsverzeichnis für die Node.js-App
WORKDIR /usr/src/app

# Kopieren und installieren Sie die Node.js-Abhängigkeiten
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g

# Kopieren Sie den gesamten App-Quellcode
COPY . .

# Erstellen Sie das Verzeichnis für Uploads
RUN mkdir -p uploads

# Kopieren Sie die Python-Abhängigkeiten und den Python-Code aus dem vorherigen Schritt
COPY --from=python-base /python_app /usr/src/app/python_app

# Setzen Sie die Umgebungsvariable für die Python-Bibliotheken
ENV PYTHONPATH=/usr/src/app/python_app

# Öffnen Sie den gewünschten Port
EXPOSE 8088

# Starten Sie die Anwendung mit pm2
CMD ["pm2-runtime", "app.js", "-i", "max"]
