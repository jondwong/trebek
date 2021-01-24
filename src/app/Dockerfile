FROM node:latest as build
RUN mkdir -p /usr/src/trebek
WORKDIR /usr/src/trebek
COPY package.json /usr/src/trebek

COPY trebek-container-server.conf ./
RUN npm install

COPY . /usr/src/trebek
RUN npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/trebek/trebek-container-server.conf /etc/nginx/conf.d/
COPY --from=build /usr/src/trebek/build /usr/share/nginx/html


EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
