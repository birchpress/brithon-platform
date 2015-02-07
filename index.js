var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('lodash');

var app = express();

app.use('/', function(req, res, next){
    var version = req.params.version;
    if(!version) {
        version = 'v1.0';
    }
    if(req.url.indexOf('public') <= -1) {
        req.url = req.path + 'releases/' + version;
    }
    next();
});

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('combined'));
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', __dirname);
app.set('view engine', 'hjs');

var releasesDir = path.join(__dirname, 'releases');
var releases = fs.readdirSync(releasesDir).filter(function(file) {
    return fs.statSync(path.join(releasesDir, file)).isDirectory();
});
_.each(releases, function(version) {
    var virtualApp = require('./releases/' + version + '/index');
    var prefix = 'releases/' + version;
    virtualApp.setPrefix(prefix);
    var routes = virtualApp.getRoutes();
    routes.setup();
    app.use('/', routes.getRouter());
    app.use(routes.getStaticPath(''), express.static(path.join(__dirname, 'releases', version, 'public')));
});

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
