'use strict';

var $ = require('jquery');
var brithon = require('brithon-framework').getInstance('client');

var ns = brithon.ns('brithon.core.signin', {
    init: function() { },

    run: function() {
        $(function() {
            $('#signinForm').parsley();
        });
    }
});

ns.init();
ns.run();

module.exports = ns;
