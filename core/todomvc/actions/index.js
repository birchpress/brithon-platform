'use strict';

var brithon = require('brithon-framework').getInstance('client');

var ns = brithon.ns('core.todomvc.actions', {

	init: function() {},

	create: function(text) {},

	updateText: function(id, text) {},

	toggleComplete: function(todo) {},

	toggleCompleteAll: function() {},

	destroy: function(id) {},

	destroyCompleted: function() {}
});

module.exports = ns;