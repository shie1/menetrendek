FROM node:current-alpine3.17
ENV NODE_ENV=production
EXPOSE 3000/tcp
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN apk add --no-cache chromium
RUN npm i 
COPY . ./
RUN npm run build
ENTRYPOINT ["npx", "next", "start"]
