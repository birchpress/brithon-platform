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

var middleware = require('./middleware');

var app = express();

function setupConfig() {
    app.enable('trust proxy');
    // app.enable('strict routing');
    app.locals.config = require('./config');
};

function setupLogger() {
    if (isDev()) {
        app.use(logger('dev'));
    } else {
        app.use(logger('combined'));
    }
};

function isDev() {
    return app.locals.config.get('env') === 'development';
};

function setupUtils() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use(cookieParser(app.locals.config.get('cookie.secret'),
        app.locals.config.get('cookie.options')));

    var db = knex(app.locals.config.get('db'));
    app.use(function(req, res, next) {
        req.locals = {
            knex: db
        };
        next();
    });
};

function setupStatic() {
    app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
    app.use('/public', express.static(path.join(__dirname, 'public')));
};

function setupRouters() {
    app.use('/:accountId/*', function(req, res, next) {
        req.locals.accountId = req.params.accountId
        next();
    });
    app.use(middleware);
    app.use(slash());
};

function setup() {
    setupConfig();
    setupLogger();
    setupUtils();
    setupStatic();
    setupRouters();
};

setup();

module.exports = app;