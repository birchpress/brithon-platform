'use strict';

var $ = require('jquery');
var BrithonFramework = require('brithon-framework');

var brithon = BrithonFramework.getInstance('client');

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
