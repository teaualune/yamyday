module.exports = function (graph, config) {
    var async = require('async'),
        underscore = require('underscore'),

        fb = require('./facebook'),
        User = require('../models/schema/user'),

        checkFirstTimeLogin = function (accessToken, callback) {
            var id, name;
            async.waterfall([
                function (cb) {
                    fb.me({ accessToken: accessToken }, cb);
                },
                function (me, cb) {
                    id = me.id;
                    name = me.name;
                    User.show({ id: me.id }, function (err, user) {
                        if (err) {
                            cb(err);
                        } else if (!user) { // first time login
                            cb(null);
                        } else {
                            cb('return');
                        }
                    });
                },
                function (cb) {
                    fb.getFriends({ accessToken: accessToken }, cb);
                },
                function (friends, cb) {
                    User.create({
                        id: id,
                        name: name,
                        accessToken: accessToken,
                        friends: underscore.pluck(friends, 'id')
                    }, function () {
                        console.log('create user ' + id);
                        cb(null);
                    });
                }
            ], function (err) {
                if (err && err !== 'return') {
                    callback(err);
                } else {
                    callback(null, id);
                }
            });
        };
    return function (req, res) {
        if (!req.query.code) {
            if (!req.query.error) {
                res.redirect(fb.getAuthenticationUrl());
            } else {
                res.send('access denied');
            }
        } else {
            fb.getToken(req.query.code, function (err, accessToken) {
                req.session.accessToken = accessToken;
                checkFirstTimeLogin(accessToken, function (err, fbid) {
                    if (err) {
                        res.send(err);
                    } else {
                        req.session.fbid = fbid;
                        res.redirect('/');
                    }
                });
            });
        }
    };
};