'use strict';

var React = require('react');
var brithon = require('brithon-framework').getInstance('client');

var getClassMarkup = function (props) {
    return (
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
};

var ns = brithon.ns('brithon.core.components.signinpanel', {

    init: function() { },

    getClass: function () {
        return React.createClass({
            render: function () {
                return getClassMarkup(this.props);
            }
        });
    }
});

module.exports = ns;
