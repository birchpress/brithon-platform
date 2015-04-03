'use strict';

var _ = require('lodash');

module.exports = function(brithon) {

	var req = brithon.request;
	var res = brithon.response;

	var ns = brithon.ns('core.common.server', {

		handleErrors: function(err) {
			var env = req.app.get('env');
			var html = brithon.core.common.server.views.getErrorPage(err);
			res.status(err.status).send(html);
		},

		getVersion: function() {
			return '1.0';
		}

	});

	return ns;
};