module.exports = (router, swig) => {
    var https = require('https');
    router.get('/', (req, res) => {
        var respuesta = swig.renderFile("views/index.html", {
            text: ""
        });
        res.send(respuesta);
    });

    router.get('/form', (req, res) => {
        res.redirect('/');
    });

    router.post('/form', (req, res) => {
        var requester = require('../ApiRequest')(https);
        var user = {
            username: req.body.username,
            repo: req.body.repo
        }
        new requester(user).performRequest((data) => {
            var respuesta = swig.renderFile("views/index.html", {
                commits: data,
            });
            res.send(respuesta);
        })
    });

    return router;
}
