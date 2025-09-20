FROM node:18-alpine
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .

# Build the app for production
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Serve the built app
CMD ["serve", "-s", "build", "-l", "3000"]