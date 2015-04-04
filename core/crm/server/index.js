'use strict';

var _ = require('lodash');

module.exports = function(brithon) {

	var req = brithon.request;
	var res = brithon.response;

	var ns = brithon.ns('core.crm.server', {

	});

	return ns;
};