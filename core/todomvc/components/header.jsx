/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var actions = require('../actions');
var BrithonFramework = require('brithon-framework');

var brithon = BrithonFramework.getInstance('client');
var TodoTextInput = require('./todotextinput.jsx').getComponentClass();

var Header = React.createClass({

    mixins: [ImmutableRenderMixin],

    /**
     * @return {object}
     */
    render: function () {
        return (
            <header id="header">
                <h1>todos</h1>
                <TodoTextInput
                    id="new-todo"
                    placeholder="What needs to be done?"
                    onSave={this._onSave}
                />
            </header>
        );
    },

    /**
     * Event handler called within TodoTextInput.
     * Defining this here allows TodoTextInput to be used in multiple places
     * in different ways.
     * @param {string} text
     */
    _onSave: function (text) {
        if (text.trim()) {
            actions.create(text);
        }

    }

});

var ns = brithon.ns('core.todomvc.components.header', {
    getComponentClass: function () {
        return Header;
    }
});

module.exports = ns;
