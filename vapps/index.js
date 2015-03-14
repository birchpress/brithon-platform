'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var vAppDir = __dirname;
var vApps = fs.readdirSync(vAppDir).filter(function(file) {
    return fs.statSync(path.join(vAppDir, file)).isDirectory();
});

// ordre is important within each vapp
var mountList = [].concat.apply([], _.map(vApps, function(vApp) {
    return require('./' + vApp);
}));

module.exports = mountList;
