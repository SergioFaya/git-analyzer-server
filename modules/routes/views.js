module.exports = (router, swig, https) => {

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
        var options = {
            host: 'api.github.com',
            path: '/users/Arquisoft/repos',
            method: 'GET',
            headers: { 'user-agent': 'SergioFaya' },
            'content-type': 'json'
        }

        var request = https.request(options, (resp) => {
            var data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk.toString('utf8');
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                var respuesta = swig.renderFile("views/index.html", {
                    text: data
                });
                res.send(respuesta);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
        request.end();
    });

    return router;
}
