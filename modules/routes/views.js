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
        var requester = require('../ApiRequester')(https);
        new requester('Arquisoft').performRequest((data) => {
            var respuesta = swig.renderFile("views/index.html", {
                text: data
            });
            res.send(respuesta);
        })
    });

    return router;
}
