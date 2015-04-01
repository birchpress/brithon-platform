'use strict';

var _ = require('lodash');

module.exports = function(brithon) {

	var req = brithon.request;
	var res = brithon.response;

	var ns = brithon.ns('core.server', {

		init: function() {
			brithon.router.get('/signin', ns.signin);
			brithon.router.get('/signup', ns.signup);
			brithon.router.get('/:accountId/admin', ns.admin);
		},

		signin: function() {
			var html = brithon.core.server.views.getSigninPage();
			res.set('Content-Type', 'text/html');
			res.status('200').send(html);
		},

		signup: function() {
			var html = brithon.core.server.views.getSignupPage();
			res.status('200').send(html);
		},

		admin: function() {

		},

		handleErrors: function(err) {
			var env = req.app.get('env');
			var html = brithon.core.server.views.getErrorPage(err);
			res.status(err.status).send(html);
		},

		getVersion: function() {
			return '1.0';
		}

	});

	return ns;
};