'use strict';

var React = require('react');
var _ = require('lodash');

var brithon = require('brithon-framework').getInstance('client');
var signinPanel = require('./components/signinpanel');

var ns = brithon.ns('brithon.core.signin', {

	init: function() {},

	run: function() {
		var SigninPanel = signinPanel.getClass();

		React.render(
			React.createElement(SigninPanel, null),
			document.getElementById('signin-panel')
		);
	}
});

ns.init();
ns.run();

module.exports = ns;