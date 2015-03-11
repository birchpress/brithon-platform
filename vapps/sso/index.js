'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var vAppName = path.basename(__dirname);
var versions = fs.readdirSync(__dirname).filter(function(file) {
    return fs.statSync(path.join(__dirname, file)).isDirectory();
});

// TODO: placeholder.
var version = versions[0];

var results = {};

var mountpath =  path.join('/', vAppName);
var instance = require(path.join(__dirname, version, 'index'));
results[mountpath] = instance;

module.exports = results;
