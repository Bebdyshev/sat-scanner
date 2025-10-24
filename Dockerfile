q# Multi-stage Dockerfile for a Next.js (App Router) production build
# Uses Debian slim images for compatibility with native modules (canvas, tesseract.js, etc.)

#########################
# Builder
#########################
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# Install dependencies (include devDeps for build)
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# Copy rest of the sources and build the app
COPY . .
RUN npm run build


#########################
# Runner (smaller runtime image)
#########################
FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

# Copy build output and static assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/next.config.ts ./next.config.ts

# If your app relies on other top-level files, copy them as needed
# COPY --from=builder /app/.env.production ./.env.production

EXPOSE 3000

# Use the start script defined in package.json (should call `next start`)
CMD ["npm", "start"]
