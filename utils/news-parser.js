(function () {
    var async = require('async'),
        underscore = require('underscore'),

        News = require('../models/schema/news'),
        Share = require('../models/schema/share'),
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

        buildShare = function (feed, news, userID, callback) {
            Share.show({ shareID: feed.id }, function (err, doc) {
                if (err) {
                    callback(err);
                } else if (doc) {
                    doc.news = news;
                    callback(null, doc);
                } else {
                    Share.create({
                        id: feed.id,
                        userID: userID,
                        from: feed.from,
                        newsID: news._id,
                        message: feed.message,
                        likes: feed.likes.summary.total_count,
                        date: new Date(1000*feed.created_time)
                    }, function (err, doc) {
                        if (err) {
                            callback(err);
                        } else {
                            doc.news = news;
                            callback(null, doc);
                        }
                    });
                }
            });
        };

    module.exports = function (feeds, config, callback) {
        async.map(feeds, function (feed, cb) {
            var source = matchNews(feed.link),
                yahooLink = feed.link;
            console.log(feed.link + ' ; ' + source);
            async.waterfall([
                function (cb) {
                    if (source) {
                        checkFeedParams(feed);
                        findNews({
                            source: source,
                            link: feed.link
                        }, cb);
                    } else {
                        cb('skip');
                    }
                },
                function (news, cb) {
                    if (news) {
                        cb(null, news);
                    } else {
                        crawler.crawlNewsPage(feed.link, source, cb);
                    }
                },
                function (news, cb) {
                    if (source === 'yahoo') {
                        cb(null, news);
                    } else {
                        crawler.crawlYahooSearchPage(news.search_title, function (err, link) {
                            if (err || !link) {
                                cb('skip');
                            } else {
                                yahooLink = link;
                                cb(null, news);
                            }
                        });
                    }
                },
                function (news, cb) {
                    if (news._id) {
                        cb(null, news);
                    } else {
                        var newsObj = {
                                id: yahooLink,
                                title: news.search_title,
                                content: news.search_content_result,
                                imgUrl: news.search_imgUrl
                            };
                        if (source !== 'yahoo') {
                            newsObj.aliases = [ feed.link ];
                        }
                        News.create(newsObj, cb);
                    }
                },
                function (news, cb) {
                    // get share from DB or create one if not found
                    buildShare(feed, news, config.fbid, cb);
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
