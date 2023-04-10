FROM node:16.20.0-alpine3.17

# Create app directory
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/data

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]