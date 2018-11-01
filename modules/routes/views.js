var mongoclient = require('mongodb').MongoClient;
const CrudManager = require('../CrudManager')(mongoclient);
var https = require('https');
const ApiRequester = require('../ApiRequest')(https);

module.exports = (router, swig, config) => {

    router.get('/', (req, res) => {
        res.send(swig.renderFile("views/index.html", {
            text: ""
        }));
    });

    router.get('/form', (req, res) => {
        res.redirect('/');
    });

    router.post('/form', (req, res) => {
        var user = {
            username: req.body.username,
            repo: req.body.repo
        }
        new ApiRequester(user).performRequest((data) => {
            res.send(swig.renderFile("views/index.html", {
                commits: data,
            }));
        })
    });

    router.get('/login', (req, res) => {
        //res.send(swig.renderFile(''));
        
    });

    router.post('/login', (req, res) => {

    });

    router.get('/commits',(req,res) => {
        var conf = {
            host: config.db.host,
            query: config.db.queries.allCommits,
            col: config.db.collections.commits
        };
        new CrudManager().getAll(conf, (result) => {
            if (result == null) {
                res.send('nada');
            } else {
                res.send(result)
            }
        });
    });
    return router;
}
