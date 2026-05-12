# Use Node.js 20 Alpine for a small footprint
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install production dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 5000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 5000

# Define the command to run your app
CMD [ "npm", "run", "dev" ]
