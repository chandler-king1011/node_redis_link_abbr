const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const exphbs = require("express-handlebars");

//Setting up server
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



//Home views
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
    client.hmset(key, fieldOne, url, fieldTwo, shortenLink);
    res.render("insertlink", {link: shortenLink});
    });




//Links views
app.get("/links", function(req, response, next) {
    client.hgetall("link", function(err, res) {
        linkObj = res;
        response.render("links", linkObj);
     });
});
    


//Port listener
app.listen(port, function() {
    console.log('Server started on port:' + port);
});





 



