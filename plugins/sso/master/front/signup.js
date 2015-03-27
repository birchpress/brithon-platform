'use strict';

var brithon = require('brithon-framework').getInstance('platform');
var $ = require('jquery');

var ns = brithon.ns('brithon.sso.front.signup', {
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
