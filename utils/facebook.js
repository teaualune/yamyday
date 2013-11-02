(function () {
    var fbConfig = require('../config.json').facebook,
        graph = require('fbgraph');

    module.exports = {
        getAuthenticationUrl: function () {
            return graph.getOauthUrl({
                client_id: fbConfig.client_id,
                redirect_uri: fbConfig.redirect_uri,
                scope: fbConfig.scope
            });
        },
        getToken: function (code, callback) {
            graph.authorize({
                client_id: fbConfig.client_id,
                redirect_uri: fbConfig.redirect_uri,
                client_secret: fbConfig.client_secret,
                code: code
            }, function (err, result) {
                callback(err, result.access_token);
            });
        },
        me: function (config, callback) {
            graph.setAccessToken(config.accessToken);
            graph.get('/me', function (err, res) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, res);
                }
            });
        },
        getFriends: function (config, callback) {
            var friends = [],
                handler = function (err, res) {
                    if (err) {
                        callback(err);
                    } else {
                        friends.push.apply(friends, res.data);
                        if (res.paging && res.paging.next) {
                            graph.get(res.paging.next, handler);
                        } else {
                            callback(null, friends);
                        }
                    }
                };
            graph.setAccessToken(config.accessToken);
            graph.get('/me/friends', handler);
        }
    }
}());