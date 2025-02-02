FROM node:13.8.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package files first for better caching
# Docker will only reinstall dependencies if package files change
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]