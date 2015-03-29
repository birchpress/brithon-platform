'use strict';

var brithon = require('./framework');
var $ = require('jquery');

var ns = brithon.ns('brithon.core.front.signup', {
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
