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

module.exports = function(req, res, next) {

	var bundleTasks = [];
	var requestBrithon = require('brithon-framework').newInstance();
	req.locals.requestBrithon = requestBrithon;
	requestBrithon.request = req;
	requestBrithon.response = res;
	requestBrithon.router = new director.http.Router();
	requestBrithon.knex = req.locals.knex;

	var loadModule = function(filePath) {
		var module = require(filePath);
		if (_.isFunction(module)) {
			var ns = module(requestBrithon);
			return ns;
		} else {
			throw new Error("Invalid module is loaded from " + filePath);
		}
	};

	var loadDir = function(dirPath) {
		var namespaces = [];
		var _loadDir = function(dirPath) {
			var fileNames = fs.readdirSync(dirPath).filter(junk.not);
			_.forEach(fileNames, function(fileName) {
				var filePath = path.join(dirPath, fileName);
				if (fs.statSync(filePath).isDirectory()) {
					_loadDir(filePath);
				} else if (fs.statSync(filePath).isFile()) {
					var namespace = loadModule(filePath);
					namespaces.push(namespace);
				}
			});
		};
		_loadDir(dirPath);
		return namespaces;
	};

	var getDefaultAppsMap = function() {
		return {};
	};

	var getAppsMap = function(accountId) {
		//TODO
		//get it from DB
		return {
			'sample': 'master'
		};
	};
	var bundleJavaScript = function(src, dest) {
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
	};

	var getExactAppName = function(type, appName, version) {
		if ('core' === type) {
			return appName;
		} else {
			return path.join(appName, version);
		}
	};

	var bundleAppJavaScripts = function(type, appName, version) {
		var exactAppName = getExactAppName(type, appName, version);
		var srcDir = path.join(__dirname, type, exactAppName);
		var fileNames = fs.readdirSync(srcDir).filter(junk.not);
		_.forEach(fileNames, function(fileName) {
			var filePath = path.join(srcDir, fileName);
			if (fs.statSync(filePath).isFile()) {
				var desPath = path.join(__dirname, 'public', type, exactAppName, fileName);
				bundleJavaScript(filePath, desPath);
			}
		});
	};

	var copyAppAssets = function(type, appName, version) {
		var exactAppName = getExactAppName(type, appName, version);
		var srcDir = path.join(__dirname, type, exactAppName, 'assets');
		var destDir = path.join(__dirname, 'public', type, exactAppName, 'assets');
		try {
			fse.copySync(srcDir, destDir);
		} catch (ex) {
			console.error(ex.message);
		}
	};

	function isDev() {
		return req.app.locals.config.get('env') === 'development';
	};

	var loadApp = function(type, appName, version) {
		var exactAppName = getExactAppName(type, appName, version);
		if (isDev()) {
			bundleAppJavaScripts(type, appName, version);
			copyAppAssets(type, appName, version);
		}
		var appPath = path.join(__dirname, type, exactAppName, 'server');
		var namespaces = [];
		if (fs.statSync(appPath).isDirectory()) {
			namespaces = loadDir(appPath);
		}
		return namespaces;
	};

	var loadCoreApps = function() {
		var namespaces = [];
		var srcDir = path.join(__dirname, 'core');
		var appNames = fs.readdirSync(srcDir).filter(junk.not);
		_.forEach(appNames, function(appName) {
			var appNamespaces = loadApp('core', appName, null);
			namespaces = namespaces.concat(appNamespaces);
		});
		return namespaces;
	};

	var loadApps = function(appsMap) {
		var namespaces = [];
		_.forEach(appsMap, function(version, appName) {
			var appNamespaces = loadApp('apps', appName, version);
			namespaces = namespaces.concat(appNamespaces);
		});
		return namespaces;
	};

	var handleErrors = function(req, res, err) {
		requestBrithon.core.common.server.handleErrors(err);
	};

	var coreNamepaces = loadCoreApps();
	var appsMap = getDefaultAppsMap();
	if (req.locals.accountId) {
		var accountId = req.locals.accountId;
		appsMap = getAppsMap(accountId);
	}
	var appNamepaces = loadApps(appsMap);
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
				handleErrors(req, res, err);
			});
		}
	});
};