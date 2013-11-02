(function () {
    var underscore = require('underscore'),
        async = require('async'),
        News = require('../models/schema/news');

    module.exports = function (results, callback) {
        var sortingResult = [],
            now = new Date(),
            sortedArray = [],
            newsArray = [],
            newsForArray;

        underscore.each(results, function (shareObj) {
            var shareSameCount = underscore.where(results, { newsID: shareObj.newsID }).length;
            shareObj.score = (shareObj.likes + 1) * shareSameCount * (1000000000000 / (now - shareObj.date + 1));
        });
        results = underscore.sortBy(results, function (shareObj) {
            return -shareObj.score;
        });
        async.each(results, function (shareObj, cb) {
            News.show({ newsID:shareObj.newsID }, function (err, doc) {
                if (err) {
                    cb(err);
                } else {
                    shareObj.news = doc;
                    cb();
                }
            });
        }, function (err) {
            underscore.each(results, function (shareObj) {
                if (underscore.where(newsArray, { _id: shareObj.newsID }).length) {
                    return;
                };
                var shareSameArray = underscore.where(results, { newsID: shareObj.newsID });
                shareSameArray = underscore.sortBy(shareSameArray, function (shareObj) {
                    return -shareObj.score;
                });
                newsForArray = shareSameArray[0].news;
                newsForArray.shares = underscore.map(shareSameArray, function (s) {
                    return underscore.pick(s, [
                        '_id',
                        'user',
                        'from',
                        'newsID',
                        'message',
                        'likes',
                        'date',
                        'score'
                    ]);
                });
                var arrayScore = 0;
                underscore.each(shareSameArray, function (shareObj) {
                    arrayScore = arrayScore + shareObj.score;
                })
                arrayScore = arrayScore / shareSameArray.length;
                newsForArray.score = arrayScore;
                newsArray.push(newsForArray);
            });
            newsArray = underscore.sortBy(newsArray, function (shareObj) {
                    return -shareObj.score;
            });
            for (var i = 0; i < Math.min(newsArray.length, 10); i = i + 1) {
                sortedArray.push(newsArray[i]);
            }
            callback(null, sortedArray);
        });

    };
}());
