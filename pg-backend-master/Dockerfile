# Stage 1: Build
FROM node:22.17-alpine3.21 as builder

# Set working directory
WORKDIR /app

# Install Yarn (optional, if not already in the image)
RUN corepack enable

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Install Nest CLI globally using Yarn
RUN yarn global add @nestjs/cli

# Copy the rest of the application source code
COPY . .

# Build all apps
RUN nest build api && nest build x-handler && nest build rewards-handler

# Default command to run all apps in parallel
CMD node dist/apps/api/main & \
    node dist/apps/rewards-handler/main & \
    node dist/apps/x-handler/main
