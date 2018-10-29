var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

router.post('/',(req,res)=>{
  console.log(req);
  console.log(res);
  res.status(200);
  res.send();
});

module.exports = router;