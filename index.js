'use strict';

var path = require('path');

var express = require('express');
var slash = require('express-slash');
var favicon = require('serve-favicon');
var logger = require('morgan');

var _ = require('lodash');
var brithon = require('brithon-framework').getInstance('platform');

var app = express();

var ns = brithon.ns('brithon.dispatcher', {
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

    setupEvents: function(app) {},

    setupUtils: function(app) {
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'hjs');
    },

    setupStatic: function(app) {
        app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
    },

    setupRouters: function(app) {
        var mountList = require('./plugins');
        _.forEach(mountList, function(mountMap) {
            app.use(mountMap.mountpath, mountMap.router);
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
    }
});

ns.init();
ns.setup(app);

module.exports = app;
