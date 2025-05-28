# Dockerfile for Next.js App

# ---- Base Node image ----
FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies Stage ----
FROM base AS deps
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --production=true

# ---- Builder Stage ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install all dependencies (including devDependencies for build scripts)
RUN yarn install --frozen-lockfile

# Fetch Pokémon data. This script writes to public/pokemon-data.json
# The .dockerignore should ensure this file isn't copied from the host if it exists there.
RUN yarn fetch-data

# Build the Next.js application with standalone output
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# ---- Runner Stage ----
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Set up a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Copy the necessary files for standalone mode
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy either the standalone build output or the complete app
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Switch to the non-root user
USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"] 