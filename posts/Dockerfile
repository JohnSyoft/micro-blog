FROM node:alpine

WORKDIR /usr/app

RUN npm install -g npm@8.19.2

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["npm","start"]
