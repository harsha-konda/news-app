import newspaper
from datetime import datetime
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

import random

popularTags = newspaper.popular_urls()
file = open("flask/data1.json", "w")
import json
def insertDocs(newsPaper,url,download,file):

    # es=Elasticsearch()
    i=0
    for article in newsPaper.articles:
        # try:
        if i>100:
            break

        if download:
            article.download()
        article.parse()
        article.nlp()
        i += 1

        file.write(json.dumps({"index": {"_index": "news", "_type": "post"}})+"\n")

        file.write(json.dumps({
            "title": article.title,
            "text": article.text,
            "keywords": article.keywords,
            "authors": article.authors,
            "summary": article.summary,
            "image": article.top_image,
            "link": url,
            "upvotes": random.randint(0, 5000),
            "timestamp": str(datetime.now()),
            "comments": [],
            "displayText": False,
            "displayComment": False,
        })+"\n")


for url in popularTags:
    print("===============================buiding===============================", url)
    paper = newspaper.build(url)
    try:
        insertDocs(paper, url, True, file=file)
    except:
        continue


file.close()

bulk()

def es_add_bulk(nginx_file):
    es = Elasticsearch(hosts = [{'host': 'localhost', 'port': 9200}])


