FROM node:boron
RUN apt-get update -y
RUN apt-get -y install && apt-get update && npm install -g @angular/cli 

RUN mkdir newApp
ADD * /newApp
WORKDIR /newApp

RUN npm i
RUN npm run build
EXPOSE 3001 4200

CMD ["npm","start"]