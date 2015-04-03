'use strict';

var _ = require('lodash');

module.exports = function(brithon) {

	var req = brithon.request;
	var res = brithon.response;

	var ns = brithon.ns('core.sso.server', {

		init: function() {
			brithon.router.get('/signin', ns.signin);
			brithon.router.get('/signup', ns.signup);
		},

		signin: function() {
			var html = brithon.core.sso.server.views.getSigninPage();
			res.set('Content-Type', 'text/html');
			res.status('200').send(html);
		},

		signup: function() {
			var html = brithon.core.sso.server.views.getSignupPage();
			res.status('200').send(html);
		}

	});

	return ns;
};