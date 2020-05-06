FROM node:lts

RUN mkdir /app

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ADD package.json /app
RUN npm install
RUN npm install react-scripts -g
COPY . .