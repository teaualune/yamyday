(function () {
    var underscore = require('underscore'),
        async = require('async'),

        User = require('../models/schema/user'),
        Share = require('../models/schema/share'),
        feed = require('../utils/fb-feed'),
        newsParser = require('../utils/news-parser'),
        shareCounter = require('../utils/share-counter'),
        timeUtils = require('../utils/time-utils'),
        isTestMode = require('../config.json').testMode,
        testModeArray = function (array) {
            var limit = isTestMode ? 100 : array.length;
            return underscore.first(array, limit);
        },

        getShareFromDB = function (user, callback) {
            Share.getShareByUser({
                user: user._id,
                timeStart: timeUtils.dateFromNow(24 * 60 * 60 * 1000),
                timeEnd: user.lastVisit
            }, callback);
        }

    module.exports = {
        main: function (req, res) {
            var friends = testModeArray(res.locals.user.friends);
            async.parallel([
                function (parallelCb) {
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
                                newsParser(feed, {
                                    fbid: res.locals.user._id
                                }, cb);
                            }
                        ], function (err, results) {
                            callback(err, results);
                        });
                    }, function (err, results) {
                        if (err) {
                            parallelCb(err);
                        } else {
                            parallelCb(null, underscore.compact(underscore.flatten(results)));
                        }
                    });
                },
                function (parallelCb) {
                    getShareFromDB({
                        user: res.locals.user
                    }, parallelCb);
                }
            ], function (err, parallelData) {
                var filtered = underscore.flatten(parallelData);
                shareCounter(filtered, function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        User.updateLastVisit({ id: res.locals.user._id }, function () {
                            res.send({
                                feeds: data
                            });
                        });
                    }
                });
            });
        }
    }
}());