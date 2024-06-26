FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install
RUN npm install pm2 -g
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN mkdir -p uploads

EXPOSE 8088
CMD ["pm2-runtime", "app.js", "-i", "max"]