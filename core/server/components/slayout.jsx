'use strict';

var React = require('react');

var getClassMarkup = function (context) {
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

                <title>{ context.title }</title>


                <link rel="stylesheet" href="/public/assets/themes/homer/vendor/fontawesome/css/font-awesome.css" />
                <link rel="stylesheet" href="/public/assets/themes/homer/vendor/metisMenu/dist/metisMenu.css" />
                <link rel="stylesheet" href="/public/assets/themes/homer/vendor/animate.css/animate.css" />
                <link rel="stylesheet" href="/public/assets/themes/homer/vendor/bootstrap/dist/css/bootstrap.css" />
                <link rel="stylesheet" href="/public/assets/css/lib/parsley.css" />

                <link rel="stylesheet" href="/public/assets/themes/homer/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css" />
                <link rel="stylesheet" href="/public/assets/themes/homer/fonts/pe-icon-7-stroke/css/helper.css" />
                <link rel="stylesheet" href="/public/assets/themes/homer/styles/style.css" />

                { context.head }

            </head>
            <body className="blank">

                <div className="color-line"></div>

                <div className="pull-left m">
                    <a href="http://www.brithon.com" className="btn btn-info">Brithon Homepage</a>
                </div>

                { context.content }

                <script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.5.0/lodash.min.js"></script>
                <script src="/public/assets/themes/homer/vendor/jquery/dist/jquery.min.js"></script>
                <script src="/public/assets/themes/homer/vendor/jquery-ui/jquery-ui.min.js"></script>
                <script src="/public/assets/themes/homer/vendor/slimScroll/jquery.slimscroll.min.js"></script>
                <script src="/public/assets/themes/homer/vendor/bootstrap/dist/js/bootstrap.min.js"></script>
                <script src="/public/assets/themes/homer/vendor/metisMenu/dist/metisMenu.min.js"></script>
                <script src="/public/assets/themes/homer/vendor/sparkline/index.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/parsley.js/2.0.7/parsley.min.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/react/0.13.1/react-with-addons.js"></script>

                { context.foot }
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
                    return getClassMarkup(this.props.context);
                }
            });
        }

    });

    return ns;
};
