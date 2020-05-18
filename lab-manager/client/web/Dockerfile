FROM node:lts

RUN mkdir /app

WORKDIR /app

ADD package.json /app
ADD yarn.lock /app

RUN yarn 

ENV PATH /app/node_modules/.bin:$PATH

COPY . .
CMD ["yarn", "start"]