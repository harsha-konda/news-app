## newsApp
[![Build Status](https://travis-ci.com/harsha-konda/news-app.svg?token=rDtgdJpvq2dsfcM9RHLT&branch=master)](https://travis-ci.com/harsha-konda/news-app)
#### Deploying

```
cd news-app/script
./build.sh
cd ..
npm start
```

---
#### tasks
1. ~~Login/Signup +15pts~~
   A pair must also provide inline validation
2. ~~Home Page +5pts<br>~~
   A pair must also provide immediate immersion
3. ~~Submit Content & Read Content~~ +10pts <br>
   A pair must also provide: Badges, Notifications, and  Dashboard
4. ~~Search for Content +15pts~~
5. ~~Content Feedback +10pts~~<br>
   Favorites and Vote to Promote
6. ~~Better Content +5pts~~<br>
   Individuals must provide tagging of terms onto favorites. A pair must provide a natural language interface to search
7. Suggestions +15pts<br>
   Everyone will provide suggestions based on history
Individuals will also provide either related content or recommendations. A pair must provide both related content and recommendations
 

### commands
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

--
### elastic search

```

PUT /customer
PUT /customer/doc/1
{
  "name": "John Doe"
}
GET /customer/doc/1
DELETE /customer

<REST Verb> /<Index>/<Type>/<ID>
```

### Id is optional
```
POST /customer/doc?pretty
{
  "name": "Jane Doe"
}
COPY AS CURLVIEW IN CONSOLE
```

### update docs
```
POST /customer/doc/1/_update?pretty
{
  "doc": { "name": "Jane Doe" }
}
```

### increment an attribute
```
POST /customer/doc/1/_update?pretty
{
  "script" : "ctx._source.age += 5"
}
```

### deleting a document
```
DELETE /customer/doc/2?pretty
```

### bulk post
```
POST /customer/doc/_bulk?pretty
{"index":{"_id":"1"}}
{"name": "John Doe" }
{"index":{"_id":"2"}}
{"name": "Jane Doe" }
```


### post from file
```
curl -H "Content-Type: application/json" -XPOST 'localhost:9200/bank/account/_bulk?pretty&refresh' --data-binary "@accounts.json"
curl 'localhost:9200/_cat/indices?v'
```

```
curl -XPUT  -H 'Content-Type: application/x-ndjson' localhost:9200/_bulk --data-binary @script/data1.json
```

### querying for documents
```
GET /bank/_search?q=*&sort=account_number:asc&pretty
GET /bank/_search
{
  "query": { "match_all": {} },
  "sort": { "balance": { "order": "desc" } },
  "from": 10,"to":20,
  "_source": ["account_number", "balance"]
  "query": { "match": { "account_number": 20 } }
  "query": { "match": { "address": "mill lane" } }
  "query": { "match_phrase": { "address": "mill lane" } }

  "size": 10
}
```

### bool query
- must - &&
- should - ||
- must_not - !

```
GET /bank/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "address": "mill" } },
        { "match": { "address": "lane" } }
      ]
    },
    "filter": {
        "range": {
          "balance": {
            "gte": 20000,
            "lte": 30000
          }
        }
      }
  	 }
  }
}
```
