'use strict';

var _ = require('lodash');

module.exports = function(brithon) {

	var req = brithon.request;
	var res = brithon.response;

	var ns = brithon.ns('sample.common.server', {

		getVersion: function() {
			return '1.0';
		}

	});

	return ns;
};