'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var brithon = require('./framework');

var ns = brithon.ns('middleware', {

	fn: function(req, res, next) {
		var requestBrithon = require('brithon-framework').newInstance();
		requestBrithon.request = req;
		requestBrithon.response = res;
		requestBrithon.crossroads = require('crossroads');

		var coreNamepaces = ns.loadDir(path.join(__dirname, 'core'), requestBrithon);
		//load plugins
		//var pluginNamepaces;
		_.each(coreNamepaces, function(namespace) {
			namespace.init();
		});
		// _.each(pluginNamepaces, function(namespace) {
		// 	namespace.init();
		// });

		requestBrithon.crossroads.parse(req.originalUrl);
		requestBrithon.crossroads.removeAllRoutes();
		next();
	},

	loadApp: function(filePath, brithon) {
		var app = require(filePath);
		var ns = app(brithon);
		return ns;
	},

	loadDir: function(dirPath, brithon) {
		var namespaces = [];
		var loadDir = function(dirPath) {
			var fileNames = fs.readdirSync(dirPath);
			_.each(fileNames, function(fileName) {
				var filePath = path.join(dirPath, fileName);
				if (fs.statSync(filePath).isDirectory()) {
					loadDir(filePath);
				} else {
					var namespace = ns.loadApp(filePath, brithon);
					namespaces.push(namespace);
				}
			});
		};
		loadDir(dirPath);
		return namespaces;
	}

});

module.exports = ns;