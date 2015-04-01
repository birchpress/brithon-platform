'use strict';

var _ = require('lodash');


module.exports = function(brithon) {

	var ns = brithon.ns('core.server', {

		init: function() {
			brithon.router.get('/', ns.doSomething);
		},

		doSomething: function() {
			var req = brithon.request;
			var res = brithon.response;
			var html = brithon.core.server.views.getHomePage();
			res.status('200').send(html);
		},

		handleErrors: function(err) {
			var env = brithon.request.app.get('env');
			var html = brithon.core.server.views.getErrorPage(err);
			brithon.response.status(err.status).send(html);
		}

	});

	return ns;
};