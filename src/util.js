import { Map, Set, WeakMap, Promise } from "./shim.js";

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

const compareFn = [
    function (b, v, i) { return b[i] !== v; },
    function (b, v, i) { return b.get(i) !== v; },
    function (b, v, i) { return !b.has(v); }
];

var setImmediateStore = new Map();
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

function isThenable(obj) {
    return !!obj && isFunction(obj.then) && obj;
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

function grep(obj, callback) {
    var arr = [];
    each(obj, function (i, v) {
        if (callback.call(this, v, i)) {
            arr[arr.length] = v;
        }
    });
    return arr;
}

function any(obj, callback) {
    var result = false;
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

function mapGet(map, key, fn) {
    return map.get(key) || fn && (map.set(key, new fn()), map.get(key));
}

function mapRemove(map, key) {
    var value = map.get(key);
    map.delete(key);
    return value;
}

function equal(a, b) {
    if (typeof a !== 'object' || !b || a.constructor !== b.constructor) {
        return a === b;
    }
    var type = (a instanceof Map && 1) || (a instanceof Set && 2) || (isArray(a) && 3) || 0;
    if (a.length !== b.length || a.size !== b.size || (!type && keys(a).length !== keys(b).length)) {
        return false;
    }
    return !single(a, (compareFn[type] || compareFn[0]).bind(0, b));
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
    resolve().then(function () {
        fn.apply(undefined, args);
    });
}

function setImmediateOnceCallback(fn) {
    mapRemove(setImmediateStore, fn)();
}

function setImmediateOnce(fn) {
    mapGet(setImmediateStore, fn, function () {
        return setImmediate(setImmediateOnceCallback.bind(0, fn)), fn;
    });
}

function setTimeoutOnce(fn) {
    mapGet(setImmediateStore, fn, function () {
        return setTimeout(setImmediateOnceCallback.bind(0, fn)), fn;
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
    return Promise.resolve(value);
}

function reject(reason) {
    return Promise.reject(reason);
}

function always(promise, callback) {
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

function catchAsync(promise) {
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
    o = extend(function () { }, { prototype: o });
    definePrototype(o, p);
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
        props = props || {};
        fn.prototype = inherit(prototype, props);
        defineHiddenProperty(fn.prototype, 'constructor', fn);
        Object.setPrototypeOf(fn, prototype);
        prototype = props;
    }
    each(getOwnPropertyDescriptors(prototype), function (i, v) {
        v.enumerable = !isFunction(v.value);
        defineProperty(fn.prototype, i, v);
    });
}

function inherit(proto, props) {
    var obj = Object.create(isFunction(proto) ? proto.prototype : proto || Object.prototype);
    define(obj, props);
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

function defineObservableProperty(obj, prop, initialValue, callback) {
    var state = getObservableState(obj);
    var alias = state.alias[prop];
    if (alias) {
        return defineObservableProperty(alias[0], alias[1], initialValue, callback);
    }
    if (!(prop in state.values)) {
        var desc = getOwnPropertyDescriptor(obj, prop);
        if (!desc ? prop in obj : desc.get || desc.set) {
            throw new Error('Only own data property can be observed');
        }
        var setter = function (value) {
            var state = getObservableState(this);
            var oldValue = state.values[prop];
            if (isFunction(callback)) {
                value = callback.call(this, value, oldValue);
            }
            if (value !== oldValue) {
                if (!(prop in state.oldValues)) {
                    state.oldValues[prop] = oldValue;
                }
                state.values[prop] = value;
                state.newValues[prop] = value;
                if (!state.sync) {
                    setImmediateOnce(state.handleChanges);
                } else if (!state.lock) {
                    state.handleChanges();
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
    return new Promise(function (resolve) {
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

export {
    // miscellanous
    noop,
    either,
    isArray,
    isFunction,
    isThenable,
    isPlainObject,
    isArrayLike,
    makeArray,
    extend,
    each,
    map,
    grep,
    any,
    single,
    kv,
    mapGet,
    mapRemove,
    equal,
    createPrivateStore,
    setTimeoutOnce,
    setImmediate,
    setImmediateOnce,

    // throw
    throwNotFunction,

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
    htmlDecode,

    // promise
    resolve,
    reject,
    always,
    resolveAll,
    catchAsync,
    setPromiseTimeout
};
