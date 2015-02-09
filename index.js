var express = require('express');
var slash = require('express-slash');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('lodash');

var getVersion4User = function(userId) {
    var map = {
        '1016': 'v1.0',
        '1017': 'v1.1',
        '1018': 'v1.0'
    };
    return map[userId] ? map[userId] : 'v1.0';
}

var app = express();
// app.enable('strict routing');

if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('combined'));
}

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', __dirname);
app.set('view engine', 'hjs');

var releasesDirName = 'releases';

var mainRouter = express.Router();
mainRouter.all('/:userId/*', function(req, res, next) {
    var userId = req.params.userId;
    var version = getVersion4User(userId);
    if (req.url.indexOf('public') <= -1) {
        req.url = '/' + [releasesDirName, version, req.url].join('/');
    }
    next();
});
app.use('/', mainRouter);

var releasesDir = path.join(__dirname, releasesDirName);
var releases = fs.readdirSync(releasesDir).filter(function(file) {
    return fs.statSync(path.join(releasesDir, file)).isDirectory();
});
_.each(releases, function(version) {
    var virtualApp = require(path.join(releasesDir, version, 'index'));
    var prefix = [releasesDirName, version].join('/');
    virtualApp.setPrefix(prefix);
    var routes = virtualApp.getRoutes();
    routes.setup();
    app.use(routes.getStaticPath(''), express.static(path.join(releasesDir, version, 'public')));
    app.use('/' + [releasesDirName, version].join('/'), routes.getRouter());
});

app.use(slash());

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
