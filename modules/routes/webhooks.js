module.exports = (logger) => {
	var router = require('express').Router();   
	router.post('/hooks',(req,res)=>{  
		logger.log('info','WEBHOOKS: title of the issue '+req.body.issue.title);
		res.status(200);
		res.send();
	}); 	
	
	return router;
};