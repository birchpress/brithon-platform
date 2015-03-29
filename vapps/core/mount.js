'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var mountList = [];
mountList.push({
    mountpath: '/', // path.join('/', vAppName);
    router: require('./index')
});

module.exports = mountList;
