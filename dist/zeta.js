(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("promise-polyfill"), require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define("zeta", ["promise-polyfill", "jQuery"], factory);
	else if(typeof exports === 'object')
		exports["zeta"] = factory(require("promise-polyfill"), require("jQuery"));
	else
		root["zeta"] = factory(root["promise-polyfill"], root["jQuery"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__804__, __WEBPACK_EXTERNAL_MODULE__609__) {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 411:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "EventContainer": function() { return /* reexport */ ZetaEventContainer; },
  "IS_IE": function() { return /* reexport */ IS_IE; },
  "IS_IE10": function() { return /* reexport */ IS_IE10; },
  "IS_IOS": function() { return /* reexport */ IS_IOS; },
  "IS_MAC": function() { return /* reexport */ IS_MAC; },
  "IS_TOUCH": function() { return /* reexport */ IS_TOUCH; },
  "InheritedNode": function() { return /* reexport */ InheritedNode; },
  "InheritedNodeTree": function() { return /* reexport */ InheritedNodeTree; },
  "TraversableNode": function() { return /* reexport */ TraversableNode; },
  "TraversableNodeTree": function() { return /* reexport */ TraversableNodeTree; },
  "TreeWalker": function() { return /* reexport */ TreeWalker; },
  "css": function() { return /* reexport */ cssUtil_namespaceObject; },
  "default": function() { return /* binding */ src; },
  "dom": function() { return /* reexport */ src_dom; },
  "util": function() { return /* binding */ util; }
});

// NAMESPACE OBJECT: ./src/util.js
var util_namespaceObject = {};
__webpack_require__.r(util_namespaceObject);
__webpack_require__.d(util_namespaceObject, {
  "always": function() { return always; },
  "any": function() { return any; },
  "camel": function() { return camel; },
  "catchAsync": function() { return catchAsync; },
  "createPrivateStore": function() { return createPrivateStore; },
  "deepFreeze": function() { return deepFreeze; },
  "define": function() { return define; },
  "defineAliasProperty": function() { return defineAliasProperty; },
  "defineGetterProperty": function() { return defineGetterProperty; },
  "defineHiddenProperty": function() { return defineHiddenProperty; },
  "defineObservableProperty": function() { return defineObservableProperty; },
  "defineOwnProperty": function() { return defineOwnProperty; },
  "definePrototype": function() { return definePrototype; },
  "each": function() { return each; },
  "either": function() { return either; },
  "equal": function() { return equal; },
  "exclude": function() { return exclude; },
  "extend": function() { return extend; },
  "getOwnPropertyDescriptors": function() { return getOwnPropertyDescriptors; },
  "grep": function() { return grep; },
  "hasOwnProperty": function() { return util_hasOwnProperty; },
  "htmlDecode": function() { return htmlDecode; },
  "hyphenate": function() { return hyphenate; },
  "iequal": function() { return iequal; },
  "inherit": function() { return inherit; },
  "isArray": function() { return isArray; },
  "isArrayLike": function() { return isArrayLike; },
  "isFunction": function() { return isFunction; },
  "isPlainObject": function() { return isPlainObject; },
  "isThenable": function() { return isThenable; },
  "keys": function() { return keys; },
  "kv": function() { return kv; },
  "lcfirst": function() { return lcfirst; },
  "makeArray": function() { return makeArray; },
  "map": function() { return map; },
  "mapGet": function() { return mapGet; },
  "mapRemove": function() { return mapRemove; },
  "matchWord": function() { return matchWord; },
  "noop": function() { return noop; },
  "pick": function() { return pick; },
  "randomId": function() { return randomId; },
  "reject": function() { return reject; },
  "repeat": function() { return repeat; },
  "resolve": function() { return resolve; },
  "resolveAll": function() { return resolveAll; },
  "setImmediate": function() { return setImmediate; },
  "setImmediateOnce": function() { return setImmediateOnce; },
  "setPromiseTimeout": function() { return setPromiseTimeout; },
  "setTimeoutOnce": function() { return setTimeoutOnce; },
  "single": function() { return single; },
  "splice": function() { return splice; },
  "throwNotFunction": function() { return throwNotFunction; },
  "trim": function() { return trim; },
  "ucfirst": function() { return ucfirst; },
  "values": function() { return values; },
  "watch": function() { return _watch; },
  "watchOnce": function() { return _watchOnce; },
  "watchable": function() { return watchable; }
});

// NAMESPACE OBJECT: ./src/domUtil.js
var domUtil_namespaceObject = {};
__webpack_require__.r(domUtil_namespaceObject);
__webpack_require__.d(domUtil_namespaceObject, {
  "acceptNode": function() { return acceptNode; },
  "bind": function() { return bind; },
  "bindUntil": function() { return bindUntil; },
  "combineNodeFilters": function() { return combineNodeFilters; },
  "comparePosition": function() { return comparePosition; },
  "compareRangePosition": function() { return compareRangePosition; },
  "connected": function() { return connected; },
  "containsOrEquals": function() { return containsOrEquals; },
  "createNodeIterator": function() { return createNodeIterator; },
  "createRange": function() { return createRange; },
  "createTreeWalker": function() { return createTreeWalker; },
  "dispatchDOMMouseEvent": function() { return dispatchDOMMouseEvent; },
  "domReady": function() { return domReady; },
  "elementFromPoint": function() { return elementFromPoint; },
  "getClass": function() { return getClass; },
  "getCommonAncestor": function() { return getCommonAncestor; },
  "getContentRect": function() { return getContentRect; },
  "getRect": function() { return getRect; },
  "getRects": function() { return getRects; },
  "getScrollOffset": function() { return getScrollOffset; },
  "getScrollParent": function() { return getScrollParent; },
  "is": function() { return is; },
  "isVisible": function() { return isVisible; },
  "iterateNode": function() { return iterateNode; },
  "iterateNodeToArray": function() { return iterateNodeToArray; },
  "makeSelection": function() { return makeSelection; },
  "mergeRect": function() { return mergeRect; },
  "parentsAndSelf": function() { return parentsAndSelf; },
  "pointInRect": function() { return pointInRect; },
  "rangeCovers": function() { return rangeCovers; },
  "rangeEquals": function() { return rangeEquals; },
  "rangeIntersects": function() { return rangeIntersects; },
  "rectCovers": function() { return rectCovers; },
  "rectEquals": function() { return rectEquals; },
  "rectIntersects": function() { return rectIntersects; },
  "removeNode": function() { return removeNode; },
  "scrollBy": function() { return scrollBy; },
  "scrollIntoView": function() { return scrollIntoView; },
  "selectClosestRelative": function() { return selectClosestRelative; },
  "selectIncludeSelf": function() { return selectIncludeSelf; },
  "setClass": function() { return setClass; },
  "tagName": function() { return tagName; },
  "toPlainRect": function() { return toPlainRect; }
});

// NAMESPACE OBJECT: ./src/cssUtil.js
var cssUtil_namespaceObject = {};
__webpack_require__.r(cssUtil_namespaceObject);
__webpack_require__.d(cssUtil_namespaceObject, {
  "isCssUrlValue": function() { return isCssUrlValue; },
  "parseCSS": function() { return parseCSS; },
  "runCSSTransition": function() { return runCSSTransition; }
});

// CONCATENATED MODULE: ./src/env.js
// @ts-nocheck
var env_window = self;
var env_document = env_window.document;
var root = env_document.documentElement;
var getSelection = env_window.getSelection;
var getComputedStyle = env_window.getComputedStyle;
var IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !env_window.MSStream;
var IS_IE10 = !!env_window.ActiveXObject;
var IS_IE = IS_IE10 || root.style.msTouchAction !== undefined || root.style.msUserSelect !== undefined;
var IS_MAC = navigator.userAgent.indexOf('Macintosh') >= 0;
var IS_TOUCH = ('ontouchstart' in env_window);
// EXTERNAL MODULE: ./src/include/promise-polyfill.cjs
var promise_polyfill = __webpack_require__(511);
// CONCATENATED MODULE: ./src/util.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



var keys = Object.keys;
var freeze = Object.freeze;
var defineProperty = Object.defineProperty;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var hasOwnPropertyImpl = Object.prototype.hasOwnProperty;
var propertyIsEnumerableImpl = Object.prototype.propertyIsEnumerable;

var values = Object.values || function (obj) {
  var vals = [];

  for (var key in obj) {
    if (hasOwnPropertyImpl.call(obj, key) && propertyIsEnumerableImpl.call(obj, key)) {
      vals.push(obj[key]);
    }
  }

  return vals;
};

var compareFn = [function (b, v, i) {
  return b[i] !== v;
}, function (b, v, i) {
  return b.get(i) !== v;
}, function (b, v, i) {
  return !b.has(v);
}];
var setImmediateStore = new Map();
var matchWordCache;
var watchStore;
/* --------------------------------------
 * Miscellaneous
 * -------------------------------------- */

function noop() {}

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
  var proto = _typeof(obj) === 'object' && obj !== null && Object.getPrototypeOf(obj);
  return (proto === Object.prototype || proto === null) && obj;
}

function isArrayLike(obj) {
  if (isFunction(obj) || obj === env_window) {
    return false;
  }

  var length = !!obj && obj.length;
  return isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj;
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

  if (_typeof(target) !== 'object' && !isFunction(target)) {
    target = {};
  }

  for (; i < length; i++) {
    if ((options = arguments[i]) !== null) {
      for (name in options) {
        src = target[name];
        copy = options[name]; // prevent never-ending loop

        if (target === copy) {
          continue;
        } // recurse if we're merging plain objects or arrays


        if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          } // never move original objects, clone them


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
    var cur,
        i = 0;

    if (typeof obj === 'string') {
      obj = obj.split(' ');
    } else if (obj instanceof Set) {
      // would be less useful if key and value refers to the same object
      obj = isFunction(obj.values) ? obj.values() : function (obj, arr) {
        return obj.forEach(function (v) {
          // @ts-ignore: arr is hinted as never[]
          arr[arr.length] = v;
        }), arr;
      }(obj, []);
    }

    if (isArrayLike(obj)) {
      var len = obj.length;

      while (i < len && callback(i, obj[i++]) !== false) {
        ;
      }
    } else if (isFunction(obj.entries)) {
      obj = obj.entries();

      while (!(cur = obj.next()).done && callback(cur.value[0], cur.value[1]) !== false) {
        ;
      }
    } else if (isFunction(obj.forEach)) {
      var value;
      obj.forEach(function (v, i) {
        value = value === false || callback(i, v);
      });
    } else if (isFunction(obj.next)) {
      while (!(cur = obj.next()).done && callback(i++, cur.value) !== false) {
        ;
      }
    } else if (isFunction(obj.nextNode)) {
      while ((cur = obj.nextNode()) && callback(i++, cur) !== false) {
        ;
      }
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

function pick(obj, keys) {
  var result = {};
  each(keys, function (i, v) {
    if (v in obj) {
      result[v] = obj[v];
    }
  });
  return result;
}

function exclude(obj, keys) {
  var result = extend({}, obj);
  each(keys, function (i, v) {
    delete result[v];
  });
  return result;
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
  if (_typeof(a) !== 'object' || !b || a.constructor !== b.constructor) {
    return a === b;
  }

  var type = a instanceof Map && 1 || a instanceof Set && 2 || isArray(a) && 3 || 0;

  if (a.length !== b.length || a.size !== b.size || !type && keys(a).length !== keys(b).length) {
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
  return promise_polyfill.resolve(value);
}

function reject(reason) {
  return promise_polyfill.reject(reason);
}

function always(promise, callback) {
  return promise.then(function (v) {
    return callback(true, v);
  }, function (v) {
    return callback(false, v);
  });
}

function resolveAll(obj, callback) {
  if (!obj || _typeof(obj) !== 'object' || isThenable(obj)) {
    return resolve(obj).then(callback);
  }

  if (isArray(obj)) {
    return promise_polyfill.all(obj).then(callback);
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
  return new promise_polyfill(function (resolve, reject) {
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
  o = extend(function () {}, {
    prototype: o
  });
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

    if (value && _typeof(value) === 'object') {
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
    handleChanges: function handleChanges(callback) {
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

    var setter = function setter(value) {
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

function _watch(obj, prop, handler, fireInit) {
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

function _watchOnce(obj, prop, handler) {
  defineObservableProperty(obj, prop);
  return new promise_polyfill(function (resolve) {
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
    watch: function watch(prop, handler, fireInit) {
      _watch(this, prop, handler, fireInit);
    },
    watchOnce: function watchOnce(prop, handler) {
      return _watchOnce(this, prop, handler);
    }
  });
  return obj;
}


// EXTERNAL MODULE: ./src/include/jquery.cjs
var jquery = __webpack_require__(304);
// CONCATENATED MODULE: ./src/domUtil.js


 // @ts-ignore: non-standard member

var elementsFromPoint = env_document.msElementsFromPoint || env_document.elementsFromPoint;
var compareDocumentPositionImpl = env_document.compareDocumentPosition;
var compareBoundaryPointsImpl = Range.prototype.compareBoundaryPoints;
var OFFSET_ZERO = Object.freeze({
  x: 0,
  y: 0
});
var domReady = new Promise(jquery);
var originDiv;
var scrollbarWidth;
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

  collapse: function collapse(side, offset) {
    var rect = this;
    var pos = rect[side] + (offset || 0);
    return side === 'left' || side === 'right' ? toPlainRect(pos, rect.top, pos, rect.bottom) : toPlainRect(rect.left, pos, rect.right, pos);
  },
  translate: function translate(x, y) {
    var self = this;
    return toPlainRect(self.left + x, self.top + y, self.right + x, self.bottom + y);
  },
  expand: function expand(l, t, r, b) {
    var self = this;

    switch (arguments.length) {
      case 1:
        t = l;

      case 2:
        r = l;

      case 3:
        b = t;
    }

    var w = self.width;
    var h = self.height;
    var dx = l + r + w;
    var dy = t + b + h;

    if (dx < 0) {
      l -= dx * l / (l + r) | 0; // @ts-ignore: type inference issue

      r = -(l + w);
    }

    if (dy < 0) {
      t -= dy * t / (t + b) | 0; // @ts-ignore: type inference issue

      b = -(t + h);
    } // @ts-ignore: type inference issue


    return toPlainRect(self.left - l, self.top - t, self.right + r, self.bottom + b);
  }
});
/* --------------------------------------
 * General helper
 * -------------------------------------- */

function tagName(element) {
  return element && element.tagName && element.tagName.toLowerCase();
}

function is(element, selector) {
  if (!element || !selector) {
    return false;
  } // constructors of native DOM objects in Safari refuse to be functions
  // use a fairly accurate but fast checking instead of isFunction


  if (selector.prototype) {
    return element instanceof selector && element;
  }

  if (selector.toFixed) {
    return element.nodeType === selector && element;
  }

  return (selector === '*' || tagName(element) === selector || jquery(element).is(selector)) && element;
}

function comparePosition(a, b, strict) {
  if (a === b) {
    return 0;
  }

  var v = a && b && compareDocumentPositionImpl.call(a.element || a, b.element || b);

  if (v & 2) {
    return strict && v & 8 || v & 1 ? NaN : 1;
  }

  if (v & 4) {
    return strict && v & 16 || v & 1 ? NaN : -1;
  }

  return NaN;
}

function connected(a, b) {
  return a && b && !(compareDocumentPositionImpl.call(a.commonAncestorContainer || a, b.commonAncestorContainer || b) & 1);
}

function containsOrEquals(container, contained) {
  container = (container || '').element || container;
  contained = (contained || '').element || contained;
  return container === contained || jquery.contains(container, contained);
}

function isVisible(element) {
  if (!connected(root, element)) {
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

  if (!node || !(iterator.whatToShow & 1 << node.nodeType - 1)) {
    return 3;
  }

  var filter = iterator.filter;
  return !filter ? 1 : (filter.acceptNode || filter).call(filter, node);
}

function combineNodeFilters() {
  var args = grep(makeArray(arguments), isFunction);

  if (!args[1]) {
    return args[0] || function () {
      return 1;
    };
  }

  return function (node) {
    var result = 1;

    for (var i = 0, len = args.length; i < len; i++) {
      var value = args[i].call(null, node);

      if (value === 2) {
        return 2;
      }

      result |= value;
    }

    return result;
  };
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

  for (var cur; (cur = iterator.nextNode()) && (!until || (isFunction(until) ? until(cur) : cur !== until || void callback(cur, i++))); callback(cur, i++)) {
    ;
  }
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
  for (b = b || a; a && a !== b && compareDocumentPositionImpl.call(a, b) !== 20; a = a.parentNode) {
    ;
  }

  return a;
}

function parentsAndSelf(element) {
  if (element === env_window) {
    return [];
  }

  for (var arr = []; element && element !== env_document && arr.push(element); element = element.parentNode || element.parent) {
    ;
  }

  return arr;
}

function selectIncludeSelf(selector, container) {
  container = container || root;
  var matched = jquery.uniqueSort(jquery(container).find(selector).add(jquery(container).filter(selector)).get());

  if (matched[0] || container === root) {
    return matched;
  }

  return jquery(container).find(jquery(selector)).get();
}

function selectClosestRelative(selector, container) {
  container = container || root;
  var element = jquery(selector, container)[0];

  if (!element) {
    var $matched = jquery(selector);

    for (; container !== root && !element; container = container.parentNode) {
      element = $matched.get().filter(function (v) {
        return containsOrEquals(container, v);
      })[0];
    }
  }

  return element;
}

function createNodeIterator(root, whatToShow, filter) {
  // @ts-ignore: assume filter is of correct signature
  return env_document.createNodeIterator(root, whatToShow, isFunction(filter) || null, false);
}

function createTreeWalker(root, whatToShow, filter) {
  // @ts-ignore: assume filter is of correct signature
  return env_document.createTreeWalker(root, whatToShow, isFunction(filter) || null, false);
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

function bindUntil(promise, element, event, listener, useCapture) {
  always(promise, bind(element, event, listener, useCapture));
}

function dispatchDOMMouseEvent(eventName, point, e) {
  if (typeof eventName !== 'string') {
    e = eventName;
    eventName = e.type;
  }

  var target = point ? elementFromPoint(point.clientX, point.clientY) || root : e.target;
  var event = env_document.createEvent('MouseEvent');
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
      return replaced++ || !v || v.length === 0 ? '' : ' ' + i + (v[0] ? [''].concat(v).join(' ' + i + '-') : '');
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

function getScrollParent(element) {
  for (var s; element !== root && (s = getComputedStyle(element)) && s.overflow === 'visible' && matchWord(s.position, 'static relative'); element = element.parentNode) {
    ;
  }

  return element;
}

function scrollBy(element, x, y) {
  var winOrElm = element === root || element === env_document.body ? env_window : element;
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

function getContentRect(element) {
  if (scrollbarWidth === undefined) {
    // detect native scrollbar size
    // height being picked because scrollbar may not be shown if container is too short
    var dummy = jquery('<div style="overflow:scroll;height:80px"><div style="height:100px"></div></div>').appendTo(env_document.body)[0];
    scrollbarWidth = getRect(dummy).width - getRect(dummy.children[0]).width;
    removeNode(dummy);
  }

  var style = getComputedStyle(element);
  var hasOverflowX = element.offsetWidth < element.scrollWidth;
  var hasOverflowY = element.offsetHeight < element.scrollHeight;
  var parentRect = getRect(element === env_document.body ? root : element);

  if ((style.overflow !== 'visible' || element === env_document.body) && (hasOverflowX || hasOverflowY)) {
    if (style.overflowY === 'scroll' || (style.overflowY !== 'hidden' || element === env_document.body) && hasOverflowY) {
      parentRect.right -= scrollbarWidth;
    }

    if (style.overflowX === 'scroll' || (style.overflowX !== 'hidden' || element === env_document.body) && hasOverflowX) {
      parentRect.bottom -= scrollbarWidth;
    }
  }

  return parentRect;
}

function scrollIntoView(element, rect) {
  if (!rect || rect.top === undefined) {
    rect = getRect(element, rect);
  }

  var parent = getScrollParent(element);
  var parentRect = getContentRect(parent);
  var deltaX = Math.max(0, rect.right - parentRect.right) || Math.min(rect.left - parentRect.left, 0);
  var deltaY = Math.max(0, rect.bottom - parentRect.bottom) || Math.min(rect.top - parentRect.top, 0);
  var result = (deltaX || deltaY) && scrollBy(parent, deltaX, deltaY) || OFFSET_ZERO;

  if (parent !== root) {
    var parentResult = scrollIntoView(parent.parentNode, rect.translate(result.x, result.y));

    if (parentResult) {
      result = {
        x: result.x + parentResult.x,
        y: result.y + parentResult.y
      };
    }
  }

  return result.x || result.y ? result : false;
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
    range = env_document.createRange();

    if (+startOffset !== startOffset) {
      range[startOffset === 'contents' || !startNode.parentNode ? 'selectNodeContents' : 'selectNode'](startNode);

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
  return strict && (value !== 0 && rangeIntersects(a, b) || value === 0 && !rangeEquals(a, b)) ? NaN : value && value / Math.abs(value);
}

function makeSelection(b, e) {
  var selection = getSelection();

  if (!selection) {
    return;
  } // for newer browsers that supports setBaseAndExtent
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
    var r = env_document.body.createTextRange();
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
      selection.addRange(createRange(env_document.body));
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

function getRect(elm, includeMargin) {
  var rect;
  elm = elm || root;

  if (elm.getRect) {
    return elm.getRect();
  }

  elm = elm.element || elm;

  if (elm === root || elm === env_window) {
    var div = originDiv || (originDiv = jquery('<div style="position:fixed; top:0; left:0;">')[0]);

    if (!containsOrEquals(env_document.body, div)) {
      env_document.body.appendChild(div);
    } // origin used by CSS, DOMRect and properties like clientX/Y may move away from the top-left corner of the window
    // when virtual keyboard is shown on mobile devices


    var o = getRect(div);
    rect = toPlainRect(0, 0, root.offsetWidth, root.offsetHeight).translate(o.left, o.top);
  } else if (!containsOrEquals(root, elm)) {
    // IE10 throws Unspecified Error for detached elements
    rect = toPlainRect(0, 0, 0, 0);
  } else {
    rect = toPlainRect(elm.getBoundingClientRect());

    if (includeMargin === true) {
      var style = getComputedStyle(elm);
      var marginTop = Math.max(0, parseFloat(style.marginTop));
      var marginLeft = Math.max(0, parseFloat(style.marginLeft));
      var marginRight = Math.max(0, parseFloat(style.marginRight));
      var marginBottom = Math.max(0, parseFloat(style.marginBottom));
      rect = rect.expand(marginLeft, marginTop, marginRight, marginBottom);
    } else if (includeMargin) {
      rect = rect.expand(includeMargin);
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
  container = container || env_document.body;
  return any(elementsFromPoint.call(env_document, x, y), function (v) {
    return containsOrEquals(container, v) && getComputedStyle(v).pointerEvents !== 'none';
  }) || null;
}


// CONCATENATED MODULE: ./src/cssUtil.js






function parseCSS(value) {
  var styles = {};
  var div = env_document.createElement('div');
  div.setAttribute('style', value);
  each(div.style, function (i, v) {
    styles[v] = div.style[v];
  });
  return styles;
}

function isCssUrlValue(value) {
  return value && value !== 'none' && /url\((?:'(.+)'|"(.+)"|([^)]+))\)/.test(value) && (RegExp.$1 || RegExp.$2 || RegExp.$3);
}

function normalizeCSSValue(curValue) {
  if (curValue === 'matrix(1, 0, 0, 1, 0, 0)') {
    return 'none';
  }

  return curValue;
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

  var test = function test(element, pseudoElement) {
    var style = getComputedStyle(element, pseudoElement);

    if (style.transitionDuration !== '0s' || style.animationName != 'none') {
      var key = {
        element: element,
        pseudoElement: pseudoElement
      };
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
  jquery(targets).css('transition', 'none');
  setClass(element, className, true);
  var newStyle = arr.map(function (v) {
    return styleToJSON(getComputedStyle(v.element, v.pseudoElement));
  });
  setClass(element, className, false);
  var appendPseudoToAnim = env_window.AnimationEvent && 'pseudoElement' in AnimationEvent.prototype;
  var map = new Map();
  each(arr, function (i, v) {
    var pseudoElement = v.pseudoElement;
    var curStyle = getComputedStyle(v.element, pseudoElement);
    var transitionProperties = map1.get(v);
    var dict = {};
    each(curStyle, function (j, v) {
      var curValue = normalizeCSSValue(curStyle[v]);
      var newValue = normalizeCSSValue(newStyle[i][v]);

      if (curValue !== newValue) {
        var prop = removeVendorPrefix(v);
        var allowNumber = matchWord(v, 'opacity line-height');

        if (prop === 'animation-name') {
          var prevAnim = curValue.replace(/,/g, '');
          each(newValue.split(/,\s*/), function (i, v) {
            if (v !== 'none' && !matchWord(prevAnim, v)) {
              dict['@' + v + (appendPseudoToAnim && pseudoElement || '')] = true;
            }
          });
        } else if (prop === 'transform' || animatableValue(curValue, allowNumber) && animatableValue(newValue, allowNumber) && !/^scroll-limit/.test(prop)) {
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
  jquery(targets).css('transition', '');
  setClass(element, className, true);

  if (!map.size) {
    callback();
    return resolve();
  }

  return new promise_polyfill(function (resolve, reject) {
    var unbind = bind(element, 'animationend transitionend', function (e) {
      var dict = map.get(e.target) || {}; // @ts-ignore: mixed type of Event

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


// CONCATENATED MODULE: ./src/observe.js




var detachHandlers = new WeakMap();
var optionsForChildList = {
  subtree: true,
  childList: true
};

function DetachHandlerState() {
  this.handlers = [];
  this.map = new Map();
}

function observe(element, options, callback) {
  callback = throwNotFunction(callback || options);

  if (isFunction(options)) {
    options = optionsForChildList;
  }

  var processRecords = function processRecords(records) {
    records = records.filter(function (v) {
      // filter out changes due to sizzle engine
      // to prevent excessive invocation due to querying elements through jQuery
      return v.attributeName !== 'id' || (v.oldValue || '').slice(0, 6) !== 'sizzle' && v.target.id !== (v.oldValue || '');
    });

    if (records[0]) {
      callback(records);
    }
  };

  var observer = new MutationObserver(processRecords);
  observer.observe(element, options);
  return function () {
    processRecords(observer.takeRecords());
  };
}

function registerCleanup(callback) {
  var state = initDetachWatcher(root);
  state.handlers.push(throwNotFunction(callback));
}

function afterDetached(element, from, callback) {
  if (!is(from, Node)) {
    callback = from;
    from = root;
  }

  var promise;

  if (!isFunction(callback)) {
    promise = new promise_polyfill(function (resolve) {
      callback = resolve;
    });
  }

  var state = initDetachWatcher(from);
  mapGet(state.map, element, Array).push(callback);
  return promise;
}

function watchElements(element, selector, callback, fireInit) {
  var collection = new Set();
  var add = collection.add.bind(collection);
  var remove = collection.delete.bind(collection);
  var options = extend({}, optionsForChildList, {
    attributes: selector.indexOf('[') >= 0
  });
  observe(element, options, function () {
    var matched = selectIncludeSelf(selector, element);
    var removedNodes = grep(collection, function (v) {
      return matched.indexOf(v) < 0;
    });
    var addedNodes = matched.filter(function (v) {
      return !collection.has(v);
    });

    if (addedNodes[0] || removedNodes[0]) {
      addedNodes.forEach(add);
      removedNodes.forEach(remove);
      callback(addedNodes, removedNodes);
    }
  });

  if (fireInit) {
    domReady.then(function () {
      var matched = selectIncludeSelf(selector, element);

      if (matched[0]) {
        matched.forEach(add);
        callback(matched, []);
      }
    });
  }
}

function watchAttributes(element, attributes, callback, fireInit) {
  var options = {
    subtree: true,
    attributes: true,
    attributeFilter: makeArray(attributes)
  };
  observe(element, options, function (records) {
    var set = new Set();
    each(records, function (i, v) {
      set.add(v.target);
    });
    callback(makeArray(set));
  });

  if (fireInit) {
    domReady.then(function () {
      var matched = selectIncludeSelf('[' + options.attributeFilter.join('],[') + ']', element);

      if (matched[0]) {
        callback(matched);
      }
    });
  }
}

function initDetachWatcher(element) {
  return mapGet(detachHandlers, element, function () {
    var state = new DetachHandlerState();
    observe(element, function (records) {
      var removedNodes = map(records, function (v) {
        return grep(v.removedNodes, function (v) {
          return v.nodeType === 1 && !containsOrEquals(element, v);
        });
      });

      if (removedNodes[0]) {
        state.handlers.forEach(function (callback) {
          callback(removedNodes.slice(0));
        });
        each(state.map, function (child, handlers) {
          if (!containsOrEquals(element, child) && mapRemove(state.map, child)) {
            handlers.forEach(function (callback) {
              callback(child);
            });
          }
        });
      }
    });
    return state;
  });
}


// CONCATENATED MODULE: ./src/constants.js
/**
 *  Key code mapping for keyboard events.
 *  @type {Record<number, string>}
 */
var KEYNAMES = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  19: 'pause',
  20: 'capsLock',
  27: 'escape',
  32: 'space',
  33: 'pageUp',
  34: 'pageDown',
  35: 'end',
  36: 'home',
  37: 'leftArrow',
  38: 'upArrow',
  39: 'rightArrow',
  40: 'downArrow',
  45: 'insert',
  46: 'delete',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  65: 'a',
  66: 'b',
  67: 'c',
  68: 'd',
  69: 'e',
  70: 'f',
  71: 'g',
  72: 'h',
  73: 'i',
  74: 'j',
  75: 'k',
  76: 'l',
  77: 'm',
  78: 'n',
  79: 'o',
  80: 'p',
  81: 'q',
  82: 'r',
  83: 's',
  84: 't',
  85: 'u',
  86: 'v',
  87: 'w',
  88: 'x',
  89: 'y',
  90: 'z',
  91: 'leftWindow',
  92: 'rightWindowKey',
  93: 'select',
  96: 'numpad0',
  97: 'numpad1',
  98: 'numpad2',
  99: 'numpad3',
  100: 'numpad4',
  101: 'numpad5',
  102: 'numpad6',
  103: 'numpad7',
  104: 'numpad8',
  105: 'numpad9',
  106: 'multiply',
  107: 'add',
  109: 'subtract',
  110: 'decimalPoint',
  111: 'divide',
  112: 'f1',
  113: 'f2',
  114: 'f3',
  115: 'f4',
  116: 'f5',
  117: 'f6',
  118: 'f7',
  119: 'f8',
  120: 'f9',
  121: 'f10',
  122: 'f11',
  123: 'f12',
  144: 'numLock',
  145: 'scrollLock',
  186: 'semiColon',
  187: 'equalSign',
  188: 'comma',
  189: 'dash',
  190: 'period',
  191: 'forwardSlash',
  192: 'backtick',
  219: 'openBracket',
  220: 'backSlash',
  221: 'closeBracket',
  222: 'singleQuote'
};
// CONCATENATED MODULE: ./src/domLock.js
function domLock_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { domLock_typeof = function _typeof(obj) { return typeof obj; }; } else { domLock_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return domLock_typeof(obj); }







var lockedElements = new WeakMap();
var handledErrors = new WeakMap();

var _ = createPrivateStore();

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
  var self = this;

  _(self, {
    promises: new Map()
  });

  self.element = element;
  lockedElements.set(element, self);
  afterDetached(element, removeLock);
}

definePrototype(DOMLock, {
  get locked() {
    return _(this).promises.size > 0;
  },

  cancel: function cancel(force) {
    var self = this;

    var state = _(self);

    var promises = state.promises;

    if (force || !promises.size) {
      if (promises.size) {
        // @ts-ignore: unable to reflect on interface member
        emitDOMEvent('cancelled', null, self.element);
      } // remove all promises from the dictionary so that
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
  wait: function wait(promise, oncancel) {
    var self = this;

    var state = _(self);

    var promises = state.promises;

    var finish = function finish() {
      if (promises.delete(promise) && !promises.size) {
        emitDOMEvent('asyncEnd', null, self.element);
        self.cancel(true);
      }
    };

    promises.set(promise, retryable(oncancel === true ? resolve : oncancel || reject, finish));

    if (promises.size === 1) {
      var callback = {};
      var deferred = new promise_polyfill(function (resolve, reject) {
        callback.resolve = resolve;
        callback.reject = reject;
      });
      state.deferred = extend(deferred, callback);

      for (var parent = self.element.parentNode; parent && !lockedElements.has(parent); parent = parent.parentNode) {
        ;
      }

      if (parent) {
        lockedElements.get(parent).wait(deferred, self.cancel.bind(self));
      }

      emitDOMEvent('asyncStart', null, self.element);
    }

    promise.catch(function (error) {
      if (error && !handledErrors.has(error)) {
        emitDOMEvent('error', null, self.element, {
          error: error
        }, true); // avoid firing error event for the same error for multiple target
        // while propagating through the promise chain

        if (domLock_typeof(error) === 'object') {
          handledErrors.set(error, true);
        }
      }

      finish();
    });
    return promise.then(function (value) {
      var cancelled = !promises.has(promise);
      finish(); // the returned promise will be rejected
      // if the current lock has been released or cancelled

      return cancelled ? reject('user_cancelled') : value;
    });
  }
});
lock(root);

env_window.onbeforeunload = function (e) {
  if (locked(root)) {
    e.returnValue = '';
    e.preventDefault();
  }
};


// CONCATENATED MODULE: ./src/dom.js








var SELECTOR_FOCUSABLE = ':input,[contenteditable],a[href],area[href],iframe';
var META_KEYS = [16, 17, 18, 91, 93];
var focusPath = [];
var focusFriends = new WeakMap();
var focusElements = new Set();
var modalElements = new Map();
var windowFocusedOut;
var currentEvent;
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
/* --------------------------------------
 * Focus management
 * -------------------------------------- */


function focused(element, strict) {
  // @ts-ignore: activeElement is not null
  return element === env_window ? !windowFocusedOut : focusElements.has(element) && (!strict || containsOrEquals(element, env_document.activeElement));
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
    return jquery(v).find(element)[0] && i;
  });
}

function triggerFocusEvent(eventName, elements, relatedTarget, source) {
  var data = {
    relatedTarget: relatedTarget
  };
  each(elements, function (i, v) {
    emitDOMEvent(eventName, v, data, {
      source: source,
      handleable: false
    });
  });
}

function setFocus(element, focusOnInput, source, path) {
  if (focusOnInput && !is(element, SELECTOR_FOCUSABLE)) {
    element = jquery(SELECTOR_FOCUSABLE, element).filter(':visible:not(:disabled,.disabled)')[0] || element;
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
  } // check whether the element is still attached in ROM
  // which can be detached while dispatching focusout event above


  if (containsOrEquals(root, element)) {
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

    var activeElement = env_document.activeElement;

    if (path[0] !== activeElement) {
      path[0].focus(); // ensure previously focused element is properly blurred
      // in case the new element is not focusable

      if (activeElement && activeElement !== env_document.body && activeElement !== root && env_document.activeElement === activeElement) {
        // @ts-ignore: activeElement is HTMLElement
        activeElement.blur();
      }
    }

    return true;
  }
}

function setModal(element, within) {
  var focusWithin = is(within, Node) || root;

  if (!focused(focusWithin)) {
    setFocus(focusWithin);
  }

  modalElements.set(element, focusPath.splice(0, focusWithin === root || env_document.body ? focusPath.length : focusPath.indexOf(focusWithin)));
  setFocus(element);
}

function retainFocus(a, b) {
  focusFriends.set(b, a);
}

function releaseFocus(b) {
  focusFriends.delete(b);
}
/* --------------------------------------
 * DOM event handling
 * -------------------------------------- */


domReady.then(function () {
  var body = env_document.body;
  var modifierCount;
  var modifiedKeyCode;
  var mouseInitialPoint;
  var mousedownFocus;
  var normalizeTouchEvents;
  var pressTimeout;
  var imeNode;
  var imeOffset;
  var imeText;

  function getEventName(e, suffix) {
    var mod = (e.ctrlKey || e.metaKey ? 'Ctrl' : '') + (e.altKey ? 'Alt' : '') + (e.shiftKey ? 'Shift' : '');
    return mod ? lcfirst(mod + ucfirst(suffix)) : suffix;
  }

  function updateIMEState() {
    var element = env_document.activeElement || root;
    var selection = getSelection();

    if (!selection) {
      return;
    }

    if ('selectionEnd' in element) {
      imeNode = element; // @ts-ignore: guranteed having selectionEnd property

      imeOffset = element.selectionEnd;
    } else {
      imeNode = selection.anchorNode;
      imeOffset = selection.anchorOffset;

      if (imeNode && imeNode.nodeType === 1) {
        // IE puts selection at element level
        // however it will insert text in the previous text node
        var child = imeNode.childNodes[imeOffset - 1];

        if (child && child.nodeType === 3) {
          imeNode = child; // @ts-ignore: child is Text

          imeOffset = child.length;
        } else {
          imeNode = imeNode.childNodes[imeOffset];
          imeOffset = 0;
        }
      }
    }
  }

  function triggerUIEvent(eventName, data, target) {
    return emitDOMEvent(eventName, target || focusPath[0], data, {
      bubbles: true,
      originalEvent: currentEvent
    });
  }

  function triggerKeystrokeEvent(keyName, char) {
    var data = {
      data: keyName,
      char: char
    };
    lastEventSource.sourceKeyName = keyName;

    if (triggerUIEvent('keystroke', data)) {
      currentEvent.preventDefault();
      return true;
    }
  }

  function triggerMouseEvent(eventName) {
    var point = mouseInitialPoint || currentEvent;
    var data = {
      target: currentEvent.target,
      clientX: point.clientX,
      clientY: point.clientY,
      metakey: getEventName(currentEvent) || ''
    };
    return triggerUIEvent(eventName, data, currentEvent.target);
  }

  function triggerGestureEvent(gesture) {
    mouseInitialPoint = null;
    return triggerUIEvent('gesture', gesture, focusPath.slice(-1)[0]);
  }

  function handleUIEventWrapper(type, callback) {
    return function (e) {
      currentEvent = e;
      setTimeout(function () {
        currentEvent = null;
      });
      setLastEventSource(null);

      if (!focusable(e.target)) {
        e.stopImmediatePropagation();
        e.preventDefault();

        if (matchWord(type, 'touchstart mousedown keydown')) {
          emitDOMEvent('focusreturn', focusPath.slice(-1)[0]);
        }
      }

      setLastEventSource(e.target);
      callback(e);
    };
  }

  var uiEvents = {
    compositionstart: function compositionstart() {
      updateIMEState();
      imeText = '';
    },
    compositionupdate: function compositionupdate(e) {
      imeText = e.data;
    },
    compositionend: function compositionend(e) {
      var isInputElm = ('selectionEnd' in imeNode);
      var prevText = imeText;
      var prevOffset = imeOffset;
      updateIMEState();
      var curText = imeNode.value || imeNode.data || '';
      imeText = e.data; // some IME lacks inserted character sequence when selecting from phrase candidate list
      // also legacy Microsoft Changjie IME reports full-width spaces (U+3000) instead of actual characters

      if (!imeText || /^\u3000+$/.test(imeText)) {
        imeText = curText.slice(prevOffset, imeOffset);
      } // some old mobile browsers fire compositionend event before replacing final character sequence
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

      if (!triggerUIEvent('textInput', imeText)) {
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
    textInput: function textInput(e) {
      // required for older mobile browsers that do not support beforeinput event
      // ignore in case browser fire textInput before/after compositionend
      if (!imeNode && (e.data === imeText || triggerUIEvent('textInput', e.data))) {
        e.preventDefault();
      }
    },
    keydown: function keydown(e) {
      if (!imeNode) {
        var keyCode = e.keyCode;
        var isModifierKey = META_KEYS.indexOf(keyCode) >= 0;

        if (isModifierKey && keyCode !== modifiedKeyCode) {
          triggerUIEvent('metakeychange', getEventName(e));
        }

        var isSpecialKey = !isModifierKey && (KEYNAMES[keyCode] || '').length > 1 && !(keyCode >= 186 || keyCode >= 96 && keyCode <= 111); // @ts-ignore: boolean arithmetic

        modifierCount = e.ctrlKey + e.shiftKey + e.altKey + e.metaKey + !isModifierKey; // @ts-ignore: boolean arithmetic

        modifierCount *= isSpecialKey || (modifierCount > 2 || modifierCount > 1 && !e.shiftKey) && !isModifierKey;
        modifiedKeyCode = keyCode;

        if (modifierCount) {
          triggerKeystrokeEvent(getEventName(e, KEYNAMES[keyCode] || e.key), keyCode === 32 ? ' ' : '');
        }
      }
    },
    keyup: function keyup(e) {
      var isModifierKey = META_KEYS.indexOf(e.keyCode) >= 0;

      if (!imeNode && (isModifierKey || modifiedKeyCode === e.keyCode)) {
        modifiedKeyCode = null;
        modifierCount--;

        if (isModifierKey) {
          triggerUIEvent('metakeychange', getEventName(e) || '');
        }
      }
    },
    keypress: function keypress(e) {
      var data = e.char || e.key || String.fromCharCode(e.charCode); // @ts-ignore: non-standard member

      if (!imeNode && !modifierCount && (e.synthetic || !('onbeforeinput' in e.target))) {
        triggerKeystrokeEvent(getEventName(e, KEYNAMES[modifiedKeyCode] || data), data);
      }
    },
    beforeinput: function beforeinput(e) {
      if (!imeNode && e.cancelable) {
        switch (e.inputType) {
          case 'insertText':
            return triggerUIEvent('textInput', e.data);

          case 'deleteContent':
          case 'deleteContentBackward':
            return triggerKeystrokeEvent('backspace', '');

          case 'deleteContentForward':
            return triggerKeystrokeEvent('delete', '');
        }
      }
    },
    touchstart: function touchstart(e) {
      // @ts-ignore: e.target is Element
      var container = getEventContext(e.target);
      normalizeTouchEvents = container.normalizeTouchEvents;
      mouseInitialPoint = extend({}, e.touches[0]);

      if (!e.touches[1]) {
        // @ts-ignore: e.target is Element
        if (normalizeTouchEvents && focused(container.element)) {
          triggerMouseEvent('mousedown');
        }

        pressTimeout = setTimeout(function () {
          if (mouseInitialPoint) {
            triggerMouseEvent('longPress');
            mouseInitialPoint = null;
          }
        }, 1000);
      }
    },
    touchmove: function touchmove(e) {
      clearTimeout(pressTimeout);
      pressTimeout = null;

      if (mouseInitialPoint) {
        if (!e.touches[1]) {
          var line = measureLine(e.touches[0], mouseInitialPoint);

          if (line.length > 50 && approxMultipleOf(line.deg, 90)) {
            triggerGestureEvent('swipe' + (approxMultipleOf(line.deg, 180) ? line.dx > 0 ? 'Right' : 'Left' : line.dy > 0 ? 'Bottom' : 'Top'));
          }
        } else if (!e.touches[2]) {
          triggerGestureEvent('pinchZoom');
        }
      }
    },
    touchend: function touchend(e) {
      clearTimeout(pressTimeout);

      if (normalizeTouchEvents && mouseInitialPoint && pressTimeout) {
        setFocus(e.target);
        triggerMouseEvent('click');
        dispatchDOMMouseEvent('click', mouseInitialPoint, e);
        e.preventDefault();
      }
    },
    mousedown: function mousedown(e) {
      setFocus(e.target);

      if ((e.buttons || e.which) === 1) {
        triggerMouseEvent('mousedown');
      }

      mouseInitialPoint = e;
      mousedownFocus = env_document.activeElement;
    },
    mousemove: function mousemove(e) {
      if (mouseInitialPoint && measureLine(e, mouseInitialPoint).length > 5) {
        mouseInitialPoint = null;
      }
    },
    mouseup: function mouseup() {
      if (mousedownFocus && env_document.activeElement !== mousedownFocus) {
        mousedownFocus.focus();
      }
    },
    wheel: function wheel(e) {
      // @ts-ignore: e.target is Element
      if (containsOrEquals(e.target, focusPath[0]) || !textInputAllowed(e.target)) {
        var dir = e.deltaY || e.detail;

        if (dir && triggerUIEvent('mousewheel', dir / Math.abs(dir) * (IS_MAC ? -1 : 1))) {
          e.preventDefault();
        }
      }
    },
    click: function click(e) {
      if (!IS_TOUCH && mouseInitialPoint) {
        triggerMouseEvent('click');
      }
    },
    contextmenu: function contextmenu(e) {
      triggerMouseEvent('rightClick');
    },
    dblclick: function dblclick(e) {
      triggerMouseEvent('dblclick');
    }
  };
  each(uiEvents, function (i, v) {
    bind(root, i, matchWord(i, 'mousemove touchmove') ? v : handleUIEventWrapper(i, v), true);
  });
  bind(root, {
    focusin: function focusin(e) {
      windowFocusedOut = false;

      if (focusable(e.target)) {
        setFocus(e.target, false, lastEventSource);
      } else {
        // @ts-ignore: e.target is Element
        e.target.blur();
      }
    },
    focusout: function focusout(e) {
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
  bind(env_window, {
    wheel: function wheel(e) {
      // scrolling will happen on first scrollable element up the DOM tree
      // prevent scrolling if interaction on such element should be blocked by modal element
      var deltaX = -e.deltaX;
      var deltaY = -e.deltaY; // @ts-ignore: e.target is Element

      for (var cur = e.target; cur && cur !== root; cur = cur.parentNode) {
        // @ts-ignore: e.target is Element
        var style = getComputedStyle(cur); // @ts-ignore: e.target is Element

        if (cur.scrollWidth > cur.offsetWidth && matchWord(style.overflowX, 'auto scroll') && (deltaX > 0 && cur.scrollLeft > 0 || deltaX < 0 && cur.scrollLeft + cur.offsetWidth < cur.scrollWidth)) {
          break;
        } // @ts-ignore: e.target is Element


        if (cur.scrollHeight > cur.offsetHeight && matchWord(style.overflowY, 'auto scroll') && (deltaY > 0 && cur.scrollTop > 0 || deltaY < 0 && cur.scrollTop + cur.offsetHeight < cur.scrollHeight)) {
          break;
        }
      }

      if (!focusable(cur)) {
        e.preventDefault();
      }
    },
    blur: function blur(e) {
      if (e.target === env_window) {
        windowFocusedOut = true;
      }
    }
  });
  registerCleanup(function () {
    each(modalElements, function (element, modelPath) {
      if (!containsOrEquals(root, element) && mapRemove(modalElements, element) && focused(element)) {
        var path = any(modalElements, function (w) {
          return w.indexOf(element) >= 0;
        }) || focusPath;
        path.push.apply(path, modelPath);
        setFocus(modelPath[0], false, null, path);
      }
    });

    for (var i = focusPath.length - 1; i >= 0; i--) {
      if (!containsOrEquals(root, focusPath[i])) {
        setFocus(focusPath[i + 1] || body);
        break;
      }
    }
  });
  setFocus(env_document.activeElement);
});
/* --------------------------------------
 * Exports
 * -------------------------------------- */

function dom_focus(element) {
  setFocus(element, true);
}

/* harmony default export */ const src_dom = ({
  get event() {
    return currentEvent;
  },

  get context() {
    return getEventContext(focusPath[0]).context;
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

  root: root,
  ready: domReady,
  textInputAllowed: textInputAllowed,
  focusable: focusable,
  focused: focused,
  setModal: setModal,
  retainFocus: retainFocus,
  releaseFocus: releaseFocus,
  focus: dom_focus,
  getEventSource: getEventSource,
  on: listenDOMEvent,
  emit: emitDOMEvent,
  lock: lock,
  locked: locked,
  cancelLock: cancelLock,
  observe: observe,
  registerCleanup: registerCleanup,
  afterDetached: afterDetached,
  watchElements: watchElements,
  watchAttributes: watchAttributes
});

// CONCATENATED MODULE: ./src/events.js






var events_ = createPrivateStore();

var containers = new WeakMap();
var domEventTrap = new ZetaEventContainer();
var domContainer = new ZetaEventContainer();
var asyncEventData = new Map();
var asyncEvents = [];
var eventSource;
var lastEventSource;
/* --------------------------------------
 * Helper functions
 * -------------------------------------- */

function ZetaEventSource(target, path) {
  var self = this;
  path = path || (eventSource ? eventSource.path : src_dom.focusedElements);
  self.path = path;
  self.source = 'script';

  if (containsOrEquals(path[0] || root, target) || path.indexOf(target) >= 0) {
    self.source = eventSource ? eventSource.source : getEventSourceName();
  }

  self.sourceKeyName = self.source !== 'keyboard' ? null : (eventSource || lastEventSource || '').sourceKeyName;
}

function setLastEventSource(source) {
  lastEventSource = new ZetaEventSource(source);
}

function prepEventSource(promise) {
  var source = eventSource || new ZetaEventSource(dom.activeElement);

  var wrap = function wrap(callback) {
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
    then: function then(a, b) {
      return promise.then(a && wrap(a), b && wrap(b));
    },
    catch: function _catch(a) {
      return promise.catch(a && wrap(a));
    }
  };
}

function getEventSource(element) {
  return element ? new ZetaEventSource(element).source : getEventSourceName();
}

function getEventSourceName() {
  var event = src_dom.event || env_window.event;
  var type = event && event.type || '';
  return type[0] === 'k' || type.substr(0, 3) === 'com' ? 'keyboard' : type[0] === 't' ? 'touch' : type[0] === 'm' || matchWord(type, 'wheel click dblclick contextmenu') ? 'mouse' : matchWord(type, 'drop cut copy paste') || 'script';
}

function getEventContext(element) {
  for (var cur = element; cur && !containers.has(cur); cur = cur.parentNode) {
    ;
  }

  var container = mapGet(containers, cur) || domContainer;
  return events_(container).options;
}

function normalizeEventOptions(options) {
  if (typeof options === 'boolean') {
    options = {
      bubbles: options
    };
  }

  return extend({
    handleable: true,
    asyncResult: true
  }, options);
}

function emitDOMEvent(eventName, target, data, options) {
  var emitter = new ZetaEventEmitter(eventName, domContainer, target, data, normalizeEventOptions(options));
  return emitter.emit(domEventTrap, 'tap', target, true) || emitter.emit();
}

function listenDOMEvent(element, event, handler) {
  if (!is(element, Node)) {
    handler = event;
    event = element;
    element = root;
  }

  return domContainer.add(element, event, handler);
}

function registerAsyncEvent(eventName, container, target, data, options, mergeData) {
  var map = mapGet(asyncEventData, container, Map);
  var dict = mapGet(map, target || container.element, Object);

  if (dict[eventName] && (isFunction(mergeData) || data === undefined && dict[eventName].data === undefined)) {
    dict[eventName].data = mergeData && mergeData(dict[eventName].data, data);
  } else {
    dict[eventName] = new ZetaEventEmitter(eventName, container, target, data, normalizeEventOptions(options));
    asyncEvents.push(dict[eventName]);
    setImmediateOnce(emitAsyncEvents);
  }
}

function removeAsyncEvent(eventName, container, target) {
  var map = mapGet(asyncEventData, container);
  var dict = map && mapGet(map, target);

  if (dict && dict[eventName]) {
    var event = dict[eventName];
    delete dict[eventName];
    asyncEvents.splice(asyncEvents.indexOf(event), 1);
    return event.data || {
      data: event.data
    };
  }
}

function emitAsyncEvents(container) {
  var events;

  if (!container) {
    events = asyncEvents.splice(0);
    asyncEventData.clear();
  } else if (mapRemove(asyncEventData, container)) {
    events = splice(asyncEvents, function (v) {
      return v.container === container;
    });
  }

  each(events, function (i, v) {
    v.emit();
  });
}
/* --------------------------------------
 * ZetaEventEmitter
 * -------------------------------------- */


function ZetaEventEmitter(eventName, container, target, data, options) {
  target = target || container.element;
  var source = options.source || new ZetaEventSource(target);
  var properties = {
    source: source.source,
    sourceKeyName: source.sourceKeyName,
    timestamp: performance.now(),
    originalEvent: options.originalEvent || null
  };
  extend(this, options, properties, {
    container: container,
    eventName: eventName,
    target: target,
    data: data,
    bubbles: !!options.bubbles,
    properties: properties,
    sourceObj: source
  });
}

definePrototype(ZetaEventEmitter, {
  emit: function emit(container, eventName, target, bubbles) {
    var self = this;
    container = container || self.container;

    if (bubbles === undefined) {
      bubbles = self.bubbles;
    }

    var components = events_(container).components; // @ts-ignore: type inference issue


    var targets = !bubbles ? [target || self.target] : self.originalEvent && target === undefined ? self.sourceObj.path : parentsAndSelf(target || self.target);
    single(targets, function (v) {
      var component = components.get(v);
      return component && emitterCallHandlers(self, component, self.eventName, eventName, self.data);
    });
    return self.result;
  }
});

function emitterCallHandlers(emitter, component, eventName, handlerName, data, isAliasEvent) {
  if (matchWord(eventName, 'keystroke gesture') && emitterCallHandlers(emitter, component, data.data, handlerName, null, true)) {
    return true;
  }

  if (data === undefined) {
    data = removeAsyncEvent(eventName, component.container, context);
  }

  var handlers = component.handlers[handlerName || eventName];
  var handled;

  if (handlers) {
    var context = component.context;
    var contextContainer = is(context, ZetaEventContainer) || component.container;
    var event = new ZetaEvent(emitter, eventName, component, data);
    var prevEventSource = eventSource;
    var prevEvent = contextContainer.event;
    contextContainer.event = event;
    eventSource = emitter.sourceObj;
    emitter.isAliasEvent = isAliasEvent;
    handled = single(handlers, function (v) {
      try {
        var returnValue = v.call(context, event, context);

        if (returnValue !== undefined) {
          event.handled(returnValue);
        }
      } catch (e) {
        console.error(e);

        if (emitter.asyncResult) {
          event.handled(reject(e));
        }
      }

      return emitter.handled;
    });
    eventSource = prevEventSource;
    contextContainer.event = prevEvent;
  }

  if (!handled && eventName === 'keystroke' && data.char && textInputAllowed(emitter.target)) {
    return emitterCallHandlers(emitter, component, 'textInput', handlerName, data.char, true);
  }

  return handled;
}
/* --------------------------------------
 * ZetaEvent
 * -------------------------------------- */


function ZetaEvent(event, eventName, component, data) {
  var self = extend(this, event.properties);
  self.eventName = eventName;
  self.type = eventName;
  self.context = component.context;
  self.currentTarget = component.element;
  self.target = containsOrEquals(event.target, component.element) ? component.element : event.target;
  self.data = null;

  if (isPlainObject(data)) {
    extend(self, data);
  } else if (data !== undefined) {
    self.data = data;
  }

  events_(self, event);
}

definePrototype(ZetaEvent, {
  handled: function handled(value) {
    var event = events_(this);

    if (event.handleable && !event.handled) {
      event.handled = true;
      event.result = event.asyncResult ? resolve(value) : value;
    }
  },
  isHandled: function isHandled() {
    return !!events_(this).handled;
  },
  preventDefault: function preventDefault() {
    var event = this.originalEvent;

    if (event) {
      event.preventDefault();
    }
  },
  isDefaultPrevented: function isDefaultPrevented() {
    return !!(this.originalEvent || events_(this)).defaultPrevented;
  }
});
/* --------------------------------------
 * ZetaEventContainer
 * -------------------------------------- */

function ZetaEventContainer(element, context, options) {
  var self = this;
  options = extend({
    element: element || root,
    context: context || null,
    autoDestroy: containsOrEquals(root, element),
    normalizeTouchEvents: false,
    captureDOMEvents: false
  }, options);

  events_(self, {
    options: options,
    components: new Map()
  });

  extend(self, options);

  if (element && self.captureDOMEvents) {
    domEventTrap.setContext(element, self);
    containers.set(element, self);
  }

  if (self.autoDestroy) {
    afterDetached(element, function () {
      self.destroy();
    });
  }
}

definePrototype(ZetaEventContainer, {
  event: null,
  tap: function tap(handler) {
    domEventTrap.add(this.element, 'tap', handler);
  },
  getContext: function getContext(element) {
    var components = events_(this).components;

    var component;

    for (var cur = element; cur && !component; cur = cur.parentNode) {
      component = components.get(cur);
    }

    return component && component.context;
  },
  setContext: function setContext(element, context) {
    containerCreateContext(this, element, context);
  },
  add: function add(target, event, handler) {
    var self = this;
    var key = randomId();
    var handlers = containerCreateContext(self, target).handlers;
    each(isPlainObject(event) || kv(event, handler), function (i, v) {
      var dict = handlers[i] || (handlers[i] = {});
      dict[key] = throwNotFunction(v);
    });
    return function () {
      each(handlers, function (i, v) {
        delete v[key];

        if (!keys(v)[0]) {
          delete handlers[i];
        }
      });

      if (!keys(handlers)[0]) {
        self.delete(target);
      }
    };
  },
  delete: function _delete(target) {
    var self = this;
    var component = mapRemove(events_(self).components, target);

    if (component && self.captureDOMEvents) {
      containers.delete(component.element);
    }
  },
  emit: function emit(eventName, target, data, bubbles) {
    var options = normalizeEventOptions(bubbles);
    var emitter = is(eventName, ZetaEvent) ? events_(eventName) : new ZetaEventEmitter(eventName, this, target, data, options);

    if (!emitter.isAliasEvent) {
      return emitter.emit(this, null, target, options.bubbles);
    }
  },
  emitAsync: function emitAsync(eventName, target, data, bubbles, mergeData) {
    registerAsyncEvent(eventName, this, target, data, bubbles, mergeData);
  },
  flushEvents: function flushEvents() {
    emitAsyncEvents(this);
  },
  destroy: function destroy() {
    var self = this;

    if (self.captureDOMEvents) {
      domEventTrap.delete(self.element);
      containers.delete(self.element);
      each(events_(self).components, function (i) {
        containers.delete(i);
      });
    }
  }
});

function containerCreateContext(container, element, context) {
  var cur = mapGet(events_(container).components, element, function () {
    return {
      container: container,
      element: element,
      context: context || element,
      handlers: {}
    };
  });

  if (context && (cur.context || context) !== context) {
    throw new Error('Element has already been set to another context');
  }

  if (container.captureDOMEvents && is(element, Element)) {
    containers.set(element, container);
  }

  return cur;
}


// CONCATENATED MODULE: ./src/tree.js






var tree_ = createPrivateStore();

var setPrototypeOf = Object.setPrototypeOf;
var collectMutations = observe(src_dom.root, handleMutations);
/** @type {WeakMap<Element, VersionState>} */

var versionMap = new WeakMap();
var version = 0;
/* --------------------------------------
 * Helper functions
 * -------------------------------------- */

function throwOrReturn(result, throwError, message) {
  if (!result && throwError) {
    throw new Error(message);
  }

  return result;
}

function assertSameTree(tree, node, throwError) {
  var assert = tree_(node).tree === tree;
  return throwOrReturn(assert, throwError, 'Node does not belongs to this tree');
}

function assertDescendantOfTree(tree, element, throwError) {
  var assert = containsOrEquals(tree, element);
  return throwOrReturn(assert, throwError, 'Element must be a descendant of the root node');
}
/**
 * @class
 * @property {number} version
 */


function VersionState() {
  this.version = version;
}

function initNode(tree, node, element) {
  var sNode = tree_(node, {
    version: version,
    tree: tree,
    node: node,
    traversable: is(node, TraversableNode),
    state: mapGet(versionMap, element, VersionState),
    childNodes: []
  });

  (containsOrEquals(tree.element, element) ? tree_(tree).nodes : tree_(tree).detached).set(element, sNode);
  defineHiddenProperty(node, 'element', element, true);

  if (tree.rootNode) {
    insertNode(sNode);
  }

  return sNode;
}

function findNode(tree, element, returnParent) {
  var sTree = tree_(tree);

  var sNode = sTree.nodes.get(element) || sTree.detached.get(element) || returnParent && findParent(tree, element);
  return sNode && checkNodeState(sNode);
}

function findParent(tree, element) {
  if (!element) {
    element = tree.node.element;
    tree = tree.tree;
  }

  if (element !== tree.element) {
    var sTree = tree_(tree);

    element = element.parentNode;

    for (; element && element !== tree.element; element = element.parentNode) {
      var result = sTree.nodes.get(element) || sTree.detached.get(element);

      if (result) {
        return result;
      }
    }
  }

  return containsOrEquals(tree, element) && tree_(tree.rootNode);
}

function checkNodeState(sNode) {
  collectMutations();

  if (sNode.version !== sNode.state.version) {
    updateTree(sNode.tree);
  }

  return sNode;
}

function insertNode(sNode) {
  return (sNode.traversable ? insertTraversableNode : insertInheritedNode)(sNode);
}

function tree_removeNode(sNode, hardRemove) {
  return (sNode.traversable ? removeTraversableNode : removeInheritedNode)(sNode, hardRemove);
}

function removeNodeFromMap(sNode, permanent) {
  var sTree = tree_(sNode.tree);

  var element = sNode.node.element;

  if (!mapRemove(sTree.nodes, element)) {
    // the node is already removed from the tree
    // therefore nothing to do
    return false;
  }

  if (!permanent) {
    sTree.detached.set(element, sNode);
  }

  return tree_removeNode(sNode, true);
}

function insertChildNode(sParent, sChild) {
  if (!sParent || sParent === sChild || sChild.parentNode === sParent.node) {
    return false;
  }

  if (sChild.parentNode) {
    tree_removeNode(sChild);
  }

  var childNodes = sChild.childNodes;
  var parentChildNodes = sParent.childNodes;
  var pos = parentChildNodes.length;

  for (var i = pos - 1; i >= 0; i--) {
    var v = comparePosition(parentChildNodes[i], sChild.node, true);

    if (v < 0) {
      break;
    }

    pos = i;

    if (v !== v) {
      tree_(parentChildNodes[i]).parentNode = sChild.node;
      childNodes.unshift(parentChildNodes.splice(i, 1)[0]);
    }
  }

  sChild.parentNode = sParent.node;
  parentChildNodes.splice(pos, 0, sChild.node);
  return [pos, childNodes, parentChildNodes];
}

function insertTraversableNode(sNode) {
  var sParent = findParent(sNode);
  var result = insertChildNode(sParent, sNode);

  if (result) {
    var empty = {};
    var childNodes = result[1];

    if (childNodes[0]) {
      var s1 = tree_(childNodes[0]);

      var s2 = tree_(childNodes[childNodes.length - 1]);

      var previousSibling = s1.previousSibling;
      var nextSibling = s2.nextSibling;
      (tree_(previousSibling) || empty).nextSibling = nextSibling;
      (tree_(nextSibling) || empty).previousSibling = previousSibling;
      (s1 || empty).previousSibling = null;
      (s2 || empty).nextSibling = null;
    }

    var parentChildNodes = result[2];

    if (parentChildNodes[1]) {
      var pos = result[0];
      var p1 = parentChildNodes[pos - 1];
      var p2 = parentChildNodes[pos + 1];
      sNode.nextSibling = p2;
      sNode.previousSibling = p1;
      (tree_(p1) || empty).nextSibling = sNode.node;
      (tree_(p2) || empty).previousSibling = sNode.node;
    }
  }

  return !!result;
}

function insertInheritedNode(sNode) {
  var sParent = findParent(sNode);
  var result = insertChildNode(sParent, sNode);

  if (result) {
    setPrototypeOf(sNode.node, sParent.node);
    each(result[1], function (i, v) {
      setPrototypeOf(v, sNode.node);
    });
  }

  return !!result;
}

function removeTraversableNode(sNode, hardRemove, ignoreSibling) {
  var parent = sNode.parentNode;

  if (!parent) {
    return false;
  }

  var newParent = (hardRemove || findParent(sNode) || '').node;

  if (newParent === parent) {
    return false;
  }

  var childNodes = [];

  var parentChildNodes = tree_(parent).childNodes;

  var pos = parentChildNodes.indexOf(sNode.node);

  if (hardRemove) {
    childNodes = sNode.childNodes.splice(0);

    if (!ignoreSibling && childNodes[0]) {
      var states = map(childNodes, function (v) {
        return tree_(v);
      });
      states[0].previousSibling = parentChildNodes[pos - 1];
      states[states.length - 1].nextSibling = parentChildNodes[pos + 1];
      each(states, function (i, v) {
        v.parentNode = parent;
      });
    }
  }

  if (!ignoreSibling && parentChildNodes[1]) {
    var empty = {};

    var s1 = tree_(parentChildNodes[pos - 1]);

    var s2 = tree_(parentChildNodes[pos + 1]);

    (s1 || empty).nextSibling = childNodes[0] || (s2 || empty).node;
    (s2 || empty).previousSibling = childNodes[childNodes.length - 1] || (s1 || empty).node;
  }

  sNode.parentNode = newParent;
  sNode.previousSibling = null;
  sNode.nextSibling = null;
  parentChildNodes.splice.apply(parentChildNodes, [pos, 1].concat(childNodes));
  return true;
}

function removeInheritedNode(sNode, hardRemove) {
  var updated = removeTraversableNode(sNode, hardRemove, true);
  each(sNode.childNodes, function (i, v) {
    setPrototypeOf(v, sNode.parentNode);
  });
  setPrototypeOf(sNode.node, InheritedNode.prototype);
  return updated;
}

function reorderTraversableChildNodes(sNode) {
  var childNodes = sNode.childNodes;
  var copy = childNodes.slice();
  var updated = false;

  for (var i = copy.length - 1; i >= 0; i--) {
    if (!containsOrEquals(sNode.tree, copy[i])) {
      // @ts-ignore: boolean arithmetics
      updated |= removeTraversableNode(tree_(copy[i]));
    }
  }

  if (childNodes.length > 1) {
    copy = childNodes.slice(0);
    childNodes.sort(comparePosition);

    if (!equal(childNodes, copy)) {
      each(childNodes, function (i, v) {
        extend(tree_(v), {
          previousSibling: childNodes[i - 1],
          nextSibling: childNodes[i + 1]
        });
      });
      updated = true;
    }
  }

  return updated;
}

function updateTree(tree) {
  var sTree = tree_(tree);

  var updatedNodes = [];
  each(sTree.nodes, function (element, sNode) {
    var newVersion = sNode.state.version;

    if (sNode.version !== newVersion) {
      var updated = false;
      var connected = containsOrEquals(tree, element);

      if (sNode.traversable) {
        // @ts-ignore: boolean arithmetics
        updated |= reorderTraversableChildNodes(sNode);
      } // @ts-ignore: boolean arithmetics


      updated |= (connected ? insertNode : removeNodeFromMap)(sNode);
      sNode.version = newVersion;

      if (updated) {
        updatedNodes[updatedNodes.length] = sNode.node;
      }

      if (connected) {
        var iterator = createTreeWalker(element, 1, function (v) {
          return v !== element && sTree.nodes.has(v) ? 2 : 1;
        });
        iterateNode(iterator, function (element) {
          var recovered = mapRemove(sTree.detached, element);

          if (recovered) {
            insertNode(recovered);
            updatedNodes[updatedNodes.length] = recovered.node;
          }
        });
      }
    }
  });
  sTree.version = version;

  if (updatedNodes[0]) {
    sTree.container.emit('update', tree, {
      updatedNodes: updatedNodes
    }, false);
  }
}

function handleMutations(mutations) {
  var empty = {};
  each(mutations, function (i, v) {
    var addedElm = grep(v.addedNodes, function (v) {
      return is(v, 1);
    });
    var removedElm = grep(v.removedNodes, function (v) {
      return is(v, 1);
    });

    if (addedElm[0] || removedElm[0]) {
      version++;
      each(parentsAndSelf(v.target).concat(addedElm, removedElm), function (i, v) {
        (mapGet(versionMap, v) || empty).version = version;
      });
    }
  });
}
/* --------------------------------------
 * Classes
 * -------------------------------------- */


function createNodeClass(baseClass, constructor) {
  constructor = constructor || function () {};

  if (is(constructor.prototype, baseClass)) {
    return constructor;
  }

  function Node(tree, element) {
    baseClass.call(this, tree, element);
    constructor.call(this, tree, element);
  }

  definePrototype(constructor, baseClass, constructor.prototype);
  return extend(Node, {
    prototype: constructor.prototype
  });
}

function VirtualNode() {}

function TraversableNode(tree, element) {
  initNode(tree, this, element);
}

definePrototype(TraversableNode, VirtualNode, {
  get parentNode() {
    return checkNodeState(tree_(this)).parentNode || null;
  },

  get childNodes() {
    return checkNodeState(tree_(this)).childNodes.slice(0);
  },

  get firstChild() {
    return checkNodeState(tree_(this)).childNodes[0] || null;
  },

  get lastChild() {
    var arr = checkNodeState(tree_(this)).childNodes;
    return arr[arr.length - 1] || null;
  },

  get previousSibling() {
    return checkNodeState(tree_(this)).previousSibling || null;
  },

  get nextSibling() {
    return checkNodeState(tree_(this)).nextSibling || null;
  }

});

function InheritedNode(tree, element) {
  initNode(tree, this, element);
}

definePrototype(InheritedNode, VirtualNode);

function NodeTree(baseClass, root, constructor, options) {
  var self = this;

  tree_(self, extend({}, options, {
    nodeClass: createNodeClass(baseClass, constructor),
    nodes: new Map(),
    detached: new WeakMap(),
    container: new ZetaEventContainer()
  }));

  defineOwnProperty(self, 'element', root, true);
  defineOwnProperty(self, 'rootNode', self.setNode(root), true);
  observe(root, function () {
    updateTree(self);
  });
}

definePrototype(NodeTree, {
  on: function on(event, handler) {
    tree_(this).container.add(this, isPlainObject(event) || kv(event, handler));
  },
  getNode: function getNode(element) {
    if (!assertDescendantOfTree(this, element)) {
      return null;
    }

    var result = findNode(this, element, true);
    return result && result.node;
  },
  setNode: function setNode(element) {
    var self = this;
    var result = findNode(self, element);
    return result ? result.node : new (tree_(self).nodeClass)(self, element);
  },
  removeNode: function removeNode(node) {
    assertSameTree(this, node, true);
    removeNodeFromMap(tree_(node), true);
  },
  update: function update() {
    collectMutations();
    updateTree(this);
  }
});

function TraversableNodeTree(root, constructor, options) {
  NodeTree.call(this, TraversableNode, root, constructor, options);
}

definePrototype(TraversableNodeTree, NodeTree, {
  isNodeVisible: function isNodeVisible() {
    return true;
  },
  acceptNode: function acceptNode() {
    return 1;
  }
});

function InheritedNodeTree(root, constructor, options) {
  NodeTree.call(this, InheritedNode, root, constructor, options);
}

definePrototype(InheritedNodeTree, NodeTree, {
  descendants: function descendants(node) {
    if (is(node, Node)) {
      node = this.setNode(node);
    } else {
      assertSameTree(this, node, true);
    }

    var arr = [node];

    var next = function next() {
      var cur = arr.shift();

      if (cur) {
        arr.unshift.apply(arr, checkNodeState(tree_(cur)).childNodes);
      }

      return {
        done: !cur,
        value: cur
      };
    };

    return {
      next: next
    };
  }
});

function TreeWalker(root, whatToShow, filter) {
  var self = this;
  self.whatToShow = whatToShow || -1;
  self.filter = filter;
  self.currentNode = root;
  self.root = root;
}

function treeWalkerIsNodeVisible(inst, node) {
  return node && tree_(node).tree.isNodeVisible(node, inst) && node;
}

function treeWalkerAcceptNode(inst, node, checkVisibility) {
  if (checkVisibility && node !== inst.root && !treeWalkerIsNodeVisible(inst, node)) {
    return 2;
  }

  var rv = tree_(node).tree.acceptNode(node, inst);

  if (rv !== 1) {
    return rv;
  }

  var filter = isFunction(inst.filter);
  return filter ? filter(node) : 1;
}

treeWalkerAcceptNode.$1 = 0;

function treeWalkerNodeAccepted(inst, node, checkVisibility) {
  treeWalkerAcceptNode.$1 = treeWalkerAcceptNode(inst, node, checkVisibility);

  if (treeWalkerAcceptNode.$1 === 1) {
    inst.currentNode = node;
    return true;
  }
}

function treeWalkerTraverseChildren(inst, pChild, pSib) {
  var node = inst.currentNode[pChild];

  while (node) {
    if (treeWalkerNodeAccepted(inst, node, true)) {
      return node;
    }

    if (treeWalkerAcceptNode.$1 === 3 && node[pChild]) {
      node = node[pChild];
      continue;
    }

    while (!node[pSib]) {
      node = treeWalkerIsNodeVisible(inst, node.parentNode);

      if (!node || node === inst.root || node === inst.currentNode) {
        return null;
      }
    }

    node = node[pSib];
  }
}

function treeWalkerTraverseSibling(inst, pChild, pSib) {
  var node = inst.currentNode;

  while (node && node !== inst.root) {
    var sibling = node[pSib];

    while (sibling) {
      if (treeWalkerNodeAccepted(inst, sibling)) {
        return sibling;
      }

      sibling = treeWalkerAcceptNode.$1 === 2 || !sibling[pChild] ? sibling[pSib] : sibling[pChild];
    }

    node = treeWalkerIsNodeVisible(inst, node.parentNode);

    if (!node || node === inst.root || treeWalkerAcceptNode(inst, node, true) === 1) {
      return null;
    }
  }
}

definePrototype(TreeWalker, {
  previousSibling: function previousSibling() {
    return treeWalkerTraverseSibling(this, 'lastChild', 'previousSibling');
  },
  nextSibling: function nextSibling() {
    return treeWalkerTraverseSibling(this, 'firstChild', 'nextSibling');
  },
  firstChild: function firstChild() {
    return treeWalkerTraverseChildren(this, 'firstChild', 'nextSibling');
  },
  lastChild: function lastChild() {
    return treeWalkerTraverseChildren(this, 'lastChild', 'previousSibling');
  },
  parentNode: function parentNode() {
    // @ts-ignore: type inference issue
    for (var node = this.currentNode; node && node !== this.root; node = node.parentNode) {
      // @ts-ignore: type inference issue
      var parentNode = node.parentNode;

      if (treeWalkerNodeAccepted(this, parentNode, true)) {
        return parentNode;
      }
    }
  },
  previousNode: function previousNode() {
    var self = this;

    for (var node = self.currentNode; node && node !== self.root;) {
      // @ts-ignore: type inference issue
      for (var sibling = node.previousSibling; sibling; sibling = node.previousSibling) {
        node = sibling;
        var rv = treeWalkerAcceptNode(self, sibling); // @ts-ignore: type inference issue

        while (rv !== 2 && treeWalkerIsNodeVisible(self, node.firstChild)) {
          // @ts-ignore: type inference issue
          node = node.lastChild;
          rv = treeWalkerAcceptNode(self, node, true);
        }

        if (rv === 1) {
          // @ts-ignore: type inference issue
          self.currentNode = node;
          return node;
        }
      } // @ts-ignore: type inference issue


      node = treeWalkerIsNodeVisible(self, node.parentNode);

      if (!node || node === self.root) {
        return null;
      }

      if (treeWalkerNodeAccepted(self, node, true)) {
        return node;
      }
    }
  },
  nextNode: function nextNode() {
    var self = this;
    var rv = 1;

    for (var node = self.currentNode; node;) {
      // @ts-ignore: type inference issue
      while (rv !== 2 && node.firstChild) {
        // @ts-ignore: type inference issue
        node = node.firstChild;

        if (treeWalkerNodeAccepted(self, node, true)) {
          return node;
        }

        rv = treeWalkerAcceptNode.$1;
      } // @ts-ignore: type inference issue


      while (node && node !== self.root && !node.nextSibling) {
        // @ts-ignore: type inference issue
        node = treeWalkerIsNodeVisible(self, node.parentNode);
      }

      if (!node || node === self.root) {
        return null;
      } // @ts-ignore: type inference issue


      node = node.nextSibling;

      if (treeWalkerNodeAccepted(self, node, true)) {
        return node;
      }

      rv = treeWalkerAcceptNode.$1;
    }
  }
});

// CONCATENATED MODULE: ./src/index.js








var util = extend({}, util_namespaceObject, domUtil_namespaceObject);

/* harmony default export */ const src = ({
  IS_IOS: IS_IOS,
  IS_IE10: IS_IE10,
  IS_IE: IS_IE,
  IS_MAC: IS_MAC,
  IS_TOUCH: IS_TOUCH,
  util: util,
  dom: src_dom,
  css: cssUtil_namespaceObject,
  EventContainer: ZetaEventContainer,
  InheritedNode: InheritedNode,
  InheritedNodeTree: InheritedNodeTree,
  TraversableNode: TraversableNode,
  TraversableNodeTree: TraversableNodeTree,
  TreeWalker: TreeWalker
});


/***/ }),

/***/ 304:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// @ts-nocheck

/** @type {JQueryStatic} */
const jQuery = window.jQuery || __webpack_require__(609);
module.exports = jQuery;


/***/ }),

/***/ 511:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// @ts-nocheck

/** @type {PromiseConstructor} */
const Promise = window.Promise || __webpack_require__(804).default;
module.exports = Promise;


/***/ }),

/***/ 609:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__609__;

/***/ }),

/***/ 804:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__804__;

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
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(411);
/******/ })()
;
});
//# sourceMappingURL=zeta.js.map