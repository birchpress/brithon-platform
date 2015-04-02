'use strict';

require('./node-jsx').install({
    extension: '.jsx'
});

var path = require('path');

var express = require('express');
var knex = require('knex');
var slash = require('express-slash');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('lodash');

var brithon = require('brithon-framework').getInstance('server');
var middleware = require('./middleware');

var app = express();

var ns = brithon.ns('platform', {

    init: function() {},

    setup: function() {
        ns.setupConfig();
        ns.setupLogger();
        ns.setupUtils();
        ns.setupStatic();
        ns.setupRouters();
    },

    setupConfig: function() {
        app.enable('trust proxy');
        // app.enable('strict routing');
        app.locals.config = require('./config');
    },

    setupLogger: function() {
        if (ns.isDev()) {
            app.use(logger('dev'));
        } else {
            app.use(logger('combined'));
        }
    },

    isDev: function() {
        return app.locals.config.get('env') === 'development';
    },

    setupUtils: function() {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));

        app.use(cookieParser(app.locals.config.get('cookie.secret'),
            app.locals.config.get('cookie.options')));

        var db = knex(app.locals.config.get('db'));
        app.use(function(req, res, next) {
            req.locals = {};
            req.locals.knex = db;
            next();
        });
    },

    setupStatic: function() {
        app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
        app.use('/public', express.static(path.join(__dirname, 'public')));
    },

    setupRouters: function() {
        app.use('/:accountId/*', function(req, res, next) {
            req.locals.accountId = req.params.accountId
            next();
        });
        app.use(middleware.fn);
        app.use(slash());
    },

    getApp: function() {
        return app;
    }
});

ns.init();
ns.setup();

module.exports = ns;
