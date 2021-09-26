from node:12.13.1-stretch
RUN sed -i '/stretch-updates/d' /etc/apt/sources.list
RUN apt-get update -y
RUN apt-get install -y mongodb
RUN npm install -g mongo-restore
RUN npm install -g migrate-mongo