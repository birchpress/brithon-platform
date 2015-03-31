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
		var pluginMap = ns.getDefaultPluginMap();
		if (req.locals.accountId) {
			var accountId = req.locals.accountId;
			pluginMap = ns.getPluginMap(accountId);
		}
		var pluginNamepaces = ns.loadPlugins(pluginMap, requestBrithon);
		_.each(coreNamepaces, function(namespace) {
			namespace.init();
		});
		_.each(pluginNamepaces, function(namespace) {
			namespace.init();
		});

		requestBrithon.router.dispatch(req, res, function(err) {
			next();
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

	getDefaultPluginMap: function() {
		return {};
	},

	getPluginMap: function(accountId) {
		//TODO
		//get it from DB
		return {
			'sample': 'master'
		};
	},

	loadCore: function(brithon) {
		return ns.loadDir(path.join(__dirname, 'core'), brithon);
	},

	loadPlugins: function(pluginMap, brithon) {
		var namespaces = [];
		_.each(pluginMap, function(version, pluginName) {
			var pluginNamespaces = ns.loadPlugin(pluginName, version, brithon);
			namespaces = namespaces.concat(pluginNamespaces);
		});
		return namespaces;
	},

	loadPlugin: function(pluginName, version, brithon) {
		var pluginPath = path.join(__dirname, 'plugins', pluginName, version);
		var namespaces = ns.loadDir(pluginPath, brithon);
		return namespaces;
	}

});

module.exports = ns;