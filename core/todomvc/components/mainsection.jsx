/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var ImmutableRenderMixin = require('react-immutable-render-mixin')

var actions = require('../actions');
var brithon = require('brithon-framework').getInstance('client');
var TodoItem = require('./todoitem.jsx').getComponentClass();

var MainSection = React.createClass({

    mixins: [ImmutableRenderMixin],

    propTypes: {
        allTodos: ReactPropTypes.object.isRequired,
        areAllComplete: ReactPropTypes.bool.isRequired
    },

    /**
     * @return {object}
     */
    render: function () {
        var allTodos = this.props.allTodos.toJS();

        // This section should be hidden by default
        // and shown when there are todos.
        if (Object.keys(allTodos).length < 1) {
            return null;
        }

        var todos = [];

        for (var key in allTodos) {
            var todo = this.props.allTodos.get(key);
            todos.push(<TodoItem key={key} todo={todo} />);
        }

        return (
            <section id="main">
                <input
                    id="toggle-all"
                    type="checkbox"
                    onChange={this._onToggleCompleteAll}
                    checked={this.props.areAllComplete ? 'checked' : ''}
                />
                <label htmlFor="toggle-all">Mark all as complete</label>
                <ul id="todo-list">{todos}</ul>
            </section>
        );
    },

    /**
     * Event handler to mark all TODOs as complete
     */
    _onToggleCompleteAll: function () {
        actions.toggleCompleteAll();
    }

});

var ns = brithon.ns('core.todomvc.components.mainsection', {
    getComponentClass: function() {
        return MainSection;
    }
});

module.exports = ns;
