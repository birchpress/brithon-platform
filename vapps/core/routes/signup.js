'use strict';

var express = require('express');
var path = require('path');

var brithon = require('../framework');

var router = express.Router();

var ns = brithon.ns('brithon.core.routes.signup', {

    init: function() {},

    setup: function() {
        router.route('/').get(ns.get).post(ns.post);
    },

    getRouter: function() {
        return router;
    },

    get: function(req, res, next) {
        res.render('signup', {
            root: req.app.locals.mountpathWithSlash,
            partials: {
                layout: 'layout'
            }
        });
    },

    post: function(req, res, next) {
        var _id = Math.floor(Date.now() / 1000);

        req.knex('user').insert({
            // TODO: fix id
            id: _id,
            username: 'Hey@' + _id,
            email: req.body.email,
            password: req.body.password
        })
            .then(function(rows) {
                    res.render('signin', {
                        root: req.app.mountpathWithSlash,
                        partials: {
                            layout: 'layout'
                        }
                    });
            })
            .catch(function(error) {
                console.error(error);
                res.render('signup', {
                    root: req.app.mountpathWithSlash,
                    partials: {
                        layout: 'layout'
                    }
                });
            });
    }
});

module.exports = ns;
