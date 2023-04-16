#Primera Etapa
FROM node:14-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build

#Segunda Etapa
FROM nginx:alpine
COPY --from=build-step /app/dist/lairenf /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
