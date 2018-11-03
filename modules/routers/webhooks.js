var express = require('express');
var router = express.Router();

module.exports = (logger) => {
   
  // middleware that is specific to this router
  router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
  });
  
  router.post('/',(req,res)=>{
  
    res.status(200);
    res.send();
  });  
  
  
  return router;
}