## newsApp

```
npm start
```


### build container
```
docker build -t news-app .
docker run -t -d  -p 3001:3001  -p 4200:4200 news-app
```

#### kill all running containers
```
docker kill $(docker ps -q)
```

### run shell inside docker

```
docker run -it news-app /bin/bash
```
