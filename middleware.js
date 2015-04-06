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

	var getAppsMap = function(accountId, callback) {
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
		callback(null, appsMap);
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

	var getShallowFiles = function(dirPath, callback) {
		async.waterfall(
			[
				fs.readdir.bind(fs, dirPath),
				function(fileNames, callback) {
					async.map(
						fileNames,
						function(fileName, callback) {
							var filePath = path.join(dirPath, fileName);
							fs.stat(filePath, function(err, stats) {
								callback(err, {
									filePath: filePath,
									stats: stats
								});
							});
						},
						callback
					);
				}
			],
			callback
		);
	};

	var isJsFile = function(filePath) {
		return _.includes(['.js', '.jsx'], path.extname(filePath));
	};

	var loadModules = function(dirPath, callback) {
		async.waterfall(
			[
				getShallowFiles.bind(null, dirPath),
				function(files, callback) {
					async.reduce(
						files, [],
						function(namespaces, file, callback) {
							if (file.stats.isDirectory()) {
								loadModules(file.filePath, function(err, newNamespaces) {
									callback(namespaces.concat(newNamespaces));
								});
							} else {
								try {
									if (isJsFile(file.filePath)) {
										var namespace = loadModule(file.filePath);
										namespaces.push(namespace);
									}
									callback(null, namespaces);
								} catch (ex) {
									callback(ex, namespaces);
								}
							}
						},
						callback
					);
				}
			],
			callback
		);
	};

	var bundleJavaScript = function(src, dest, callback) {
		if (!isJsFile(src)) {
			return;
		}
		async.series(
			[
				function(callback) {
					var dirname = path.dirname(dest);
					mkdirp(dirname, function(err) {
						callback(err, dest);
					});
				},
				function(callback) {
					var bundle = browserify(src).bundle();
					var writable = fs.createWriteStream(dest);
					bundle.on('error', function(err) {
						callback(err, dest);
					});
					writable.on('finish', function() {
						callback(null, dest);
					});
					bundle.pipe(writable);
				}
			],
			callback
		);
	};

	var getPluginPublicPath = function(pluginPath) {
		var relative = path.relative(__dirname, pluginPath);
		return path.join(__dirname, 'public', relative);
	};

	var bundlePluginJavaScripts = function(pluginPath, callback) {
		getShallowFiles(pluginPath, function(err, files) {
			async.each(
				files,
				function(file, callback) {
					if (file.stats.isFile()) {
						var desPath = getPluginPublicPath(file.filePath);
						bundleJavaScript(file.filePath, desPath, callback);
					}
				},
				callback
			);
		});
	};

	var copyPluginAssets = function(pluginPath, callback) {
		var srcDir = path.join(pluginPath, 'assets');
		var pluginPublicPath = getPluginPublicPath(pluginPath);
		var destDir = path.join(pluginPublicPath, 'assets');
		fse.copy(srcDir, destDir, function(err) {
			if (err) {
				console.warn('Failded copying assets from ' + srcDir + ' to ' + destDir);
				console.warn(err.message);
			}
			callback(null, destDir);
		});
	};

	var isDev = function() {
		return req.app.locals.config.get('env') === 'development';
	};

	var loadPlugin = function(pluginPath, callback) {
		var serverDir = path.join(pluginPath, 'server');

		var tasks = [];
		tasks.push(function(callback) {
			fs.stat(serverDir, function(err, stats) {
				if (err) {
					callback(err, []);
				} else {
					if (stats.isDirectory) {
						loadModules(serverDir, callback);
					} else {
						console.warn("Plugin's server folder " + pluginPath + " is not found.");
						callback(null, []);
					}
				}
			});
		});
		if (isDev) {
			tasks.push(bundlePluginJavaScripts.bind(null, pluginPath));
			tasks.push(copyPluginAssets.bind(null, pluginPath));
		}
		async.waterfall(tasks, callback);
	};

	var loadApp = function(appPath, callback) {
		fs.stat(appPath, function(err, stats) {
			if (err) {
				console.error('Failed to load app from path ' + appPath);
				console.error(ex.message);
				callback(null, []);
				return;
			}
			if (stats.isDirectory) {
				getShallowFiles(appPath, function(err, files) {
					async.map(
						files,
						function(file, callback) {
							if (file.stats.isDirectory()) {
								loadPlugin(file.filePath, callback);
							} else {
								callback(null, []);
							}
						},
						function(err, result) {
							var namespaces = _.reduce(result, function(merged, value) {
								return merged.concat(value);
							});
							callback(err, namespaces);
						}
					);
				});
			} else {
				console.error('App path ' + appPath + " is not found.");
				callback(null, []);
			}
		});
	};

	var loadCore = loadApp.bind(null, path.join(__dirname, 'core'));

	var loadCustomApps = function(appsMap, callback) {
		var namespaces = [];
		async.reduce(
			_.keys(appsMap), [],
			function(namespaces, appName, callback) {
				var version = appsMap[appName];
				var appPath = path.join(__dirname, 'apps', appName, version);
				loadApp(appPath, function(err, newNamespaces) {
					callback(err, namespaces.concat(newNamespaces));
				});
			},
			callback
		);
	};

	var handleErrors = function(req, res, err) {
		requestBrithon.core.common.server.handleErrors(err);
	};

	var accountId = req.locals.accountId;

	async.waterfall(
		[
			loadCore(callback),
			function(coreNamepaces, callback) {
				_.forEach(coreNamepaces, function(namespace) {
					if (_.isFunction(namespace.init)) {
						namespace.init();
					}
				});
				callback(null);
			},
			getAppsMap.bind(null, accountId),
			loadCustomApps.bind(null, appsMap),
			function(appNamepaces, callback) {
				_.forEach(appNamepaces, function(namespace) {
					if (_.isFunction(namespace.init)) {
						namespace.init();
					}
				});
				callback(null);
			}
		],
		function(err, result) {
			if (err) {
				console.error(err.message);
			}
			requestBrithon.router.dispatch(req, res, function(err) {
				handleErrors(req, res, err);
			});
		}
	);
};
