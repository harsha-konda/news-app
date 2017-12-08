curl -XPUT 'localhost:9200/news?pretty' -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2 
        }
    }
}
'

curl -XPUT 'localhost:9200/users?pretty' -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2 
        }
    }
}
'

elasticdump \
  --input=${PWD}/my_index.json \
  --output=http://localhost:9200/news \
  --type=data \
--headers='{"Content-Type": "application/json"}' \
--limit=10000
