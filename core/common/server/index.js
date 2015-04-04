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
		},

		getAppFileUrl: function(type, appName, appVersion, relPath) {
			if('core' === type) {
				return "/public/" + type + "/" + appName + "/" + relPath + "?version=" + ns.getVersion();
			} else {
				return "/public/" + type + "/" + appName + "/" + appVersion + "/" + relPath;
			}
		},

		getCoreAppFileUrl: function(appName, relPath) {
			return ns.getAppFileUrl('core', appName, null, relPath);
		}

	});

	return ns;
};