FROM node:current-alpine3.17
EXPOSE 3000/tcp
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DISPLAY=:99
RUN apk add --no-cache chromium
RUN apk add --no-cache xvfb
RUN apk add --no-cache curl
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
HEALTHCHECK CMD curl -I --fail http://localhost:3000 || exit 1   
ENTRYPOINT (Xvfb :99 &) && npx next start