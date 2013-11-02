(function () {
    var timeUtils = require('../../utils/time-utils'),
        mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        UserSchema = new Schema({
            _id: String, //FBID
            name: String, 
            accessToken: String, //accesstoken
            friends: [String], //friend_FBID
            lastVisit: Date,
            store:[String] //share.id
        }),
        User = mongoose.model('User', UserSchema);

    exports.Model = User;

    // show post by id;
    exports.show = function (config, callback) {
        User.findOne({
            _id: config.id
        }, function (err, docs) {
            if (err) {
                callback(err);
            } else {
                callback(null, docs);
            }
        });
    };

    // create a post
    exports.create = function (config, callback) {
        var lastVisit = timeUtils.dateFromNow(24 * 60 * 60 * 1000);
        User.create({
            _id: config.id, //FBID
            name: config.name, 
            accessToken: config.accessToken,
            friends: config.friends, //friend_FBID
            lastVisit: lastVisit,
            store: []
        }, function (err, doc) {
            callback(null, doc);
        });
    };

    exports.updateLastVisit = function (config, callback) {
        User.findByIdAndUpdate(config.id, {
            lastVisit: new Date()
        }, function (err, doc) {
            callback(err, doc);
        });
    };

    exports.addStore = function (config, callback) {
        User.show({ id: config.id }, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                User.findByIdAndUpdate(config.id, {
                    store: doc.store.push(config.storeUpdate)
                }, function (err) {
                    callback(err);
                });    
            }
        });
    };

}());