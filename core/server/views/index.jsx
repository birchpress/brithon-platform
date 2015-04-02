'use strict';

var _ = require('lodash');
var React = require('react');
var beautify= require('js-beautify');

module.exports = function (brithon) {

    var ns = brithon.ns('core.server.views', {

        init: function () {
        },

        renderReactComponent: function(component) {
            var html = React.renderToStaticMarkup(component);
            html = beautify.html(html);
            return html;
        },

        getSigninPage: function () {
            var SLayout = brithon.core.server.components.slayout.getClass();
            var content = (
                <div id="signin-panel"></div>
            );
            var head = (
                <link rel="stylesheet" href="/public/core/assets/css/signin.css" />
            );
            var foot = (
                <script src="/public/core/signin.js"></script>
            );
            var context = {
                title: "Subscribe to Brithon Appointments today",
                head: head,
                content: content,
                foot: foot
            };
            return ns.renderReactComponent(
                <SLayout context={ context } />
            );
        },

        getSignupPage: function () {

        },

        getErrorPage: function (error) {
            return ns.renderReactComponent(
                <html>
                    <head>
                        <meta charSet='utf-8' />
                    </head>
                    <body>
                        <h1>{ error.message }</h1>
                        <h2>{ error.status }</h2>
                        <pre>{ error.stack }</pre>
                    </body>
                </html>
            );
        }

    });

    return ns;
};