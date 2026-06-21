# Multi-stage build for Angular client
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build -- --configuration=production

# Nginx stage to serve static files
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default content
RUN rm -rf ./*

# Copy built app
COPY --from=build /app/dist/client/browser/ .

# Copy nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1