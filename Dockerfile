FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app
COPY ./ ./
RUN npm i

CMD npm start