(function () {
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        fromSchema = new Schema({
            FBID: String,
            name: String
        }),
        ShareSchema = new Schema({
            _id: String, //postFBID
            user: String, // U, the searching guy
            from: {type: String, refs:fromSchema}, // U're friend, who post this share
            newsID: String, //News_id
            message: {type: String, default: ''},
            likes: {type: Number, default: 0},
            date: Date
        }),
        Share = mongoose.model('Share', ShareSchema);

    exports.Model = Share;

    exports.show = function (config, callback) {
        Share.findOne({ _id: config.shareID }, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, doc);
            } 
        });
    };

    exports.create = function (config, callback) {
        Share.create({
            _id: config.id,
            user: config.userID,
            from: {
                FBID: config.from.id,
                name: config.from.name
            },
            newsID: config.newsID,
            message: config.message,
            likes: config.likes,
            date: config.date
        }, function (err, doc) {
            if (err) {
                callback(err);
            } else if (doc) {
                callback(null, doc);
            } else {
                callback();
            }
        });
    };

    exports.updateShareLikes = function (config, callback) {
        Share.findByIdAndUpdate(config.id, {
            likes: config.likes
        }, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, doc);
            } 
        });
    };

    exports.getShareByUser = function (config, callback) {
        Share.find({
            _id: config.user,
            date: {
                '$gte': config.timeStart,
                '$lt': config.timeEnd
            }
        }, function (err, docs) {
            if (err) {
                callback(err);
            } else {
                callback(null, docs);
            }
        });
    };
}());