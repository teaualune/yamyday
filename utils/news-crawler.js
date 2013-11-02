(function () {
    var URL = require('url'),
        querystring = require('querystring'),
        underscore = require('underscore'),
        htmlparser2 = require('htmlparser2'),
        request = require('request'),
        dom = require('xmldom').DOMParser,
        xpath = require('xpath'),

        pythonServer = URL.format(require('../config.json').python),
        yahooSearch = 'http://tw.news.search.yahoo.com/search?';

    module.exports = {
        crawlNewsPage: function (url, source, callback) {
            var qs = querystring.stringify({
                    url: url,
                    source: source
                }),
                pythonUrl = pythonServer + '?' + qs;
            request(pythonUrl, function (err, res, body) {
                if (err) {
                    callback(err);
                } else {
                    body = JSON.parse(body);
                    callback(null, body);
                }
            });
        },
        crawlYahooSearchPage: function (query, callback) {
            var url = yahooSearch + querystring.stringify({ p: query });
            request(url, function (err, res, body) {
                if (err) {
                    callback(err);
                } else {
                    var doc = new dom().parseFromString(body),
                        a = xpath.select('//div[@id="sm-1"]//a', doc)[0],
                        link;
                    link = a ? a.attributes[1].nodeValue : false;
                    callback(null, link);
                }
            });
        }
    };
}());