FROM node:9-alpine

RUN   apk update \                                                                                                                                                                                                                        
&&   apk add ca-certificates \                                                                                                                                                                                                      
&&   update-ca-certificates \
&& apk add openssl


ADD . /app
WORKDIR /app

CMD node /app/live-tickers.js $*