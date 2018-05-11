FROM node:9

RUN mkdir /app
WORKDIR /app

ADD package.json .
ADD package-lock.json .
RUN npm install

COPY . .
RUN node_modules/.bin/tsc index.ts server.ts

CMD node index.js
