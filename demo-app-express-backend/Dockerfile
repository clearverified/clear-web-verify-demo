FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy all files from the current directory to the container image
COPY . .

# Expose the port on which the backend runs
EXPOSE 3002

# Start the backend application
CMD [ "npm", "start"]
