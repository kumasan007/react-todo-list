FROM node:18.13.0-alpine

WORKDIR /data

RUN apk update && \
  apk upgrade && \
  apk --no-cache add vim yarn bash

COPY ./src /data
WORKDIR /data
