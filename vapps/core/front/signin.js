'use strict';

var brithon = require('./framework');
var $ = require('jquery');

var ns = brithon.ns('brithon.core.front.signin', {
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
