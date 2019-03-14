FROM node:8-alpine
MAINTAINER Sergio Faya Fernández <sergiofayafernandez@gmail.com>
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3001
CMD [ "npm", "run", "deploy" ]
