FROM node:alpine AS deps


RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL


FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm prune --production

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /app

# ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/static ./static
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env.local ./.env.local
# COPY --from=builder /app/.env.production ./.env.production
#COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

# COPY entrypoint.sh .
# COPY .env.production .

# # Execute script
# RUN apk add --no-cache --upgrade bash
# RUN ["chmod", "+x", "./entrypoint.sh"]
# ENTRYPOINT ["/app/entrypoint.sh"]


# ENV NEXT_TELEMETRY_DISABLED 1

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node_modules/.bin/next", "start", "--", "--port=4008"]