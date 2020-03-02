FROM node:lts-alpine

RUN apk add bash

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node/api

WORKDIR /home/node/api

RUN npm i -g @adonisjs/cli

COPY package.json package-lock.json ./

USER node

RUN npm install

COPY --chown=node:node . .

# RUN ./run init --key

CMD ["adonis", "server --dev"]

EXPOSE 3333
