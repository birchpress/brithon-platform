!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.BrithonFramework=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

(function() {
    var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

    var _submodules = {};
    var _instances = {};

    var _assert = function(assertion, message) {
        if (!assertion) {
            throw new Error(message);
        }
    };

    var newInstance = function() {
        var _fnMap = {};

        var namespace = function(nsName, obj) {
            _assert(_.isString(nsName));

            var ns = nsName.split('.');
            var currentStr = ns[0];
            var current = instance[currentStr] = createNs(currentStr, instance[currentStr]);
            var sub = ns.slice(1);
            var len = sub.length;
            for (var i = 0; i < len; ++i) {
                currentStr = currentStr + '.' + sub[i];
                current[sub[i]] = createNs(currentStr, current[sub[i]]);
                current = current[sub[i]];
            }

            _.forOwn(obj, function(value, key) {
                if (_.isFunction(value) && !_.has(value, 'fn')) {
                    current[key] = defn(current, key, value);
                } else {
                    current[key] = value;
                }
            });
            return current;
        };

        var createNs = function(nsString, ns) {
            if (!_.isObject(ns)) {
                ns = {};
            }
            ns.nsString = nsString;
            return ns;
        };

        var argumentsToArray = function(args) {
            return Array.prototype.slice.call(args);
        };

        var applyListeners = function() {
            var args = argumentsToArray(arguments);
            _assert(args.length >= 2, 'At least two arguments are required. The arguments are ' + args);
            _assert(_.isString(args[0]), 'The hook name should be string.');

            var context = this;
            var eventName = args[0];
            var value = args[1];
            if (_.has(_fnMap, eventName)) {
                var listeners = _fnMap[eventName];
                if (_.isArray(listeners)) {
                    _.each(listeners, function(priorityListeners, priority) {
                        if (_.isArray(priorityListeners)) {
                            _.each(priorityListeners, function(fn, index) {
                                var fnArgs = args.slice(2);
                                fnArgs.unshift(value);
                                var return_val = fn.apply(context, fnArgs);
                                if (return_val !== undefined) {
                                    value = return_val;
                                }
                            });
                        }
                    });
                }
            }
            return value;
        };

        var defn = function(ns, fnName, fn) {
            _assert(_.isObject(ns) && _.has(ns, 'nsString'), 'The namespace(1st argument) should be a namespace object.');
            _assert(_.isString(fnName), 'The function name(2nd argument) should be a string.');
            _assert(_.isFunction(fn), 'The 3rd argument should be a function');
            _assert(!_.has(fn, 'fn'), 'The 3rd argument is already a hookable function');

            var eventName = ns.nsString + '.' + fnName;
            var preEventName = eventName + '-pre';
            var hookable = function() {
                var args = argumentsToArray(arguments);

                var preArgs = [];
                preArgs.unshift(preEventName, args);
                args = applyListeners.apply(ns, preArgs);

                var result = fn.apply(ns, args);

                var fArgs = args.slice(0);
                fArgs.unshift(eventName, result);
                result = applyListeners.apply(ns, fArgs);

                return result;
            };
            Object.defineProperty(hookable, 'fn', {
                value: fn,
                writable: false
            });

            return hookable;
        };

        var parsePriority = function(arg) {
            arg = parseInt(arg);
            if (_.isNaN(arg) || arg < 0) {
                arg = 10;
            }
            return arg;
        };

        var addListener = function(eventName, fn, priority) {
            _assert(_.isString(eventName), 'The hook name should be a string.');
            _assert(_.isFunction(fn), 'The listener should be a function');

            priority = parsePriority(priority);
            if (_.has(_fnMap, eventName)) {
                var listeners = _fnMap[eventName];
                if (_.isArray(listeners) && _.isArray(listeners[priority])) {
                    listeners[priority].push(fn);
                } else {
                    listeners = [];
                    listeners[priority] = [fn];
                }
            } else {
                _fnMap[eventName] = [];
                _fnMap[eventName][priority] = [fn];
            }
        };

        var removeListener = function(eventName, fn, priority) {
            _assert(_.isString(eventName), 'The hook name should be a string.');
            _assert(_.isFunction(fn), 'The listener should be a function');

            priority = parsePriority(priority);
            if (_.has(_fnMap, eventName)) {
                var listeners = _fnMap[eventName];
                if (_.isArray(listeners) && _.isArray(listeners[priority])) {
                    _.without(listeners[priority], fn);
                }
            }
        };

        var instance = {
            on: addListener,
            addListener: addListener,
            removeListener: removeListener,
            ns: namespace,
            assert: _assert
        };

        instance = _.merge(instance, _submodules);

        return instance;
    };

    var getInstance = function(instanceName) {
        _assert(_.isString(instanceName), 'instanceName must be a string');
        if (!_.has(_instances, instanceName)) {
            _instances[instanceName] = newInstance();
        }
        return _instances[instanceName];
    };

    var mixin = function(submodule) {
        _submodules = _.merge(_submodules, submodule);
    };


    module.exports = {
        newInstance: newInstance,
        getInstance: getInstance,
        mixin: mixin
    };
}());
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

(function() {
    var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);
    
    var brithon = require('./brithon');

    var multimethod = require('./multimethod');
    brithon.mixin(multimethod);
    
    module.exports = brithon;
}());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./brithon":1,"./multimethod":3}],3:[function(require,module,exports){
(function (global){
//
// (c) 2011 Kris Jordan
//
// `multimethod` is freely distributable under the MIT license.
// For details and documentation: 
// [http://krisjordan.com/multimethod-js](http://krisjordan.com/multimethod-js)

// (c) 2015 Brithon Inc.

'use strict';

(function() {
    var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

    var noop = function() {};

    var identity = function(a) { return a; };

    var match = function(value, methods) {
        if(_.has(methods, value)) {
            return methods[value];
        } else {
            return false;
        }
    };

    var pluck = function(property) {
        return function(object) {
            return object[property];
        }
    };


    var multimethod = function(dispatch) { 

        var _dispatch,
            _methods   = {},
            _default   = noop;

        var _lookup    = function() {
            var criteria    = _dispatch.apply(that, arguments),
                method      = match(criteria, _methods);
            if(method !== false) {
                return method;
            } else {
                return _default;
            }
        };

        var toValue = function(subject, args) {
            if(_.isFunction(subject)) {
                return subject.apply(that, args);
            } else {
                return subject;
            }
        };

        var that = function() {
            var method = _lookup.apply(that, arguments);
            return toValue.call(that, method, arguments);
        };

        that['dispatch'] = function(dispatch) {
            if(_.isFunction(dispatch)) {
                _dispatch = dispatch;
            } else if(_.isString(dispatch)) {
                _dispatch = pluck(dispatch);
            } else {
                throw "dispatch requires a function or a string.";
            }
            return that;
        };

        that.dispatch(dispatch || identity);

        that['when'] = function(matchValue, fn) {
            _methods[matchValue] = fn;
            return that;
        };

        that['remove'] = function(matchValue) {
            if(_.has(_methods, matchValue)) {
                delete _methods[matchValue];
            }
            return that;
        };

        that['setDefault'] = function(method) {
            _default = method;
            Object.defineProperty(that, 'default', {
                value: _default,
                writable: false
            });

            return that;
        };

        return that;
    };

    module.exports = {
        multimethod: multimethod
    };
}());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2])(2)
});