const express = require('express');
var wh = require('node-webhooks');
var app = express();
var swig = require('swig');


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.urlencoded({ extended: true }));

var route_hooks = require('./modules/routes/webhooks');
var route_general = require('./modules/routes/views')(express.Router(),swig);

app.use(express.static('public'));

app.use('/',route_general);
app.use('/',route_hooks);

app.listen(3000,()=>{
    console.log("listening on port 3000")
});


