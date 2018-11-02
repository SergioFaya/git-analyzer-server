var mongoclient = require('mongodb').MongoClient;
const CrudManager = require('../CrudManager')(mongoclient);
var https = require('https');
const ApiRequester = require('../ApiRequest')(https);

module.exports = (router, swig, config) => {

    router.get('/', (req, res) => {
        res.send(swig.renderFile('views/index.html', {
            client_id: config.oauth.client_id
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
        });
    });

    router.post('/login', (req, res) => {
        var conf = {
            host: config.db.host,
            col: config.db.collections.commits,
            data: data
        }
        /* new CrudManager().insert(conf, (result) => {
            if(result == null){ 
                console.log("not inserted");
            }else{
                console.log("inserted")
            }
        }); */
    });

    router.get('/commits', (req, res) => {
        var conf = {
            host: config.db.host,
            query: config.db.queries.allCommits,
            col: config.db.collections.commits
        };
        new CrudManager().getAll(conf, (result) => {
            if (result == null) {
                res.send('nada');
            } else {
                res.send(swig.renderFile('views/commits.html', {
                    commits: JSON.stringify(result),
                    client_id: config.oauth.client_id
                }));
            }
        });
    });

    router.post('/auth', (req, res) => {
        console.log(req);
        res.redirect('/');
        // FIXME: when calling oauth app, github redirects to /auth?code=askahkdalshdka
        // and for some reason does not get inside the route
    });
    
    router.get('/auth', (req,res)=>{
        console.log(req);
        res.redirect('/');
        // FIXME: when calling oauth app, github redirects to /auth?code=askahkdalshdka
        // and for some reason does not get inside the route
    });

    return router;
}
