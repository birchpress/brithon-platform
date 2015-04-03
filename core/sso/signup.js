'use strict';

var $ = require('jquery');
var brithon = require('brithon-framework').getInstance('client');

var ns = brithon.ns('brithon.core.sso.signup', {
    init: function() { },

    run: function() {
        $(function() {
            $('#signupForm').parsley();
        });
    }
});

ns.init();
ns.run();

module.exports = ns;
