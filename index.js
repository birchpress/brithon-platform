'use strict';

var path = require('path');

var express = require('express');
var slash = require('express-slash');
var favicon = require('serve-favicon');
var logger = require('morgan');

var _ = require('lodash');
var brithon = require('./framework');
var middleware = require('./middleware');

var app = express();

var ns = brithon.ns('apps', {

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
        app.use('/:accountId/*', function(req, res, next){
            req.locals = {
                accountId: req.params.accountId
            };
            next();
        });
        app.use(middleware.fn);
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

    getApp: function() {
        return app;
    }
});

ns.init();
ns.setup(app);

module.exports = ns;