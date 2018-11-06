const config = require('./modules/config/config');
const express = require('express');
// TODO: Revisar oktokit
// TODO: Revisar la utilidad de los node webhooks ya que de momento postean guay
var wh = require('node-webhooks');
var app = express();
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

var router_hooks = require('./modules/routes/webhooks')(logger);
var router_user = require('./modules/routes/router-user')(logger);
var router_general = require('./modules/routes/router-general')(logger);
var router_not_found = require('./modules/routes/router-notfound')(logger);
var router_session = require('./modules/routes/router-session')(logger);

app.use(express.static('public'));
app.use('/user', router_session);
app.use('/', router_general);
app.use('/', router_user);
app.use('/hooks', router_hooks);
app.use('/', router_not_found);

app.listen(config.app.port, config.app.source, () => {
    console.log("listening on port", config.app.port)
});
