FROM node:14.16.0-alpine

WORKDIR card-game
RUN apk update

COPY . .

RUN npm install --prefix clientApp
RUN npm rebuild node-sass --prefix clientApp
RUN npm run build --prefix clientApp

RUN npm install --prefix server
RUN npm run prod:build --prefix server

#RUN npm run server:build:prod
#RUN npm run client:build:prod

EXPOSE 8000

CMD ["npm", "run", "server:start:prod"]

