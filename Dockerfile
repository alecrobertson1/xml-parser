FROM node:14 as base

WORKDIR /app

COPY package.json /app 

RUN npm install

ADD . /app

RUN npm run build

CMD npm start

EXPOSE 8081
