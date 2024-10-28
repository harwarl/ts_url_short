FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

COPY .env ./

RUN yarn build

EXPOSE 3030

CMD ["yarn", "start:prod"]
