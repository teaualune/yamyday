(function () {
    var User = require('../models/schema/user');
    module.exports = function (req, res, next) {
        // get user by req.session.fbid
        // if user exists, res.locals.user = user
        // if not, redirect to login
        if (req.session.fbid) {
            User.show({ id: req.session.fbid }, function (err, user) {
                if (err || !user) {
                    res.redirect('/login');
                } else {
                    res.locals.user = user;
                    next();
                }
            });
        } else {
            res.redirect('/login');
        }
    };
}());