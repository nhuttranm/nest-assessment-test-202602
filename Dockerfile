# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port 3000 to allow communication to/from the application
EXPOSE 3000

# Run migrations before starting the application
CMD ["sh", "-c", "npm run migration:run && npm run start"]