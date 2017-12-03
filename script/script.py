import newspaper
from datetime import datetime
from elasticsearch import Elasticsearch
import sys
import random
import argparse
import json

def insertDocs(newsPaper, url, download, file,params):
  es = Elasticsearch(hosts=[{'host': 'localhost', 'port': 9200}])
  i = 0
  for article in newsPaper.articles:
    if i > 100:
      break
    print(i)

    if download:
      article.download()
    article.parse()
    article.nlp()
    i += 1


    if (params['file']):
      file.write(json.dumps({"index": {"_index": "news", "_type": "post"}}) + "\n")

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
      }) + "\n")
    else:
      es.index(index='news', doc_type='post', body={
        "title": article.title,
        "text": article.text,
        "keywords": article.keywords,
        "authors": article.authors,
        "summary": article.summary,
        "image": article.top_image,
        "link": url,
        "upvotes": 0,
        "timestamp": str(datetime.now()),
        "comments": [],
        "displayText": False,
        "displayComment": False,
      })

def createIndex(index):
  es=Elasticsearch()
  es.indices.create(index=index, ignore=[400, 404])
  return


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--file', action='store_true', default=False)
  parser.add_argument('--no-cache',dest='memoize_articles',action='store_false',default=True)
  parser.add_argument('--data',dest='urls',default=[])
  params = vars(parser.parse_args())
  createIndex('news')

  if(params['file']):
    file = open("script/data.json", "w")

  data=json.loads(params['urls'].strip("'"))

  popularTags = data if len(params['urls'])>0 else newspaper.popular_urls()

  for url in popularTags:
    print("===============================buiding===============================", url)
    sys.stdout.flush()

    paper = newspaper.build(url,memoize_articles=params['memoize_articles'])
    try:
      insertDocs(paper, url, True, file=file,params=params)
    except:
      continue

  file.close()
