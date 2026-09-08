FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build

# Expose Cloud Run port
EXPOSE 8080
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

# Start Next.js production server on Cloud Run port 8080
CMD ["npm", "run", "start", "--", "-p", "8080"]
