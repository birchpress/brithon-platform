'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var brithon = require('brithon-framework').getInstance('client');

var router = new Backbone.Router();

var ns = brithon.ns('core.demo', {

	init: function() {},

	getRouter: function() {
		return router;
	},

	run: function() {
		Backbone.history.start({
			pushState: true,
			root: "/demo/"
		});
	}

});

ns.init();

$(function() {
	ns.run();
});

module.exports = ns;