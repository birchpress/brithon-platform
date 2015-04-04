'use strict';

var _ = require('lodash');
var React = require('react');
var beautify= require('js-beautify');

module.exports = function (brithon) {

    var ns = brithon.ns('core.sso.server.views', {

        getSigninPage: function () {
            var SLayout = brithon.core.sso.server.components.slayout.getClass();
            var content = (
                <div id="signin-panel"></div>
            );
            var head = (
                <link rel="stylesheet" href="/public/core/sso/assets/css/signin.css" />
            );
            var foot = (
                <script src="/public/core/sso/signin.js"></script>
            );
            var context = {
                title: "Subscribe to Brithon Appointments today",
                head: head,
                content: content,
                foot: foot
            };
            return brithon.core.common.server.views.renderReactComponent(
                <SLayout context={ context } />
            );
        },

        getSignupPage: function () {

        }

    });

    return ns;
};