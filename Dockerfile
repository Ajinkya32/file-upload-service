# Use an official lightweight Node.js image
FROM node:20-alpine

# Install OpenSSL libs required by Prisma
RUN apk add --no-cache openssl openssl-dev

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Generate Prisma client and run migrations
RUN npx prisma generate

# Ensure uploads directory exists
RUN mkdir -p uploads

# Production environment
ENV NODE_ENV=production

# Expose application port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]