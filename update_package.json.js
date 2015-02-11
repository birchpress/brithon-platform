#!/usr/bin/env node

var jf = require('jsonfile');
var _ = require('lodash');

if (process.argv.length < 3) {
    console.log('Usage: node update_package.json.js <source_package.json>');
    process.exit(1);
}

var sourceFile = process.argv[2];
var destFile = './package.json';

var source = jf.readFileSync(sourceFile);
var dest = jf.readFileSync(destFile);

_.assign(dest.dependencies, source.dependencies);

jf.writeFileSync(destFile, dest);

