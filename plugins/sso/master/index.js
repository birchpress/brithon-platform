'use strict';

var path = require('path');

var express = require('express');
var knex = require('knex');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var _ = require('lodash');
var brithon = require('brithon-framework').getInstance('platform');

var app = express();

var ns = brithon.ns('brithon.sso', {
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
        app.locals.config = require('./config');
        app.locals.brithon = brithon;
    },

    setupLogger: function(app) {
        if (app.locals.config.get('env') === 'development') {
            app.use(logger('dev'));
        } else {
            app.use(logger('combined'));
        }
    },

    setupEvents: function(app) {
        app.on('mount', function(parent) {
            parent.use(path.join('/', app.mountpath, 'public'),
                       express.static(path.join(__dirname, 'public')));

            if (app.mountpath === '/') {
                app.locals.mountpathWithSlash =  app.mountpath;
            } else {
                app.locals.mountpathWithSlash = app.mountpath + '/';
            }
        });
    },

    setupUtils: function(app) {
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'hjs');

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        
        app.use(cookieParser(app.locals.config.get('cookie.secret'),
                             app.locals.config.get('cookie.options')));

        var db = knex(app.locals.config.get('db'));
        app.use(function(req, res, next) {
            req.knex = db;
            next();
        });
    },

    setupStatic: function(app) {
        app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
        app.use('/public', express.static(path.join(__dirname, 'public')));
    },

    setupRouters: function(app) {
        var rootRouter = require('./routes/index');
        rootRouter.setup();
        app.use(rootRouter.getRouter());
    },

    setupErrorHandler: function(app) {
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (app.locals.config.get('env') === 'development') {
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
