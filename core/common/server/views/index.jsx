'use strict';

var _ = require('lodash');
var React = require('react');
var beautify= require('js-beautify');

module.exports = function (brithon) {

    var ns = brithon.ns('core.common.server.views', {

        renderReactComponent: function(component) {
            var html = React.renderToStaticMarkup(component);
            html = beautify.html(html);
            return html;
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