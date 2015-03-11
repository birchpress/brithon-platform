'use strict';

var path = require('path');

var express = require('express');
var slash = require('express-slash');
var favicon = require('serve-favicon');
var logger = require('morgan');

var _ = require('lodash');
var brithon = require('./framework/brithon');

var app = express();

var ns = brithon.ns('brithon.appointments.app', {
    init: function() {},

    setup: function(app) {
        ns.setupConfig(app);
        ns.setupLogger(app);
        ns.setupEvents(app);
        ns.setupUtils(app);
        ns.setupStatic(app);
        ns.setupRouters(app);
        ns.setupErrorHandler(app);
    },

    setupConfig: function(app) {
        app.enable('trust proxy');
        // app.enable('strict routing');
    },

    setupLogger: function(app) {
        if (app.get('env') === 'development') {
            app.use(logger('dev'));
        } else {
            app.use(logger('combined'));
        }
    },

    setupEvents: function(app) {
        app.on('mount', function(parent) {
            parent.use(path.join('/', app.mountpath, 'public'),
                       express.static(path.join(__dirname, 'public')));
        });
    },

    setupUtils: function(app) {
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'hjs');
    },

    setupStatic: function(app) {
        app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
    },

    setupRouters: function(app) {
        var mainRouter = express.Router();

        mainRouter.all('/:userId(\\d+)/', function(req, res, next) {
            var userId = req.params.userId;
            var version = ns.getVersion4User(userId);
            var vApp = 'appointments';

            req.url = path.join('/', vApp, version, req.url);

            next();
        });

        app.use(mainRouter);

        var vApps = require('./vapps/index');
        _.forEach(vApps, function(instance, mountPath) {
            app.use(mountPath, instance);
        });

        app.use(slash());
    },

    setupErrorHandler: function(app) {
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

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
    },

    // TODO: placeholder
    getVersion4User: function(userId) {
        var map = {
            '1016': 'v1.0',
            '1017': 'v1.1',
            '1018': 'v1.0'
        };

        return map[userId] ? map[userId] : 'v1.0';
    }
});

ns.init();
ns.setup(app);

module.exports = app;
