# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
# NEXT_PUBLIC_* vars are baked into the client bundle at build time, not read
# at container startup — they must be passed as build args, not just runtime env.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY . .
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3002
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
RUN chown -R app:app /app
USER app
EXPOSE 3002
CMD ["node", "server.js"]
