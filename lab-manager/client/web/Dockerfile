FROM node
WORKDIR /app
COPY package.json /app/
RUN npm i npm@latest @angular/cli -g
RUN npm install
COPY ./ /app/