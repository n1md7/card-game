FROM node:12.18-slim

RUN apt-get update -y
RUN apt-get install -y vim
RUN apt-get install -y sudo
RUN useradd http_server_user -p "temporary" -u 1001 -m
RUN passwd -d http_server_user
RUN usermod -aG sudo http_server_user

USER http_server_user
WORKDIR /home/http_server_user/src

RUN npm install
