'use strict';

var _ = require('lodash');
var React = require('react');

module.exports = function(brithon) {

	var ns = brithon.ns('core.todomvc.server.views', {

		init: function() {
			brithon.on('core.demo.server.views.getFoot', ns.addFoot);
			brithon.on('core.demo.server.views.getHead', ns.addHead);
			brithon.on('core.demo.server.views.getContent', ns.addContent);
		},

		addHead: function(head) {
			return [
				<link rel="stylesheet" href="/public/core/todomvc/assets/css/base.css" />,
				<link rel="stylesheet" href="/public/core/todomvc/assets/css/app.css" />	
			];
		},

		addFoot: function(foot) {
			return [
				<script src="/public/core/todomvc/index.js"></script>
			];
		},

		addContent: function(content) {
			return [
				<section id="todoapp"></section>,
				<footer id="info">
				    <p>Double-click to edit a todo</p>

					<p>Created by <a href="http://facebook.com/bill.fisher.771">Bill Fisher</a></p>
				    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
				</footer>
			];
		}

	});

	return ns;
};