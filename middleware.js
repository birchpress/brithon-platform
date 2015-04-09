'use strict';

var Promise = require("bluebird");
var path = require('path');
var fs = Promise.promisifyAll(require('fs'));
var _ = require('lodash');
var director = require('director');
var browserify = require('browserify');
var fse = Promise.promisifyAll(require('fs-extra'));
var junk = require('junk');
var mkdirp = require('mkdirp');
var BrithonFramework = require('brithon-framework');

var mkdirpAsync = Promise.promisify(mkdirp);

module.exports = function(req, res, next) {

	var requestBrithon = BrithonFramework.newInstance();
	req.locals.requestBrithon = requestBrithon;
	requestBrithon.request = req;
	requestBrithon.response = res;
	requestBrithon.router = new director.http.Router();
	requestBrithon.knex = req.locals.knex;

	var getDefaultAppsMap = function() {
		return {};
	};

	var getAppsMapAsync = Promise.method(function(accountId) {
		//TODO
		//get it from DB
		// format {
		// 	'appointments': '1.0',
		// 	'{appName}': '{appVersion}'
		// }
		var appsMap;
		if (req.locals.accountId) {
			appsMap = {
				'sample': 'master'
			};
		} else {
			appsMap = getDefaultAppsMap();
		}
		return appsMap;
	});

	var loadModule = function(filePath) {
		var module = require(filePath);
		if (_.isFunction(module)) {
			var ns = module(requestBrithon);
			return ns;
		} else {
			throw new Error("Invalid module is loaded from " + filePath);
		}
	};

	var getShallowFilesAsync = function(dirPath) {
		return fs.readdirAsync(dirPath)
			.map(function(fileName) {
				var filePath = path.join(dirPath, fileName);
				var stats = fs.statAsync(filePath);
				return Promise.join(filePath, stats, function(filePath, stats) {
					return {
						filePath: filePath,
						stats: stats
					}
				});
			})
			.filter(function(file) {
				return junk.not(file.filePath);
			});
	};

	var isJsFile = function(filePath) {
		return _.includes(['.js', '.jsx'], path.extname(filePath));
	};

	var loadModulesAsync = function(dirPath) {
		return fs.statAsync(dirPath)
			.then(function(stats) {
				if (stats.isDirectory()) {
					return getShallowFilesAsync(dirPath)
						.reduce(function(namespaces, file) {
							return loadModulesAsync(file.filePath)
								.then(function(newNamespaces) {
									return namespaces.concat(newNamespaces);
								});
						}, []);
				} else {
					return [
						loadModule(dirPath)
					];
				}
			});
	};

	var bundleJavaScriptAsync = function(src, dest) {
		var dirname = path.dirname(dest);
		return mkdirpAsync(dirname)
			.then(function() {
				return new Promise(function(resolve, reject) {
					var bundle = browserify(src).bundle();
					var writable = fs.createWriteStream(dest);
					bundle.on('error', reject);
					writable.on('finish', resolve);
					bundle.pipe(writable);
				});
			});
	};

	var getPluginPublicPath = function(pluginPath) {
		var relative = path.relative(__dirname, pluginPath);
		return path.join(__dirname, 'public', relative);
	};

	var bundlePluginJavaScriptsAsync = function(pluginPath) {
		return getShallowFilesAsync(pluginPath)
			.filter(function(file) {
				return isJsFile(file.filePath);
			})
			.each(function(file) {
				if (file.stats.isFile()) {
					var desPath = getPluginPublicPath(file.filePath);
					return bundleJavaScriptAsync(file.filePath, desPath);
				}
			});
	};

	var copyPluginAssetsAsync = function(pluginPath) {
		var srcDir = path.join(pluginPath, 'assets');
		var pluginPublicPath = getPluginPublicPath(pluginPath);
		var destDir = path.join(pluginPublicPath, 'assets');
		return fse.copyAsync(srcDir, destDir)
			.catch(function(e) {
				console.warn('Failded copying assets from ' + srcDir + ' to ' + destDir);
			});
	};

	var isDev = function() {
		return req.app.locals.config.get('env') === 'development';
	};

	var loadPluginAsync = function(pluginPath) {
		var serverDir = path.join(pluginPath, 'server');

		return fs.statAsync(serverDir)
			.then(function(stats) {
				if (stats && stats.isDirectory()) {
					return loadModulesAsync(serverDir);
				}
			})
			.then(function(namespaces) {
				if (isDev()) {
					return bundlePluginJavaScriptsAsync(pluginPath)
						.then(function() {
							return copyPluginAssetsAsync(pluginPath)
						})
						.return(namespaces);
				} else {
					return namespaces;
				}
			})
	};

	var loadAppAsync = function(appPath) {
		return fs.statAsync(appPath)
			.then(function(stats) {
				if (stats.isDirectory()) {
					return getShallowFilesAsync(appPath)
						.filter(function(file) {
							return file.stats.isDirectory();
						})
						.map(function(file) {
							return loadPluginAsync(file.filePath);
						})
						.reduce(function(namespaces, pluginNamepaces) {
							return namespaces.concat(pluginNamepaces);
						}, []);
				}
			});
	};

	var loadCoreAsync = function() {
		return loadAppAsync(path.join(__dirname, 'core'));
	};

	var loadCustomAppsAsync = function(appsMap) {
		return Promise.map(_.keys(appsMap), function(appName) {
				var version = appsMap[appName];
				var appPath = path.join(__dirname, 'apps', appName, version);
				return loadAppAsync(appPath);
			})
			.reduce(function(namespaces, appNamepaces) {
				return namespaces.concat(appNamepaces);
			}, []);
	};

	var handleErrors = function(err) {
		requestBrithon.core.common.server.handleErrors(err);
	};

	var accountId = req.locals.accountId;

	loadCoreAsync()
		.each(function(namespace) {
			if (namespace && _.isFunction(namespace.init)) {
				namespace.init();
			}
		})
		.then(function() {
			return getAppsMapAsync(accountId);
		})
		.then(function(appsMap) {
			return loadCustomAppsAsync(appsMap);
		})
		.each(function(namespace) {
			if (namespace && _.isFunction(namespace.init)) {
				namespace.init();
			}
		})
		.return(true)
		.catch(function(e) {
			return Promise.try(function() {
				if (isDev()) {
					res.status(500).send(e.message + "<br />" + e.stack);
				} else {
					res.status(500).send('A Fancy 500 page.');
				}
				return false;
			});
		})
		.then(function(loaded) {
			if (loaded) {
				var dispatchAsync = Promise.promisify(requestBrithon.router.dispatch, requestBrithon.router);
				return dispatchAsync(req, res)
					.then(function() {
						if (_.isObject(res.locals.promise)) {
							return res.locals.promise;
						}
					})
					.catch(function(e) {
						handleErrors(e);
					});

			}
		});

};