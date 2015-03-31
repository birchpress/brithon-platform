'use strict';

var _ = require('lodash');


module.exports = function(brithon) {

	var ns = brithon.ns('core', {

		init: function() {
			brithon.router.get('/', ns.doSomething);
		},

		doSomething: function() {
			var req = brithon.request;
			var res = brithon.response;
			res.status('200').send('hello');
		}

	});

	return ns;
};