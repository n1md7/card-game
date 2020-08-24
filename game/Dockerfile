FROM node:12.18-slim
RUN apt-get update -y
RUN apt-get install -y vim 
RUN apt-get install -y sudo
RUN passwd -d node
RUN usermod -aG sudo -u 1001 node

USER node

WORKDIR /home/node/src



