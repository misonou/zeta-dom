import Promise from "./include/promise-polyfill.js";
import { window } from "./env.js";

const objectProto = Object.prototype;
const keys = Object.keys;
const freeze = Object.freeze;
const defineProperty = Object.defineProperty;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const getOwnPropertyNames = Object.getOwnPropertyNames;
const getPrototypeOf = Object.getPrototypeOf;
const hasOwnPropertyImpl = objectProto.hasOwnProperty;
const propertyIsEnumerableImpl = objectProto.propertyIsEnumerable;
const toStringImpl = objectProto.toString;
const values = Object.values || function (obj) {
    var vals = [];
    for (var key in obj) {
        if (hasOwnPropertyImpl.call(obj, key) && propertyIsEnumerableImpl.call(obj, key)) {
            vals.push(obj[key]);
        }
    }
    return vals;
};
const queueMicrotask = window.queueMicrotask || function (callback) {
    resolve().then(callback);
};
const sameValue = Object.is || function (a, b) {
    return sameValueZero(a, b) && (a !== 0 || 1 / a === 1 / b);
};

const compareFn = [
    function (b, v, i) { return !sameValueZero(b[i], v); },
    function (b, v, i) { return !sameValueZero(b.get(i), v); },
    function (b, v, i) { return !b.has(v); }
];

var setImmediateStore = new Map();
var matchWordCache = Object.create(null);
var watchStore = createPrivateStore();

/* --------------------------------------
 * Miscellaneous
 * -------------------------------------- */

function noop() { }

function pipe(v) {
    return v;
}

function either(x, y) {
    return x ? !y : !!y;
}

function sameValueZero(x, y) {
    return x === y || x !== x && y !== y;
}

function is(obj, fn) {
    return obj instanceof fn && obj;
}

function isUndefinedOrNull(value) {
    return value === undefined || value === null;
}

function isArray(obj) {
    return Array.isArray(obj) && obj;
}

function isFunction(obj) {
    return typeof obj === 'function' && obj;
}

function isError(obj) {
    return toStringImpl.call(obj) === '[object Error]' && obj;
}

function isThenable(obj) {
    return !!obj && isFunction(obj.then) && obj;
}

function isPlainObject(obj) {
    var proto = typeof obj === 'object' && obj !== null && getPrototypeOf(obj);
    return (proto === objectProto || proto === null) && obj;
}

function isArrayLike(obj) {
    if (!obj || typeof obj !== 'object' || obj === window) {
        return false;
    }
    if (isArray(obj)) {
        return true;
    }
    var length = obj.length;
    return typeof length === 'number' && length >= 0 && (isFunction(obj.slice) !== false || toStringImpl.call(obj) !== '[object Object]');
}

function makeArray(obj) {
    if (isArray(obj)) {
        return obj.slice(0);
    }
    if (obj && (isArrayLike(obj) || isFunction(obj.forEach))) {
        var arr = [];
        each(obj, function (i, v) {
            arr[arr.length] = v;
        });
        return arr;
    }
    return isUndefinedOrNull(obj) ? [] : [obj];
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
                } else {
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
        callback = callback.bind(obj);
        if (typeof obj === 'string') {
            if (obj.indexOf(' ') < 0) {
                callback(0, obj);
                return;
            }
            obj = obj.split(' ');
        } else if (obj instanceof Set) {
            // would be less useful if key and value refers to the same object
            obj = obj.values();
        }
        if (isArrayLike(obj)) {
            var len = obj.length;
            while (i < len && callback(i, obj[i++]) !== false);
        } else if (isFunction(obj.entries)) {
            obj = obj.entries();
            while (!(cur = obj.next()).done && callback(cur.value[0], cur.value[1]) !== false);
        } else if (isFunction(obj.next)) {
            while (!(cur = obj.next()).done && callback(i++, cur.value) !== false);
        } else if (isFunction(obj.nextNode)) {
            while ((cur = obj.nextNode()) && callback(i++, cur) !== false);
        } else if (isFunction(obj.forEach)) {
            obj.forEach(function (v, i) {
                if (cur !== false) {
                    cur = callback(i, v);
                }
            });
        } else {
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
        if (!isUndefinedOrNull(result)) {
            if (isArray(result)) {
                arr.push.apply(arr, result);
            } else {
                arr[arr.length] = result;
            }
        }
    });
    return arr;
}

function grep(obj, callback) {
    var arr = [];
    callback = callback || pipe;
    each(obj, function (i, v) {
        if (callback.call(this, v, i)) {
            arr[arr.length] = v;
        }
    });
    return arr;
}

function splice(arr, callback) {
    var result = [];
    for (var i = arr.length - 1; i >= 0; i--) {
        if (callback.call(arr, arr[i], i)) {
            result.unshift(arr.splice(i, 1)[0]);
        }
    }
    return result;
}

function any(obj, callback) {
    var result = false;
    callback = callback || pipe;
    each(obj, function (i, v) {
        if (callback.call(this, v, i)) {
            result = v;
            return false;
        }
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

function fill(obj, keys, value) {
    if (arguments.length < 3) {
        return fill({}, obj, keys);
    }
    each(keys, function (i, v) {
        obj[v] = value;
    });
    return obj;
}

function pick(obj, keys) {
    var result = {};
    if (isFunction(keys)) {
        each(obj, function (i, v) {
            if (keys.call(obj, v, i)) {
                result[i] = v;
            }
        });
    } else {
        each(keys, function (i, v) {
            if (v in obj) {
                result[v] = obj[v];
            }
        });
    }
    return result;
}

function exclude(obj, keys) {
    var result = {};
    if (isFunction(keys)) {
        each(obj, function (i, v) {
            if (!keys.call(obj, v, i)) {
                result[i] = v;
            }
        });
    } else {
        extend(result, obj);
        each(keys, function (i, v) {
            delete result[v];
        });
    }
    return result;
}

function mapObject(obj, callback) {
    var result = {};
    each(obj, function (i, v) {
        result[i] = callback.call(obj, v, i);
    });
    return result;
}

function mapGet(map, key, fn, passKey) {
    if (!map.has(key) && fn) {
        map.set(key, hasOwnProperty(fn, 'prototype') ? (passKey ? new fn(key) : new fn()) : (passKey ? fn(key) : fn()));
    }
    return map.get(key);
}

function mapRemove(map, key) {
    var value = map.get(key);
    map.delete(key);
    return value;
}

function arrRemove(arr, obj) {
    var index = arr.indexOf(obj);
    if (index >= 0) {
        return arr.splice(index, 1)[0];
    }
}

function setAdd(set, obj) {
    var result = !set.has(obj);
    set.add(obj);
    return result;
}

function equal(a, b) {
    if (!a || !b || typeof a !== 'object' || a.constructor !== b.constructor) {
        return sameValueZero(a, b);
    }
    var type = (a instanceof Map && 1) || (a instanceof Set && 2) || (isArrayLike(a) && 3) || 0;
    if (type) {
        return a.length === b.length && a.size === b.size && !single(a, compareFn[type % 3].bind(0, b));
    }
    var needles = keys(a);
    return needles.length === keys(b).length && !single(needles, function (v) {
        return !hasOwnPropertyImpl.call(b, v) || !propertyIsEnumerableImpl.call(b, v) || !sameValueZero(a[v], b[v]);
    });
}

function combineFn(arr) {
    arr = isFunction(arr) ? [].slice.call(arguments, 0) : arr;
    return function () {
        var self = this;
        var args = [].slice.call(arguments, 0);
        each(arr, function (i, v) {
            v.apply(self, args);
        });
    };
}

function executeOnce(fn) {
    var value;
    return function () {
        if (isFunction(fn)) {
            value = fn.apply(this, arguments);
        }
        fn = undefined;
        return value;
    };
}

function createPrivateStore() {
    var map = new WeakMap();
    return function (obj, value) {
        if (value) {
            map.set(obj, value);
        }
        return value || map.get(obj);
    };
}

function setImmediate(fn) {
    var args = [].slice.call(arguments, 1);
    queueMicrotask(function () {
        fn.apply(undefined, args);
    });
}

function setImmediateOnceCallback(fn) {
    (mapRemove(setImmediateStore, fn) || noop)();
}

function setImmediateOnce(fn) {
    mapGet(setImmediateStore, fn, function () {
        return setImmediate(setImmediateOnceCallback.bind(0, fn)), fn;
    });
}

function setTimeoutOnce(fn, ms) {
    mapGet(setImmediateStore, fn, function () {
        return setTimeout(setImmediateOnceCallback.bind(0, fn), ms || 0), fn;
    });
}

function clearImmediateOnce(fn) {
    mapRemove(setImmediateStore, fn);
}

function setTimeout() {
    var t = window.setTimeout.apply(window, arguments);
    return function () {
        clearTimeout(t);
    };
}

function setInterval() {
    var t = window.setInterval.apply(window, arguments);
    return function () {
        clearInterval(t);
    };
}

function setIntervalSafe(callback, ms) {
    var args = makeArray(arguments).slice(2);
    var cancelled = false;
    var last = 0;
    var t;
    (function next() {
        var now = Date.now();
        if (!cancelled) {
            t = window.setTimeout(function () {
                always(callback.apply(this, args), next);
            }, Math.max(0, Math.min(ms || 0, now - last)));
            last = now;
        }
    })();
    return function () {
        clearTimeout(t);
        cancelled = true;
    };
}


/* --------------------------------------
 * Throw helper
 * -------------------------------------- */

function throws(error) {
    throw (isError(error) || new Error(error));
}

function throwNotFunction(obj, name) {
    if (!isFunction(obj)) {
        throws((name || 'callback') + ' must be a function');
    }
    return obj;
}

function errorWithCode(code, message, props) {
    return extend(new Error(message || code), props, {
        code: code
    });
}

function isErrorWithCode(error, code) {
    return isError(error) && error.code === code;
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

function getMatchWordRegex(needle) {
    return matchWordCache[needle] || (matchWordCache[needle] = new RegExp('(?:^|\\s)(' + needle.replace(/\s+/g, '|') + ')(?=$|\\s)'));
}

function execFirstParen(re, haystack) {
    return re.test(haystack) && RegExp.$1;
}

function matchWord(haystack, needle) {
    return haystack ? execFirstParen(getMatchWordRegex(needle), String(haystack)) : false;
}

function matchWordMulti(haystack, needle) {
    if (!haystack) {
        return pipe.bind(0, false);
    }
    var re = new RegExp(getMatchWordRegex(needle).source, 'g');
    return execFirstParen.bind(0, re, String(haystack));
}

function htmlDecode(input) {
    return input && new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
}


/* --------------------------------------
 * Promise related
 * -------------------------------------- */

function resolve(value) {
    return Promise.resolve(value);
}

function reject(reason) {
    return Promise.reject(reason);
}

function always(promise, callback) {
    promise = isThenable(promise) || resolve(promise);
    return promise.then(function (v) {
        return callback(true, v);
    }, function (v) {
        return callback(false, v);
    });
}

function resolveAll(obj, callback) {
    if (!obj || typeof obj !== 'object' || isThenable(obj)) {
        return resolve(obj).then(callback);
    }
    if (isArray(obj)) {
        return Promise.all(obj).then(callback);
    }
    var result = {};
    var arr = map(obj, function (v, i) {
        return resolve(v).then(function (d) {
            result[i] = d;
        });
    });
    return resolveAll(arr, function () {
        return isFunction(callback) ? callback(result) : result;
    });
}

function retryable(fn, done) {
    var promise;
    return function () {
        return promise || (promise = makeAsync(fn).apply(this, arguments).then(done, function (e) {
            promise = null;
            throw e;
        }));
    };
}

function deferrable(arr) {
    arr = makeArray(arr);
    var resolved;
    var promise = resolve().then(function next() {
        resolved = !arr.length;
        return resolved ? undefined : resolveAll(arr.splice(0).map(catchAsync), next);
    });
    return extend(promise, {
        waitFor: function () {
            return !resolved && !!arr.push.apply(arr, arguments);
        }
    });
}

function catchAsync(promise) {
    promise = isThenable(promise) || resolve(promise);
    return promise.catch(noop);
}

function setPromiseTimeout(promise, ms, resolveWhenTimeout) {
    return new Promise(function (resolve, reject) {
        promise.then(resolve, reject);
        setTimeout(function () {
            (resolveWhenTimeout ? resolve : reject)('timeout');
        }, ms);
    });
}

function delay(ms, callback) {
    return new Promise(function (resolve) {
        setTimeout(callback ? function () {
            resolve(makeAsync(callback)());
        } : resolve, ms);
    });
}

function makeAsync(callback) {
    return function () {
        try {
            return resolve(callback.apply(this, arguments));
        } catch (e) {
            return reject(e);
        }
    };
}


/* --------------------------------------
 * Property and prototype
 * -------------------------------------- */

function hasOwnProperty(obj, prop) {
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
    each(getOwnPropertyDescriptors(p), function (i, v) {
        if (isFunction(v.value)) {
            v.enumerable = false;
        }
        defineProperty(o, i, v);
    });
}

function defineOwnProperty(obj, name, value, readonly) {
    defineProperty(obj, name, {
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

function definePrototype(fn, prototype, props) {
    if (isFunction(prototype)) {
        fn.prototype = inherit(prototype, props);
        defineHiddenProperty(fn.prototype, 'constructor', fn);
        Object.setPrototypeOf(fn, prototype);
    } else {
        define(fn.prototype, prototype);
    }
}

function inherit(proto, props) {
    var obj = Object.create(isFunction(proto) ? proto.prototype : proto || objectProto);
    define(obj, props || {});
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
    return watchStore(obj) || watchStore(obj, {
        sync: !!sync,
        values: {},
        oldValues: {},
        newValues: {},
        alias: Object.create(null),
        handlers: [],
        handleChanges: function (callback) {
            var self = watchStore(obj);
            var result;
            try {
                self.lock = true;
                do {
                    var oldValues = self.oldValues;
                    var newValues = self.newValues;
                    if (isFunction(callback)) {
                        result = callback();
                        callback = null;
                    }
                    for (var i in oldValues) {
                        if (sameValueZero(oldValues[i], newValues[i])) {
                            delete oldValues[i];
                            delete newValues[i];
                        }
                    }
                    if (getOwnPropertyNames(oldValues)[0]) {
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
            return result;
        }
    });
}

function ensurePropertyObserved(obj, prop) {
    for (var proto = obj; proto && proto !== objectProto; proto = getPrototypeOf(proto)) {
        if (hasOwnProperty(proto, prop)) {
            var state = getObservableState(proto);
            var alias = state.alias[prop];
            if (alias) {
                return ensurePropertyObserved(alias[0], alias[1]);
            }
            if (hasOwnProperty(state.values, prop)) {
                return;
            }
        }
    }
    defineObservableProperty(obj, prop);
}

function throwNotOwnDataProperty(obj, prop) {
    var desc = getOwnPropertyDescriptor(obj, prop);
    if (!desc ? prop in obj : desc.get || desc.set) {
        throws('Must be own data property');
    }
}

function defineAliasProperty(obj, prop, target, targetProp) {
    targetProp = targetProp || prop;
    throwNotOwnDataProperty(obj, prop);
    defineGetterProperty(obj, prop, function () {
        return target[targetProp];
    }, function (value) {
        target[targetProp] = value;
    });
    var state = getObservableState(obj);
    state.alias[prop] = getObservableState(target).alias[targetProp] || [target, targetProp];
}

function defineObservableProperty(obj, prop, initialValue, callback) {
    var state = getObservableState(obj);
    var alias = state.alias[prop];
    if (alias) {
        return defineObservableProperty(alias[0], alias[1], initialValue, callback);
    }
    if (!hasOwnProperty(state.values, prop)) {
        throwNotOwnDataProperty(obj, prop);
        var setter = function (value) {
            var state = getObservableState(this);
            var oldValue = state.values[prop];
            if (isFunction(callback)) {
                value = callback.call(this, value, oldValue);
            }
            if (!sameValueZero(value, oldValue)) {
                state.values[prop] = value;
                if (state.handlers[0]) {
                    if (!hasOwnProperty(state.oldValues, prop)) {
                        state.oldValues[prop] = oldValue;
                    }
                    state.newValues[prop] = value;
                    if (!state.sync) {
                        setImmediateOnce(state.handleChanges);
                    } else if (!state.lock) {
                        state.handleChanges();
                    }
                }
            }
        };
        state.values[prop] = prop in obj ? obj[prop] : initialValue;
        defineGetterProperty(obj, prop, function () {
            var state = getObservableState(this);
            return state.values[prop];
        }, callback === true ? undefined : setter);
        return setter.bind(obj);
    }
}

function watch(obj, prop, handler, fireInit) {
    if (typeof prop === 'boolean') {
        if (watchStore(obj)) {
            throws('Observable initialized');
        }
        var state = getObservableState(obj, prop);
        return state.handleChanges;
    }
    var wrapper, handlers;
    if (isFunction(prop)) {
        wrapper = prop;
        handlers = getObservableState(obj).handlers;
        handlers.push(prop);
    } else {
        ensurePropertyObserved(obj, prop);
        if (isFunction(handler)) {
            var alias = getObservableState(obj).alias[prop] || [obj, prop];
            handlers = getObservableState(alias[0]).handlers;
            wrapper = function (e) {
                if (hasOwnProperty(e.newValues, alias[1])) {
                    handler.call(obj, e.newValues[alias[1]], e.oldValues[alias[1]], prop, obj);
                }
            };
            handlers.push(wrapper);
            if (fireInit) {
                handler.call(obj, obj[prop], null, prop, obj);
            }
        }
    }
    if (wrapper) {
        return executeOnce(function () {
            arrRemove(handlers, wrapper);
        });
    }
    return noop;
}

function watchOnce(obj, prop, handler) {
    ensurePropertyObserved(obj, prop);
    return new Promise(function (resolve) {
        var alias = getObservableState(obj).alias[prop] || [obj, prop];
        var handlers = getObservableState(alias[0]).handlers;
        handlers.push(function fn(e) {
            if (hasOwnProperty(e.newValues, alias[1])) {
                var value = e.newValues[alias[1]];
                var returnValue;
                arrRemove(handlers, fn);
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
            return watch(this, prop, handler, fireInit);
        },
        watchOnce: function (prop, handler) {
            return watchOnce(this, prop, handler);
        }
    });
    return obj;
}

export {
    // miscellanous
    noop,
    pipe,
    either,
    sameValue,
    sameValueZero,
    is,
    isUndefinedOrNull,
    isArray,
    isFunction,
    isError,
    isThenable,
    isPlainObject,
    isArrayLike,
    makeArray,
    extend,
    each,
    map,
    grep,
    splice,
    any,
    single,
    kv,
    fill,
    pick,
    exclude,
    mapObject,
    mapGet,
    mapRemove,
    arrRemove,
    setAdd,
    equal,
    combineFn,
    executeOnce,
    createPrivateStore,
    setTimeout,
    setTimeoutOnce,
    setInterval,
    setIntervalSafe,
    setImmediate,
    setImmediateOnce,
    clearImmediateOnce,

    // throw
    throws,
    throwNotFunction,
    errorWithCode,
    isErrorWithCode,

    // property and prototype related
    keys,
    values,
    hasOwnProperty,
    getOwnPropertyDescriptors,
    define,
    definePrototype,
    defineOwnProperty,
    defineGetterProperty,
    defineHiddenProperty,
    defineAliasProperty,
    defineObservableProperty,
    watch,
    watchOnce,
    watchable,
    inherit,
    freeze,
    deepFreeze,

    // string related
    iequal,
    randomId,
    repeat,
    camel,
    hyphenate,
    ucfirst,
    lcfirst,
    trim,
    matchWord,
    matchWordMulti,
    htmlDecode,

    // promise
    resolve,
    reject,
    always,
    resolveAll,
    retryable,
    deferrable,
    catchAsync,
    setPromiseTimeout,
    delay,
    makeAsync
};
