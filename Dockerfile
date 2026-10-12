# BoltIdentifierApp Containerfile / Dockerfile
FROM node:20-bookworm-slim

WORKDIR /app

# Non-interactive environment and CI mode
ENV DEBIAN_FRONTEND=noninteractive
ENV CI=true

# Copy package manifests
COPY package*.json ./

# Install dependencies deterministically
RUN npm ci --prefer-offline --no-audit

# Copy project files
COPY . .

# Expose React Native Metro Bundler default port
EXPOSE 8081

# Default action is running tests
CMD ["npm", "test"]
