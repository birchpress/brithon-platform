'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var director = require('director');
var browserify = require('browserify');
var mkdirp = require('mkdirp');
var fse = require('fs-extra');

var brithon = require('brithon-framework').getInstance('server');

var ns = brithon.ns('middleware', {

	fn: function(req, res, next) {
		var requestBrithon = require('brithon-framework').newInstance();
		requestBrithon.request = req;
		requestBrithon.response = res;
		requestBrithon.router = new director.http.Router();
		requestBrithon.knex = req.locals.knex;

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

	loadModule: function(filePath, requestBrithon) {
		var module = require(filePath);
		var ns = module(requestBrithon);
		return ns;
	},

	loadDir: function(dirPath, requestBrithon) {
		var namespaces = [];
		var loadDir = function(dirPath) {
			var fileNames = fs.readdirSync(dirPath);
			_.each(fileNames, function(fileName) {
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
		// bundle.transform('reactify');
		// bundle.transform('browserify-shim');
		mkdirp.sync(path.dirname(dest));
		var writable = fs.createWriteStream(dest);
		bundle.on('error', console.error);
		bundle.pipe(writable);
	},

	bundleCoreJavaScipts: function() {
		var srcDir = path.join(__dirname, 'core');
		var fileNames = fs.readdirSync(srcDir);
		_.each(fileNames, function(fileName) {
			var filePath = path.join(srcDir, fileName);
			if (fs.statSync(filePath).isFile()) {
				var desPath = path.join(__dirname, 'public', 'core', fileName);
				ns.bundleJavaScript(filePath, desPath);
			}
		});
	},

	bundleAppJavaScripts: function(appName, version) {
		var srcDir = path.join(__dirname, 'apps', appName, version);
		var fileNames = fs.readdirSync(srcDir);
		_.each(fileNames, function(fileName) {
			var filePath = path.join(srcDir, fileName);
			if (fs.statSync(filePath).isFile()) {
				var desPath = path.join(__dirname, 'public', 'apps', appName, version, fileName);
				ns.bundleJavaScript(filePath, desPath);
			}
		});
	},

	copyCoreAssets: function() {
		var srcDir = path.join(__dirname, 'core', 'assets');
		var destDir = path.join(__dirname, 'public', 'core', 'assets');
		fse.copySync(srcDir, destDir);
	},

	copyAppAssets: function(appName, version) {
		var srcDir = path.join(__dirname, 'apps', appName, version, 'assets');
		var destDir = path.join(__dirname, 'public', 'apps', appName, version, 'assets');
		fse.copySync(srcDir, destDir);
	},

	loadCore: function(requestBrithon) {
		if (brithon.platform.isDev()) {
			ns.bundleCoreJavaScipts();
			ns.copyCoreAssets();
		}
		var namespace = ns.loadDir(path.join(__dirname, 'core', 'server'), requestBrithon);
		return namespace;
	},

	loadApps: function(appsMap, requestBrithon) {
		var namespaces = [];
		_.each(appsMap, function(version, appName) {
			var appNamespaces = ns.loadApp(appName, version, requestBrithon);
			namespaces = namespaces.concat(appNamespaces);
		});
		return namespaces;
	},

	loadApp: function(appName, version, requestBrithon) {
		if (brithon.platform.isDev()) {
			ns.bundleAppJavaScripts(appName, version);
			ns.copyAppAssets(appName, version);
		}
		var appPath = path.join(__dirname, 'apps', appName, version, 'server');
		var namespaces = ns.loadDir(appPath, requestBrithon);
		return namespaces;
	},

	handleErrors: function(req, res, err, requestBrithon) {
		requestBrithon.core.server.handleErrors(err);
	}

});

module.exports = ns;