'use strict';

var _ = require('lodash');
var React = require('react');
var beautify= require('js-beautify');

var getPageMarkup = function(ns) {
    var head = ns.getHead();
    var content = ns.getContent();
    var foot = ns.getFoot();

    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

                <title>Brithon Demo Apps</title>

                { head }

            </head>
            <body>

                { content }

                <script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.5.0/lodash.min.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/react/0.13.1/react-with-addons.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/immutable/3.7.1/immutable.js"></script>

                <script src="/public/core/demo/index.js"></script>

                { foot }
            </body>
        </html>
    );
};

module.exports = function (brithon) {

    var ns = brithon.ns('core.demo.server.views', {

        getPage: function () {
            return brithon.core.common.server.views.renderReactComponent(
                getPageMarkup(ns)
            );

        },

        getHead: function() {
            return [];
        },

        getContent: function() {
            return [];
        },

        getFoot: function () {
            return [];
        }

    });

    return ns;
};