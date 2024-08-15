# Use an official Node.js runtime as a parent image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or pnpm-lock.yaml) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Bundle app source
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000 for the application
EXPOSE 3000

# Define the command to run the application
CMD ["pnpm", "run", "start"]
