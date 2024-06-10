FROM node:18
FROM python:3.10-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN pip install --no-cache-dir numpy pillow pytesseract ultralytics

RUN npm install
RUN npm install pm2 -g
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN mkdir -p uploads

EXPOSE 8088
CMD ["pm2-runtime", "app.js", "-i", "max"]