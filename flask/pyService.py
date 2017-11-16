from flask import Flask, request
import json
import newspaper
from elasticsearch import Elasticsearch

from datetime import datetime

app = Flask(__name__, static_url_path='')
es = Elasticsearch()

elasticeEndPoint="http://localhost:9200/news"

@app.route("/generatePaper", methods=['GET'])
def handle1():
    if request.method == 'GET':

        url=request.args['url']
        print(url)
        paper=newspaper.build(url,memoize_articles=False)


        articles=[]
        i=0
        for article in paper.articles:

            article.download()
            article.parse()
            article.nlp()
            articles+=[article]
            i+=1
            if i>100:
                break

            es.index(index='news', doc_type='post', body={
                             "text":article.text,
                             "keywords":article.keywords,
                             "authors":article.authors,
                             "summary":article.summary,
                             "image":article.top_image,
                             "link":url,
                             "upvotes":0,
                             "timestamp":datetime.now(),
                             "comments":[]
                    })



        return json.dumps({"news":1})


@app.route("/dropIndex",methods=['GET'])
def handle2():
    if request.method=='GET':
        index=request.args['index']
        es.indices.delete(index=index, ignore=[400, 404])
        return json.dumps({"success":1})


@app.route("/createIndex", methods=['GET'])
def handle3():
    if request.method == 'GET':
        index = request.args['index']
        es.indices.create(index=index, ignore=[400, 404])
        return json.dumps({"success": 1})


if __name__ == '__main__':
    app.run(threaded=True, debug=True, host="0.0.0.0", port=5000)
