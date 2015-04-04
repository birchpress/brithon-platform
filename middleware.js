'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var director = require('director');
var browserify = require('browserify');
var mkdirp = require('mkdirp');
var fse = require('fs-extra');
var async = require('async');
var junk = require('junk');

var brithon = require('brithon-framework').getInstance('server');

var bundleTasks = [];

var ns = brithon.ns('middleware', {

	fn: function(req, res, next) {
		var requestBrithon = require('brithon-framework').newInstance();
		req.locals.requestBrithon = requestBrithon;
		requestBrithon.request = req;
		requestBrithon.response = res;
		requestBrithon.router = new director.http.Router();
		requestBrithon.knex = req.locals.knex;

		var coreNamepaces = ns.loadCoreApps(requestBrithon);
		var appsMap = ns.getDefaultAppsMap();
		if (req.locals.accountId) {
			var accountId = req.locals.accountId;
			appsMap = ns.getAppsMap(accountId);
		}
		var appNamepaces = ns.loadApps(appsMap, requestBrithon);
		_.forEach(coreNamepaces, function(namespace) {
			if (_.isFunction(namespace.init)) {
				namespace.init();
			}
		});
		_.forEach(appNamepaces, function(namespace) {
			if (_.isFunction(namespace.init)) {
				namespace.init();
			}
		});

		async.series(bundleTasks, function(err, results) {
			if (err) {
				console.error(err);
			} else {
				requestBrithon.router.dispatch(req, res, function(err) {
					ns.handleErrors(req, res, err, requestBrithon);
				});
			}
		});
	},

	loadModule: function(filePath, requestBrithon) {
		var module = require(filePath);
		if(_.isFunction(module)) {
			var ns = module(requestBrithon);
			return ns;
		} else {
			throw new Error("Invalid module is loaded from " + filePath);
		}
	},

	loadDir: function(dirPath, requestBrithon) {
		var namespaces = [];
		var loadDir = function(dirPath) {
			var fileNames = fs.readdirSync(dirPath).filter(junk.not);
			_.forEach(fileNames, function(fileName) {
				var filePath = path.join(dirPath, fileName);
				if (fs.statSync(filePath).isDirectory()) {
					loadDir(filePath);
				} else if (fs.statSync(filePath).isFile()) {
					var namespace = ns.loadModule(filePath, requestBrithon);
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

	bundleJavaScript: function(src, dest) {
		var bundle = browserify(src).bundle();
		mkdirp.sync(path.dirname(dest));
		var task = function(callback) {
			var writable = fs.createWriteStream(dest);
			bundle.on('error', function(err) {
				callback(err, dest);
			});
			writable.on('finish', function() {
				callback(null, dest);
			});
			bundle.pipe(writable);
		};
		bundleTasks.push(task);
	},

	getExactAppName: function(type, appName, version) {
		if ('core' === type) {
			return appName;
		} else {
			return path.join(appName, version);
		}
	},

	bundleAppJavaScripts: function(type, appName, version) {
		var exactAppName = ns.getExactAppName(type, appName, version);
		var srcDir = path.join(__dirname, type, exactAppName);
		var fileNames = fs.readdirSync(srcDir).filter(junk.not);
		_.forEach(fileNames, function(fileName) {
			var filePath = path.join(srcDir, fileName);
			if (fs.statSync(filePath).isFile()) {
				var desPath = path.join(__dirname, 'public', type, exactAppName, fileName);
				ns.bundleJavaScript(filePath, desPath);
			}
		});
	},

	copyAppAssets: function(type, appName, version) {
		var exactAppName = ns.getExactAppName(type, appName, version);
		var srcDir = path.join(__dirname, type, exactAppName, 'assets');
		var destDir = path.join(__dirname, 'public', type, exactAppName, 'assets');
		try {
			fse.copySync(srcDir, destDir);
		} catch (ex) {
			console.error(ex.message);
		}
	},

	loadApp: function(type, appName, version, requestBrithon) {
		var exactAppName = ns.getExactAppName(type, appName, version);
		if (brithon.platform.isDev()) {
			ns.bundleAppJavaScripts(type, appName, version);
			ns.copyAppAssets(type, appName, version);
		}
		var appPath = path.join(__dirname, type, exactAppName, 'server');
		var namespaces = [];
		if (fs.statSync(appPath).isDirectory()) {
			namespaces = ns.loadDir(appPath, requestBrithon);
		}
		return namespaces;
	},

	loadCoreApps: function(requestBrithon) {
		var namespaces = [];
		var srcDir = path.join(__dirname, 'core');
		var appNames = fs.readdirSync(srcDir).filter(junk.not);
		_.forEach(appNames, function(appName) {
			var appNamespaces = ns.loadApp('core', appName, null, requestBrithon);
			namespaces = namespaces.concat(appNamespaces);
		});
		return namespaces;
	},

	loadApps: function(appsMap, requestBrithon) {
		var namespaces = [];
		_.forEach(appsMap, function(version, appName) {
			var appNamespaces = ns.loadApp('apps', appName, version, requestBrithon);
			namespaces = namespaces.concat(appNamespaces);
		});
		return namespaces;
	},

	handleErrors: function(req, res, err, requestBrithon) {		
		requestBrithon.core.common.server.handleErrors(err);		
 	}

});

module.exports = ns;