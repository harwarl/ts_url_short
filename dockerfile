FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json yarn*.lock ./

RUN yarn install --production

COPY . .

COPY .env ./

RUN yarn build

EXPOSE 3030

CMD ["yarn", "start:prod"]
