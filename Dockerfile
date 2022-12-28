FROM node:current-alpine3.17
EXPOSE 3000/tcp
WORKDIR /app
RUN apk add --no-cache chromium
RUN apk add --no-cache xvfb
COPY package.json ./
COPY yarn.lock ./
RUN npm i
COPY . ./
RUN npm run build
RUN apk add --no-cache curl
ENV DISPLAY=:99
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1   
ENTRYPOINT (Xvfb :99 &) && npx next start