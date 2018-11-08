module.exports = function (logger) {
    var router = require('express').Router();
    router.use(function (req, res, next) {
        if (req.session.usuario) {
            if (req.session.usuario != null) {
                next();
            }
        } else {
            res.redirect('/authenticate');
        } 
    });
    return router;
};