FROM node:17.9.0-alpine as builder

WORKDIR /var/www/todo

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./
COPY . .

RUN npm install -g nodemon
RUN npm install -g ts-node
RUN npm install

EXPOSE 3000
CMD npm run start
