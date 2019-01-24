var Octokit = require('@octokit/rest');
var request = require('superagent');
var express = require('express');

var client_id = 'c4c42af4e127583d6c40';
var client_secret = 'd6aa5e40a8d48ffe98c831f65a244879982fe237';

var router = express.Router();

const octokit = new Octokit({
	agent: undefined,
	headers: {
		// 'accept': 'application/vnd.github.v3+json',
		// custom media type for accesing API during preview
		'Accept': 'application/vnd.github.machine-man-preview+json',
        'user-agent': 'SergioFaya',
        'content-type': 'application/vnd.github.machine-man-preview+json',
	},
	timeout: 0,
});

router.get('/login', (req, res) => {
	res.redirect('https://github.com/login/oauth/authorize?client_id='
		+ client_id + '&scope=repo' );
});

router.get('/auth', (req, res) => {
    request
        .post('https://github.com/login/oauth/access_token')
        .send({
            client_id: client_id,
            client_secret: client_secret,
            code: req.query.code,
        })
        .set('Accept', 'application/json')
        .then((result) => {
            const accessToken = result.body.access_token;
            // utilizamos la autenticación de octokit
            octokit.authenticate({
                token: accessToken,
                type: 'oauth',
            });
            octokit.apps.listRepos({})
                .then((result1) => {
                    console.log(result1)
                })
                .catch((err) => {
                    console.log(err)
                });
        }).catch((err) => {
            console.log(err);
        });
});

this.app = express();
this.app.use('/', router);

this.app.listen(3000, ()=>{
    console.log('app running');

})
