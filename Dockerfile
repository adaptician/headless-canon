# Stage 1: Build the TypeScript code
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Run the application
FROM node:18 AS runtime

# Set working directory
WORKDIR /app

# Copy only the production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the compiled JavaScript code and other necessary files
COPY --from=build /app/dist ./dist

# Expose the application port (change if needed)
EXPOSE 3000

# Set the default command to run the application
CMD ["node", "dist/server.js"]
