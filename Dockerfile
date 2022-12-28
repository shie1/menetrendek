FROM node:current-alpine3.17
ENV NODE_ENV=production
EXPOSE 3000/tcp
WORKDIR /app
RUN apk add --no-cache chromium
COPY package.json ./
COPY yarn.lock ./
RUN npm i
COPY . ./
RUN npm run build
RUN apk add --no-cache curl
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1   
ENTRYPOINT ["npx", "next", "start"]
