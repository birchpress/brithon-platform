'use strict';

var _ = require('lodash');
var React = require('react');

module.exports = function (brithon) {

    var ns = brithon.ns('core.server.views', {

        init: function () {
        },

        getSigninPage: function () {
            var SLayout = brithon.core.server.components.slayout.getClass();
            var content = (
                <div class="container signup">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="text-center m-b-md">
                                <h3>Sign in to Brithon </h3>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                        </div>
                        <div class="col-md-4">
                            <div class="hpanel">
                                <div class="panel-body">
                                    <form action="" method="post" id="signinForm" data-parsley-validate data-parsley-ui-enabled="true">
                                        <div class="form-group">
                                            <label>Email</label>
                                            <input type="email" name="email" value="" id="" class="form-control" data-parsley-required />
                                        </div>
                                        <div class="form-group">
                                            <label>Password</label>
                                            <input type="password" name="password" value="" id="" class="form-control" ata-parsley-require />
                                        </div>
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" name="rememberme" checked="checked" />
                                                Remember me on this computer
                                            </label>
                                        </div>
                                        <div class="form-group">
                                            <div class="text-center">
                                                <button type="submit" class="btn btn-primary">Sign in</button>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="text-center">
                                                Havent registered
                                                <a href="/signup">Sign up for free</a>
                                                here.
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 text-center">
                            2015 &copy; Brithon Inc.
                        </div>
                    </div>
                </div>
            );
            var foot = (
                <script src="/public/core/signin.js"></script>
            );

            return React.renderToStaticMarkup(
                <SLayout title="Subscribe to Brithon Appointments today"
                    content={ content } foot={ foot } />
            );
        },

        getSignupPage: function () {

        },

        getErrorPage: function (error) {
            return React.renderToStaticMarkup(
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