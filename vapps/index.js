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
    _.merge(results, require('./' + vApp));
});

module.exports = results;
