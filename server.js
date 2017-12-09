const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
var request = require('request');
var async = require("async");
var webshot = require('webshot');
var path = require('path');
require('dotenv').config();
var es = require('elasticsearch');
var bodyParser = require('body-parser')
var crypto = require('crypto');
var homepage = require("./server/homepage.js");
var Topics = require("./server/topics.js");
var spawn = require("child_process").spawn;

var client = new es.Client({
  host: 'localhost:9200',
  // log: 'trace'
});


if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file'
}

app.use(bodyParser.json())


app.use(cors());

app.use('/static', express.static(path.join(__dirname, 'public')));
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});


const checkScopes = jwtAuthz(['read:messages']);
const checkScopesAdmin = jwtAuthz(['write:messages']);


/**
 * delete contents of a table
 * */
app.get('/api/delete/:index', checkJwt, function (req, res) {
  var index = req.params.index;

  client.deleteByQuery({
    "index": index,
    q: '*:*'
  }).then(function (body) {
    res.json(body);
  }, function (error) {
  });

});

/**
 * update News Feed
 * */
app.get('/api/updateTable', checkJwt, function (req, res) {

  var data = "--data='" + JSON.stringify(Topics.topics) + "'";
  var process = spawn('python3', ["script/script.py", data])

  process.stderr.on('data', function (data) {
    console.log(data.toString('utf-8').trim());

  })
  process.stdout.on('data', function (data) {

    console.log(data.toString('utf-8').trim());
  });

  res.json({"inservice": 1})
});

/**
 * Currently available subsctiption
 * */
app.get('/api/listsubs', checkJwt, function (req, res) {
  res.json({topics: Topics.topics});
});

/**
 * Add Subscription
 * */
app.post('/api/subs/add/', checkJwt, function (req, res) {
  var url = req.body.url;
  if (url) {
    Topics.add(url);
    res.redirect('/api/updateTable')
  } else {
    res.json({added: true});
  }
});

/**
 * Delete Subscription
 **/
app.get('/api/subs/remove/:remove', checkJwt, function (req, res) {
  var url = req.params.remove;
  if (url)
    Topics.remove(url);
  res.json({removed: true});
});

/**
 * Get news feed for a url
 **/
app.get('/es/:obj/search/:text', checkJwt, function (req, res) {
  var obj = req.params.obj;
  var text = req.params.text;

  client.search({
    index: obj,
    size: 100,
    q: text
  }).then(function (body) {
    res.json(body);
  }, function (error) {
  })
});

/**
 * create an md5 hash of post/user comment
 **/
app.post('/es/:obj/:type/create', checkJwt, function (req, res) {
  var body = req.body;
  var obj = req.params.obj;
  var type = req.params.type;

  var key = req.body.user ? req.body.user : req.body.text;

  client.create({
    index: obj,
    type: type,
    id: crypto.createHash('md5').update(key).digest('hex'),
    body: body,

  }, function (error, response) {
    var prompt = "success";
    if (error)
      prompt = "faliure"
    res.json({status: prompt})
  });
});

/**
 * update either posts/users
 **/
app.post('/es/:obj/:type/update', checkJwt, function (req, res) {
  var body = req.body;
  var obj = req.params.obj;
  var type = req.params.type;

  body = (obj == 'news') ? body["_source"] : body;
  var key = req.body.user ? crypto.createHash('md5').update(req.body.user).digest('hex') : req.body._id;

  client.update({
    index: obj,
    type: type,
    id: key,
    body: {doc: body},

  }, function (error, response) {
    var prompt = "success";
    if (error)
      prompt = "faliure"
    res.json({status: prompt})
  });
});

/**
 * Handle favorites
 **/
app.get('/es/favorites/:user', checkJwt, function (req, res) {
  var user = req.params.user;

  client.search({
    index: 'users',
    type: '1',
    body: {
      "_source": ["heart", "tags"],
      query: {
        term: {
          user: {value: user}

        }
      }
    }
  }, function (err, response) {

    if (response.hits.hits[0]) {
      var posts = (response.hits.hits[0]["_source"].heart);
      posts = posts.concat(response.hits.hits[0]["_source"].tags);
      var promisesArr = [];
      posts.forEach(function (value) {
        // value=Object.keys(value)[0];
        if (typeof(value) != "string")
          Object.keys(value).forEach((data)=>searchContext(promisesArr, data, value[data])
      )
        ;
      else
        searchContext(promisesArr, value, null);

      })

      Promise.all(promisesArr).then(function (values) {
        res.json(values);
      }).catch(function (err) {
        res.json({status: "fail"});
      });


    }

  });
});


function searchContext(promisesArr, value, tags) {
  promisesArr.push(new Promise(function (resolve, reject) {
    client.get({
      index: 'news',
      type: 'post',
      "_source": ["text", "title", "summary", "image"],
      id: value

    }, function (err, response) {
      if (tags)
        response["_source"]["tags"] = tags;
      resolve(response['_source']);
    })
  }));

}

app.get('/es/recommend/:user', function (req, response) {
  var user = req.params.user;
  client.search({
    index: 'users',
    type: '1',
    body: {
      "_source": ["heart", "tags"],
      query: {
        term: {
          user: {value: user}

        }
      }
    }
  }, function (req, res) {
    if (res.hits.hits[0]) {
      var posts = (res.hits.hits[0]["_source"].heart);
      client.search({
        index: 'news',
        type: 'post',
        body: {
          "_source":["keywords"],
          query: {
            ids: {
              values: posts
            }
          }
        }
      }, function (req, res) {
        var result=(res.hits.hits);
        var keyWords=new Set();
        result.forEach((data)=>data["_source"]['keywords'].forEach((key)=>keyWords.add(key)));

        var keywords=Array.from(keyWords);
        client.search({
          index:'news',
          type:'post',
          body:{
            query:{
              bool:{
                must:{
                terms:{
                  keywords: keywords,
                },
              },
              }
            },
            size:5
          }
        },function(req,res){
          response.json({res:res.hits.hits});
        });

      });
    }
  });
});

function recommendations() {

}

app.get('/api/private', checkJwt, function (req, res) {
  res.json({message: "Hello from a private endpoint1! You need to be authenticated and have a scope of read:messages to see this."});
});

app.post('/api/admin', checkJwt, checkScopesAdmin, function (req, res) {
  res.json({message: "Hello from an admin endpoint! You need to be authenticated and have a scope of write:messages to see this."});
});

app.listen(3001);
console.log('Server listening on http://localhost:3001. The Angular app will be built and served at http://localhost:4200.');
