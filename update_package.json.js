#!/usr/bin/env node

var jf = require('jsonfile');
var _ = require('lodash');

var sourceFile = process.argv[2];
var destFile = './package.json';

var source = jf.readFileSync(sourceFile);
var dest = jf.readFileSync(destFile);

_.assign(dest.dependencies, source.dependencies);

jf.writeFileSync(destFile, dest);

