(function () {
    var async = require('async'),
        underscore = require('underscore'),

        News = require('../models/schema/news'),
        crawler = require('./news-crawler'),

        newsGroup = {
            yahoo: 'tw.news.yahoo.com/',
            ettoday: 'www.ettoday.net/news/',
            nownews: 'www.nownews.com/n/',
            udn: 'udn.com/NEWS/',
            cna: 'www.cna.com.tw/news/',
            chinatimes: '.chinatimes.com/',
        },

        matchNews = function (link) {
            var matched = null,
                n;
            if (link) {
                for (n in newsGroup) {
                    if (newsGroup.hasOwnProperty(n) && link.indexOf(newsGroup[n]) >= 0) {
                        matched = n;
                        break;
                    }
                }
            }
            return matched;
        },

        checkFeedParams = function (feed) {
            feed.likes = feed.likes || { summary: { total_count: 0 }};
        },

        findNews = function (config, callback) {
            var handler = function (err, news) {
                    if (err) {
                        callback(err);
                    } else if (news) { // found
                        callback(null, news);
                    } else { // not found, return false
                        callback(null, false);
                    }
                };
            if (config.source === 'yahoo') {
                News.show({ newsID: config.link }, handler);
            } else {
                // find Y! News by alias form web
                News.findNewsByAlias({ alias: config.link }, handler);
            }
        },

        findYahooNewsByAlias = function () {},

        buildShare = function () {};

    module.exports = function (feeds, config, callback) {
        async.map(feeds, function (feed, cb) {
            var source = matchNews(feed.link);
            console.log(feed.link + ' ; ' + source);
            async.waterfall([
                function (cb) {
                    if (source) {
                        checkFeedParams(feed);
                        cb();
                    } else {
                        cb('skip');
                    }
                },
                function (cb) {
                    findNews({
                        source: source,
                        link: feed.link
                    }, cb);
                },
                function (news, cb) {
                    if (news) {
                        cb(null, news);
                    } else {
                        crawler.crawlNewsPage(feed.link, source, cb);
                    }
                },
                function (news, cb) {
                    if (news._id) {
                        cb(null, news);
                    } else {
                        News.create({
                            id: feed.link,
                            title: news.search_title,
                            content: news.search_content_result,
                            imgUrl: news.search_imgUrl
                        }, cb);
                    }
                },
                function (news, cb) {
                    // get share from DB or create one if not found
                }
            ], function (err, share) {
                if (err && err !== 'skip') {
                    cb(err);
                } else if (share) {
                    cb(null, share);
                } else {
                    cb(null, false);
                }
            });
        }, function (err, results) {
            var returnResults = underscore.compact(results);
            if (err && returnResults.length === 0) {
                callback(err);
            } else {
                callback(null, returnResults);
            }
        });
    };
}());
