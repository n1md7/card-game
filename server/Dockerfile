FROM node:14.16.0-alpine

WORKDIR card-game
RUN apk update

COPY . .
RUN npm install
RUN npm rebuild node-sass --prefix clientApp
RUN npm run server:build:prod
RUN npm run client:build:prod

EXPOSE 8000

CMD ["npm", "run", "server:start:prod"]

