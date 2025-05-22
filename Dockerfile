# Stage 1: Build
FROM node:18 AS build

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy source code and compile
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18

WORKDIR /app

# Only copy what's needed for runtime
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "./dist/src/index.js"]
