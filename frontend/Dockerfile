FROM node:18.14.1-alpine

WORKDIR /data

RUN apk update && \
  apk upgrade && \
  apk --no-cache add vim yarn bash

COPY ./src /data
WORKDIR /data
