FROM node:20-alpine
LABEL maintainer "glow-app-backend@glow-app.com"

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
EXPOSE 443

COPY package.json yarn.lock ./
RUN touch .env

# Install specific versions of all related packages
RUN yarn add string-width@4.2.3 strip-ansi@6.0.1 cli-table3@0.6.3 --exact

# Then install rest of dependencies
RUN set -x && yarn

COPY . .

CMD [ "yarn", "start:dev" ]
