FROM node:14.16.0-alpine as Client
WORKDIR clientApp
RUN apk update
COPY ./clientApp/package.json ./clientApp/package-lock.json ./
RUN npm ci
COPY ./clientApp .
RUN npm run build
#FIXME : This is a hack to get the client to work.
# its not a good solution. Well it is not hack but its needs to be one build with shared types

FROM node:14.16.0-alpine as Server
WORKDIR server
RUN apk update
COPY ./server/package.json ./server/package-lock.json ./
RUN npm ci
COPY ./server .
RUN npm run prod:build
COPY --from=Client /clientApp/build ./dist/public
RUN chown -R node:node /server
USER node
ENV NODE_ENV=production
ENV STATIC_PATH=/server/dist/public
EXPOSE 8000

CMD ["npm", "run", "prod"]

