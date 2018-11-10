module.exports = (logger) => {
	var router = require('express').Router();
	router.use(function (req, res, next) {
		if (req.session.usuario) {
			if (req.session.usuario != null) {
				console.log('Time: ', Date.now());
				next();	
			}
		} else {
			res.redirect('/authenticate');
		} 
	});
	return router;
};