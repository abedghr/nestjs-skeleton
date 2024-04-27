FROM node:21.1.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN set -x && npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]