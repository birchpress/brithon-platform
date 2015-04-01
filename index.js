'use strict';

require('./node-jsx').install({
    extension: '.jsx'
});

var path = require('path');

var express = require('express');
var slash = require('express-slash');
var favicon = require('serve-favicon');
var logger = require('morgan');
var _ = require('lodash');

var brithon = require('brithon-framework').getInstance('server');
var middleware = require('./middleware');

var app = express();

var ns = brithon.ns('apps', {

    init: function() {},

    setup: function(app) {
        ns.setupConfig(app);
        ns.setupLogger(app);
        ns.setupStatic(app);
        ns.setupRouters(app);
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

    setupStatic: function(app) {
        app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
        app.use('/public', express.static(path.join(__dirname, 'public')));
    },

    setupRouters: function(app) {
        app.use(function(req, res, next) {
            req.locals = {};
            next();
        });
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
ns.setup(app);

module.exports = ns;