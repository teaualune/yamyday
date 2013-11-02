(function () {
    module.exports = function (req, res, next) {
        // get user by req.session.fbid
        // if user exists, res.locals.user = user
        // if not, redirect to login
        if (req.session.fbid) {
            next();
        } else {
            res.redirect('/login');
        }
    };
}());