const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
var spawn = require("child_process").spawn;
var request = require('request');
async = require("async");
var webshot = require('webshot');
var path=require('path');
require('dotenv').config();


var homepage = require("./server/homepage.js")

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file'
}

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

app.get('/api/load/trending', function (req, res) {
  request('http://localhost:5000/listTrendingTopics', function (error, response, body) {

    JSON.parse(body).slice(0, 10).forEach(function (site) {

      request('http://localhost:5000/generatePaper?url=' + site, function (err, response, body) {

      });
    });
    res.json({status: "queud for scraping"});

  });
});


app.get('/trends/toptopics',function (req, res) {

  var topic = [];

  request('http://localhost:5000/listTrendingTopics', function (error, response, body) {

    var topics = JSON.parse(body);
    var promise = [];

    for (var i = 0; i < 100; i++) {
      var temp=new Promise(function (resolve, reject) {

          webshot(topics[i], "public/"+topics[i].replace("http://","") + ".png", function (err) {
            resolve();
          });
        })

      temp.then(function(){
          console.log("Yay");
      });

    }


  });
    res.json({"succes":1});

});

app.get('/api/public', function (req, res) {
  res.json({message: "bitch please!"});
});


app.get('/api/private', checkJwt, function (req, res) {
  res.json({message: "Hello from a private endpoint1! You need to be authenticated and have a scope of read:messages to see this."});
});

app.post('/api/admin', checkJwt, checkScopesAdmin, function (req, res) {
  res.json({message: "Hello from an admin endpoint! You need to be authenticated and have a scope of write:messages to see this."});
});

app.listen(3001);
console.log('Server listening on http://localhost:3001. The Angular app will be built and served at http://localhost:4200.');
