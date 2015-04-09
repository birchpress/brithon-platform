'use strict';

var _ = require('lodash');
var Promise = require("bluebird");

module.exports = function(brithon) {

	var req = brithon.request;
	var res = brithon.response;

	var ns = brithon.ns('core.demo.server', {

		init: function() {
			brithon.router.get('/demo/*', ns.demo);
			//brithon.router.get('/demo/', ns.demo);
		},

		demo: function() {
			res.locals.promise = Promise.try(function() {
				var html = brithon.core.demo.server.views.getPage();
				res.set('Content-Type', 'text/html');
				res.status('200').send(html);
			});
		}

	});

	return ns;
};