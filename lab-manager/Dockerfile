FROM node:lts as client

WORKDIR /app

ADD ./client/web/package.json /app
ADD ./client/web/yarn.lock /app
RUN yarn 
ENV PATH /app/node_modules/.bin:$PATH

COPY ./client/web /app

RUN yarn build

FROM nginx

RUN rm /etc/nginx/conf.d/*

COPY ./server/proxy/prod/nginx/conf.d /etc/nginx/conf.d

COPY --from=client /app/build /usr/share/nginx/html/client

# RUN chown -R nginx:nginx /usr/share/nginx/html; \
#     find /usr/share/nginx/html -type f -exec chmod 0660 {} \; ; \
#     find /usr/share/nginx/html -type d -exec chmod 2770 {}  \; ; 

CMD ["nginx","-g","daemon off;"]