'use strict';

var express = require('express');
var path = require('path');

var brithon = require('../framework');

var router = express.Router();

var ns = brithon.ns('brithon.core.routes.signin', {

    init: function() {},

    setup: function() {
        router.route('/').get(ns.get).post(ns.post);
    },

    getRouter: function() {
        return router;
    },

    get: function(req, res, next) {
        res.render('signin', {
            root: req.app.locals.mountpathWithSlash,
            partials: {
                layout: 'layout'
            }
        });
    },

    post: function(req, res, next) {
        req.knex('user').select('id').where({
            email: req.body.email,
            password: req.body.password
        })
            .then(function(rows) {
                if (rows.length == 1) {
                    res.cookie('uid', rows[0].id, {signed: true});
                    res.redirect('/' + rows[0].id);
                } else {
                    res.render('signin', {
                        root: req.app.mountpathWithSlash,
                        notFound: true,
                        partials: {
                            layout: 'layout'
                        }
                    });
                }
            })
            .catch(function(error) {
                console.error(error);
                res.render('signin', {
                    root: req.app.mountpathWithSlash,
                    partials: {
                        layout: 'layout'
                    }
                });
            });
    }
});

module.exports = ns;
