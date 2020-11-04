(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("promise-polyfill"));
	else if(typeof define === 'function' && define.amd)
		define("zeta", ["jquery", "promise-polyfill"], factory);
	else if(typeof exports === 'object')
		exports["zeta"] = factory(require("jquery"), require("promise-polyfill"));
	else
		root["zeta"] = factory(root["$"], root["promise-polyfill"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__44__, __WEBPACK_EXTERNAL_MODULE__804__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 463:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "IS_IE": () => /* binding */ src_IS_IE,
  "IS_IE10": () => /* binding */ src_IS_IE10,
  "IS_IOS": () => /* binding */ src_IS_IOS,
  "IS_MAC": () => /* binding */ src_IS_MAC,
  "IS_TOUCH": () => /* binding */ src_IS_TOUCH,
  "css": () => /* reexport */ cssUtil_namespaceObject,
  "default": () => /* binding */ src,
  "dom": () => /* reexport */ src_dom,
  "shim": () => /* reexport */ shim_namespaceObject,
  "util": () => /* binding */ util
});

// NAMESPACE OBJECT: ./src/shim.js
var shim_namespaceObject = {};
__webpack_require__.r(shim_namespaceObject);
__webpack_require__.d(shim_namespaceObject, {
  "$": () => jQuery,
  "Map": () => shim_Map,
  "Promise": () => shim_Promise,
  "Set": () => Set,
  "WeakMap": () => shim_WeakMap
});

// NAMESPACE OBJECT: ./src/util.js
var util_namespaceObject = {};
__webpack_require__.r(util_namespaceObject);
__webpack_require__.d(util_namespaceObject, {
  "always": () => always,
  "any": () => any,
  "camel": () => camel,
  "catchAsync": () => catchAsync,
  "createPrivateStore": () => createPrivateStore,
  "deepFreeze": () => deepFreeze,
  "define": () => define,
  "defineAliasProperty": () => defineAliasProperty,
  "defineGetterProperty": () => defineGetterProperty,
  "defineHiddenProperty": () => defineHiddenProperty,
  "defineObservableProperty": () => defineObservableProperty,
  "defineOwnProperty": () => defineOwnProperty,
  "definePrototype": () => definePrototype,
  "each": () => each,
  "either": () => either,
  "extend": () => extend,
  "getOwnPropertyDescriptors": () => getOwnPropertyDescriptors,
  "hasOwnProperty": () => util_hasOwnProperty,
  "htmlDecode": () => htmlDecode,
  "hyphenate": () => hyphenate,
  "iequal": () => iequal,
  "inherit": () => inherit,
  "isArray": () => isArray,
  "isArrayLike": () => isArrayLike,
  "isFunction": () => isFunction,
  "isPlainObject": () => isPlainObject,
  "keys": () => keys,
  "kv": () => kv,
  "lcfirst": () => lcfirst,
  "makeArray": () => makeArray,
  "map": () => map,
  "mapGet": () => mapGet,
  "mapRemove": () => mapRemove,
  "matchWord": () => matchWord,
  "noop": () => noop,
  "randomId": () => randomId,
  "reject": () => reject,
  "repeat": () => repeat,
  "resolve": () => resolve,
  "resolveAll": () => resolveAll,
  "setImmediate": () => setImmediate,
  "setPromiseTimeout": () => setPromiseTimeout,
  "setTimeoutOnce": () => setTimeoutOnce,
  "single": () => single,
  "throwNotFunction": () => throwNotFunction,
  "trim": () => trim,
  "ucfirst": () => ucfirst,
  "values": () => values,
  "watch": () => watch,
  "watchOnce": () => watchOnce,
  "watchable": () => watchable
});

// NAMESPACE OBJECT: ./src/domUtil.js
var domUtil_namespaceObject = {};
__webpack_require__.r(domUtil_namespaceObject);
__webpack_require__.d(domUtil_namespaceObject, {
  "bind": () => bind,
  "comparePosition": () => comparePosition,
  "compareRangePosition": () => compareRangePosition,
  "connected": () => connected,
  "containsOrEquals": () => containsOrEquals,
  "createDocumentFragment": () => createDocumentFragment,
  "createElement": () => createElement,
  "createNodeIterator": () => createNodeIterator,
  "createRange": () => createRange,
  "createTextNode": () => createTextNode,
  "dispatchDOMMouseEvent": () => dispatchDOMMouseEvent,
  "elementFromPoint": () => elementFromPoint,
  "getClass": () => getClass,
  "getCommonAncestor": () => getCommonAncestor,
  "getRect": () => getRect,
  "getRects": () => getRects,
  "getScrollOffset": () => getScrollOffset,
  "is": () => is,
  "isVisible": () => isVisible,
  "iterateNode": () => iterateNode,
  "iterateNodeToArray": () => iterateNodeToArray,
  "makeSelection": () => makeSelection,
  "mergeRect": () => mergeRect,
  "parentsAndSelf": () => parentsAndSelf,
  "pointInRect": () => pointInRect,
  "rangeCovers": () => rangeCovers,
  "rangeEquals": () => rangeEquals,
  "rangeIntersects": () => rangeIntersects,
  "rectCovers": () => rectCovers,
  "rectEquals": () => rectEquals,
  "rectIntersects": () => rectIntersects,
  "removeNode": () => removeNode,
  "sameElementSpec": () => sameElementSpec,
  "scrollBy": () => scrollBy,
  "selectClosestRelative": () => selectClosestRelative,
  "selectIncludeSelf": () => selectIncludeSelf,
  "setClass": () => setClass,
  "tagName": () => tagName,
  "toPlainRect": () => toPlainRect
});

// NAMESPACE OBJECT: ./src/cssUtil.js
var cssUtil_namespaceObject = {};
__webpack_require__.r(cssUtil_namespaceObject);
__webpack_require__.d(cssUtil_namespaceObject, {
  "isCssUrlValue": () => isCssUrlValue,
  "parseCSS": () => parseCSS,
  "runCSSTransition": () => runCSSTransition
});

// CONCATENATED MODULE: ./src/env.js
// @ts-nocheck
const root = document.documentElement;

const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const IS_IE10 = !!window.ActiveXObject;
const IS_IE = !!window.ActiveXObject || root.style.msTouchAction !== undefined || root.style.msUserSelect !== undefined;
const IS_MAC = navigator.userAgent.indexOf('Macintosh') >= 0;
const IS_TOUCH = 'ontouchstart' in window;

// CONCATENATED MODULE: ./src/shim.js
// @ts-nocheck

const shim_Map = window.Map || (function () {
    function indexOf(map, key) {
        return map.items.indexOf(key);
    }
    function Map() {
        var self = this;
        self.items = [];
        self._values = [];
        self._keys = Set.prototype._keys;
    }
    Map.prototype = {
        get size() {
            return this.items.length;
        },
        has: function (v) {
            return indexOf(this, v) >= 0;
        },
        get: function (v) {
            var index = indexOf(this, v);
            return index >= 0 ? this._values[index] : undefined;
        },
        set: function (i, v) {
            var self = this;
            var index = indexOf(self, i);
            self._values[index >= 0 ? index : self.items.push(i) - 1] = v;
            return self;
        },
        delete: function (v) {
            var self = this;
            var index = indexOf(self, v);
            if (index >= 0) {
                self.items.splice(index, 1);
                self._values.splice(index, 1);
            }
            return index >= 0;
        },
        keys: function () {
            return this._keys();
        },
        values: function () {
            var self = this;
            return self._keys(function (v) {
                return self.get(v);
            });
        },
        entries: function () {
            var self = this;
            return self._keys(function (v) {
                return [v, self.get(v)];
            });
        },
        forEach: function (callback, thisArg) {
            var self = this;
            self.items.forEach(function (v, i) {
                callback.call(thisArg, self._values[i], v, self);
            });
        },
        clear: function () {
            this.items.splice(0);
            this._values.splice(0);
        }
    };
    return Map;
}());

const Set = window.Set || (function () {
    function Iterator(arr, callback) {
        var self = this;
        self.items = arr;
        self.index = -1;
        self.callback = callback || function (v) {
            return v;
        };
    }
    Iterator.prototype = {
        next: function () {
            var self = this;
            if (++self.index < self.items.length) {
                return {
                    value: self.callback(self.items[self.index], self.index),
                    done: false
                };
            }
            return {
                value: undefined,
                done: true
            };
        }
    };

    function Set() {
        this.items = [];
    }
    Set.prototype = {
        get size() {
            return this.items.length;
        },
        has: function (v) {
            return this.items.indexOf(v) >= 0;
        },
        add: function (v) {
            var items = this.items;
            if (items.indexOf(v) < 0) {
                items.push(v);
            }
            return this;
        },
        delete: function (v) {
            var index = this.items.indexOf(v);
            if (index >= 0) {
                this.items.splice(index, 1);
            }
            return index >= 0;
        },
        keys: function () {
            return this._keys();
        },
        values: function () {
            return this._keys();
        },
        entries: function () {
            return this._keys(function (v) {
                return [v, v];
            });
        },
        forEach: function (callback, thisArg) {
            var self = this;
            self.items.forEach(function (v) {
                callback.call(thisArg, v, v, self);
            });
        },
        clear: function () {
            this.items.splice(0);
        },
        _keys: function (callback) {
            return new Iterator(this.items, callback);
        }
    };
    return Set;
}());

const shim_WeakMap = window.WeakMap || (function () {
    var num = 0;
    var state = 0;
    var returnValue;

    function WeakMap() {
        this.key = '__WeakMap' + (++num);
    }
    WeakMap.prototype = {
        get: function (key) {
            if (this.has(key)) {
                try {
                    state = 1;
                    key[this.key]();
                    if (state !== 2) {
                        throw new Error('Invalid operation');
                    }
                    var value = returnValue;
                    returnValue = null;
                    return value;
                } finally {
                    state = 0;
                }
            }
        },
        set: function (key, value) {
            Object.defineProperty(key, this.key, {
                configurable: true,
                value: function () {
                    if (state === 1) {
                        returnValue = value;
                        state = 2;
                    }
                }
            });
            return this;
        },
        has: function (key) {
            return key && Object.hasOwnProperty.call(key, this.key);
        },
        delete: function (key) {
            var has = this.has(key);
            if (has) {
                delete key[this.key];
            }
            return has;
        }
    };
    return WeakMap;
}());

const useRequire = "function" === 'function';
const jQuery = window.jQuery || (useRequire && __webpack_require__(44));
const shim_Promise = window.Promise || (useRequire && __webpack_require__(804).default);



// CONCATENATED MODULE: ./src/util.js


const keys = Object.keys;
const freeze = Object.freeze;
const defineProperty = Object.defineProperty;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const getOwnPropertyNames = Object.getOwnPropertyNames;
const hasOwnPropertyImpl = Object.prototype.hasOwnProperty;
const propertyIsEnumerableImpl = Object.prototype.propertyIsEnumerable;
const values = Object.values || function (obj) {
    var vals = [];
    for (var key in obj) {
        if (hasOwnPropertyImpl.call(obj, key) && propertyIsEnumerableImpl.call(obj, key)) {
            vals.push(obj[key]);
        }
    }
    return vals;
};

var matchWordCache;
var watchStore;

/* --------------------------------------
 * Miscellaneous
 * -------------------------------------- */

function noop() { }

function either(x, y) {
    return x ^ y;
}

function isArray(obj) {
    return Array.isArray(obj) && obj;
}

function isFunction(obj) {
    return typeof obj === 'function' && obj;
}

function isPlainObject(obj) {
    var proto = typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj);
    return (proto === Object.prototype || proto === null) && obj;
}

function isArrayLike(obj) {
    if (isFunction(obj) || obj === window) {
        return false;
    }
    var length = !!obj && 'length' in obj && obj.length;
    return isArray(obj) || length === 0 || (typeof length === 'number' && length > 0 && (length - 1) in obj);
}

function makeArray(obj) {
    if (isArray(obj)) {
        return obj.slice(0);
    }
    if (typeof obj === 'string') {
        return [obj];
    }
    if (obj && (isArrayLike(obj) || isFunction(obj.forEach))) {
        var arr = [];
        each(obj, function (i, v) {
            arr[arr.length] = v;
        });
        return arr;
    }
    return obj !== null && obj !== undefined ? [obj] : [];
}

function extend() {
    var options, name, src, copy, copyIsArray, clone;
    var target = arguments[0] || {};
    var i = 1;
    var length = arguments.length;
    var deep = false;

    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }
    if (typeof target !== 'object' && !isFunction(target)) {
        target = {};
    }
    for (; i < length; i++) {
        if ((options = arguments[i]) !== null) {
            for (name in options) {
                src = target[name];
                copy = options[name];

                // prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // recurse if we're merging plain objects or arrays
                if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    // never move original objects, clone them
                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    // don't bring in undefined values
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}

function each(obj, callback) {
    if (obj) {
        var cur, i = 0;
        if (typeof obj === 'string') {
            obj = obj.split(' ');
        } else if (obj instanceof Set) {
            // would be less useful if key and value refers to the same object
            obj = isFunction(obj.values) ? obj.values() : (function (obj, arr) {
                return obj.forEach(function (v) {
                    // @ts-ignore: arr is hinted as never[]
                    arr[arr.length] = v;
                }), arr;
            }(obj, []));
        }
        if (isArrayLike(obj)) {
            var len = obj.length;
            while (i < len && callback(i, obj[i++]) !== false);
        } else if (isFunction(obj.entries)) {
            obj = obj.entries();
            while (!(cur = obj.next()).done && callback(cur.value[0], cur.value[1]) !== false);
        } else if (isFunction(obj.forEach)) {
            var value;
            obj.forEach(function (v, i) {
                value = value === false || callback(i, v);
            });
        } else if (isFunction(obj.next)) {
            while (!(cur = obj.next()).done && callback(i++, cur.value) !== false);
        } else if (isFunction(obj.nextNode)) {
            while ((cur = obj.nextNode()) && callback(i++, cur) !== false);
        } else {
            // @ts-ignore: i is unused elsewhere thus can be assigned string
            for (i in obj) {
                if (callback(i, obj[i]) === false) {
                    return;
                }
            }
        }
    }
}

function map(obj, callback) {
    var arr = [];
    each(obj, function (i, v) {
        var result = callback.call(this, v, i);
        if (result !== null && result !== undefined) {
            if (isArray(result)) {
                arr.push.apply(arr, result);
            } else {
                arr[arr.length] = result;
            }
        }
    });
    return arr;
}

function any(obj, callback) {
    var result;
    each(obj, function (i, v) {
        result = callback.call(this, v, i) && v;
        return !result;
    });
    return result;
}

function single(obj, callback) {
    var result;
    each(obj, function (i, v) {
        result = callback.call(this, v, i);
        return !result;
    });
    return result;
}

function kv(key, value) {
    var obj = {};
    obj[key] = value;
    return obj;
}

function mapGet(map, key, fn) {
    return map.get(key) || fn && (map.set(key, new fn()), map.get(key));
}

function mapRemove(map, key) {
    var value = map.get(key);
    map.delete(key);
    return value;
}

function createPrivateStore() {
    var map = new shim_WeakMap();
    return function (obj, value) {
        if (value) {
            map.set(obj, value);
        }
        return value || map.get(obj);
    };
}

function setImmediate(fn) {
    var args = [].slice.call(arguments, 1);
    resolve().then(function () {
        fn.apply(undefined, args);
    });
}

function setTimeoutOnce(fn) {
    fn.timeout = fn.timeout || setTimeout(function () {
        fn.timeout = null;
        fn();
    });
}


/* --------------------------------------
 * Throw helper
 * -------------------------------------- */

function throwNotFunction(obj, name) {
    if (!isFunction(obj)) {
        throw new Error((name || 'callback') + ' must be a function');
    }
    return obj;
}


/* --------------------------------------
 * Strings
 * -------------------------------------- */

function iequal(a, b) {
    return a.toLowerCase() === b.toLowerCase();
}

function randomId() {
    return Math.random().toString(36).substr(2, 8);
}

function repeat(str, count) {
    return new Array(count + 1).join(str);
}

function camel(str) {
    return String(str).replace(/-([a-z])/g, function (v, a) {
        return a.toUpperCase();
    });
}

function hyphenate(str) {
    return String(str).replace(/[A-Z](?![A-Z])|[A-Z]{2,}(?=[A-Z])/g, function (v, a) {
        return (a ? '-' : '') + v.toLowerCase();
    });
}

function ucfirst(v) {
    v = String(v || '');
    return v.charAt(0).toUpperCase() + v.slice(1);
}

function lcfirst(v) {
    v = String(v || '');
    return v.charAt(0).toLowerCase() + v.slice(1);
}

function trim(v) {
    return String(v || '').replace(/^(?:\u200b|[^\S\u00a0])+|(?:\u200b|[^\S\u00a0])+$/g, '');
}

function matchWord(haystack, needle) {
    var cache = matchWordCache || (matchWordCache = {});
    var re = cache[needle] || (cache[needle] = new RegExp('(?:^|\\s)(' + needle.replace(/\s+/g, '|') + ')(?=$|\\s)'));
    return re.test(String(haystack || '')) && RegExp.$1;
}

function htmlDecode(input) {
    return input && new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
}


/* --------------------------------------
 * Promise related
 * -------------------------------------- */

function resolve(value) {
    return shim_Promise.resolve(value);
}

function reject(reason) {
    return shim_Promise.reject(reason);
}

function always(promise, callback) {
    return promise.then(function (v) {
        return callback(true, v);
    }, function (v) {
        return callback(false, v);
    });
}

function resolveAll(obj, callback) {
    if (!obj || typeof obj !== 'object') {
        return shim_Promise.resolve(obj).then(callback);
    }
    if (obj instanceof shim_Promise || isFunction(obj.then)) {
        return obj.then(callback);
    }
    if (isArray(obj)) {
        return shim_Promise.all(obj).then(function (d) {
            return isFunction(callback) ? callback(d) : d;
        });
    }
    var result = {};
    return shim_Promise.all(keys(obj).map(function (v) {
        return resolveAll(obj[v], function (d) {
            result[v] = d;
        });
    })).then(function () {
        return isFunction(callback) ? callback(result) : result;
    });
}

function catchAsync(promise) {
    return promise.catch(noop);
}

function setPromiseTimeout(promise, ms, resolveWhenTimeout) {
    return new shim_Promise(function (resolve, reject) {
        promise.then(resolve, reject);
        setTimeout(function () {
            (resolveWhenTimeout ? resolve : reject)('timeout');
        }, ms);
    });
}


/* --------------------------------------
 * Property and prototype
 * -------------------------------------- */

function util_hasOwnProperty(obj, prop) {
    return hasOwnPropertyImpl.call(obj, prop);
}

function getOwnPropertyDescriptors(obj) {
    var props = {};
    each(getOwnPropertyNames(obj || {}), function (i, v) {
        props[v] = getOwnPropertyDescriptor(obj, v);
    });
    return props;
}

function define(o, p) {
    o = extend(function () { }, { prototype: o });
    definePrototype(o, p);
}

function defineOwnProperty(obj, name, value, readonly) {
    Object.defineProperty(obj, name, {
        configurable: true,
        enumerable: true,
        writable: !readonly,
        value: value
    });
}

function defineGetterProperty(obj, name, get, set) {
    defineProperty(obj, name, {
        configurable: true,
        enumerable: true,
        get: get,
        set: set
    });
}

function defineHiddenProperty(obj, name, value, readonly) {
    defineProperty(obj, name, {
        configurable: true,
        enumerable: false,
        writable: !readonly,
        value: value
    });
}

function definePrototype(fn, prototype) {
    each(getOwnPropertyDescriptors(prototype), function (i, v) {
        v.enumerable = !isFunction(v.value);
        defineProperty(fn.prototype, i, v);
    });
}

function inherit(proto, props) {
    var obj = Object.create(isFunction(proto) ? proto.prototype : proto || Object.prototype);
    each(getOwnPropertyDescriptors(props), function (i, v) {
        defineProperty(obj, i, v);
    });
    return obj;
}

function deepFreeze(obj) {
    freeze(obj);
    getOwnPropertyNames(obj).forEach(function (v) {
        var value = obj[v];
        if (value && typeof value === 'object') {
            deepFreeze(value);
        }
    });
    return obj;
}


/* --------------------------------------
 * Observable
 * -------------------------------------- */

function getObservableState(obj, sync) {
    var cache = watchStore || (watchStore = createPrivateStore());
    return cache(obj) || cache(obj, {
        sync: !!sync,
        values: {},
        oldValues: {},
        newValues: {},
        alias: {},
        handlers: [],
        handleChanges: function (callback) {
            var self = cache(obj);
            try {
                self.lock = true;
                do {
                    var oldValues = self.oldValues;
                    var newValues = self.newValues;
                    if (isFunction(callback)) {
                        callback();
                    }
                    if (getOwnPropertyNames(oldValues)[0]) {
                        for (var i in oldValues) {
                            if (oldValues[i] === newValues[i]) {
                                delete oldValues[i];
                                delete newValues[i];
                            }
                        }
                        self.oldValues = {};
                        self.newValues = {};
                        self.handlers.slice(0).forEach(function (v) {
                            v.call(obj, {
                                oldValues: oldValues,
                                newValues: newValues
                            });
                        });
                    }
                } while (self.sync && getOwnPropertyNames(self.oldValues)[0]);
            } finally {
                self.lock = false;
            }
        }
    });
}

function defineAliasProperty(obj, prop, target, targetProp) {
    var desc = getOwnPropertyDescriptor(obj, prop);
    if (!desc ? prop in obj : desc.get || desc.set) {
        throw new Error('Cannot create alias property');
    }
    targetProp = targetProp || prop;
    defineGetterProperty(obj, prop, function () {
        return target[targetProp];
    }, function (value) {
        target[targetProp] = value;
    });
    var state = getObservableState(obj);
    state.alias[prop] = getObservableState(target).alias[targetProp] || [target, targetProp];
}

function defineObservableProperty(obj, prop, initialValue) {
    var state = getObservableState(obj);
    var alias = state.alias[prop];
    if (alias) {
        return defineObservableProperty(alias[0], alias[1], initialValue);
    }
    if (!(prop in state.values)) {
        var desc = getOwnPropertyDescriptor(obj, prop);
        if (!desc ? prop in obj : desc.get || desc.set) {
            throw new Error('Only own data property can be observed');
        }
        var setter = function (value) {
            var state = getObservableState(this);
            if (value !== state.values[prop]) {
                if (!(prop in state.oldValues)) {
                    state.oldValues[prop] = state.values[prop];
                }
                state.values[prop] = value;
                state.newValues[prop] = value;
                if (!state.sync) {
                    setTimeoutOnce(state.handleChanges);
                } else if (!state.lock) {
                    state.handleChanges();
                }
            }
        };
        state.values[prop] = prop in obj ? obj[prop] : initialValue;
        defineGetterProperty(obj, prop, function () {
            var state = getObservableState(this);
            return state.values[prop];
        }, initialValue !== undefined ? undefined : setter);
        return setter.bind(obj);
    }
}

function watch(obj, prop, handler, fireInit) {
    if (prop === true) {
        var state = getObservableState(obj, true);
        return state.handleChanges;
    }
    if (isFunction(prop)) {
        getObservableState(obj).handlers.push(prop);
    } else {
        defineObservableProperty(obj, prop);
        if (isFunction(handler)) {
            var alias = getObservableState(obj).alias[prop] || [obj, prop];
            var handlers = getObservableState(alias[0]).handlers;
            handlers.push(function (e) {
                if (alias[1] in e.newValues) {
                    handler.call(obj, e.newValues[alias[1]], e.oldValues[alias[1]], prop, obj);
                }
            });
            if (fireInit) {
                handler.call(obj, obj[prop], null, prop, obj);
            }
        }
    }
}

function watchOnce(obj, prop, handler) {
    defineObservableProperty(obj, prop);
    return new shim_Promise(function (resolve) {
        var alias = getObservableState(obj).alias[prop] || [obj, prop];
        var handlers = getObservableState(alias[0]).handlers;
        handlers.push(function fn(e) {
            if (alias[1] in e.newValues) {
                var value = e.newValues[alias[1]];
                var returnValue;
                handlers.splice(handlers.indexOf(fn), 1);
                if (isFunction(handler)) {
                    returnValue = handler(value);
                }
                resolve(returnValue === undefined ? value : returnValue);
            }
        });
    });
}

function watchable(obj) {
    obj = obj || {};
    define(obj, {
        watch: function (prop, handler, fireInit) {
            watch(this, prop, handler, fireInit);
        },
        watchOnce: function (prop, handler) {
            return watchOnce(this, prop, handler);
        }
    });
    return obj;
}



// CONCATENATED MODULE: ./src/domUtil.js




const domUtil_root = document.documentElement;
const selection = window.getSelection();
// @ts-ignore: non-standard member
const elementsFromPoint = document.msElementsFromPoint || document.elementsFromPoint;
const compareDocumentPositionImpl = document.compareDocumentPosition;
const compareBoundaryPointsImpl = Range.prototype.compareBoundaryPoints;

var originDiv;

/* --------------------------------------
 * Custom class
 * -------------------------------------- */

function Rect(l, t, r, b) {
    var self = this;
    self.left = l;
    self.top = t;
    self.right = r;
    self.bottom = b;
}

definePrototype(Rect, {
    get width() {
        return this.right - this.left;
    },
    get height() {
        return this.bottom - this.top;
    },
    get centerX() {
        return (this.left + this.right) / 2;
    },
    get centerY() {
        return (this.top + this.bottom) / 2;
    },
    collapse: function (side, offset) {
        var rect = this;
        var pos = rect[side] + (offset || 0);
        return side === 'left' || side === 'right' ? toPlainRect(pos, rect.top, pos, rect.bottom) : toPlainRect(rect.left, pos, rect.right, pos);
    },
    translate: function (x, y) {
        var self = this;
        return toPlainRect(self.left + x, self.top + y, self.right + x, self.bottom + y);
    }
});

const domUtil_MutationObserver = window.MutationObserver || (function () {
    function MutationObserver(handler) {
        var self = this;
        this.records = [];
        this.handler = function () {
            handler(self.takeRecords(), self);
        };
        throwNotFunction(handler);
    }
    MutationObserver.prototype = {
        observe: function (element, init) {
            var self = this;
            bind(element, 'DOMNodeInserted DOMNodeRemoved DOMAttrModified DOMCharacterDataModified', function (e) {
                var type = e.type.charAt(7);
                var oldValue = e.prevValue;
                var record = {};
                record.addedNodes = [];
                record.removedNodes = [];
                if (type === 'M') {
                    record.type = 'attributes';
                    record.target = e.target;
                    record.attributeName = e.attrName;
                    if (init.attributeOldValue) {
                        record.oldValue = oldValue;
                    }
                } else if (type === 'a') {
                    record.type = 'characterData';
                    record.target = e.target;
                    if (init.characterDataOldValue) {
                        record.oldValue = oldValue;
                    }
                } else {
                    record.type = 'childList';
                    record.target = e.target.parentNode;
                    record[type === 'I' ? 'addedNodes' : 'removedNodes'][0] = e.target;
                }
                var shouldIgnore = any(self.records, function (v) {
                    return v.type === 'childList' && v.addedNodes.some(function (v) {
                        return containsOrEquals(v, record.target);
                    });
                });
                if (!shouldIgnore && init[record.type] && (init.subtree || record.target === element)) {
                    self.records[self.records.length] = record;
                    setTimeoutOnce(self.handler);
                }
            });
        },
        takeRecords: function () {
            return this.records.splice(0);
        }
    };
    return MutationObserver;
}());


/* --------------------------------------
 * General helper
 * -------------------------------------- */

function tagName(element) {
    return element && element.tagName && element.tagName.toLowerCase();
}

function is(element, selector) {
    if (!element || !selector) {
        return false;
    }
    // constructors of native DOM objects in Safari refuse to be functions
    // use a fairly accurate but fast checking instead of isFunction
    if (selector.prototype) {
        return element instanceof selector && element;
    }
    if (selector.toFixed) {
        return (element.nodeType & selector) && element;
    }
    return (selector === '*' || tagName(element) === selector || jQuery(element).is(selector)) && element;
}

function sameElementSpec(a, b) {
    if (tagName(a) !== tagName(b)) {
        return false;
    }
    var thisAttr = a.attributes;
    var prevAttr = b.attributes;
    return thisAttr.length === prevAttr.length && !any(thisAttr, function (v) {
        return !prevAttr[v.nodeName] || v.value !== prevAttr[v.nodeName].value;
    });
}

function comparePosition(a, b, strict) {
    if (a === b) {
        return 0;
    }
    var v = a && b && compareDocumentPositionImpl.call(a, b);
    if (v & 2) {
        return (strict && v & 8) || (v & 1) ? NaN : 1;
    }
    if (v & 4) {
        return (strict && v & 16) || (v & 1) ? NaN : -1;
    }
    return NaN;
}

function connected(a, b) {
    return a && b && !(compareDocumentPositionImpl.call(a.commonAncestorContainer || a, b.commonAncestorContainer || b) & 1);
}

function containsOrEquals(container, contained) {
    container = (container || '').element || container;
    contained = (contained || '').element || contained;
    return container === contained || jQuery.contains(container, contained);
}

function isVisible(element) {
    if (!connected(domUtil_root, element)) {
        return false;
    }
    var rect = getRect(element);
    if (!rect.top && !rect.left && !rect.width && !rect.height) {
        for (var cur = element; cur; cur = cur.parentNode) {
            if (getComputedStyle(cur).display === 'none') {
                return false;
            }
        }
    }
    return true;
}

function acceptNode(iterator, node) {
    node = node || iterator.currentNode;
    if (!node || !(iterator.whatToShow & (is(node, Node) ? (1 << (node.nodeType - 1)) : node.nodeType))) {
        return 3;
    }
    return !iterator.filter ? 1 : (iterator.filter.acceptNode || iterator.filter).call(iterator.filter, node);
}

function iterateNode(iterator, callback, from, until) {
    var i = 0;
    iterator.currentNode = from = from || iterator.currentNode;
    callback = callback || noop;
    switch (acceptNode(iterator)) {
        case 2:
            return;
        case 1:
            callback(from, i++);
    }
    for (var cur; (cur = iterator.nextNode()) && (!until || (isFunction(until) ? until(cur) : cur !== until || void callback(cur, i++))); callback(cur, i++));
}

function iterateNodeToArray(iterator, callback, from, until) {
    var result = [];
    iterateNode(iterator, function (v) {
        result[result.length] = v;
    }, from, until);
    return callback ? map(result, callback) : result;
}


/* --------------------------------------
 * Advanced traversal
 * -------------------------------------- */

function getCommonAncestor(a, b) {
    for (b = b || a; a && a !== b && compareDocumentPositionImpl.call(a, b) !== 20; a = a.parentNode);
    return a;
}

function parentsAndSelf(element) {
    if (element === window) {
        return [];
    }
    for (var arr = []; element && element !== document && arr.push(element); element = element.parentNode || element.parent);
    return arr;
}

function selectIncludeSelf(selector, container) {
    container = container || domUtil_root;
    var matched = jQuery.uniqueSort(jQuery(container).find(selector).add(jQuery(container).filter(selector)).get());
    if (matched[0] || container === domUtil_root) {
        return matched;
    }
    return jQuery(container).find(jQuery(selector)).get();
}

function selectClosestRelative(selector, container) {
    container = container || domUtil_root;
    var element = jQuery(selector, container)[0];
    if (!element) {
        var $matched = jQuery(selector);
        for (; container !== domUtil_root && !element; container = container.parentNode) {
            element = $matched.get().filter(function (v) {
                return containsOrEquals(container, v);
            })[0];
        }
    }
    return element;
}


/* --------------------------------------
 * Create
 * -------------------------------------- */

function createDocumentFragment(node) {
    return is(node, DocumentFragment) || jQuery(document.createDocumentFragment()).append(node)[0];
}

function createTextNode(text) {
    return document.createTextNode(text || '\u200b');
}

function createElement(name) {
    return document.createElement(name);
}

function createNodeIterator(root, whatToShow, filter) {
    // @ts-ignore: assume filter is of correct signature
    return document.createNodeIterator(root, whatToShow, isFunction(filter) || null, false);
}


/* --------------------------------------
 * Events
 * -------------------------------------- */

function addOrRemoveEventListener(method, element, event, listener, useCapture) {
    if (isPlainObject(event)) {
        each(event, function (i, v) {
            element[method](i, v, listener);
        });
    } else if (typeof event === 'string') {
        each(event.split(' '), function (i, v) {
            element[method](v, listener, useCapture);
        });
    }
}

function bind(element, event, listener, useCapture) {
    addOrRemoveEventListener('addEventListener', element, event, listener, useCapture);
    return function () {
        unbind(element, event, listener);
    };
}

function unbind(element, event, listener) {
    addOrRemoveEventListener('removeEventListener', element, event, listener);
}

function dispatchDOMMouseEvent(eventName, point, e) {
    if (typeof eventName !== 'string') {
        e = eventName;
        eventName = e.type;
    }
    var target = point ? elementFromPoint(point.clientX, point.clientY) || domUtil_root : e.target;
    var event = document.createEvent('MouseEvent');
    point = point || e;
    event.initMouseEvent(eventName, e.bubbles, e.cancelable, e.view, e.detail, point.screenX, point.screenY, point.clientX, point.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
    return target.dispatchEvent(event);
}


/* --------------------------------------
 * DOM manip
 * -------------------------------------- */

function removeNode(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

function getClass(element, className) {
    var re = new RegExp('(?:^|\\s+)' + className + '(?:-(\\S+)|\\b)', 'ig');
    var t = [false];
    (element.className || '').replace(re, function (v, a) {
        t[a ? t.length : 0] = a || true;
    });
    return t[1] ? t.slice(1) : t[0];
}

function setClass(element, className, values) {
    var value = element.className || '';
    each(isPlainObject(className) || kv(className, values), function (i, v) {
        var re = new RegExp('(^|\\s)\\s*' + i + '(?:-(\\S+)|\\b)|\\s*$', 'ig');
        var replaced = 0;
        if (isPlainObject(v)) {
            v = map(v, function (v, i) {
                return v ? i : null;
            });
        }
        value = value.replace(re, function () {
            return replaced++ || !v || v.length === 0 ? '' : (' ' + i + (v[0] ? [''].concat(v).join(' ' + i + '-') : ''));
        });
    });
    element.className = value;
}

function getScrollOffset(winOrElm) {
    return {
        x: winOrElm.pageXOffset || winOrElm.scrollLeft || 0,
        y: winOrElm.pageYOffset || winOrElm.scrollTop || 0
    };
}

function scrollBy(element, x, y) {
    var winOrElm = element === domUtil_root || element === document.body ? window : element;
    var orig = getScrollOffset(winOrElm);
    if (winOrElm.scrollBy) {
        winOrElm.scrollBy(x, y);
    } else {
        winOrElm.scrollLeft = orig.x + x;
        winOrElm.scrollTop = orig.y + y;
    }
    var cur = getScrollOffset(winOrElm);
    return {
        x: cur.x - orig.x,
        y: cur.y - orig.y
    };
}


/* --------------------------------------
 * Range and rect
 * -------------------------------------- */

function createRange(startNode, startOffset, endNode, endOffset) {
    if (startNode && isFunction(startNode.getRange)) {
        return startNode.getRange();
    }
    var range;
    if (is(startNode, Node)) {
        range = document.createRange();
        if (+startOffset !== startOffset) {
            range[(startOffset === 'contents' || !startNode.parentNode) ? 'selectNodeContents' : 'selectNode'](startNode);
            if (typeof startOffset === 'boolean') {
                range.collapse(startOffset);
            }
        } else {
            range.setStart(startNode, getOffset(startNode, startOffset));
        }
        if (is(endNode, Node) && connected(startNode, endNode)) {
            range.setEnd(endNode, getOffset(endNode, endOffset));
        }
    } else if (is(startNode, Range)) {
        range = startNode.cloneRange();
        if (!range.collapsed && typeof startOffset === 'boolean') {
            range.collapse(startOffset);
        }
    }
    if (is(startOffset, Range) && connected(range, startOffset)) {
        var inverse = range.collapsed && startOffset.collapsed ? -1 : 1;
        if (compareBoundaryPointsImpl.call(range, 0, startOffset) * inverse < 0) {
            range.setStart(startOffset.startContainer, startOffset.startOffset);
        }
        if (compareBoundaryPointsImpl.call(range, 2, startOffset) * inverse > 0) {
            range.setEnd(startOffset.endContainer, startOffset.endOffset);
        }
    }
    return range;
}

function rangeIntersects(a, b) {
    a = is(a, Range) || createRange(a);
    b = is(b, Range) || createRange(b);
    return connected(a, b) && compareBoundaryPointsImpl.call(a, 3, b) <= 0 && compareBoundaryPointsImpl.call(a, 1, b) >= 0;
}

function rangeCovers(a, b) {
    a = is(a, Range) || createRange(a);
    b = is(b, Range) || createRange(b);
    return connected(a, b) && compareBoundaryPointsImpl.call(a, 0, b) <= 0 && compareBoundaryPointsImpl.call(a, 2, b) >= 0;
}

function rangeEquals(a, b) {
    a = is(a, Range) || createRange(a);
    b = is(b, Range) || createRange(b);
    return connected(a, b) && compareBoundaryPointsImpl.call(a, 0, b) === 0 && compareBoundaryPointsImpl.call(a, 2, b) === 0;
}

function compareRangePosition(a, b, strict) {
    a = is(a, Range) || createRange(a);
    b = is(b, Range) || createRange(b);
    var value = !connected(a, b) ? NaN : compareBoundaryPointsImpl.call(a, 0, b) + compareBoundaryPointsImpl.call(a, 2, b);
    return (strict && ((value !== 0 && rangeIntersects(a, b)) || (value === 0 && !rangeEquals(a, b)))) ? NaN : value && value / Math.abs(value);
}

function makeSelection(b, e) {
    if (!selection) {
        return;
    }
    // for newer browsers that supports setBaseAndExtent
    // avoid undesirable effects when direction of editor's selection direction does not match native one
    if (selection.setBaseAndExtent && is(e, Range)) {
        selection.setBaseAndExtent(b.startContainer, b.startOffset, e.startContainer, e.startOffset);
        return;
    }

    var range = createRange(b, e);
    try {
        selection.removeAllRanges();
    } catch (e) {
        // IE fails to clear ranges by removeAllRanges() in occasions mentioned in
        // http://stackoverflow.com/questions/22914075
        // @ts-ignore: non-standard member
        var r = document.body.createTextRange();
        r.collapse();
        r.select();
        selection.removeAllRanges();
    }
    try {
        selection.addRange(range);
    } catch (e) {
        // IE may throws unspecified error even though the selection is successfully moved to the given range
        // if the range is not successfully selected retry after selecting other range
        if (!selection.rangeCount) {
            selection.addRange(createRange(document.body));
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}

function getRect(elm, includeMargin) {
    var rect;
    elm = elm || domUtil_root;
    if (elm.getRect) {
        return elm.getRect();
    }
    elm = elm.element || elm;
    if (elm === domUtil_root || elm === window) {
        var div = originDiv || (originDiv = jQuery('<div style="position:fixed; top:0; left:0;">')[0]);
        if (!containsOrEquals(document.body, div)) {
            document.body.appendChild(div);
        }
        // origin used by CSS, DOMRect and properties like clientX/Y may move away from the top-left corner of the window
        // when virtual keyboard is shown on mobile devices
        var o = getRect(div);
        rect = toPlainRect(0, 0, domUtil_root.offsetWidth, domUtil_root.offsetHeight).translate(o.left, o.top);
    } else if (!containsOrEquals(domUtil_root, elm)) {
        // IE10 throws Unspecified Error for detached elements
        rect = toPlainRect(0, 0, 0, 0);
    } else {
        rect = toPlainRect(elm.getBoundingClientRect());
        if (includeMargin) {
            var style = getComputedStyle(elm);
            rect.top -= Math.max(0, parseFloat(style.marginTop));
            rect.left -= Math.max(0, parseFloat(style.marginLeft));
            rect.right += Math.max(0, parseFloat(style.marginRight));
            rect.bottom += Math.max(0, parseFloat(style.marginBottom));
        }
    }
    return rect;
}

function getOffset(node, offset) {
    var len = node.length || node.childNodes.length;
    return 1 / offset < 0 ? Math.max(0, len + offset) : Math.min(len, offset);
}

function getRects(range) {
    return map((is(range, Range) || createRange(range, 'contents')).getClientRects(), toPlainRect);
}

function toPlainRect(l, t, r, b) {
    function clip(v) {
        // IE provides precision up to 0.05 but with floating point errors that hinder comparisons
        return Math.round(v * 1000) / 1000;
    }
    if (l.top !== undefined) {
        return new Rect(clip(l.left), clip(l.top), clip(l.right), clip(l.bottom));
    }
    if (r === undefined) {
        return new Rect(l, t, l, t);
    }
    return new Rect(l, t, r, b);
}

function rectEquals(a, b) {
    function check(prop) {
        return Math.abs(a[prop] - b[prop]) < 1;
    }
    return check('left') && check('top') && check('bottom') && check('right');
}

function rectCovers(a, b) {
    return b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom;
}

function rectIntersects(a, b) {
    return !(b.right < a.left || b.left > a.right) && !(b.bottom < a.top || b.top > a.bottom);
}

function pointInRect(x, y, rect, within) {
    within = within || 0;
    return rect.width && rect.height && x - rect.left >= -within && x - rect.right <= within && y - rect.top >= -within && y - rect.bottom <= within;
}

function mergeRect(a, b) {
    return toPlainRect(Math.min(a.left, b.left), Math.min(a.top, b.top), Math.max(a.right, b.right), Math.max(a.bottom, b.bottom));
}

function elementFromPoint(x, y, container) {
    container = container || document.body;
    if (elementsFromPoint) {
        return any(elementsFromPoint.call(document, x, y), function (v) {
            return containsOrEquals(container, v) && getComputedStyle(v).pointerEvents !== 'none';
        }) || null;
    }
    var element = document.elementFromPoint(x, y);
    if (!containsOrEquals(container, element) && pointInRect(x, y, getRect(container))) {
        var tmp = [];
        try {
            while (element && comparePosition(container, element, true)) {
                var target = jQuery(element).parentsUntil(getCommonAncestor(container, element)).slice(-1)[0] || element;
                if (target === tmp[tmp.length - 1]) {
                    return null;
                }
                // @ts-ignore: assume we are working with HTMLElement
                target.style.pointerEvents = 'none';
                tmp[tmp.length] = target;
                element = document.elementFromPoint(x, y);
            }
        } finally {
            jQuery(tmp).css('pointer-events', '');
        }
    }
    return containsOrEquals(container, element) ? element : null;
}




// CONCATENATED MODULE: ./src/cssUtil.js



function parseCSS(value) {
    var styles = {};
    var div = document.createElement('div');
    div.setAttribute('style', value);
    each(div.style, function (i, v) {
        styles[v] = div.style[v];
    });
    return styles;
}

function isCssUrlValue(value) {
    return value && value !== 'none' && /url\((?:'(.+)'|"(.+)"|([^)]+))\)/.test(value) && (RegExp.$1 || RegExp.$2 || RegExp.$3);
}

function styleToJSON(style) {
    var t = {};
    each(style, function (i, v) {
        t[v] = style[v];
    });
    return t;
}

function animatableValue(v, allowNumber) {
    return /\b(?:[+-]?(\d+(?:\.\d+)?)(px|%)?|#[0-9a-f]{3,}|(rgba?|hsla?|matrix|calc)\(.+\))\b/.test(v) && (allowNumber || !RegExp.$1 || RegExp.$2);
}

function removeVendorPrefix(name) {
    return name.replace(/^-(webkit|moz|ms|o)-/, '');
}

function runCSSTransition(element, className, callback) {
    if (getClass(element, className)) {
        return reject();
    }
    callback = callback || noop;
    if (callback === true) {
        callback = setClass.bind(null, element, className, false);
    }
    setClass(element, className, true);
    var arr = [];
    var map1 = new Map();
    var test = function (element, pseudoElement) {
        var style = getComputedStyle(element, pseudoElement);
        if (style.transitionDuration !== '0s' || style.animationName != 'none') {
            var key = { element: element, pseudoElement: pseudoElement };
            map1.set(key, style.transitionProperty.split(/,\s*/));
            arr.push(key);
        }
    };
    iterateNode(createNodeIterator(element, 1, function (v) {
        if (!isVisible(v)) {
            return 2;
        }
        test(v, null);
        test(v, '::before');
        test(v, '::after');
    }));
    if (!arr[0]) {
        callback();
        return resolve();
    }

    var targets = arr.map(function (v) {
        return v.element;
    });
    setClass(element, className, false);
    $(targets).css('transition', 'none');
    setClass(element, className, true);
    var newStyle = arr.map(function (v) {
        return styleToJSON(getComputedStyle(v.element, v.pseudoElement));
    });
    setClass(element, className, false);

    var appendPseudoToAnim = window.AnimationEvent && 'pseudoElement' in AnimationEvent.prototype;
    var map = new Map();
    each(arr, function (i, v) {
        var pseudoElement = v.pseudoElement;
        var curStyle = getComputedStyle(v.element, pseudoElement);
        var transitionProperties = map1.get(v);
        var dict = {};
        each(curStyle, function (j, v) {
            var curValue = curStyle[v];
            var newValue = newStyle[i][v];
            if (curValue === 'matrix(1, 0, 0, 1, 0, 0)') {
                curValue = 'none';
            }
            if (newValue === 'matrix(1, 0, 0, 1, 0, 0)') {
                newValue = 'none';
            }
            if (curValue !== newValue) {
                var prop = removeVendorPrefix(v);
                var allowNumber = matchWord(v, 'opacity line-height');
                if (prop === 'animation-name') {
                    var prevAnim = curValue.replace(/,/g, '');
                    each(newValue.split(/,\s*/), function (i, v) {
                        if (v !== 'none' && !matchWord(prevAnim, v)) {
                            dict['@' + v + ((appendPseudoToAnim && pseudoElement) || '')] = true;
                        }
                    });
                } else if (prop === 'transform' || (animatableValue(curValue, allowNumber) && animatableValue(newValue, allowNumber) && !/^scroll-limit/.test(prop))) {
                    if (transitionProperties[0] === 'all' || transitionProperties.indexOf(v + (pseudoElement || '')) >= 0) {
                        dict[prop + (pseudoElement || '')] = true;
                    }
                }
            }
        });
        if (keys(dict)[0]) {
            map.set(v.element, dict);
        }
    });
    $(targets).css('transition', '');
    setClass(element, className, true);
    if (!map.size) {
        callback();
        return resolve();
    }

    return new Promise(function (resolve, reject) {
        var unbind = bind(element, 'animationend transitionend', function (e) {
            var dict = map.get(e.target) || {};
            // @ts-ignore: mixed type of Event
            delete dict[(e.propertyName ? removeVendorPrefix(e.propertyName) : '@' + e.animationName) + (e.pseudoElement || '')];
            if (!keys(dict)[0] && map.delete(e.target) && !map.size) {
                unbind();
                if (getClass(element, className)) {
                    callback();
                    resolve(element);
                } else {
                    reject(element);
                }
            }
        });
    });
}



// CONCATENATED MODULE: ./src/events.js




const events_root = document.documentElement;
const containers = new WeakMap();
const domEventTrap = new ZetaContainer();
const domContainer = new ZetaContainer();
const _ = createPrivateStore();

var eventSource;
var lastEventSource;


/* --------------------------------------
 * Helper functions
 * -------------------------------------- */

/** @type {Zeta.ZetaComponentConstructor} */
function ZetaComponent() {
    this.states = {};
}

function ZetaEventHandlerState(element, context, handlers) {
    var self = this;
    var copy = {};
    each(handlers, function (i, v) {
        if (isFunction(v)) {
            copy[i] = v;
        }
    });
    self.element = element;
    self.context = context;
    self.handlers = copy;
}

function ZetaEventSource(target, path) {
    var self = this;
    path = path || (eventSource ? eventSource.path : src_dom.focusedElements);
    self.path = path;
    self.source = 'script';
    if (containsOrEquals(path[0] || events_root, target) || path.indexOf(target) >= 0) {
        self.source = eventSource ? eventSource.source : getEventSourceName();
    }
    self.sourceKeyName = self.source !== 'keyboard' ? null : (eventSource || lastEventSource || '').sourceKeyName;
}

function setLastEventSource(source) {
    lastEventSource = new ZetaEventSource(source);
}

function prepEventSource(promise) {
    var source = eventSource || new ZetaEventSource(dom.activeElement);
    var wrap = function (callback) {
        return function () {
            var prev = eventSource;
            try {
                eventSource = source;
                return callback.apply(this, arguments);
            } finally {
                eventSource = prev;
            }
        };
    };
    return {
        then: function (a, b) {
            return promise.then(a && wrap(a), b && wrap(b));
        },
        catch: function (a) {
            return promise.catch(a && wrap(a));
        }
    };
}

function getEventSource(element) {
    return element ? new ZetaEventSource(element).source : getEventSourceName();
}

function getEventSourceName() {
    var event = src_dom.event || window.event;
    var type = (event && event.type) || '';
    return type[0] === 'k' || type.substr(0, 3) === 'com' ? 'keyboard' : type[0] === 't' ? 'touch' : type[0] === 'm' || matchWord(type, 'wheel click dblclick contextmenu') ? 'mouse' : matchWord(type, 'drop cut copy paste') || 'script';
}

function getContainer(element, exact) {
    if (exact) {
        return mapGet(containers, element);
    }
    for (var cur = element; cur && !containers.has(cur); cur = cur.parentNode);
    return mapGet(containers, cur) || domContainer;
}

function emitEvent(eventName, container, target, data, bubbles) {
    var event = is(eventName, ZetaEvent) ? _(eventName) : new ZetaEventEmitter(eventName, container, target, data, null, bubbles);
    return event.emit(container, null, target, bubbles);
}

function emitDOMEvent(eventName, nativeEvent, target, data, bubbles, source) {
    var event = new ZetaEventEmitter(eventName, domContainer, target, data, nativeEvent, bubbles, source);
    return event.emit(domEventTrap, 'tap', getContainer(target).element, false) || event.emit();
}

function listenDOMEvent(element, event, handler) {
    if (!is(element, Node)) {
        handler = event;
        event = element;
        element = events_root;
    }
    domContainer.setContext(element, element);
    domContainer.add(element, isPlainObject(event) || kv(event, handler));
}


/* --------------------------------------
 * ZetaEventEmitter
 * -------------------------------------- */

function ZetaEventEmitter(eventName, container, target, data, originalEvent, bubbles, source) {
    target = target || container.element;
    source = source || new ZetaEventSource(target);
    var properties = {
        source: source.source,
        sourceKeyName: source.sourceKeyName,
        timestamp: performance.now(),
        originalEvent: originalEvent || null
    };
    extend(this, {
        container: container,
        eventName: eventName,
        target: target,
        data: data,
        bubbles: bubbles,
        properties: properties,
        sourceObj: source
    }, properties);
}

definePrototype(ZetaEventEmitter, {
    emit: function (container, eventName, target, bubbles) {
        var self = this;
        container = container || self.container;
        bubbles = bubbles === undefined ? self.bubbles : bubbles;

        var callHandler = function (state, handlerName, eventName, data) {
            if (handlerName === 'init' || handlerName === 'destroy') {
                // prevent init and destroy event from called consecutively twice
                if (state.lastEvent === handlerName) {
                    return false;
                }
                state.lastEvent = handlerName;
            }
            if (matchWord(handlerName || eventName, 'keystroke gesture') && callHandler(state, null, data.data, null)) {
                return self.handled;
            }
            var handler = state.handlers[handlerName || eventName];
            if (!handler) {
                return false;
            }
            var contextContainer = is(state.context, ZetaContainer) || container;
            var event = new ZetaEvent(self, eventName, state, data === undefined ? containerRemoveAsyncEvent(container, eventName, state) : data);
            var prevEventSource = eventSource;
            var prevEvent = contextContainer.event;
            contextContainer.event = event;
            eventSource = self.sourceObj;
            try {
                var returnValue = handler.call(event.context, event, event.context);
                if (returnValue !== undefined) {
                    // @ts-ignore: type inference issue
                    self.handled = resolve(returnValue);
                }
            } catch (e) {
                console.error(e);
                // @ts-ignore: type inference issue
                self.handled = reject(e);
            }
            eventSource = prevEventSource;
            contextContainer.event = prevEvent;
            return self.handled;
        };
        if (is(target, ZetaEventHandlerState)) {
            return callHandler(target, eventName, self.eventName, self.data);
        }
        // find the nearest ancestor that has widget or context set
        var context = container.getContext(target || self.target);
        return single((bubbles ? parentsAndSelf : makeArray)(context), function (v) {
            var component = container.components.get(v.element || v);
            return component && single(component.states, function (v) {
                return callHandler(v, eventName, self.eventName, self.data);
            });
        });
    }
});


/* --------------------------------------
 * ZetaEvent
 * -------------------------------------- */

function ZetaEvent(event, eventName, state, data) {
    var self = extend(this, event.properties);
    self.eventName = eventName;
    self.type = eventName;
    self.context = state.context;
    self.target = containsOrEquals(event.target, state.element) ? state.element : event.target;
    self.data = null;
    if (isPlainObject(data)) {
        extend(self, data);
    } else if (data !== undefined) {
        self.data = data;
    }
    _(self, event);
}

definePrototype(ZetaEvent, {
    handled: function (promise) {
        var event = _(this);
        if (!event.handled) {
            event.handled = resolve(promise);
        }
    },
    isHandled: function () {
        return !!_(this).handled;
    },
    preventDefault: function () {
        var event = this.originalEvent;
        if (event) {
            event.preventDefault();
        } else {
            _(this).defaultPrevented = true;
        }
    },
    isDefaultPrevented: function () {
        return !!(this.originalEvent || _(this)).defaultPrevented;
    }
});


/* --------------------------------------
 * ZetaContainer
 * -------------------------------------- */

function ZetaContainer(element, context) {
    var self = this;
    if (element) {
        containers.set(element, self);
    }
    self.element = element || events_root;
    self.context = context || null;
    self.components = new Map();
    self.asyncEvents = new Map();
    self.autoDestroy = containsOrEquals(events_root, element);
    if (element) {
        containers.set(element, self);
    }
}

definePrototype(ZetaContainer, {
    event: null,
    tap: function (handler) {
        domEventTrap.setContext(this.element, this);
        domEventTrap.add(this.element, {
            tap: handler
        });
    },
    getContext: function (element) {
        return (containerGetContext(this, element) || '').context;
    },
    setContext: function (element, context) {
        containerSetContext(this, element, context);
        if (this !== domEventTrap && is(element, Node)) {
            containers.set(element, this);
        }
    },
    add: function (element, key, handlers) {
        if (typeof key !== 'string') {
            handlers = key;
            key = randomId();
        }
        var self = this;
        var target = is(element, Node) || element.element || element;
        var component = is(target, Node) ? containerGetContext(self, target) : containerSetContext(self, element, element);
        if (component) {
            var state = component.states[key] || new ZetaEventHandlerState(target, is(element, Node) ? component.context : element, handlers);
            component.attached = true;
            component.states[key] = state;
            containerRegisterWidgetEvent(self, state, true);
        }
    },
    delete: function (element, key) {
        var self = this;
        var component = mapGet(self.components, element);
        if (component) {
            if (key) {
                var state = component.states[key];
                if (state) {
                    delete component.states[key];
                    containerRegisterWidgetEvent(self, state, false);
                }
            } else {
                component.attached = false;
                each(component.states, function (i, v) {
                    containerRegisterWidgetEvent(self, v, false);
                });
            }
        }
    },
    observe: function (callback, options) {
        return containerCreateObserver(this, callback, options);
    },
    emit: function (eventName, target, data, bubbles) {
        return emitEvent(eventName, this, data, target, bubbles);
    },
    emitAsync: function (event, target, data, bubbles, mergeData) {
        containerRegisterAsyncEvent(this, event, target || this.element, data, bubbles, mergeData);
    },
    flushEvents: function () {
        containerEmitAsyncEvents(this);
    },
    destroy: function () {
        var self = this;
        domEventTrap.delete(self.element);
        containers.delete(self.element);
        each(self.components, function (i, v) {
            containers.delete(i);
            self.emit('destroy', i);
        });
    }
});


function containerEmitAsyncEvents(inst) {
    inst.timeout = null;
    while (inst.asyncEvents.size) {
        var map = inst.asyncEvents;
        inst.asyncEvents = new Map();
        each(map, function (i, v) {
            each(v, function (j, v) {
                if (!isPlainObject(i) || i.handlers[j]) {
                    v.emit(null, null, i);
                }
            });
        });
        each(map, function (i, v) {
            var obj = mapGet(inst.components, i.element || i);
            if (obj && !obj.attached) {
                inst.components.delete(i.element || i);
            }
        });
    }
}

function containerRemoveAsyncEvent(inst, eventName, target) {
    var obj = mapGet(inst.asyncEvents, target);
    if (obj && obj[eventName]) {
        var data = obj[eventName].data;
        delete obj[eventName];
        return data || {
            data: data
        };
    }
}

function containerRegisterAsyncEvent(inst, eventName, target, data, bubbles, mergeData) {
    var obj = mapGet(inst.asyncEvents, target, Object);
    obj[eventName] = new ZetaEventEmitter(eventName, inst, target.element || target, mergeData && obj[eventName] ? mergeData(obj[eventName].data, data) : data, null, bubbles);
    inst.timeout = inst.timeout || setTimeout(containerEmitAsyncEvents, 0, inst);
}

function containerRegisterWidgetEvent(container, state, isInit) {
    var event = ['destroy', 'init'];
    if (state.attached ^ isInit && !containerRemoveAsyncEvent(container, event[+!isInit], state)) {
        containerRegisterAsyncEvent(container, event[+isInit], state);
    }
    state.attached = isInit;
}

function containerValidTarget(container, element) {
    return container === domEventTrap || (containers.get(element) || container) === container;
}

function containerCreateObserver(container, callback, options) {
    function handleMutations(mutations) {
        var changes = [];
        var orphans = new Map();
        each(mutations, function (i, v) {
            // filter out changes due to sizzle engine
            // to prevent excessive invocation due to querying elements through jQuery
            if (v.attributeName !== 'id' || ((v.oldValue || '').slice(0, 6) !== 'sizzle' && (v.target.id !== (v.oldValue || '')))) {
                if (!containsOrEquals(container.element, v.target)) {
                    mapGet(orphans, v.target, Array).push(v);
                } else if (containerValidTarget(container, v.target)) {
                    each(v.removedNodes, function (i, v) {
                        if (orphans.has(v)) {
                            changes.push.apply(changes, orphans.get(v));
                        }
                    });
                    changes.push(v);
                }
            }
        });
        changes = changes.filter(function (v) {
            return options[v.type];
        });
        if (changes[0]) {
            callback(changes);
        }
    }

    var moptions = extend({}, options);
    moptions.subtree = true;
    moptions.childList = true;
    moptions.attributeOldValue |= options.attributes;

    var observer = new MutationObserver(handleMutations);
    observer.observe(container.element, moptions);
    return function () {
        handleMutations(observer.takeRecords());
    };
}

function containerGetContext(inst, element) {
    var component;
    for (var cur = element; cur && !component; cur = cur.parentNode) {
        component = inst.components.get(cur);
    }
    return component || null;
}

function containerSetContext(inst, element, context) {
    var cur = mapGet(inst.components, element, ZetaComponent);
    // @ts-ignore: undeclared property added to ZetaComponent
    if ((cur.context || context) !== context) {
        throw new Error('Element has already been set to another context');
    }
    // @ts-ignore: undeclared property added to ZetaComponent
    cur.element = element;
    // @ts-ignore: undeclared property added to ZetaComponent
    cur.context = context;
    return cur;
}



// CONCATENATED MODULE: ./src/domLock.js





const lockedElements = new shim_WeakMap();
const handledErrors = new shim_WeakMap();
const domLock_ = createPrivateStore();

function retryable(fn, done) {
    var promise;
    return function () {
        return promise || (promise = resolve(fn()).then(done, function () {
            // user has rejected the cancellation
            // remove the promise object so that user will be prompted again
            promise = null;
            return reject('user_cancelled');
        }));
    };
}

function lock(element, promise, oncancel) {
    var lock = lockedElements.get(element) || new DOMLock(element);
    return promise ? lock.wait(promise, oncancel) : resolve();
}

function locked(element, parents) {
    return !!any(parents ? parentsAndSelf(element) : [element], function (v) {
        return (lockedElements.get(v) || '').locked;
    });
}

function cancelLock(element, force) {
    var lock = lockedElements.get(element);
    return lock ? lock.cancel(force) : resolve();
}

function removeLock(element) {
    var lock = mapRemove(lockedElements, element);
    if (lock) {
        lock.cancel(true);
    }
}

function DOMLock(element) {
    this.element = element;
    lockedElements.set(element, this);
    domLock_(this, { promises: new shim_Map() });
}

definePrototype(DOMLock, {
    get locked() {
        return domLock_(this).promises.size > 0;
    },
    cancel: function (force) {
        var self = this;
        var state = domLock_(self);
        var promises = state.promises;
        if (force || !promises.size) {
            if (promises.size) {
                // @ts-ignore: unable to reflect on interface member
                emitDOMEvent('cancelled', null, self.element);
            }
            // remove all promises from the dictionary so that
            // filtered promise from lock.wait() will be rejected by cancellation
            promises.clear();
            state.handler = null;
            if (state.deferred) {
                state.deferred.resolve();
            }
            return resolve();
        }
        return (state.handler || (state.handler = retryable(function () {
            // request user cancellation for each async task in sequence
            return makeArray(promises).reduce(function (a, v) {
                return a.then(v);
            }, resolve()).then(function () {
                // @ts-ignore: unable to reflect on interface member
                self.cancel(true);
            });
        })))();
    },
    wait: function (promise, oncancel) {
        var self = this;
        var state = domLock_(self);
        var promises = state.promises;
        var finish = function () {
            if (promises.delete(promise) && !promises.size) {
                emitDOMEvent('asyncEnd', null, self.element);
                self.cancel(true);
            }
        };
        promises.set(promise, retryable(oncancel === true ? resolve : oncancel || reject, finish));
        if (promises.size === 1) {
            var callback = {};
            var deferred = new shim_Promise(function (resolve, reject) {
                callback.resolve = resolve;
                callback.reject = reject;
            });
            state.deferred = extend(deferred, callback);
            for (var parent = self.element.parentNode; parent && !lockedElements.has(parent); parent = parent.parentNode);
            if (parent) {
                lockedElements.get(parent).wait(deferred, self.cancel.bind(self));
            }
            emitDOMEvent('asyncStart', null, self.element);
        }
        promise.catch(function (error) {
            if (error && !handledErrors.has(error)) {
                emitDOMEvent('error', null, self.element, {
                    error: error
                }, true);
                // avoid firing error event for the same error for multiple target
                // while propagating through the promise chain
                if (typeof error === 'object') {
                    handledErrors.set(error, true);
                }
            }
            finish();
        });
        return promise.then(function (value) {
            var cancelled = !promises.has(promise);
            finish();
            // the returned promise will be rejected
            // if the current lock has been released or cancelled
            return cancelled ? reject('user_cancelled') : value;
        });
    }
});

lock(document);
window.onbeforeunload = function (e) {
    if (locked(document)) {
        e.returnValue = '';
        e.preventDefault();
    }
};



// CONCATENATED MODULE: ./src/dom.js







const KEYNAMES = JSON.parse('{"8":"backspace","9":"tab","13":"enter","16":"shift","17":"ctrl","18":"alt","19":"pause","20":"capsLock","27":"escape","32":"space","33":"pageUp","34":"pageDown","35":"end","36":"home","37":"leftArrow","38":"upArrow","39":"rightArrow","40":"downArrow","45":"insert","46":"delete","48":"0","49":"1","50":"2","51":"3","52":"4","53":"5","54":"6","55":"7","56":"8","57":"9","65":"a","66":"b","67":"c","68":"d","69":"e","70":"f","71":"g","72":"h","73":"i","74":"j","75":"k","76":"l","77":"m","78":"n","79":"o","80":"p","81":"q","82":"r","83":"s","84":"t","85":"u","86":"v","87":"w","88":"x","89":"y","90":"z","91":"leftWindow","92":"rightWindowKey","93":"select","96":"numpad0","97":"numpad1","98":"numpad2","99":"numpad3","100":"numpad4","101":"numpad5","102":"numpad6","103":"numpad7","104":"numpad8","105":"numpad9","106":"multiply","107":"add","109":"subtract","110":"decimalPoint","111":"divide","112":"f1","113":"f2","114":"f3","115":"f4","116":"f5","117":"f6","118":"f7","119":"f8","120":"f9","121":"f10","122":"f11","123":"f12","144":"numLock","145":"scrollLock","186":"semiColon","187":"equalSign","188":"comma","189":"dash","190":"period","191":"forwardSlash","192":"backtick","219":"openBracket","220":"backSlash","221":"closeBracket","222":"singleQuote"}');
const SELECTOR_FOCUSABLE = ':input, [contenteditable], a[href], area[href], iframe';
const META_KEYS = [16, 17, 18, 91, 93];
const OFFSET_ZERO = {
    x: 0,
    y: 0
};

const dom_root = document.documentElement;
const dom_selection = window.getSelection();
const focusPath = [];
const focusFriends = new shim_WeakMap();
const focusElements = new Set();
const modalElements = new shim_Map();
const domReady = new shim_Promise(jQuery);

var windowFocusedOut;
var currentEvent;
var scrollbarWidth;


/* --------------------------------------
 * Helper functions
 * -------------------------------------- */

function approxMultipleOf(a, b) {
    return Math.abs(Math.round(a / b) - a / b) < 0.2;
}

function measureLine(p1, p2) {
    var dx = p1.clientX - p2.clientX;
    var dy = p1.clientY - p2.clientY;
    return {
        dx: dx,
        dy: dy,
        deg: Math.atan2(dy, dx) / Math.PI * 180,
        length: Math.sqrt(dx * dx + dy * dy)
    };
}

function textInputAllowed(v) {
    return v.isContentEditable || is(v, 'input,textarea,select');
}

function getScrollParent(element) {
    for (var s; element !== dom_root && (s = getComputedStyle(element)) && s.overflow === 'visible' && matchWord(s.position, 'static relative'); element = element.parentNode);
    return element;
}

function getUnobscuredRect(element) {
    var style = getComputedStyle(element);
    var hasOverflowX = element.offsetWidth < element.scrollWidth;
    var hasOverflowY = element.offsetHeight < element.scrollHeight;
    var parentRect = getRect(element === document.body ? dom_root : element);
    if ((style.overflow !== 'visible' || element === document.body) && (hasOverflowX || hasOverflowY)) {
        if (style.overflowY === 'scroll' || ((style.overflowY !== 'hidden' || element === document.body) && hasOverflowY)) {
            parentRect.right -= scrollbarWidth;
        }
        if (style.overflowX === 'scroll' || ((style.overflowX !== 'hidden' || element === document.body) && hasOverflowX)) {
            parentRect.bottom -= scrollbarWidth;
        }
    }
    return parentRect;
}

function scrollIntoView(element, rect) {
    var parent = getScrollParent(element);
    var parentRect = getUnobscuredRect(parent);
    rect = rect || getRect(element);

    var deltaX = Math.max(0, rect.right - parentRect.right) || Math.min(rect.left - parentRect.left, 0);
    var deltaY = Math.max(0, rect.bottom - parentRect.bottom) || Math.min(rect.top - parentRect.top, 0);
    var result = (deltaX || deltaY) && scrollBy(parent, deltaX, deltaY) || OFFSET_ZERO;
    if (parent !== dom_root) {
        var parentResult = scrollIntoView(parent.parentNode, rect.translate(result.x, result.y));
        if (parentResult) {
            result = {
                x: result.x + parentResult.x,
                y: result.y + parentResult.y
            };
        }
    }
    return (result.x || result.y) ? result : false;
}


/* --------------------------------------
 * Focus management
 * -------------------------------------- */

function focused(element, strict) {
    // @ts-ignore: activeElement is not null
    return element === window ? !windowFocusedOut : focusElements.has(element) && (!strict || containsOrEquals(element, document.activeElement));
}

function focusable(element) {
    var friends = map(parentsAndSelf(element), function (v) {
        return focusFriends.get(v);
    });
    return any(focusPath, function (v) {
        return containsOrEquals(v, element) || friends.indexOf(v) >= 0;
    });
}

function focusLockedWithin(element) {
    return single(modalElements, function (v, i) {
        return jQuery(v).find(element)[0] && i;
    });
}

function triggerFocusEvent(eventName, elements, relatedTarget, source) {
    each(elements, function (i, v) {
        if (getContainer(v, true)) {
            emitDOMEvent(eventName, null, v, {
                relatedTarget: relatedTarget
            }, false, source);
        }
    });
}

function setFocus(element, focusOnInput, source, path) {
    if (focusOnInput && !is(element, SELECTOR_FOCUSABLE)) {
        element = jQuery(SELECTOR_FOCUSABLE, element).filter(':visible:not(:disabled,.disabled)')[0] || element;
    }
    path = path || focusPath;
    if (path[0]) {
        var within = path !== focusPath ? element : focusable(element);
        if (!within) {
            var lockParent = focusLockedWithin(element);
            element = focused(lockParent) ? path[0] : lockParent;
            within = focusable(element);
        }
        if (!within) {
            return false;
        }
        var removed = path.splice(0, path.indexOf(within));
        each(removed, function (i, v) {
            focusElements.delete(v);
        });
        triggerFocusEvent('focusout', removed, element, source);
    }
    // check whether the element is still attached in ROM
    // which can be detached while dispatching focusout event above
    if (containsOrEquals(dom_root, element)) {
        var added = parentsAndSelf(element).filter(function (v) {
            return !focusElements.has(v);
        });
        var friend = map(added, function (v) {
            return focusFriends.get(v);
        })[0];
        if (friend && !focused(friend)) {
            var result = setFocus(friend);
            if (result !== undefined) {
                return result && setFocus(element);
            }
        }
        if (added[0]) {
            path.unshift.apply(path, added);
            each(added, function (i, v) {
                focusElements.add(v);
            });
            triggerFocusEvent('focusin', added, null, source || new ZetaEventSource(added[0], path));
        }
        var activeElement = document.activeElement;
        if (path[0] !== activeElement) {
            path[0].focus();
            // ensure previously focused element is properly blurred
            // in case the new element is not focusable
            if (activeElement && activeElement !== document.body && activeElement !== dom_root && document.activeElement === activeElement) {
                // @ts-ignore: activeElement is HTMLElement
                activeElement.blur();
            }
        }
        return true;
    }
}

function setModal(element, within) {
    var focusWithin = is(within, Node) || dom_root;
    if (!focused(focusWithin)) {
        setFocus(focusWithin);
    }
    modalElements.set(element, focusPath.splice(0, focusWithin === dom_root || document.body ? focusPath.length : focusPath.indexOf(focusWithin)));
    setFocus(element);
}

function retainFocus(a, b) {
    focusFriends.set(b, a);
}

function releaseFocus(b) {
    focusFriends.delete(b);
}


/* --------------------------------------
 * Observe
 * -------------------------------------- */

function watchElements(element, selector, callback) {
    var collection = new Set();
    var observer = new MutationObserver(function (records) {
        var removedNodes = map(records, function (v) {
            return selectIncludeSelf(selector, v.removedNodes);
        });
        var addedNodes = map(records, function (v) {
            return selectIncludeSelf(selector, v.addedNodes);
        });
        addedNodes = addedNodes.filter(function (v) {
            return containsOrEquals(element, v) && !collection.has(v);
        });
        removedNodes = removedNodes.filter(function (v) {
            return !containsOrEquals(element, v);
        });
        addedNodes.forEach(collection.add.bind(collection));
        removedNodes.forEach(collection.delete.bind(collection));
        callback(addedNodes, removedNodes);
    });
    observer.observe(element, {
        subtree: true,
        childList: true
    });
}

/* --------------------------------------
 * DOM event handling
 * -------------------------------------- */


domReady.then(function () {
    var body = document.body;
    var modifierCount;
    var modifiedKeyCode;
    var mouseInitialPoint;
    var mousedownFocus;
    var pressTimeout;
    var imeNode;
    var imeOffset;
    var imeText;
    
    // detect native scrollbar size
    // height being picked because scrollbar may not be shown if container is too short
    var dummy = jQuery('<div style="overflow:scroll;height:80px"><div style="height:100px"></div></div>').appendTo(body)[0];
    scrollbarWidth = getRect(dummy).width - getRect(dummy.children[0]).width;
    removeNode(dummy);

    function getEventName(e, suffix) {
        var mod = ((e.ctrlKey || e.metaKey) ? 'Ctrl' : '') + (e.altKey ? 'Alt' : '') + (e.shiftKey ? 'Shift' : '');
        return mod ? lcfirst(mod + ucfirst(suffix)) : suffix;
    }

    function updateIMEState() {
        var element = document.activeElement || dom_root;
        if ('selectionEnd' in element) {
            imeNode = element;
            // @ts-ignore: guranteed having selectionEnd property
            imeOffset = element.selectionEnd;
        } else {
            // @ts-ignore: selection is not null
            imeNode = dom_selection.anchorNode;
            // @ts-ignore: selection is not null
            imeOffset = dom_selection.anchorOffset;
            if (imeNode && imeNode.nodeType === 1) {
                // IE puts selection at element level
                // however it will insert text in the previous text node
                var child = imeNode.childNodes[imeOffset - 1];
                if (child && child.nodeType === 3) {
                    imeNode = child;
                    // @ts-ignore: child is Text
                    imeOffset = child.length;
                } else {
                    imeNode = imeNode.childNodes[imeOffset];
                    imeOffset = 0;
                }
            }
        }
    }

    function triggerUIEvent(eventName, nativeEvent, elements, data, bubbles) {
        var prev = null;
        return any(makeArray(elements), function (v) {
            var container = getContainer(v);
            if (prev !== container) {
                prev = container;
                if (emitDOMEvent(eventName, nativeEvent, v, data, bubbles)) {
                    return true;
                }
                if (data.char && textInputAllowed(v)) {
                    return emitDOMEvent('textInput', nativeEvent, v, data.char, true);
                }
            }
        });
    }

    function triggerKeystrokeEvent(keyName, char, nativeEvent) {
        var data = {
            data: keyName,
            char: char
        };
        lastEventSource.sourceKeyName = keyName;
        if (triggerUIEvent('keystroke', nativeEvent, focusPath, data, true)) {
            nativeEvent.preventDefault();
            return true;
        }
    }

    function triggerMouseEvent(eventName, nativeEvent) {
        var point = mouseInitialPoint || nativeEvent;
        return emitDOMEvent(eventName, nativeEvent, nativeEvent.target, {
            target: nativeEvent.target,
            clientX: point.clientX,
            clientY: point.clientY,
            metakey: getEventName(nativeEvent)
        });
    }

    function triggerGestureEvent(gesture, nativeEvent) {
        mouseInitialPoint = null;
        return triggerUIEvent('gesture', nativeEvent, focusPath.slice(-1), gesture);
    }

    function unmount(mutations) {
        // automatically free resources when DOM nodes are removed from document
        each(mutations, function (i, v) {
            each(v.removedNodes, function (i, v) {
                if (v.nodeType === 1 && !containsOrEquals(dom_root, v)) {
                    var container = getContainer(v, true);
                    if (container && container.autoDestroy && container.element === v) {
                        container.destroy();
                    }
                    removeLock(v);
                    var modalPath = mapRemove(modalElements, v);
                    if (modalPath && focused(v)) {
                        var path = any(modalElements, function (w) {
                            return w.indexOf(v) >= 0;
                        }) || focusPath;
                        path.push.apply(path, modalPath);
                        setFocus(modalPath[0], false, null, path);
                    }
                    var index = focusPath.indexOf(v);
                    if (index >= 0) {
                        setFocus(focusPath[index + 1] || body);
                    }
                }
            });
        });
    }

    if (IS_IE10) {
        // polyfill for pointer-events: none for IE10
        bind(body, 'mousedown mouseup mousemove mouseenter mouseleave click dblclick contextmenu wheel', function (e) {
            // @ts-ignore: e.target is Element
            if (getComputedStyle(e.target).pointerEvents === 'none') {
                e.stopPropagation();
                e.stopImmediatePropagation();
                // @ts-ignore: e.target is Element
                if (!e.bubbles || !dispatchDOMMouseEvent(e.type, e, e)) {
                    e.preventDefault();
                }
            }
        }, true);
    }

    bind(window, 'mousedown mouseup wheel compositionstart compositionend beforeinput textInput keydown keyup keypress touchstart touchend cut copy paste drop click dblclick contextmenu', function (e) {
        currentEvent = e;
        setTimeout(function () {
            currentEvent = null;
        });
        setLastEventSource(null);
        if (!focusable(e.target)) {
            e.stopImmediatePropagation();
            e.preventDefault();
            if (matchWord(e.type, 'touchstart mousedown keydown')) {
                emitDOMEvent('focusreturn', null, focusPath.slice(-1)[0]);
            }
        }
        setLastEventSource(e.target);
    }, true);

    bind(dom_root, {
        compositionstart: function () {
            updateIMEState();
            imeText = '';
        },
        compositionupdate: function (e) {
            imeText = e.data;
        },
        compositionend: function (e) {
            var isInputElm = 'selectionEnd' in imeNode;
            var prevText = imeText;
            var prevOffset = imeOffset;
            updateIMEState();

            var curText = imeNode.value || imeNode.data || '';
            imeText = e.data;
            // some IME lacks inserted character sequence when selecting from phrase candidate list
            // also legacy Microsoft Changjie IME reports full-width spaces (U+3000) instead of actual characters
            if (!imeText || /^\u3000+$/.test(imeText)) {
                imeText = curText.slice(prevOffset, imeOffset);
            }

            // some old mobile browsers fire compositionend event before replacing final character sequence
            // need to compare both to truncate the correct range of characters
            // three cases has been observed: XXX{imeText}|, XXX{prevText}| and XXX|{imeText}
            var o1 = imeOffset - imeText.length;
            var o2 = imeOffset - prevText.length;
            var startOffset = imeOffset;
            if (curText.slice(o1, imeOffset) === imeText) {
                startOffset = o1;
            } else if (curText.slice(o2, imeOffset) === prevText) {
                startOffset = o2;
            } else if (curText.substr(imeOffset, imeText.length) === imeText) {
                imeOffset += imeText.length;
            }
            var newText = curText.substr(0, startOffset) + curText.slice(imeOffset);
            if (isInputElm) {
                imeNode.value = newText;
                imeNode.setSelectionRange(startOffset, startOffset);
            } else {
                imeNode.data = newText;
                makeSelection(imeNode, startOffset);
            }
            if (!triggerUIEvent('textInput', e, focusPath[0], imeText)) {
                if (isInputElm) {
                    imeNode.value = curText;
                    imeNode.setSelectionRange(imeOffset, imeOffset);
                } else {
                    imeNode.data = curText;
                    makeSelection(imeNode, imeOffset);
                }
            }
            imeNode = null;
            setTimeout(function () {
                imeText = null;
            });
        },
        textInput: function (e) {
            // required for older mobile browsers that do not support beforeinput event
            // ignore in case browser fire textInput before/after compositionend
            if (!imeNode && (e.data === imeText || triggerUIEvent('textInput', e, focusPath[0], e.data))) {
                e.preventDefault();
            }
        },
        keydown: function (e) {
            if (!imeNode) {
                var keyCode = e.keyCode;
                var isModifierKey = (META_KEYS.indexOf(keyCode) >= 0);
                if (isModifierKey && keyCode !== modifiedKeyCode) {
                    triggerUIEvent('metakeychange', e, focusPath, getEventName(e), true);
                }
                var isSpecialKey = !isModifierKey && (KEYNAMES[keyCode] || '').length > 1 && !(keyCode >= 186 || (keyCode >= 96 && keyCode <= 111));
                // @ts-ignore: boolean arithmetic
                modifierCount = e.ctrlKey + e.shiftKey + e.altKey + e.metaKey + !isModifierKey;
                // @ts-ignore: boolean arithmetic
                modifierCount *= isSpecialKey || ((modifierCount > 2 || (modifierCount > 1 && !e.shiftKey)) && !isModifierKey);
                modifiedKeyCode = keyCode;
                if (modifierCount) {
                    triggerKeystrokeEvent(getEventName(e, KEYNAMES[keyCode] || e.key), keyCode === 32 ? ' ' : '', e);
                }
            }
        },
        keyup: function (e) {
            var isModifierKey = (META_KEYS.indexOf(e.keyCode) >= 0);
            if (!imeNode && (isModifierKey || modifiedKeyCode === e.keyCode)) {
                modifiedKeyCode = null;
                modifierCount--;
                if (isModifierKey) {
                    triggerUIEvent('metakeychange', e, focusPath, getEventName(e) || '', true);
                }
            }
        },
        keypress: function (e) {
            var data = e.char || e.key || String.fromCharCode(e.charCode);
            // @ts-ignore: non-standard member
            if (!imeNode && !modifierCount && (e.synthetic || !('onbeforeinput' in e.target))) {
                triggerKeystrokeEvent(getEventName(e, KEYNAMES[modifiedKeyCode] || data), data, e);
            }
        },
        beforeinput: function (e) {
            if (!imeNode && e.cancelable) {
                switch (e.inputType) {
                    case 'insertText':
                        return triggerUIEvent('textInput', e, focusPath[0], e.data);
                    case 'deleteContent':
                    case 'deleteContentBackward':
                        return triggerKeystrokeEvent('backspace', '', e);
                    case 'deleteContentForward':
                        return triggerKeystrokeEvent('delete', '', e);
                }
            }
        },
        touchstart: function (e) {
            mouseInitialPoint = extend({}, e.touches[0]);
            if (!e.touches[1]) {
                // @ts-ignore: e.target is Element
                if (focused(getContainer(e.target).element)) {
                    triggerMouseEvent('mousedown', e);
                }
                pressTimeout = setTimeout(function () {
                    if (mouseInitialPoint) {
                        triggerMouseEvent('longPress', e);
                        mouseInitialPoint = null;
                    }
                }, 1000);
            }
        },
        touchmove: function (e) {
            clearTimeout(pressTimeout);
            pressTimeout = null;
            if (mouseInitialPoint) {
                if (!e.touches[1]) {
                    var line = measureLine(e.touches[0], mouseInitialPoint);
                    if (line.length > 50 && approxMultipleOf(line.deg, 90)) {
                        triggerGestureEvent('swipe' + (approxMultipleOf(line.deg, 180) ? (line.dx > 0 ? 'Right' : 'Left') : (line.dy > 0 ? 'Bottom' : 'Top')), e);
                    }
                } else if (!e.touches[2]) {
                    triggerGestureEvent('pinchZoom', e);
                }
            }
        },
        touchend: function (e) {
            clearTimeout(pressTimeout);
            if (mouseInitialPoint && pressTimeout) {
                setFocus(e.target);
                triggerMouseEvent('click', e);
                dispatchDOMMouseEvent('click', mouseInitialPoint, e);
                e.preventDefault();
            }
        },
        mousedown: function (e) {
            setFocus(e.target);
            if ((e.buttons || e.which) === 1) {
                triggerMouseEvent('mousedown', e);
            }
            mouseInitialPoint = e;
            mousedownFocus = document.activeElement;
        },
        mousemove: function (e) {
            if (mouseInitialPoint && measureLine(e, mouseInitialPoint).length > 5) {
                mouseInitialPoint = null;
            }
        },
        mouseup: function () {
            if (mousedownFocus && document.activeElement !== mousedownFocus) {
                mousedownFocus.focus();
            }
        },
        wheel: function (e) {
            // @ts-ignore: e.target is Element
            if (containsOrEquals(e.target, focusPath[0]) || !textInputAllowed(e.target)) {
                var dir = e.deltaY || e.detail;
                if (dir && triggerUIEvent('mousewheel', e, e.target, dir / Math.abs(dir) * (IS_MAC ? -1 : 1), true)) {
                    e.preventDefault();
                }
            }
        },
        click: function (e) {
            if (!IS_TOUCH && mouseInitialPoint) {
                triggerMouseEvent('click', e);
            }
        },
        contextmenu: function (e) {
            triggerMouseEvent('rightClick', e);
        },
        dblclick: function (e) {
            triggerMouseEvent('dblclick', e);
        },
        focusin: function (e) {
            windowFocusedOut = false;
            if (focusable(e.target)) {
                setFocus(e.target, false, lastEventSource);
            } else {
                // @ts-ignore: e.target is Element
                e.target.blur();
            }
        },
        focusout: function (e) {
            // browser set focus to body if the focused element is no longer visible
            // which is not a desirable behavior in many cases
            // find the first visible element in focusPath to focus
            // @ts-ignore: e.target is Element
            if (!e.relatedTarget && !isVisible(e.target)) {
                var cur = any(focusPath.slice(focusPath.indexOf(e.target) + 1), isVisible);
                if (cur) {
                    setFocus(cur, false, lastEventSource);
                }
            }
        }
    }, true);

    bind(window, {
        wheel: function (e) {
            // scrolling will happen on first scrollable element up the DOM tree
            // prevent scrolling if interaction on such element should be blocked by modal element
            var deltaX = -e.deltaX;
            var deltaY = -e.deltaY;
            // @ts-ignore: e.target is Element
            for (var cur = e.target; cur && cur !== dom_root; cur = cur.parentNode) {
                // @ts-ignore: e.target is Element
                var style = getComputedStyle(cur);
                // @ts-ignore: e.target is Element
                if (cur.scrollWidth > cur.offsetWidth && matchWord(style.overflowX, 'auto scroll') && ((deltaX > 0 && cur.scrollLeft > 0) || (deltaX < 0 && cur.scrollLeft + cur.offsetWidth < cur.scrollWidth))) {
                    break;
                }
                // @ts-ignore: e.target is Element
                if (cur.scrollHeight > cur.offsetHeight && matchWord(style.overflowY, 'auto scroll') && ((deltaY > 0 && cur.scrollTop > 0) || (deltaY < 0 && cur.scrollTop + cur.offsetHeight < cur.scrollHeight))) {
                    break;
                }
            }
            if (!focusable(cur)) {
                e.preventDefault();
            }
        },
        blur: function (e) {
            if (e.target === window) {
                windowFocusedOut = true;
            }
        }
    });

    new MutationObserver(unmount).observe(dom_root, {
        subtree: true,
        childList: true
    });
    setFocus(document.activeElement);
});


/* --------------------------------------
 * Exports
 * -------------------------------------- */

/* harmony default export */ const src_dom = ({
    get event() {
        return currentEvent;
    },
    get activeElement() {
        return focusPath[0];
    },
    get focusedElements() {
        return focusPath.slice(0);
    },
    get eventSource() {
        return getEventSource();
    },
    root: dom_root,
    ready: domReady,

    focusable,
    focused,
    setModal,
    setFocus,
    retainFocus,
    releaseFocus,
    focus: function (element) {
        setFocus(element, true);
    },

    getEventSource: getEventSource,
    on: listenDOMEvent,
    emit: function (eventName, element, data, bubbles) {
        return emitDOMEvent(eventName, null, element, data, bubbles);
    },

    lock: lock,
    locked: locked,
    cancelLock: cancelLock,
    removeLock: removeLock,

    scrollIntoView,
    watchElements,
});

// CONCATENATED MODULE: ./src/index.js







const src_IS_IOS = IS_IOS;
const src_IS_IE10 = IS_IE10;
const src_IS_IE = IS_IE;
const src_IS_MAC = IS_MAC;
const src_IS_TOUCH = IS_TOUCH;
const util = { ...util_namespaceObject, ...domUtil_namespaceObject };

/* harmony default export */ const src = ({
    IS_IOS: src_IS_IOS,
    IS_IE10: src_IS_IE10,
    IS_IE: src_IS_IE,
    IS_MAC: src_IS_MAC,
    IS_TOUCH: src_IS_TOUCH,
    shim: shim_namespaceObject,
    util,
    dom: src_dom,
    css: cssUtil_namespaceObject
});




/***/ }),

/***/ 804:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__804__;

/***/ }),

/***/ 44:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__44__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(463);
/******/ })()
;
});
//# sourceMappingURL=zeta.js.map