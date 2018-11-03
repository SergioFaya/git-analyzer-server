module.exports = function (app, express) {
    var routerSession = express.Router();
    routerSession.use(function (req, res, next) {
        if (req.session.usuario != null) {
            next();
        } else {
            res.redirect("/");
        } 
    });
}