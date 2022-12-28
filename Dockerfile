FROM node:current-alpine3.17 AS deps
RUN apk add --no-cache chromium
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:current-alpine3.17 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:current-alpine3.17 AS run
EXPOSE 3000/tcp
WORKDIR /app
ENV NODE_ENV=production
ENV DISPLAY=:99
RUN apk add --no-cache chromium
RUN apk add --no-cache xvfb
RUN apk add --no-cache curl
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build --chown=root /app/.next/standalone ./
COPY --from=build --chown=root /app/.next/static ./.next/static
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1   
ENTRYPOINT (Xvfb :99 &) && npx next start
