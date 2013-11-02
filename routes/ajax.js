(function () {
    var underscore = require('underscore'),
        async = require('async'),

        User = require('../models/schema/user'),
        feed = require('../utils/fb-feed'),
        newsParser = require('../utils/news-parser'),
        shareCounter = require('../utils/share-counter'),
        timeUtils = require('../utils/time-utils'),
        isTestMode = require('../config.json').testMode,
        testModeArray = function (array) {
            var limit = isTestMode ? 100 : array.length;
            return underscore.first(array, limit);
        };

    module.exports = {
        main: function (req, res) {
            var friends = testModeArray(res.locals.user.friends);
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
                    res.send(err);
                } else {
                    var filtered = underscore.compact(underscore.flatten(results));
                    shareCounter(filtered, function (err, data) {
                        var sharesObj = {};
                        var scoreObj = {};
                        underscore.each(data, function (obj) {
                            sharesObj[obj._id] = obj.shares;
                            scoreObj[obj._id] = obj.score;
                        });
                        console.log(sharesObj);
                        console.log(scoreObj);
                        if (err) {
                            res.send(err);
                        } else {
                            User.updateLastVisit({ id: res.locals.user._id }, function () {
                                res.send({
                                    news: data,
                                    shares: sharesObj,
                                    scores: scoreObj
                                });
                            });
                        }
                    });
                }
            });
        }
    }
}());