module.exports = function (app,express){
    var routerSecurity = express.Router();
    routerSecurity.use(function (req, res) {
        console.log("routerSecurity");
        res.status(400).redirect("/notFound");
    });

    app.use('/*', routerSecurity);
}