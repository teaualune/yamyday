(function () {
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        NewsSchema = new Schema({
            _id: String, //url
            title: String, //news title
            content : String, //news content
            imgUrl: String,
            aliases: [String] // a news in other news site's url
        }),
        News = mongoose.model('News', NewsSchema);

    exports.Model = News;

    exports.show = function (config, callback) {
        News.findOne({ _id: config.newsID }, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, doc);
            }
        });
    };

    exports.create = function (config, callback) {
        News.create({
            _id: config.id, //url
            title: config.title, //news title
            content : config.content,
            imgUrl: config.imgUrl,
            aliases: config.aliases || []
        }, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, doc);
            }
        });

    };

    exports.updateAliases = function (config, callback) {
        News.findOne({ _id: config.id }, function (err, doc) {
            News.findByIdAndUpdate(id, {
                aliases: doc.aliases.concat(config.aliases)
            }, function (err, doc) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, doc);
                } 
            });    
        });
    };

    exports.findNewsByAlias = function (config, callback) {
        News.findOne({ alias: config.alias }, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, doc);
            }    
        });
    };

}());