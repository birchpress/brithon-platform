'use strict';

var React = require('react');
var _ = require('lodash');

var BrithonFramework = require('brithon-framework');
var signinPanel = require('./components/signinpanel');

var brithon = BrithonFramework.getInstance('client');

var ns = brithon.ns('brithon.core.sso.signin', {

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