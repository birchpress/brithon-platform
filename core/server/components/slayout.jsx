'use strict';

var _ = require('lodash');
var React = require('react');

var getClass = function (title, head, content, foot) {
    var style = ".signup a { " +
        "           text-decoration: underline;" +
        "        }";
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />

                <title>{ title }</title>


                <link rel="stylesheet" href="/public/assets/themes/homer/vendor/fontawesome/css/font-awesome.css" />
                <link rel="stylesheet" href="/public/assets/themes/homer/vendor/metisMenu/dist/metisMenu.css" />
                <link rel="stylesheet" href="/public/assets/themes/homer/vendor/animate.css/animate.css" />
                <link rel="stylesheet" href="/public/assets/themes/homer/vendor/bootstrap/dist/css/bootstrap.css" />
                <link rel="stylesheet" href="/public/assets/css/lib/parsley.css" />

                <link rel="stylesheet" href="/public/assets/themes/homer/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css" />
                <link rel="stylesheet" href="/public/assets/themes/homer/fonts/pe-icon-7-stroke/css/helper.css" />
                <link rel="stylesheet" href="/public/assets/themes/homer/styles/style.css" />

                <style>
                    {style}
                </style>

                { head }

            </head>
            <body class="blank">

                <div class="color-line"></div>

                <div class="pull-left m">
                    <a href="http://www.brithon.com" class="btn btn-info">Brithon Homepage</a>
                </div>

                { content }

                <script src="/public/assets/themes/homer/vendor/jquery/dist/jquery.min.js"></script>
                <script src="/public/assets/themes/homer/vendor/jquery-ui/jquery-ui.min.js"></script>
                <script src="/public/assets/themes/homer/vendor/slimScroll/jquery.slimscroll.min.js"></script>
                <script src="/public/assets/themes/homer/vendor/bootstrap/dist/js/bootstrap.min.js"></script>
                <script src="/public/assets/themes/homer/vendor/metisMenu/dist/metisMenu.min.js"></script>
                <script src="/public/assets/themes/homer/vendor/sparkline/index.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/parsley.js/2.0.7/parsley.min.js"></script>

                <script src="/public/assets/themes/homer/scripts/homer.js"></script>

                { foot }
            </body>
        </html>
    )
};

module.exports = function (brithon) {

    var ns = brithon.ns('core.server.components.slayout', {

        init: function () {
        },

        getClass: function () {
            return React.createClass({

                render: function () {
                    var title = this.props.title;
                    var head = this.props.head;
                    var content = this.props.content;
                    var foot = this.props.foot;

                    return getClass(title, head, content, foot);
                }
            });
        }

    });

    return ns;
};