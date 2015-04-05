'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var director = require('director');
var browserify = require('browserify');
var fse = require('fs-extra');
var async = require('async');
var junk = require('junk');
var mkdirp = require('mkdirp');

module.exports = function(req, res, next) {

	var requestBrithon = require('brithon-framework').newInstance();
	req.locals.requestBrithon = requestBrithon;
	requestBrithon.request = req;
	requestBrithon.response = res;
	requestBrithon.router = new director.http.Router();
	requestBrithon.knex = req.locals.knex;

	var getDefaultAppsMap = function() {
		return {};
	};

	var getAppsMap = function(accountId) {
		//TODO
		//get it from DB
		// format {
		// 	'appointments': '1.0',
		// 	'{appName}': '{appVersion}'
		// }
		if (req.locals.accountId) {
			return {
				'sample': 'master'
			};
		} else {
			return getDefaultAppsMap();
		}
	};

	var loadModule = function(filePath) {
		var module = require(filePath);
		if (_.isFunction(module)) {
			var ns = module(requestBrithon);
			return ns;
		} else {
			throw new Error("Invalid module is loaded from " + filePath);
		}
	};

	var loadModules = function(dirPath) {
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

	var bundleTasks = [];

	var bundleJavaScript = function(src, dest) {
		bundleTasks.push(function(callback) {
			var dirname = path.dirname(dest);
			mkdirp(dirname, function(err) {
				callback(err, dest);
			});
		});
		bundleTasks.push(function(callback) {
			var bundle = browserify(src).bundle();
			var writable = fs.createWriteStream(dest);
			bundle.on('error', function(err) {
				callback(err, dest);
			});
			writable.on('finish', function() {
				callback(null, dest);
			});
			bundle.pipe(writable);
		});
	};

	var getPluginPublicPath = function(pluginPath) {
		var relative = path.relative(__dirname, pluginPath);
		return path.join(__dirname, 'public', relative);
	};

	var bundlePluginJavaScripts = function(pluginPath) {
		var srcDir = pluginPath;
		var fileNames = fs.readdirSync(srcDir).filter(junk.not);
		_.forEach(fileNames, function(fileName) {
			var filePath = path.join(srcDir, fileName);
			if (fs.statSync(filePath).isFile()) {
				var pluginPublicPath = getPluginPublicPath(pluginPath);
				var desPath = path.join(pluginPublicPath, fileName);
				bundleJavaScript(filePath, desPath);
			}
		});
	};

	var copyAssetsTasks = [];

	var copyPluginAssets = function(pluginPath) {
		var srcDir = path.join(pluginPath, 'assets');
		var pluginPublicPath = getPluginPublicPath(pluginPath);
		var destDir = path.join(pluginPublicPath, 'assets');
		var task = function(callback) {
			fse.copy(srcDir, destDir, function(err) {
				if (err) {
					console.warn('Failded copying assets from ' + srcDir + ' to ' + destDir);
					console.warn(err.message);
				}
				callback(null, destDir);
			});
		};
		copyAssetsTasks.push(task);
	};

	var isDev = function() {
		return req.app.locals.config.get('env') === 'development';
	};

	var loadPlugin = function(pluginPath) {
		var serverDir = path.join(pluginPath, 'server');
		var namespaces = [];
		if (fs.statSync(serverDir).isDirectory()) {
			namespaces = loadModules(serverDir);
		}
		if (isDev()) {
			bundlePluginJavaScripts(pluginPath);
			copyPluginAssets(pluginPath);
		}
		return namespaces;
	};

	var loadApp = function(appPath) {
		var namespaces = [];
		try {
			if (fs.statSync(appPath).isDirectory()) {
				var pluginNames = fs.readdirSync(appPath).filter(junk.not);
				_.forEach(pluginNames, function(pluginName) {
					var pluginPath = path.join(appPath, pluginName);
					if (fs.statSync(pluginPath).isDirectory()) {
						var pluginNamespaces = loadPlugin(pluginPath);
						namespaces = namespaces.concat(pluginNamespaces);
					}
				});
			}
		} catch (ex) {
			console.error('Failed to load app from path ' + appPath);
			console.error(ex.message);
		}
		return namespaces;
	};

	var loadCore = function() {
		return loadApp(path.join(__dirname, 'core'));
	};

	var loadCustomApps = function(appsMap) {
		var namespaces = [];
		_.forEach(appsMap, function(version, appName) {
			var appPath = path.join(__dirname, 'apps', appName, version);
			var appNamepaces = loadApp(appPath);
			namespaces = namespaces.concat(appNamepaces);
		});
		return namespaces;
	};

	var handleErrors = function(req, res, err) {
		requestBrithon.core.common.server.handleErrors(err);
	};

	var coreNamepaces = loadCore();
	var accountId = req.locals.accountId;
	var appsMap = getAppsMap(accountId);
	var appNamepaces = loadCustomApps(appsMap);

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

	var allTasks = [].concat(bundleTasks).concat(copyAssetsTasks);

	async.series(allTasks, function(err, results) {
		if (err) {
			console.error(err.message);
		}
		requestBrithon.router.dispatch(req, res, function(err) {
			handleErrors(req, res, err);
		});
	});
};