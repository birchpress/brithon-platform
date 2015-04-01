'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var director = require('director');
var brithon = require('./framework');

var ns = brithon.ns('middleware', {

	fn: function(req, res, next) {
		var requestBrithon = require('brithon-framework').newInstance();
		requestBrithon.request = req;
		requestBrithon.response = res;
		requestBrithon.router = new director.http.Router();

		var coreNamepaces = ns.loadCore(requestBrithon);
		var appsMap = ns.getDefaultAppsMap();
		if (req.locals.accountId) {
			var accountId = req.locals.accountId;
			appsMap = ns.getAppsMap(accountId);
		}
		var appNamepaces = ns.loadApps(appsMap, requestBrithon);
		_.each(coreNamepaces, function(namespace) {
			namespace.init();
		});
		_.each(appNamepaces, function(namespace) {
			namespace.init();
		});

		requestBrithon.router.dispatch(req, res, function(err) {
			ns.handleErrors(req, res, err, requestBrithon);
		});
	},

	loadModule: function(filePath, brithon) {
		var module = require(filePath);
		var ns = module(brithon);
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
				} else if (fs.statSync(filePath).isFile()) {
					var namespace = ns.loadModule(filePath, brithon);
					namespaces.push(namespace);
				}
			});
		};
		loadDir(dirPath);
		return namespaces;
	},

	getDefaultAppsMap: function() {
		return {};
	},

	getAppsMap: function(accountId) {
		//TODO
		//get it from DB
		return {
			'sample': 'master'
		};
	},

	loadCore: function(brithon) {
		return ns.loadDir(path.join(__dirname, 'core', 'server'), brithon);
	},

	loadApps: function(appsMap, brithon) {
		var namespaces = [];
		_.each(appsMap, function(version, appName) {
			var appNamespaces = ns.loadApp(appName, version, brithon);
			namespaces = namespaces.concat(appNamespaces);
		});
		return namespaces;
	},

	loadApp: function(appName, version, brithon) {
		var appPath = path.join(__dirname, 'apps', appName, version, 'server');
		var namespaces = ns.loadDir(appPath, brithon);
		return namespaces;
	},

	handleErrors: function(req, res, err, brithon) {
		brithon.core.server.handleErrors(err);
	}

});

module.exports = ns;