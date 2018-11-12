var router = require('express').Router();
const CrudObject = require('../db_objects/CrudObject');
const config = require('../config/config');
const swig = require('swig');
const octokit = require('@octokit/rest')({
	timeout: 0,
	headers: {
		accept: 'application/vnd.github.v3+json',
		'user-agent': config.oauth.userAgent
	},
	agent: undefined
});
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
		//redundant authentication for security
		if (req.session.user) {
			var token = req.session.user.access_token;
			octokit.authenticate({
				type: 'oauth',
				token: token
			});
		}
		octokit.repos
			.getCommits({
				owner: req.body.username,
				repo: req.body.repo,
			})
			.then(result => {
				if (!result) {
					res.redirect('/?err=No access token provided');
				} else {
					res.send(swig.renderFile('views/index.html', {
						commits: result.data,
						client_id: config.oauth.client_id,
						scope: config.oauth.scope,
						err: req.query.err,
						user: req.session.user
					}));
				}
			}).catch((err) => {
				logger.log({
					level: 'error',
					message: 'Content not found for request with username:' + req.body.username + ' and repo:' + req.body.repo,
					date: Date.now().toString(),
					trace: err.toString()
				});
				res.redirect('/?err=No username or repo provided');
			});
	});

	router.get('/commits', (req, res) => {
		var conf = {
			host: config.db.host,
			query: config.db.queries.allCommits,
			col: config.db.collections.commits
		};
		new CrudObject(conf).getAll((result) => {
			if (result == null) {
				res.send('nada');
				logger.log({
					level: 'error',
					message: 'error accessing the database',
					date: Date.now().toString()
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
