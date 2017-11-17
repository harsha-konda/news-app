from flask import Flask, request
import json
import newspaper
from newspaper import news_pool

from elasticsearch import Elasticsearch

from datetime import datetime

app = Flask(__name__, static_url_path='')

elasticeEndPoint="http://localhost:9200/news"


def insertDocs(newsPaper,url,download):

    es=Elasticsearch()
    i=0
    for article in newsPaper.articles:
        try:
            if i>100:
                break

            if download:
                article.download()
            article.parse()
            article.nlp()
            i += 1

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

        except:
            print("===============================EXCPETION===============================")
            continue



@app.route("/loadTrending", methods=['GET'])
def loadTrending():
    if request.method == 'GET':
        popularTags = newspaper.popular_urls()

        print("===============================buiding===============================")


        for url in popularTags:
            print("===============================buiding===============================",url)
            paper=newspaper.build(url,memoize_articles=False)
            insertDocs(paper,url,True)


            # popularNews+=[newspaper.build(url,memoize_articles=False)]

        # print("===============================built popular news===============================")
        # news_pool.set(popularNews,threads_per_source=4)
        # news_pool.join()

        # print("===============================done downloading===============================")

        # for i,newsPaper in enumerate(popularNews):
        #     print("===============================inserting===============================")
        #     insertDocs(newsPaper,popularTags[i],False)

        return json.dumps({"status":"success"})

@app.route("/generatePaper", methods=['GET'])
def generatePaper():
    if request.method == 'GET':
        url=request.args['url']
        paper=newspaper.build(url,memoize_articles=False)
        insertDocs(paper,url,True)
        return json.dumps({"news":1})


@app.route("/dropIndex",methods=['GET'])
def dropIndex():
    if request.method=='GET':
        es=Elasticsearch()
        index=request.args['index']
        es.indices.delete(index=index, ignore=[400, 404])
        return json.dumps({"success":1})


@app.route("/createIndex", methods=['GET'])
def createIndex():
    if request.method == 'GET':
        es=Elasticsearch()
        index = request.args['index']
        es.indices.create(index=index, ignore=[400, 404])
        return json.dumps({"success": 1})


@app.route("/listTrendingTopics", methods=['GET'])
def trndingTopics():
    if request.method == 'GET':
        popularTags = newspaper.popular_urls()
        return json.dumps(popularTags)


if __name__ == '__main__':
    app.run(threaded=True, debug=True, host="0.0.0.0", port=5000)
