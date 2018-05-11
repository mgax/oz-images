FROM node:9

RUN set -e \
 && apt-get update \
 && apt-get install -y --no-install-recommends \
     libmagick++-dev \
 && ln -s `ls /usr/lib/\`uname -m\`-linux-gnu/ImageMagick-*/bin-Q16/Magick++-config | head -n 1` /usr/local/bin/ \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir /app
WORKDIR /app

ADD package.json .
ADD package-lock.json .
RUN npm install

COPY . .
RUN node_modules/.bin/tsc index.ts server.ts

CMD node index.js
