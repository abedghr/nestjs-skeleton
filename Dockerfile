FROM node:21.1.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN set -x && yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "run", "start:dev" ]