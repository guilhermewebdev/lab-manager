FROM node:lts

RUN mkdir /app

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ADD package*.json /app
ADD yarn.lock /app

RUN yarn install

COPY . .
CMD ["yarn", "start"]
