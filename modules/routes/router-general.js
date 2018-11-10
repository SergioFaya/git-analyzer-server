var router = require('express').Router();
var mongoclient = require('mongodb').MongoClient;
const CrudManager = require('../CrudManager')(mongoclient);
const config = require('../config/config');
const swig = require('swig');
const octokit = require('@octokit/rest')();
module.exports = (logger) => {
	router.get('/', (req, res) => {
		res.send(swig.renderFile('views/index.html', {
			client_id: config.oauth.client_id,
			scope: config.oauth.scope,
			err: req.query.err,
			user: req.session.user
		}));
	});

	router.get('/form', (req, res) => {
		res.redirect('/');
	});

	router.post('/form', (req, res) => {
		var token;
		if (req.session.user) {
			token = req.session.user.access_token;
		}
		var user = {
			username: req.body.username,
			repo: req.body.repo,
			access_token: token
		};
		octokit.repos
			.getCommits({
				owner: user.username,
				repo: user.repo,
			})
			.then(result => {
				if (!result) {
					var data;
					data.length = 'ERROR: NO ACCESS TOKEN';
					res.send(swig.renderFile('views/index.html', {
						commits: data,
						client_id: config.oauth.client_id,
						scope: config.oauth.scope,
						err: req.query.err,
						user: req.session.user
					}));
				} else {
					res.send(swig.renderFile('views/index.html', {
						commits: result.data,
						client_id: config.oauth.client_id,
						scope: config.oauth.scope,
						err: req.query.err,
						user: req.session.user
					}));
				}
			});
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
				logger.log({
					'level': 'error',
					'messange': 'error when accessing github api for getting user data with the access token'
				});
			} else {
				res.send(swig.renderFile('views/commits.html', {
					commits: JSON.stringify(result),
					client_id: config.oauth.client_id
				}));
			}
		});
	});

	return router;
};
