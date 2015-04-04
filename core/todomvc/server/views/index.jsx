'use strict';

var _ = require('lodash');
var React = require('react');

module.exports = function(brithon) {

	var ns = brithon.ns('core.todomvc.server.views', {

		init: function() {
			brithon.on('core.demo.server.views.getTitle', ns.getTitle);
			brithon.on('core.demo.server.views.getFoot', ns.getFoot);
			brithon.on('core.demo.server.views.getHead', ns.getHead);
			brithon.on('core.demo.server.views.getContent', ns.getContent);
		},

		getTitle: function(title) {
			return 'Brithon TodoMVC';
		},

		getHead: function(head) {
		    var baseCss = brithon.core.common.server.getCoreAppFileUrl('todomvc', 'assets/css/base.css');
		    var appCss = brithon.core.common.server.getCoreAppFileUrl('todomvc', 'assets/css/app.css');

			return [
				<link rel="stylesheet" href={ baseCss } />,
				<link rel="stylesheet" href={ appCss } />	
			];
		},

		getFoot: function(foot) {
		    var indexJs = brithon.core.common.server.getCoreAppFileUrl('todomvc', 'index.js');

			return [
				<script src={ indexJs }></script>
			];
		},

		getContent: function(content) {
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