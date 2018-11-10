module.exports = (logger) => {
	var router = require('express').Router();   
	router.post('/hooks',(req,res)=>{  
		logger.log({level:'webhook',message:'Hook Received', payload: req.body });
		res.status(200);
		res.send();
	});  
	
	
	return router;
};