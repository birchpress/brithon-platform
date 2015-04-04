'use strict';

var sequence = require('when/sequence');
var async = require('async');
var _ = require('lodash');
var debug = require('debug')('db:migrate');

var schema = require('./schema');
var knex;

function createTable(tableName, tableDef) {
    return knex.schema.createTable(tableName, function (table) {
        var column;
        var columnKeys = _.keys(tableDef);
        _.forEach(columnKeys, function (key) {
            if (tableDef[key].type === 'text' &&
                tableDef[key].hasOwnProperty('fieldtype')) {
                column = table[tableDef[key].type](key, tableDef[key].fieldtype);
            } else if (tableDef[key].type === 'string' &&
                       tableDef[key].hasOwnProperty('maxlength')) {
                column = table[tableDef[key].type](key, tableDef[key].maxlength);
            } else {
                column = table[tableDef[key].type](key);
            }

            if (tableDef[key].hasOwnProperty('nullable') &&
                tableDef[key].nullable === true) {
                column.nullable();
            } else {
                column.notNullable();
            }

            if (tableDef[key].hasOwnProperty('primary') &&
                tableDef[key].primary === true) {
                column.primary();
            }

            if (tableDef[key].hasOwnProperty('unique') &&
                tableDef[key].unique) {
                column.unique();
            }

            if (tableDef[key].hasOwnProperty('unsigned') &&
                tableDef[key].unsigned) {
                column.unsigned();
            }

            if (tableDef[key].hasOwnProperty('references')) {
                column.references(tableDef[key].references);
            }

            if (tableDef[key].hasOwnProperty('defaultTo')) {
                column.defaultTo(tableDef[key].defaultTo);
            }
        });
    });
}

function createTables (schema) {
    var tableNames = _.keys(schema);
    var tables = _.map(tableNames, function (tableName) {
        return function () {
            return createTable(tableName, schema[tableName]);
        };
    });

    return sequence(tables);
}

function migrate (db) {
    knex = db;
    createTables()
        .then(function() {
            debug('DB migration successes.');
        })
        .otherwise(function (error) {
            debug(error.stack);
            process.exit(1);
        });
}

module.exports = migrate;
