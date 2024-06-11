# Verwenden Sie ein offizielles Python-Image als Basis
FROM python:3.8-slim

# Setzen Sie das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopieren Sie den Rest der Anwendung
COPY . .

# Exponieren Sie den Port
EXPOSE 5000

# Festlegen des Startbefehls
CMD ["python", "app.py"]
