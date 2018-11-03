var express = require('express');
var router = express.Router();
var mongoclient = require('mongodb').MongoClient;
const CrudManager = require('../CrudManager')(mongoclient);
var https = require('https');
const ApiRequester = require('../ApiRequest')(https);
const request = require('superagent');
const config = require('../config/config');
module.exports = (swig, logger) => {

    router.get('/', (req, res) => {
        res.send(swig.renderFile('views/index.html', {
            client_id: config.oauth.client_id,
            err: req.query.err,
            user: req.session.user
        }));
    });

    router.get('/form', (req, res) => {
        res.redirect('/');
    });

    router.post('/form', (req, res) => {
        var user = {
            username: req.body.username,
            repo: req.body.repo     
        }
        new ApiRequester(user).performRequest((data) => {
            res.send(swig.renderFile("views/index.html", {
                commits: data,
            }));
        });
    });

    router.get('/commits', (req, res) => {
        var conf = {
            host: config.db.host,
            query: config.db.queries.allCommits,
            col: config.db.collections.commits
        };
        new CrudManager().getAll(conf, (result) => {
            if (result == null) {
                res.send('nada');
            } else {
                res.send(swig.renderFile('views/commits.html', {
                    commits: JSON.stringify(result),
                    client_id: config.oauth.client_id
                }));
            }
        });
    });

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
                var user = require('./../db_objects/user');
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

                        new CrudManager().insert(conf, (result) => {
                            if (result == null) {
                                logger.log({level: 'error', message: 'user data not inserted'});
                            } else {
                                logger.log({level: 'info', message: 'user data inserted'});
                                req.session.user = user;
                                res.redirect('/');                                
                            }
                        });
                    }).catch(() => {
                            logger.log({level: 'error', message: 'error when accessing github api'});
                            res.redirect('/?err=ERROR')
                            }
                        );
            }).catch(() => {
                logger.log({level: 'error', message: 'error when accessing github api'});
                res.redirect('/?err=ERROR')
                }
            );

    });

    return router;
}
