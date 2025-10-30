FROM node:20-alpine

WORKDIR /app

# Copy package info and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source files
COPY . .

# Build TypeScript -> JavaScript
RUN npm run build

# Ensure database folder exists
RUN mkdir -p /app/data

EXPOSE 3000

# Run compiled JS directly (no ts-node)
CMD ["node", "dist/server.js"]
