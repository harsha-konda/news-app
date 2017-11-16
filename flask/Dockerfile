FROM node:boron

RUN apt-get update -y

RUN apt-get -y upgrade && \
	apt-get install -y python3-pip 
#flask
RUN pip3 install --upgrade pip &&\
	pip3 install flask && \
	pip3 install requests && \
	pip3 install Elasticsearch

#newspaper
RUN pip3 install newspaper3k

EXPOSE 5000

CMD ["python3","pyService.py"]