FROM node:14.16.0-alpine

WORKDIR card-game
RUN apk update

COPY . .

RUN npm install
RUN npm install --prefix clientApp
RUN npm install --prefix server

RUN npm run build --prefix clientApp
RUN npm run prod:build --prefix server

EXPOSE 8000

CMD ["npm", "run", "server:start:prod"]
