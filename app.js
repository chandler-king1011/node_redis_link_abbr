const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const exphbs = require("express-handlebars");
const port = 3000;
const app = express();


//view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// redis client
const client = redis.createClient();

client.on('connect', function() {
    console.log("Connected to Redis...");

});

client.on("error", function (err) {
    console.log("Error connecting to Redis..." + err);
});




app.get("/", function(req, res, next) {
    res.render("insertlink");
    }
);

app.post("/", function(req, res) {
    let key ="link" 
    let url = req.body.url
    let fieldOne = req.body.id
    let fieldTwo = "short" + req.body.id;
    let shortenLink = `http://localhost:${Math.random()}`;
    console.log(shortenLink);
    client.hmset(key, fieldOne, url, fieldTwo, shortenLink);
    client.hgetall(key, fieldTwo, function(err, response) {
        let url = response;
        console.log(response);
        res.render("insertlink", {
            link: url
        });
    });
});




app.get("/links", function(req, response, next) {
    client.hgetall("link", function(err, res) {
        linkObj = res;
        console.log(linkObj);
        response.render("links", linkObj);
     });
});
    








app.listen(port, function() {
    console.log('Server started on port:' + port);
});





 



