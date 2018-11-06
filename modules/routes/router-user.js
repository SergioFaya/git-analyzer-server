const router = require('express').Router();
const request = require('superagent');
const config = require('../config/config');
module.exports = (logger) => {

    router.get('/auth', (req, res) => {
        var code = req.query.code;
        request
            .post('https://github.com/login/oauth/access_token')
            .send({
                client_id: config.oauth.client_id,
                client_secret: config.oauth.client_secret,
                code: code
            })
            .set('Accept', 'application/json')
            .then((result) => {
                var user = require('../db_objects/user');
                var access_token = result.body.access_token;
                user.access_token = access_token;
                request
                    .get('https://api.github.com/user')
                    .set('Authorization', 'token ' + access_token)
                    .then((result2) => {
                        user.username = result2.body.login;
                        user.name = result2.body.name;
                        user.avatar_url = result2.body.avatar_url;

                        var conf = {
                            host: config.db.host,
                            col: config.db.collections.users,
                            data: user
                        }
                        req.session.user = user;
                        res.redirect('/');
                    }).catch(() => {
                        logger.log({ level: 'error', message: 'error when accessing github api for getting user data with the access token' });
                        res.redirect('/?err=ERROR using the acces token')
                    }
                    );
            }).catch(() => {
                logger.log({ level: 'error', message: 'error when sending to the github api the code for access token' });
                res.redirect('/?err=ERROR getting the access token')
            });
    });

    router.get('/logout',(req, res)=>{
        req.session.user = null;
        res.redirect('/');
    });

    return router;
}