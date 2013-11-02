var express = require('express'),
    http = require('http'),
    path = require('path'),
    fb = require('fbgraph'),
    mongoose = require('mongoose'),

    routes = require('./routes'),

    config = require('./config.json'),
    fbConfig = config.facebook,

    login = require('./utils/login'),
    userMiddleware = require('./utils/user-middleware'),

    app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'yamyday'
    }));
    app.use(app.router);
    app.use(require('less-middleware')({
        src: __dirname + '/public'
    }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', userMiddleware, routes.index);
app.get('/login', login(fb, fbConfig));

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
