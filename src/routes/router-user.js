const router = require('express').Router();
const request = require('superagent');
const config = require('../config/config');
const octokit = require('@octokit/rest')({
	timeout: 0,
	headers: {
		accept: 'application/vnd.github.v3+json',
		'user-agent': config.oauth.userAgent
	},
	agent: undefined
});
module.exports = (logger) => {

	router.get('/auth', (req, res) => {
		var code = req.query.code;
		request
			.post('https://github.com/login/oauth/access_token')
			.send({
				client_id: config.oauth.client_id,
				client_secret: config.oauth.client_secret,
				code: code
			})
			.set('Accept', 'application/json')
			.then((result) => {
				var user = require('../db_objects/user');
				var access_token = result.body.access_token;
				user.access_token = access_token;
				octokit.authenticate({
					type: 'oauth',
					token: access_token
				});
				request
					.get('https://api.github.com/user')
					.set('Authorization', 'token ' + access_token)
					.then(result =>{
						user.username = result.body.login;
						user.name = result.body.name;
						user.avatar_url = result.body.avatar_url;
						req.session.user = user;
						res.redirect('/');
					}).catch((err) => {
						logger.log({ 
							level: 'error',
							message: 'error when getting the user data',
							date: Date.now().toString(),
							trace: err.toString()
						});
						res.redirect('/?err=ERROR: cannot authenticate, try making another request');
					});
			}).catch((err) => {
				logger.log({ 
					level: 'error',
					message: 'error when getting the github access token',
					date: Date.now().toString(),
					trace: err.toString()
				});
				res.redirect('/?err=ERROR: cannot get the access token');
			});
	});

	router.get('/logout',(req, res)=>{
		req.session.user = null;
		res.redirect('/');
	});

	return router;
};