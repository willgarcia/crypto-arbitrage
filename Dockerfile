FROM node:9-alpine

RUN  apk update \
&& apk add ca-certificates \
&& update-ca-certificates \ 
&& apk add openssl

ADD . /app
WORKDIR /app

RUN npm install

CMD node /app/live-tickers.js
