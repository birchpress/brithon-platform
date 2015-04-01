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
                <div className="container signup">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-center m-b-md">
                                <h3>Sign in to Brithon </h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                        </div>
                        <div className="col-md-4">
                            <div className="hpanel">
                                <div className="panel-body">
                                    <form action="" method="post" id="signinForm" data-parsley-validate data-parsley-ui-enabled="true">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" name="email" value="" id="" className="form-control" data-parsley-required />
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input type="password" name="password" value="" id="" className="form-control" ata-parsley-require />
                                        </div>
                                        <div className="checkbox">
                                            <label>
                                                <input type="checkbox" name="rememberme" checked="checked" />
                                                Remember me on this computer
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary">Sign in</button>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="text-center">
                                                Haven't registered?
                                                <a href="/signup">Sign up for free</a>
                                                here.
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 text-center">
                            2015 &copy; Brithon Inc.
                        </div>
                    </div>
                </div>
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