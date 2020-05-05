FROM node:lts-buster
WORKDIR /app
RUN npm i npm@latest
RUN npm i @angular/cli -g
ADD package.json /app
RUN npm install; npm audit; npm audit fix --force
COPY ./ /app/