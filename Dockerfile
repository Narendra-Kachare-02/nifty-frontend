# Frontend (Vite + React) - Multi-stage build

# Stage 1: Build (Bun)
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies with Bun
RUN bun install

# Copy source
COPY . .

# Build-time API URL (override when building for production)
ARG VITE_API_BASE_URL=http://localhost:8001/
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN bun run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (optional; default serves SPA)
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        access_log off; \
        return 200 "ok"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
