# Verwenden Sie node:18 als Basis-Image
FROM node:18 AS node_base

# Erstellen Sie ein Verzeichnis für die App
WORKDIR /usr/src/app

# Kopieren Sie package.json und package-lock.json
COPY package*.json ./

# Installieren Sie die Node.js Abhängigkeiten
RUN npm install
RUN npm install pm2 -g

# Verwenden Sie python:3.10-slim als zweites Basis-Image
FROM python:3.10-slim

# Erstellen Sie ein Verzeichnis für die App
WORKDIR /usr/src/app

# Kopieren Sie die Dateien aus dem Node.js-Build
COPY --from=node_base /usr/src/app /usr/src/app

# Installieren Sie die Python-Abhängigkeiten
RUN pip install --no-cache-dir numpy pillow pytesseract ultralytics

# Kopieren Sie den gesamten Code
COPY . .

# Erstellen Sie das uploads Verzeichnis
RUN mkdir -p uploads

# Exponieren Sie den Port
EXPOSE 8088

# Starten Sie die App mit pm2
CMD ["pm2-runtime", "app.js", "-i", "max"]
