'use strict';

var _ = require('lodash');


module.exports = function(brithon) {

	var ns = brithon.ns('apps.sample.server', {

		init: function() {
			brithon.router.get('/:accountId/sample/:sampleId', ns.doSomething);
		},

		doSomething: function(accountId, sampleId) {
			var req = brithon.request;
			var res = brithon.response;
			res.status('200').send('sample id: ' + sampleId);
		}

	});

	return ns;
};