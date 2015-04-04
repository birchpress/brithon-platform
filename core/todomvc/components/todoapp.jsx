/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin')

var brithon = require('brithon-framework').getInstance('client');
var Footer = require('./footer.jsx').getComponentClass();
var Header = require('./header.jsx').getComponentClass();
var MainSection = require('./mainsection.jsx').getComponentClass();

var TodoApp = React.createClass({

    mixins: [ImmutableRenderMixin],

    /**
     * @return {object}
     */
    render: function () {
        return (
            <div>
                <Header />
                <MainSection
                    allTodos={this.props.todoStore.allTodos}
                    areAllComplete={this.props.todoStore.areAllComplete}
                />
                <Footer allTodos={this.props.todoStore.allTodos} />
            </div>
        );
    }
});

var ns = brithon.ns('core.todomvc.components.todoapp', {
    getComponentClass: function() {
        return TodoApp;
    }
});

module.exports = ns;
