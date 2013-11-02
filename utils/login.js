module.exports = function (graph, config) {
    var fb = require('./facebook'),
        async = require('async'),
        underscore = require('underscore'),
        checkFirstTimeLogin = function (accessToken, callback) {
            var id;
            async.waterfall([
                function (cb) {
                    fb.me({ accessToken: accessToken }, cb);
                },
                function (me, cb) {
                    id = me.id;
                    cb();
                }
            ], function (err) {
                if (err) {
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