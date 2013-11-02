(function () {
    var underscore = require('underscore'),
        async = require('async'),
        feed = require('../utils/fb-feed'),
        timeUtils = require('../utils/time-utils');

    module.exports = {
        main: function (req, res) {
            var friends = res.locals.user.friends;
            async.map(friends, function (friend, callback) {
                async.waterfall([
                    function (cb) {
                        var since = timeUtils.minutesFromNow(res.locals.user.lastVisit);
                        feed({
                            accessToken: req.session.accessToken,
                            fbid: friend,
                            since: since,
                            limit: 100
                        }, cb);
                    },
                    function (feed, cb) {
                        // parse news
                        cb(null, feed);
                    }
                ], function (err, results) {
                    callback(err, results);
                });
            }, function (err, results) {
                if (err) {
                    res.send(err);
                } else {
                    console.log(results);
                    res.send({
                        feeds: underscore.flatten(results)
                    });
                }
            });
        }
    }
}());