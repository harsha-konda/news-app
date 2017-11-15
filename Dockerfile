FROM node:boron

RUN apt-get update -y

RUN apt-get -y upgrade && \
	apt-get install -y python3-pip 
#flask
RUN pip3 install --upgrade pip &&\
	pip3 install flask && \
	pip3 install requests && \
	pip3 install pymongo

#newspaper
RUN pip3 install newspaper3k


#angular
RUN apt-get -y install && \
	apt-get update && \
	npm install -g @angular/cli 

#flask
WORKDIR /newApp

COPY . ./

RUN ls -l /newApp/


RUN npm i
EXPOSE 3001 4200 6000

CMD ["npm","start"]