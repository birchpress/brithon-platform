'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var BrithonFramework = require('brithon-framework');

var brithon = BrithonFramework.getInstance('client');
var DemoRouter = Backbone.Router.extend({
	routes: {

	}
});
var router = new DemoRouter();

var ns = brithon.ns('core.demo', {

	init: function() {},

	getRouter: function() {
		return router;
	},

	run: function() {
		console.log(router);
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