(function () {
    var graph = require('fbgraph'),
        querystring = require('querystring'),

        getFeedRequestURL = function (config) {
            var qs = querystring.stringify({
                    since: (config.since || (24 * 60)) + ' minutes ago',
                    limit: config.limit || 100,
                    fields: 'link,message,likes.summary(true),from,comments.fields(from,message)',
                    date_format: 'U'
                });
            return config.fbid + '/feed?' + qs;
        };

    module.exports = function (config, callback) {
        var url = '/' + getFeedRequestURL(config);
        graph.setAccessToken(config.accessToken);
        graph.get(url, function (err, feed) {
            if (err) {
                callback(err);
            } else {
                callback(null, feed.data);
            }
        });
    };
}());