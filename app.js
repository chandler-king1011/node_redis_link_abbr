const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const redis = require('redis');
const fs = require('fs');
const exphbs = require("express-handlebars");

const port = 3000;
const app = express();

//view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
const hbs = exphbs.create({
    helpers: {
        links: " "
        } ,
    }
);

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





app.get("/links", function(req, response, next) {
    client.hgetall("link", function(err, res) {
        linkObj = res;
        response.render("links", linkObj);
     });
});
    






app.post("/", function(req, res) {
    let key ="link" 
    let link = req.body.url
    client.hmset(key, req.body.id, link);
    client.hmget(key, req.body.id, function(err, response) {
        let url = response;
        res.render("insertlink", {
            link: url
        });
    });
});


app.listen(port, function() {
    console.log('Server started on port:' + port);
});





 



