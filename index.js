const config = require('./modules/config/config');
const express = require('express');
// TODO: Revisar la utilidad de los node webhooks ya que de momento postean guay
var wh = require('node-webhooks');
var app = express();
// TODO: cambiar a ejs posiblemente
var swig = require('swig');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({ extended: true }));

var route_hooks = require('./modules/routes/webhooks');
var route_general = require('./modules/routes/views')(express.Router(),swig, config);

app.use(express.static('public'));
app.use('/',route_general);
app.use('/',route_hooks);

app.listen(config.app.port, () => {
    console.log("listening on port", config.app.port)
});
