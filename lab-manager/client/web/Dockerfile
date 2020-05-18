FROM node:lts

RUN mkdir /app

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ADD package.json /app
ADD yarn.lock /app

RUN yarn install
RUN echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p

COPY . .
CMD ["yarn", "start"]
