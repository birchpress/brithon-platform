'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var results = {};

var vAppDir = __dirname;
var vApps = fs.readdirSync(vAppDir).filter(function(file) {
    return fs.statSync(path.join(vAppDir, file)).isDirectory();
});

_.forEach(vApps, function(vApp) {
    var versions = fs.readdirSync(path.join(vAppDir, vApp)).filter(function(file) {
        return fs.statSync(path.join(vAppDir, vApp, file)).isDirectory();
    });

    _.forEach(versions, function(version) {
        var mountPath =  path.join('/', vApp, version);
        var instance = require(path.join(vAppDir, vApp, version, 'index'));
        results[mountPath] = instance;
    });
});

module.exports = results;
