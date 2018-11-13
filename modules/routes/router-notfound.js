module.exports = (logger) => {
	var router = require('express').Router();
	var config = require('../config/config');

	router.get('/notFound', (req, res) => {
		res.send({
			client_id: config.oauth.client_id,
			err: req.query.err,
			user: req.session.user
		});
	});
	
	router.use((req, res) => {
		logger.log({level: 'info', message: 'Going to '+ req.originalUrl});
		res.status(404).redirect('/notFound');
	});

	return router;
};