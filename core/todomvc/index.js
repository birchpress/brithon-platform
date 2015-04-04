'use strict';

var React = require('react');

var BrithonFramework = require('brithon-framework');

var brithon = BrithonFramework.getInstance('client');
var stores = require('./stores');
var actions = require('./actions');
var TodoApp = require('./components/todoapp.jsx').getComponentClass();

var todoAppComponent;

var ns = brithon.ns('core.todomvc', {

    init: function() {
        stores.init();
        actions.init();
        brithon.core.demo.getRouter().route('todomvc', 'todomvc', ns.run);
    },

    run: function() {
        if (!todoAppComponent) {
            todoAppComponent = React.render(
                React.createElement(TodoApp, {
                    todoStore: ns.getTodoStore()
                }),
                document.getElementById('todoapp')
            );
            brithon.on('core.todomvc.stores.onChange', function() {
                todoAppComponent.setProps({
                    todoStore: ns.getTodoStore()
                });
            });
        }
    },

    /**
     * Retrieve the current TODO data from the TodoStore
     */
    getTodoStore: function() {
        return {
            allTodos: stores.getAll(),
            areAllComplete: stores.areAllComplete()
        };
    }
});

ns.init();

module.exports = ns;