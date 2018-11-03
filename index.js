const config = require('./modules/config/config');
const express = require('express');
// TODO: Revisar oktokit
// TODO: Revisar la utilidad de los node webhooks ya que de momento postean guay
var wh = require('node-webhooks');
var app = express();
// TODO: cambiar a ejs posiblemente
var swig = require('swig');

var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

//Winston para los logs
var winston = require('winston');
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs.log' })
    ]
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var route_hooks = require('./modules/routers/webhooks')(logger);
var route_general = require('./modules/routers/views')(swig, logger);

app.use(express.static('public'));
app.use('/',route_general);
app.use('/',route_hooks);

// 0.0.0.0 allows access from any ip address not only form 127.0.0.1 aka localhost
app.listen(config.app.port, config.app.source, () => {
    console.log("listening on port", config.app.port)
});
