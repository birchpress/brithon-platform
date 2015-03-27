'use strict';

var brithon = require('brithon-framework').getInstance('platform');
var $ = require('jquery');

var ns = brithon.ns('brithon.sso.front.signin', {
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
