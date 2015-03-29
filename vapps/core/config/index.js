'use strict';

var path = require('path');
var convict = require('convict');

var baseConfig = require(path.join(__dirname, 'base.json'));
var config = convict(baseConfig);

config.loadFile(path.join(__dirname, config.get('env') + '.json'));

config.validate();

module.exports = config;
