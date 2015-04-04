/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var actions = require('../actions');
var brithon = require('brithon-framework').getInstance('client');

var Footer = React.createClass({

    mixins: [ImmutableRenderMixin],

    propTypes: {
        allTodos: ReactPropTypes.object.isRequired
    },

    /**
     * @return {object}
     */
    render: function () {
        var allTodos = this.props.allTodos.toJS();
        var total = Object.keys(allTodos).length;

        if (total === 0) {
            return null;
        }

        var completed = 0;
        for (var key in allTodos) {
            if (allTodos[key].complete) {
                completed++;
            }
        }

        var itemsLeft = total - completed;
        var itemsLeftPhrase = itemsLeft === 1 ? ' item ' : ' items ';
        itemsLeftPhrase += 'left';

        // Undefined and thus not rendered if no completed items are left.
        var clearCompletedButton;
        if (completed) {
            clearCompletedButton =
                <button
                    id="clear-completed"
                    onClick={this._onClearCompletedClick}>
                    Clear completed ({completed})
                </button>;
        }

        return (
            <footer id="footer">
                <span id="todo-count">
                    <strong>
                    {itemsLeft}
                    </strong>
                    {itemsLeftPhrase}
                </span>
                {clearCompletedButton}
            </footer>
        );
    },

    /**
     * Event handler to delete all completed TODOs
     */
    _onClearCompletedClick: function () {
        actions.destroyCompleted();
    }

});

var ns = brithon.ns('core.todomvc.components.footer', {
    getComponentClass: function() {
        return Footer;
    }
});

module.exports = ns;