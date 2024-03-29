FROM node:18.9.0-alpine3.15

WORKDIR card-game
RUN apk update

COPY . .

RUN npm ci
RUN npm run install:all

RUN npm run build --prefix clientApp
RUN npm run prod:build --prefix server

EXPOSE 8000

CMD ["npm", "run", "server:start:prod"]
