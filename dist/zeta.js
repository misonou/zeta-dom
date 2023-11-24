/*! zeta-dom v0.4.13 | (c) misonou | https://misonou.github.io */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define("zeta-dom", ["jquery"], factory);
	else if(typeof exports === 'object')
		exports["zeta-dom"] = factory(require("jquery"));
	else
		root["zeta"] = factory(root["jQuery"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__254__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 702:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ErrorCode": function() { return /* reexport */ errorCode_namespaceObject; },
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
  "dom": function() { return /* reexport */ dom; },
  "util": function() { return /* binding */ util; }
});

// NAMESPACE OBJECT: ./src/errorCode.js
var errorCode_namespaceObject = {};
__webpack_require__.r(errorCode_namespaceObject);
__webpack_require__.d(errorCode_namespaceObject, {
  "cancellationRejected": function() { return cancellationRejected; },
  "cancelled": function() { return cancelled; },
  "invalidOperation": function() { return invalidOperation; }
});

// NAMESPACE OBJECT: ./src/util.js
var util_namespaceObject = {};
__webpack_require__.r(util_namespaceObject);
__webpack_require__.d(util_namespaceObject, {
  "always": function() { return always; },
  "any": function() { return any; },
  "arrRemove": function() { return arrRemove; },
  "camel": function() { return camel; },
  "catchAsync": function() { return catchAsync; },
  "clearImmediateOnce": function() { return clearImmediateOnce; },
  "combineFn": function() { return combineFn; },
  "createPrivateStore": function() { return createPrivateStore; },
  "deepFreeze": function() { return deepFreeze; },
  "deferrable": function() { return deferrable; },
  "define": function() { return define; },
  "defineAliasProperty": function() { return defineAliasProperty; },
  "defineGetterProperty": function() { return defineGetterProperty; },
  "defineHiddenProperty": function() { return defineHiddenProperty; },
  "defineObservableProperty": function() { return defineObservableProperty; },
  "defineOwnProperty": function() { return defineOwnProperty; },
  "definePrototype": function() { return definePrototype; },
  "delay": function() { return delay; },
  "each": function() { return each; },
  "either": function() { return either; },
  "equal": function() { return equal; },
  "errorWithCode": function() { return errorWithCode; },
  "exclude": function() { return exclude; },
  "executeOnce": function() { return executeOnce; },
  "extend": function() { return extend; },
  "fill": function() { return fill; },
  "freeze": function() { return freeze; },
  "getOwnPropertyDescriptors": function() { return getOwnPropertyDescriptors; },
  "grep": function() { return grep; },
  "hasOwnProperty": function() { return util_hasOwnProperty; },
  "htmlDecode": function() { return htmlDecode; },
  "hyphenate": function() { return hyphenate; },
  "iequal": function() { return iequal; },
  "inherit": function() { return inherit; },
  "is": function() { return is; },
  "isArray": function() { return isArray; },
  "isArrayLike": function() { return isArrayLike; },
  "isErrorWithCode": function() { return isErrorWithCode; },
  "isFunction": function() { return isFunction; },
  "isPlainObject": function() { return isPlainObject; },
  "isThenable": function() { return isThenable; },
  "isUndefinedOrNull": function() { return isUndefinedOrNull; },
  "keys": function() { return keys; },
  "kv": function() { return kv; },
  "lcfirst": function() { return lcfirst; },
  "makeArray": function() { return makeArray; },
  "makeAsync": function() { return makeAsync; },
  "map": function() { return map; },
  "mapGet": function() { return mapGet; },
  "mapObject": function() { return mapObject; },
  "mapRemove": function() { return mapRemove; },
  "matchWord": function() { return matchWord; },
  "matchWordMulti": function() { return matchWordMulti; },
  "noop": function() { return noop; },
  "pick": function() { return pick; },
  "pipe": function() { return pipe; },
  "randomId": function() { return randomId; },
  "reject": function() { return reject; },
  "repeat": function() { return repeat; },
  "resolve": function() { return util_resolve; },
  "resolveAll": function() { return resolveAll; },
  "retryable": function() { return retryable; },
  "sameValueZero": function() { return sameValueZero; },
  "setAdd": function() { return setAdd; },
  "setImmediate": function() { return setImmediate; },
  "setImmediateOnce": function() { return setImmediateOnce; },
  "setInterval": function() { return util_setInterval; },
  "setIntervalSafe": function() { return setIntervalSafe; },
  "setPromiseTimeout": function() { return setPromiseTimeout; },
  "setTimeout": function() { return util_setTimeout; },
  "setTimeoutOnce": function() { return setTimeoutOnce; },
  "single": function() { return single; },
  "splice": function() { return splice; },
  "throwNotFunction": function() { return throwNotFunction; },
  "throws": function() { return util_throws; },
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
  "connected": function() { return connected; },
  "containsOrEquals": function() { return containsOrEquals; },
  "createNodeIterator": function() { return createNodeIterator; },
  "createTreeWalker": function() { return createTreeWalker; },
  "dispatchDOMMouseEvent": function() { return dispatchDOMMouseEvent; },
  "domReady": function() { return domReady; },
  "elementFromPoint": function() { return elementFromPoint; },
  "getClass": function() { return getClass; },
  "getCommonAncestor": function() { return getCommonAncestor; },
  "getContentRect": function() { return getContentRect; },
  "getRect": function() { return getRect; },
  "getRects": function() { return getRects; },
  "getSafeAreaInset": function() { return getSafeAreaInset; },
  "getScrollOffset": function() { return getScrollOffset; },
  "getScrollParent": function() { return getScrollParent; },
  "isVisible": function() { return isVisible; },
  "iterateNode": function() { return iterateNode; },
  "iterateNodeToArray": function() { return iterateNodeToArray; },
  "makeSelection": function() { return makeSelection; },
  "matchSelector": function() { return matchSelector; },
  "mergeRect": function() { return mergeRect; },
  "parentsAndSelf": function() { return parentsAndSelf; },
  "pointInRect": function() { return pointInRect; },
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

// CONCATENATED MODULE: ./src/include/promise-polyfill.js
var promise_polyfill_Promise = window.Promise;
/* harmony default export */ const promise_polyfill = (promise_polyfill_Promise);
// EXTERNAL MODULE: external {"commonjs":"jquery","commonjs2":"jquery","amd":"jquery","root":"jQuery"}
var external_commonjs_jquery_commonjs2_jquery_amd_jquery_root_jQuery_ = __webpack_require__(254);
// CONCATENATED MODULE: ./src/include/jquery.js

/* harmony default export */ const jquery = (external_commonjs_jquery_commonjs2_jquery_amd_jquery_root_jQuery_);
// CONCATENATED MODULE: ./src/env.js
// @ts-nocheck


var env_window = self;
var env_document = env_window.document;
var root = env_document.documentElement;
var getSelection = env_window.getSelection;
var getComputedStyle = env_window.getComputedStyle;
var domReady = new promise_polyfill(jquery);
var IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !env_window.MSStream;
var IS_IE10 = !!env_window.ActiveXObject;
var IS_IE = IS_IE10 || root.style.msTouchAction !== undefined || root.style.msUserSelect !== undefined;
var IS_MAC = navigator.userAgent.indexOf('Macintosh') >= 0;
var IS_TOUCH = ('ontouchstart' in env_window);
// CONCATENATED MODULE: ./src/errorCode.js
var cancellationRejected = 'zeta/cancellation-rejected';
var cancelled = 'zeta/cancelled';
var invalidOperation = 'zeta/invalid-operation';
// CONCATENATED MODULE: ./src/util.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



var objectProto = Object.prototype;
var keys = Object.keys;
var freeze = Object.freeze;
var defineProperty = Object.defineProperty;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getPrototypeOf = Object.getPrototypeOf;
var hasOwnPropertyImpl = objectProto.hasOwnProperty;
var propertyIsEnumerableImpl = objectProto.propertyIsEnumerable;

var values = Object.values || function (obj) {
  var vals = [];

  for (var key in obj) {
    if (hasOwnPropertyImpl.call(obj, key) && propertyIsEnumerableImpl.call(obj, key)) {
      vals.push(obj[key]);
    }
  }

  return vals;
};

var queueMicrotask = env_window.queueMicrotask || function (callback) {
  util_resolve().then(callback);
};

var compareFn = [function (b, v, i) {
  return !sameValueZero(b[i], v);
}, function (b, v, i) {
  return !sameValueZero(b.get(i), v);
}, function (b, v, i) {
  return !b.has(v);
}];
var setImmediateStore = new Map();
var matchWordCache = Object.create(null);
var watchStore = createPrivateStore();
/* --------------------------------------
 * Miscellaneous
 * -------------------------------------- */

function noop() {}

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

function isThenable(obj) {
  return !!obj && isFunction(obj.then) && obj;
}

function isPlainObject(obj) {
  var proto = _typeof(obj) === 'object' && obj !== null && getPrototypeOf(obj);
  return (proto === objectProto || proto === null) && obj;
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
    var cur,
        i = 0;
    callback = callback.bind(obj);

    if (typeof obj === 'string') {
      obj = obj.split(' ');
    } else if (obj instanceof Set) {
      // would be less useful if key and value refers to the same object
      obj = obj.values();
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
    } else if (isFunction(obj.next)) {
      while (!(cur = obj.next()).done && callback(i++, cur.value) !== false) {
        ;
      }
    } else if (isFunction(obj.nextNode)) {
      while ((cur = obj.nextNode()) && callback(i++, cur) !== false) {
        ;
      }
    } else if (isFunction(obj.forEach)) {
      obj.forEach(function (v, i) {
        if (cur !== false) {
          cur = callback(i, v);
        }
      });
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
    map.set(key, util_hasOwnProperty(fn, 'prototype') ? passKey ? new fn(key) : new fn() : passKey ? fn(key) : fn());
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
  if (_typeof(a) !== 'object' || !b || a.constructor !== b.constructor) {
    return sameValueZero(a, b);
  }

  var type = a instanceof Map && 1 || a instanceof Set && 2 || isArray(a) && 3 || 0;

  if (a.length !== b.length || a.size !== b.size || !type && keys(a).length !== keys(b).length) {
    return false;
  }

  return !single(a, (compareFn[type] || compareFn[0]).bind(0, b));
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
    return util_setTimeout(setImmediateOnceCallback.bind(0, fn), ms || 0), fn;
  });
}

function clearImmediateOnce(fn) {
  mapRemove(setImmediateStore, fn);
}

function util_setTimeout() {
  var t = env_window.setTimeout.apply(env_window, arguments);
  return function () {
    clearTimeout(t);
  };
}

function util_setInterval() {
  var t = env_window.setInterval.apply(env_window, arguments);
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
      t = env_window.setTimeout(function () {
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


function util_throws(error) {
  throw is(error, Error) || new Error(error);
}

function throwNotFunction(obj, name) {
  if (!isFunction(obj)) {
    util_throws((name || 'callback') + ' must be a function');
  }

  return obj;
}

function errorWithCode(code, message, props) {
  return extend(new Error(message || code), props, {
    code: code
  });
}

function isErrorWithCode(error, code) {
  return is(error, Error) && error.code === code;
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


function util_resolve(value) {
  return promise_polyfill.resolve(value);
}

function reject(reason) {
  return promise_polyfill.reject(reason);
}

function always(promise, callback) {
  promise = isThenable(promise) || util_resolve(promise);
  return promise.then(function (v) {
    return callback(true, v);
  }, function (v) {
    return callback(false, v);
  });
}

function resolveAll(obj, callback) {
  if (!obj || _typeof(obj) !== 'object' || isThenable(obj)) {
    return util_resolve(obj).then(callback);
  }

  if (isArray(obj)) {
    return promise_polyfill.all(obj).then(callback);
  }

  var result = {};
  var arr = map(obj, function (v, i) {
    return util_resolve(v).then(function (d) {
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
  var promise = util_resolve().then(function next() {
    resolved = !arr.length;
    return resolved ? undefined : always(promise_polyfill.allSettled(arr.splice(0)), next);
  });
  return extend(promise, {
    waitFor: function waitFor() {
      return !resolved && !!arr.push.apply(arr, arguments);
    }
  });
}

function catchAsync(promise) {
  promise = isThenable(promise) || util_resolve(promise);
  return promise.catch(noop);
}

function setPromiseTimeout(promise, ms, resolveWhenTimeout) {
  return new promise_polyfill(function (resolve, reject) {
    promise.then(resolve, reject);
    util_setTimeout(function () {
      (resolveWhenTimeout ? resolve : reject)('timeout');
    }, ms);
  });
}

function delay(ms, callback) {
  return new promise_polyfill(function (resolve) {
    util_setTimeout(callback ? function () {
      resolve(makeAsync(callback)());
    } : resolve, ms);
  });
}

function makeAsync(callback) {
  return function () {
    try {
      return util_resolve(callback.apply(this, arguments));
    } catch (e) {
      return reject(e);
    }
  };
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
  return watchStore(obj) || watchStore(obj, {
    sync: !!sync,
    values: {},
    oldValues: {},
    newValues: {},
    alias: {},
    handlers: [],
    handleChanges: function handleChanges(callback) {
      var self = watchStore(obj);

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

function ensurePropertyObserved(obj, prop) {
  for (var proto = obj; proto && proto !== objectProto; proto = getPrototypeOf(proto)) {
    if (util_hasOwnProperty(proto, prop)) {
      var state = getObservableState(proto);
      var alias = state.alias[prop];

      if (alias) {
        return ensurePropertyObserved(alias[0], alias[1]);
      }

      if (prop in state.values) {
        return;
      }
    }
  }

  defineObservableProperty(obj, prop);
}

function throwNotOwnDataProperty(obj, prop) {
  var desc = getOwnPropertyDescriptor(obj, prop);

  if (!desc ? prop in obj : desc.get || desc.set) {
    util_throws('Must be own data property');
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

  if (!(prop in state.values)) {
    throwNotOwnDataProperty(obj, prop);

    var setter = function setter(value) {
      var state = getObservableState(this);
      var oldValue = state.values[prop];

      if (isFunction(callback)) {
        value = callback.call(this, value, oldValue);
      }

      if (!sameValueZero(value, oldValue)) {
        state.values[prop] = value;

        if (state.handlers[0]) {
          if (!(prop in state.oldValues)) {
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

function _watch(obj, prop, handler, fireInit) {
  if (typeof prop === 'boolean') {
    if (watchStore(obj)) {
      util_throws('Observable initialized');
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

      wrapper = function wrapper(e) {
        if (alias[1] in e.newValues) {
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

function _watchOnce(obj, prop, handler) {
  ensurePropertyObserved(obj, prop);
  return new promise_polyfill(function (resolve) {
    var alias = getObservableState(obj).alias[prop] || [obj, prop];
    var handlers = getObservableState(alias[0]).handlers;
    handlers.push(function fn(e) {
      if (alias[1] in e.newValues) {
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
    watch: function watch(prop, handler, fireInit) {
      return _watch(this, prop, handler, fireInit);
    },
    watchOnce: function watchOnce(prop, handler) {
      return _watchOnce(this, prop, handler);
    }
  });
  return obj;
}


// CONCATENATED MODULE: ./src/observe.js




var detachHandlers = new WeakMap();
var optionsForChildList = {
  subtree: true,
  childList: true
};
var globalCleanups = createAutoCleanupMap(function (element, arr) {
  combineFn(arr)();
});

function DetachHandlerState() {
  this.handlers = [];
  this.map = new Map();
}

function observe(element, options, callback) {
  callback = throwNotFunction(callback || options);

  if (isFunction(options)) {
    options = optionsForChildList;
  }

  var filterRecords = options.attributes && (options.attributeFilter || ['id']).indexOf('id') >= 0;

  var processRecords = function processRecords(records) {
    if (filterRecords) {
      records = records.filter(function (v) {
        // filter out changes due to sizzle engine
        // to prevent excessive invocation due to querying elements through jQuery
        return v.attributeName !== 'id' || (v.oldValue || '').slice(0, 6) !== 'sizzle' && v.target.id !== (v.oldValue || '');
      });
    }

    if (records[0]) {
      callback(records);
    }
  };

  var observer = new MutationObserver(processRecords);
  observer.observe(element, options);

  var collect = function collect(discard) {
    (discard ? noop : processRecords)(observer.takeRecords());
  };

  var dispose = function dispose() {
    observer.disconnect();
  };

  if (element !== root) {
    registerCleanup(element, dispose);
  }

  return extend(collect, {
    dispose: dispose
  });
}

function registerCleanup(element, callback) {
  if (isFunction(element)) {
    var state = initDetachWatcher(root);
    state.handlers.push(element);
  } else {
    mapGet(globalCleanups, element, Set).add(callback);
  }
}

function createAutoCleanupMap(container, callback) {
  if (!container || isFunction(container)) {
    callback = container;
    container = root;
  }

  var map = new Map();
  callback = isFunction(callback) || noop;
  observe(container, function () {
    each(map, function (i) {
      if (!container.contains(i)) {
        callback(i, mapRemove(map, i));
      }
    });
  });
  return map;
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

function trackElements(element, selector) {
  var collection = new Set();
  var add = collection.add.bind(collection);
  var remove = collection.delete.bind(collection);
  return function (callback) {
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
      (callback || noop)(addedNodes, removedNodes);
    }

    return [addedNodes, removedNodes];
  };
}

function watchElements(element, selector, callback, fireInit) {
  var collect = trackElements(element, selector);
  var attributes;
  var attributeFilter = [];
  selector.replace(/\.|\[([^=~|^$*\]]+)|:(?!empty|is|has|not|where|(?:first|last|only|nth|nth-last)-(?:child|of-type))/g, function (v, a) {
    attributes = true;

    if (v[0] === ':') {
      attributeFilter = undefined;
    } else if (attributeFilter) {
      attributeFilter.push(v[0] === '.' ? 'class' : a);
    }
  });
  var options = extend({}, optionsForChildList, {
    attributes: attributes,
    attributeFilter: attributes && attributeFilter
  });
  var fn = observe(element, options, function () {
    collect(callback);
  });
  collect(fireInit && callback);
  return fn;
}

function watchAttributes(element, attributes, callback, fireInit) {
  var collect = trackElements(element, '[' + makeArray(attributes).join('],[') + ']');
  var options = extend({}, optionsForChildList, {
    attributes: true,
    attributeFilter: makeArray(attributes)
  });
  var fn = observe(element, options, function (records) {
    var set = new Set();
    var arr = [[]].concat(collect());
    var all = arr[1].concat(arr[2]);
    each(records, function (i, v) {
      var target = v.target;

      if (v.attributeName && all.indexOf(target) < 0 && set.add(target)) {
        all.push(target);
      }
    });
    arr[0] = all;
    arr[3] = makeArray(set);

    if (arr[0][0]) {
      callback.apply(this, arr);
    }
  });
  collect(fireInit && function (added) {
    callback(added, added, [], []);
  });
  return fn;
}

function watchOwnAttributes(element, attributes, callback) {
  return observe(element, {
    attributes: true,
    attributeFilter: makeArray(attributes)
  }, callback);
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


// CONCATENATED MODULE: ./src/libCheck.js

var ZETA_KEY = '__ZETA__';

if (window[ZETA_KEY]) {
  util_throws('Another copy of zeta-dom is instantiated. Please check your dependencies.');
}

defineHiddenProperty(window, ZETA_KEY, true, true);
/* harmony default export */ const libCheck = (null);
// CONCATENATED MODULE: ./src/constants.js
/**
 *  Key code mapping for keyboard events.
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
'1234567890'.split('').forEach(function (v) {
  KEYNAMES['Digit' + v] = v;
  KEYNAMES['Numpad' + v] = 'numpad' + v;
});
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (v) {
  KEYNAMES['Key' + v.toUpperCase()] = v;
});
var constants_map = {
  ShiftLeft: 16,
  // shift
  ShiftRight: 16,
  // shift
  ControlLeft: 17,
  // ctrl
  ControlRight: 17,
  // ctrl
  AltLeft: 18,
  // alt
  AltRight: 18,
  // alt
  ArrowLeft: 37,
  // leftArrow
  ArrowUp: 38,
  // upArrow
  ArrowRight: 39,
  // rightArrow
  ArrowDown: 40,
  // downArrow
  OSLeft: 91,
  // leftWindow
  OSRight: 92,
  // rightWindowKey
  ContextMenu: 93,
  // select
  NumpadMultiply: 106,
  // multiply
  NumpadAdd: 107,
  // add
  NumpadSubtract: 109,
  // subtract
  NumpadDecimal: 110,
  // decimalPoint
  NumpadDivide: 111,
  // divide
  Semicolon: 186,
  // semiColon
  Equal: 187,
  // equalSign
  Minus: 189,
  // dash
  Slash: 191,
  // forwardSlash
  Backquote: 192,
  // backtick
  BracketLeft: 219,
  // openBracket
  BracketRight: 221,
  // closeBracket
  Quote: 222 // singleQuote

};

for (var i in constants_map) {
  KEYNAMES[i] = KEYNAMES[constants_map[i]];
}

[8, // backspace
9, // tab
13, // enter
19, // pause
20, // capsLock
27, // escape
32, // space
33, // pageUp
34, // pageDown
35, // end
36, // home
45, // insert
46, // delete
144, // numLock
145, // scrollLock
188, // comma
190, // period
220, // backSlash
112, // f1
113, // f2
114, // f3
115, // f4
116, // f5
117, // f6
118, // f7
119, // f8
120, // f9
121, // f10
122, // f11
123 // f12
].forEach(function (v) {
  v = KEYNAMES[v];
  KEYNAMES[v[0].toUpperCase() + v.slice(1)] = v;
});
// CONCATENATED MODULE: ./src/domLock.js
function domLock_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { domLock_typeof = function _typeof(obj) { return typeof obj; }; } else { domLock_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return domLock_typeof(obj); }









var handledErrors = new WeakMap();
var subscribers = new WeakMap();
var locks = createAutoCleanupMap(clearLock);
var leaveCounter = 0;

function ensureLock(element) {
  var promises = mapGet(locks, element, Map);

  if (!promises.cancel) {
    promises.element = element;
    promises.cancel = retryable(function () {
      // request user cancellation for each async task in sequence
      return makeArray(promises).reduce(function (a, v) {
        return a.then(v.bind(0, false));
      }, util_resolve()).then(function () {
        clearLock(element);
      }, function () {
        throw errorWithCode(cancellationRejected);
      });
    });
  }

  return promises;
}

function clearLock(element, map) {
  var cancelCallbacks = makeArray(mapRemove(locks, element) || map).concat(makeArray(subscribers.get(element)));

  if (cancelCallbacks[0]) {
    combineFn(cancelCallbacks)(true);
    emitDOMEvent('cancelled', element);
  }
}

function handlePromise(promise, element, oncancel) {
  var cancel;
  promise = new promise_polyfill(function (resolve, reject) {
    cancel = executeOnce(function () {
      reject(errorWithCode(cancelled));
      (oncancel || noop)();
    });
    promise.then(resolve, reject);
    promise.catch(function (error) {
      if (error && !handledErrors.has(error)) {
        emitDOMEvent('error', element, {
          error: error
        }, true); // avoid firing error event for the same error for multiple target
        // while propagating through the promise chain

        if (domLock_typeof(error) === 'object') {
          handledErrors.set(error, true);
        }
      }
    });
  });
  return extend(promise, {
    cancel: cancel
  });
}

function lock(element, promise, oncancel) {
  if (!promise) {
    return subscribeAsync(element);
  }

  if (isFunction(promise)) {
    promise = lock(element, new promise_polyfill(noop), promise);
    return promise.cancel;
  }

  var promises = ensureLock(element);
  promise = handlePromise(promise, element);
  oncancel = isFunction(oncancel) ? retryable(oncancel) : oncancel ? noop : reject;
  promises.set(promise, function (force) {
    return util_resolve(force || oncancel()).then(promise.cancel);
  });
  always(promise, function () {
    promises.delete(promise);
  });
  return promise;
}

function subscribeAsync(element, callback) {
  var promises = mapGet(subscribers, element, Map);

  if (callback === true) {
    promises.handled = true;
  } else if (isFunction(callback)) {
    return listenDOMEvent(element, {
      asyncStart: function asyncStart() {
        callback.call(element, true);
      },
      asyncEnd: function asyncEnd() {
        callback.call(element, false);
      }
    });
  }
}

function notifyAsync(element, promise, oncancel) {
  promise = handlePromise(promise, element, oncancel);
  subscribeAsync(element);
  each(iterateFocusPath(element), function (i, v) {
    var promises = subscribers.get(v);

    if (promises) {
      // ensure oncancel is called when cancelLock is called
      ensureLock(v);
      always(promise, function () {
        if (promises.delete(promise) && !promises.size) {
          emitDOMEvent('asyncEnd', v);
        }
      });
      promises.set(promise, promise.cancel);

      if (promises.size === 1) {
        emitDOMEvent('asyncStart', v);
      }

      return !promises.handled;
    }
  });
}

function preventLeave(element, promise, oncancel) {
  if (!element) {
    leaveCounter++;
    return executeOnce(function () {
      leaveCounter--;
    });
  }

  always(promise ? lock(element, promise, oncancel) : element, preventLeave());
}

function locked(element, parents) {
  if (!element || element === root) {
    return !!any(locks, function (v, i) {
      return containsOrEquals(root, i) && v.size;
    });
  }

  return !!any(parents ? parentsAndSelf(element) : [element], function (v) {
    return (locks.get(v) || '').size;
  });
}

function cancelLock(element, force) {
  var targets = element ? grep(locks, function (v, i) {
    return containsOrEquals(element, i);
  }) : makeArray(locks);

  if (force) {
    each(targets, function (i, v) {
      clearLock(v.element);
    });
    return util_resolve();
  }

  return targets.reduce(function (a, v) {
    return a.then(v.cancel);
  }, util_resolve());
}

bind(env_window, 'beforeunload', function (e) {
  if (leaveCounter) {
    e.returnValue = '';
    e.preventDefault();
  }
});
subscribeAsync(root);

// CONCATENATED MODULE: ./src/dom.js










var SELECTOR_FOCUSABLE = 'input,select,button,textarea,[contenteditable],a[href],area[href],iframe';
var focusPath = [root];
var focusFriends = new WeakMap();
var focusElements = new Set([root]);
var modalElements = createAutoCleanupMap(releaseModal);
var tabIndex = new WeakMap();
var tabRoots = new WeakSet();
var shortcuts = {};
var metaKeys = {
  alt: true,
  ctrl: true,
  shift: true
};
var windowFocusedOut;
var currentEvent;
var currentMetaKey = '';
var currentTabRoot = root;
var trackPromise;
var trackCallbacks;
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
  if (v.disabled || v.readOnly) {
    return false;
  }

  if (v.isContentEditable) {
    return true;
  }

  if (tagName(v) === 'input') {
    return !matchWord(v.type, 'button checkbox color file image radio range reset submit');
  }

  return matchSelector(v, 'textarea,select');
}

function isMouseDown(e) {
  return (isUndefinedOrNull(e.buttons) ? e.which : e.buttons) === 1;
}

function normalizeKey(e) {
  var key = KEYNAMES[e.code || e.keyCode];
  return {
    key: key || lcfirst(e.code) || e.key,
    char: e.char || (e.key || '').length === 1 && e.key || e.charCode && String.fromCharCode(e.charCode) || (key === 'enter' ? '\r' : ''),
    meta: !!metaKeys[key]
  };
}

function createIterator(callback) {
  return {
    next: function next() {
      var value = callback();
      return {
        value: value,
        done: !value
      };
    }
  };
}

function inputValueImpl(element, method, value) {
  // React defines its own getter and setter on input elements
  var desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');

  if (desc && desc[method]) {
    return desc[method].call(element, value);
  }

  return method === 'get' ? element.value : element.value = value;
}

function setTextData(node, text, offset) {
  if (node.tagName) {
    inputValueImpl(node, 'set', text);
    node.setSelectionRange(offset, offset);
  } else {
    var range = env_document.createRange();
    node.data = text;
    range.setStart(node, offset);
    makeSelection(range);
  }
}

function dispatchInputEvent(element, text) {
  element.dispatchEvent(new InputEvent('input', {
    inputType: text ? 'insertText' : 'deleteContent',
    data: text || null,
    bubbles: true
  }));
}
/* --------------------------------------
 * Focus management
 * -------------------------------------- */


function cleanupFocusPath() {
  for (var i = focusPath.length - 1; i >= 0; i--) {
    if (!containsOrEquals(root, focusPath[i])) {
      setFocus(focusPath[i + 1] || env_document.body);
      break;
    }
  }
}

function getActiveElement() {
  if (!containsOrEquals(root, focusPath[0])) {
    cleanupFocusPath();
  }

  return focusPath[0];
}

function getModalElement() {
  var element = focusPath.slice(-2)[0];

  if (element === env_document.body) {
    return null;
  }

  if (!containsOrEquals(root, element)) {
    releaseModal(element);
    return getModalElement();
  }

  return element;
}

function focused(element, strict) {
  // @ts-ignore: activeElement is not null
  return element === env_window ? !windowFocusedOut : focusElements.has(element) && (!strict || containsOrEquals(element, env_document.activeElement));
}

function focusable(element) {
  if (!containsOrEquals(root, element)) {
    return false;
  }

  if (element === root || !focusPath[1]) {
    return root;
  }

  var friends = map(parentsAndSelf(element), function (v) {
    return focusFriends.get(v);
  });
  return any(focusPath, function (v) {
    return v !== root && (containsOrEquals(v, element) || friends.indexOf(v) >= 0);
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

function triggerModalChangeEvent() {
  emitDOMEvent('modalchange', root, {
    modalElement: getModalElement()
  });
}

function updateTabRoot() {
  var tabRoot = any(focusPath, function (v) {
    return tabRoots.has(v);
  }) || getModalElement() || root;

  if (tabRoot !== currentTabRoot) {
    currentTabRoot = tabRoot;
    updateTabIndex();
  }
}

function updateTabIndex(newNodes) {
  jquery(newNodes || SELECTOR_FOCUSABLE).each(function (i, v) {
    if (!containsOrEquals(currentTabRoot, v)) {
      if (v.tabIndex !== -1) {
        tabIndex.set(v, jquery(v).attr('tabindex') || null);
        v.tabIndex = -1;
      }
    } else if (tabIndex.has(v)) {
      jquery(v).attr('tabindex', mapRemove(tabIndex, v));
    }
  });
}

function setFocus(element, source, suppressFocusChange) {
  if (element === root) {
    element = env_document.body;
  }

  var len = focusPath.length;
  var index = focusPath.indexOf(element);

  if (index === 0) {
    setFocusUnsafe(focusPath, [], source);
    return len;
  }

  if (index > 0) {
    removeFocusUnsafe(focusPath, element, source, element);
    len = len - index;
  } else {
    var added = [];
    var friend;
    any(parentsAndSelf(element), function (v) {
      return focusPath.indexOf(v) >= 0 || added.push(v) && (friend = focusFriends.get(v));
    });

    if (friend && added.indexOf(friend) < 0 && focusPath.indexOf(friend) < 0) {
      len = setFocus(friend, source, true);
    }

    var within = focusable(element);

    if (within) {
      removeFocusUnsafe(focusPath, within, source, element, true);
      len = Math.min(len, focusPath.length); // check whether the element is still attached in ROM
      // which can be detached while dispatching focusout event above

      if (containsOrEquals(root, element)) {
        each(added, function (i, element) {
          if (focusElements.has(element) && focusPath.indexOf(element) < 0) {
            any(modalElements, function (v) {
              return removeFocusUnsafe(v, element, source, element, true) && v.shift();
            });
          }
        });
      } else {
        added = [];
      }

      setFocusUnsafe(focusPath, added, source);
    }
  }

  if (!suppressFocusChange) {
    triggerFocusEvent('focuschange', focusPath.slice(-len), null, source);
  }

  return len;
}

function setFocusUnsafe(path, elements, source, suppressFocus) {
  if (elements[0]) {
    source = source || new ZetaEventSource(elements[0], path);
    path.unshift.apply(path, elements);
    elements = grep(elements, function (v) {
      return setAdd(focusElements, v);
    });
    triggerFocusEvent('focusin', elements.reverse(), null, source);
  }

  if (path === focusPath && !suppressFocus) {
    var activeElement = any(focusPath, function (v) {
      return matchSelector(v, SELECTOR_FOCUSABLE);
    });

    if (activeElement) {
      activeElement.focus();
    } else {
      env_document.activeElement.blur();
    }

    setTimeoutOnce(updateTabRoot);
  }
}

function removeFocusUnsafe(path, element, source, relatedTarget, suppressFocus) {
  var index = path.indexOf(element);

  if (index > 0) {
    var removed = path.splice(0, index);
    each(removed, function (i, v) {
      focusElements.delete(v);
    });
    triggerFocusEvent('focusout', removed, relatedTarget, source);
    setFocusUnsafe(path, [], source, suppressFocus);
  }

  return index >= 0;
}

function setModal(element) {
  if (modalElements.has(element)) {
    return true;
  }

  if (!focusable(element)) {
    return false;
  }

  var from = focusPath.indexOf(element) + 1;
  var modalPath = focusPath.splice(from, focusPath.length - from - 1);
  modalElements.set(element, modalPath);

  if (!focused(element)) {
    var added = parentsAndSelf(element).filter(function (v) {
      return !focusElements.has(v);
    });
    setFocusUnsafe(modalPath, added.slice(1));
    setFocusUnsafe(focusPath, [element]);
  }

  setImmediateOnce(triggerModalChangeEvent);
  return true;
}

function releaseModal(element, modalPath) {
  modalPath = mapRemove(modalElements, element) || modalPath;

  if (!modalPath) {
    return;
  }

  if (focusPath.indexOf(element) >= 0) {
    var inner = any(modalPath, function (v) {
      return containsOrEquals(v, element);
    });

    if (inner && inner !== modalPath[0]) {
      // trigger focusout event for previously focused element
      // which focus is lost to modal element
      removeFocusUnsafe(modalPath, inner);
    } // find the index again as focusPath might be updated


    var index = focusPath.indexOf(element);
    focusPath.splice.apply(focusPath, [index + 1, 0].concat(modalPath));
    setFocus(focusPath[0]);
    cleanupFocusPath();
    setImmediateOnce(triggerModalChangeEvent);
  } else {
    each(modalElements, function (i, v) {
      var index = v.indexOf(element);

      if (index >= 0) {
        v.splice.apply(v, [0, index + 1].concat(modalPath));
        return false;
      }
    });
  }
}

function setTabRoot(a) {
  if (a !== root && a !== env_document.body && setAdd(tabRoots, a)) {
    setTimeoutOnce(updateTabRoot);
  }
}

function unsetTabRoot(a) {
  if (tabRoots.delete(a)) {
    setTimeoutOnce(updateTabRoot);
  }
}

function retainFocus(a, b) {
  if (a !== root && a !== env_document.body) {
    focusFriends.set(b, a);
  }
}

function releaseFocus(b) {
  focusFriends.delete(b);
}

function iterateFocusPath(element) {
  var returnedOnce;

  if (element === root || !focused(element)) {
    var visited = new Set();
    return createIterator(function () {
      if (!returnedOnce || !element) {
        returnedOnce = true;
      } else {
        var friend = focusFriends.get(element); // make sure the next iterated element in connected in DOM and
        // not being the descendants of current element

        element = friend && !visited.has(friend) && containsOrEquals(root, friend) && !containsOrEquals(element, friend) ? friend : element.parentNode;
      }

      visited.add(element);
      return element;
    });
  }

  var elements = focusPath.slice(0);

  var next = function next() {
    var cur = elements.shift();
    var modalPath = modalElements.get(cur);

    if (modalPath) {
      elements.unshift.apply(elements, modalPath);
    }

    return cur;
  };

  return createIterator(function () {
    var cur = next();

    if (!returnedOnce) {
      for (; cur !== element; cur = next()) {
        ;
      }

      returnedOnce = true;
    }

    element = cur;
    return element;
  });
}
/* --------------------------------------
 * DOM event handling
 * -------------------------------------- */


function getShortcut(key) {
  return keys(shortcuts[key] || {});
}

function setShortcut(command, keystroke) {
  if (isPlainObject(command)) {
    each(command, setShortcut);
  } else {
    var dict = shortcuts[command] || (shortcuts[command] = {});
    var copy = extend({}, dict);
    each(keystroke, function (i, v) {
      if (copy[v]) {
        delete copy[v];
      } else {
        dict[v] = true;
        (shortcuts[v] || (shortcuts[v] = {}))[command] = true;
      }
    });
    each(copy, function (v) {
      delete shortcuts[command][v];
      delete shortcuts[v][command];
    });
  }
}

function trackPointer(callback) {
  if (trackCallbacks) {
    if (callback) {
      trackCallbacks.push(callback);
    }

    return trackPromise;
  }

  var target = currentEvent.target;
  var lastPoint = currentEvent;
  var scrollWithin = grep(focusPath, function (v) {
    return containsOrEquals(v, target);
  }).slice(-1)[0];
  var scrollParent = getScrollParent(target);
  var scrollTimeout;
  var resolve, reject;
  trackCallbacks = callback ? [callback] : [];
  trackPromise = new Promise(function (res, rej) {
    resolve = res.bind(0, undefined);
    reject = rej;
  });
  callback = combineFn(trackCallbacks);

  if (root.setCapture) {
    root.setCapture();
  }

  var stopScroll = function stopScroll() {
    cancelAnimationFrame(scrollTimeout);
    scrollTimeout = null;
  };

  var startScroll = function startScroll() {
    var last;
    scrollTimeout = scrollTimeout || requestAnimationFrame(function next(ts) {
      if (last) {
        var f = (ts - last) / 16 - 1;
        var x = lastPoint.clientX;
        var y = lastPoint.clientY;
        var r = getContentRect(scrollParent);
        var dx = Math.max(x - r.right + 5, 0) || Math.min(x - r.left - 5, 0);
        var dy = Math.max(y - r.bottom + 5, 0) || Math.min(y - r.top - 5, 0);

        if (!dx && !dy || !scrollIntoView(target, toPlainRect(x + dx * f, y + dy * f).expand(5), scrollWithin, 'instant')) {
          scrollTimeout = null;
          return;
        }

        callback(lastPoint);
      }

      last = ts;
      scrollTimeout = requestAnimationFrame(next);
    });
  };

  bindUntil(trackPromise, root, {
    mouseup: resolve,
    touchend: resolve,
    keydown: function keydown(e) {
      if (normalizeKey(e).key === 'escape') {
        reject(errorWithCode(cancelled));
      }
    },
    mousemove: function mousemove(e) {
      startScroll();

      if (!e.which && !lastPoint.touches) {
        resolve();
      } else if (e.clientX !== lastPoint.clientX || e.clientY !== lastPoint.clientY) {
        lastPoint = e;
        callback(lastPoint);
      }
    },
    touchmove: function touchmove(e) {
      var points = makeArray(e.touches);

      if (!points[1] && trackCallbacks[0]) {
        startScroll();
        lastPoint = points[0];
      }

      callback.apply(0, points);
    }
  }, true);
  always(trackPromise, function () {
    stopScroll();
    trackCallbacks = null;
    trackPromise = null;

    if (root.releaseCapture) {
      root.releaseCapture();
    }
  });
  return trackPromise;
}

function beginDrag(within, callback) {
  if (!currentEvent || !matchWord(currentEvent.type, 'mousedown mousemove touchstart touchmove')) {
    return reject(errorWithCode(invalidOperation));
  }

  var initialPoint = (currentEvent.touches || [currentEvent])[0];
  callback = isFunction(callback || within);
  return trackPointer(callback && function (p) {
    var x = p.clientX;
    var y = p.clientY;
    callback(x, y, x - initialPoint.clientX, y - initialPoint.clientY);
  });
}

function beginPinchZoom(callback) {
  var initialPoints = (currentEvent || '').touches;

  if (!initialPoints || !initialPoints[1]) {
    return reject(errorWithCode(invalidOperation));
  }

  var m0 = measureLine(initialPoints[0], initialPoints[1]);
  return trackPointer(isFunction(callback) && function (p1, p2) {
    var m1 = measureLine(p1, p2);
    callback((m1.deg - m0.deg + 540) % 360 - 180, m1.length / m0.length, p1.clientX - initialPoints[0].clientX + (m0.dx - m1.dx) / 2, p1.clientY - initialPoints[0].clientY + (m0.dy - m1.dy) / 2);
  });
}

function insertText(element, text, startOffset, endOffset) {
  if (isUndefinedOrNull(element.selectionStart)) {
    throw errorWithCode(invalidOperation);
  }

  var prevText = inputValueImpl(element, 'get');
  var maxLength = element.maxLength;

  if (startOffset === undefined) {
    startOffset = element.selectionStart;
    endOffset = element.selectionEnd;
  } else {
    startOffset = Math.max(0, Math.min(startOffset, prevText.length));
    endOffset = Math.max(startOffset, endOffset || startOffset);
  }

  if (maxLength >= 0) {
    text = text.slice(0, Math.max(0, maxLength - prevText.length + endOffset - startOffset));
  }

  if (text || startOffset !== endOffset) {
    var newtext = prevText.slice(0, startOffset) + text + prevText.slice(endOffset);
    setTextData(element, newtext, startOffset + text.length);
    dispatchInputEvent(element, text);
    return true;
  }

  return false;
}

domReady.then(function () {
  var modifierCount;
  var modifiedKeyCode;
  var mouseInitialPoint;
  var preventClick;
  var pressTimeout;
  var hasBeforeInput;
  var hasCompositionUpdate;
  var imeModifyOnUpdate;
  var imeNodeText;
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

      imeOffset = [element.selectionStart, element.selectionEnd];
      imeNodeText = inputValueImpl(element, 'get');
    } else {
      imeNode = selection.anchorNode;
      imeOffset = [selection.focusOffset, selection.anchorOffset];

      if (imeNode && imeNode.nodeType === 1) {
        // IE puts selection at element level
        // however it will insert text in the previous text node
        var child = imeNode.childNodes[imeOffset[1] - 1];

        if (child && child.nodeType === 3) {
          imeNode = child; // @ts-ignore: child is Text

          imeOffset = [child.length, child.length];
        } else {
          imeNode = imeNode.childNodes[imeOffset[1]];
          imeOffset = [0, 0];
        }
      }

      imeNodeText = imeNode.data || '';
    }
  }

  function triggerUIEvent(eventName, data, preventNative, point, target) {
    var handled = emitDOMEvent(eventName, target || focusPath[0], data, {
      clientX: (point || '').clientX,
      clientY: (point || '').clientY,
      bubbles: true,
      originalEvent: currentEvent
    });

    if (handled && preventNative) {
      currentEvent.preventDefault();
    }

    return handled;
  }

  function triggerKeystrokeEvent(keyName, char) {
    var data = {
      data: keyName,
      char: char
    };
    lastEventSource.sourceKeyName = keyName;
    return triggerUIEvent('keystroke', data, true);
  }

  function triggerMouseEvent(eventName, event) {
    event = event || currentEvent;
    var data = {
      target: event.target,
      metakey: getEventName(event) || ''
    };
    return triggerUIEvent(eventName, data, true, event, data.target);
  }

  function triggerGestureEvent(gesture) {
    var target = mouseInitialPoint.target;
    mouseInitialPoint = null;
    return triggerUIEvent('gesture', gesture, true, null, target);
  }

  function handleUIEventWrapper(type, callback) {
    var isMoveEvent = matchWord(type, 'mousemove touchmove');
    var isKeyboardEvent = matchWord(type, 'keydown keyup keypress');
    var fireFocusReturn = matchWord(type, 'mousedown touchstart');
    return function (e) {
      currentEvent = e;
      setTimeout(function () {
        if (currentEvent === e) {
          currentEvent = null;
        }
      });

      if ('ctrlKey' in e) {
        var metaKey = getEventName(e, '');

        if (metaKey !== currentMetaKey) {
          currentMetaKey = metaKey;
          triggerUIEvent('metakeychange', metaKey, false);
        }
      }

      if (!isMoveEvent) {
        setLastEventSource(null);

        if (!focusable(e.target)) {
          e.stopImmediatePropagation();

          if (!isKeyboardEvent) {
            e.preventDefault();
          }

          if (fireFocusReturn) {
            emitDOMEvent('focusreturn', focusPath.slice(-2)[0]);
          }
        }

        setLastEventSource(e.target);
      }

      callback(e);
    };
  }

  var uiEvents = {
    compositionstart: function compositionstart() {
      updateIMEState();
      imeModifyOnUpdate = false;
      imeText = '';
    },
    compositionupdate: function compositionupdate(e) {
      if (!imeNode || imeOffset[0] === null) {
        return;
      }

      if (!hasCompositionUpdate && imeOffset[0] !== imeOffset[1]) {
        triggerUIEvent('textInput', '', false);
      }

      imeText = e.data || '';
      hasCompositionUpdate = true; // check whether input value or node data
      // are updated immediately after compositionupdate event

      if (!imeModifyOnUpdate) {
        setImmediate(function () {
          var prevNodeText = imeNodeText;
          var prevOffset = imeOffset;
          updateIMEState();
          imeModifyOnUpdate = imeNodeText !== prevNodeText;
          imeOffset[0] = prevOffset[0];
        });
      }
    },
    compositionend: function compositionend(e) {
      if (!imeNode || imeOffset[0] === null) {
        return;
      }

      var prevText = imeText;
      var prevOffset = imeOffset;
      var prevNodeText = imeNodeText;
      updateIMEState();
      imeText = e.data; // some IME lacks inserted character sequence when selecting from phrase candidate list
      // also legacy Microsoft Changjie IME reports full-width spaces (U+3000) instead of actual characters

      if (!imeText || /^\u3000+$/.test(imeText)) {
        imeText = imeNodeText.slice(prevOffset[1], imeOffset[1]);
      }

      var afterNodeText = imeNodeText;
      var afterOffset = imeOffset[1];
      var startOffset = afterOffset; // in some case the node does not contain the final input text

      if ((!hasCompositionUpdate || imeModifyOnUpdate) && prevOffset[0] + imeText.length !== afterOffset) {
        afterNodeText = imeNodeText.slice(0, afterOffset) + imeText + imeNodeText.slice(afterOffset);
        afterOffset += imeText.length;
      } // some old mobile browsers fire compositionend event before replacing final character sequence
      // need to compare both to truncate the correct range of characters
      // three cases has been observed: XXX{imeText}|, XXX{prevText}| and XXX|{imeText}


      var o1 = afterOffset - imeText.length;
      var o2 = afterOffset - prevText.length;

      if (imeNodeText.slice(o1, afterOffset) === imeText) {
        startOffset = o1;
      } else if (imeNodeText.slice(o2, afterOffset) === prevText) {
        startOffset = o2;
      } else if (imeNodeText.substr(afterOffset, imeText.length) === imeText) {
        afterOffset += imeText.length;
      }

      prevNodeText = imeNodeText.substr(0, startOffset) + imeNodeText.slice(afterOffset);
      setTextData(imeNode, prevNodeText, startOffset);

      if (!triggerUIEvent('textInput', imeText, false)) {
        setTextData(imeNode, afterNodeText, afterOffset);
        dispatchInputEvent(e.target, imeText);
      }

      imeNode = null;
      hasCompositionUpdate = false;
      setTimeout(function () {
        imeText = null;
      });
    },
    textInput: function textInput(e) {
      // required for older mobile browsers that do not support beforeinput event
      // ignore in case browser fire textInput before/after compositionend
      if (!hasCompositionUpdate && (e.data === imeText || !hasBeforeInput && triggerUIEvent('textInput', e.data, true))) {
        e.preventDefault();
      }

      hasBeforeInput = false;
    },
    keydown: function keydown(e) {
      if (!imeNode) {
        var data = normalizeKey(e);
        modifierCount = e.ctrlKey + e.shiftKey + e.altKey + e.metaKey + !data.meta;
        modifierCount *= !data.meta && (!data.char || modifierCount > 2 || modifierCount > 1 && !e.shiftKey);
        modifiedKeyCode = data.key;

        if (modifierCount) {
          triggerKeystrokeEvent(getEventName(e, data.key), '');
        }
      }
    },
    keyup: function keyup(e) {
      var data = normalizeKey(e);

      if (!imeNode && (data.meta || modifiedKeyCode === data.key)) {
        modifiedKeyCode = null;
        modifierCount--;
      }

      lastEventSource.sourceKeyName = null;
    },
    keypress: function keypress(e) {
      if (!imeNode) {
        var data = normalizeKey(e).char;
        var keyName = getEventName(e, modifiedKeyCode || data);
        lastEventSource.sourceKeyName = keyName;

        if (!modifierCount) {
          triggerKeystrokeEvent(keyName, data);
        }
      }
    },
    beforeinput: function beforeinput(e) {
      if (e.inputType !== 'insertCompositionText') {
        hasCompositionUpdate = false;
      }

      if (!imeNode && e.cancelable) {
        hasBeforeInput = true;

        switch (e.inputType) {
          case 'insertText':
            if (lastEventSource.sourceKeyName) {
              return;
            }

          case 'insertFromPaste':
          case 'insertFromDrop':
            return triggerUIEvent('textInput', e.data, true);

          case 'deleteByCut':
          case 'deleteContent':
          case 'deleteContentBackward':
            return triggerKeystrokeEvent('backspace', '');

          case 'deleteContentForward':
            return triggerKeystrokeEvent('delete', '');
        }
      }
    },
    touchstart: function touchstart(e) {
      mouseInitialPoint = extend({}, e.touches[0]);
      triggerMouseEvent('touchstart', mouseInitialPoint);

      if (!e.touches[1]) {
        pressTimeout = setTimeout(function () {
          if (mouseInitialPoint) {
            triggerMouseEvent('longPress', e);
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
          var point = mouseInitialPoint;
          var line = measureLine(e.touches[0], point);

          if (line.length > 5) {
            var swipeDir = approxMultipleOf(line.deg, 90) && (approxMultipleOf(line.deg, 180) ? line.dx > 0 ? 'Right' : 'Left' : line.dy > 0 ? 'Down' : 'Up');

            if (!swipeDir || !triggerGestureEvent('swipe' + swipeDir)) {
              triggerMouseEvent('drag', point);
            }

            mouseInitialPoint = null;
            return;
          }
        } else if (!e.touches[2]) {
          triggerGestureEvent('pinchZoom');
        }
      }
    },
    touchend: function touchend(e) {
      clearTimeout(pressTimeout);
    },
    mousedown: function mousedown(e) {
      mouseInitialPoint = e;
      preventClick = false;

      if (isMouseDown(e)) {
        triggerMouseEvent('mousedown');
      }
    },
    mousemove: function mousemove(e) {
      if (mouseInitialPoint && measureLine(e, mouseInitialPoint).length > 5) {
        var target = mouseInitialPoint.target;

        if (isMouseDown(e) && containsOrEquals(target, elementFromPoint(mouseInitialPoint.clientX, mouseInitialPoint.clientY))) {
          triggerMouseEvent('drag', mouseInitialPoint);
        }

        mouseInitialPoint = null;
        preventClick = true;
      }
    },
    wheel: function wheel(e) {
      var dir = e.deltaY || e.deltaX || e.detail;

      if (dir && !textInputAllowed(e.target) && triggerUIEvent('mousewheel', dir / Math.abs(dir) * (IS_MAC ? -1 : 1), false, e, e.target)) {
        e.stopPropagation();
      }
    },
    click: function click(e) {
      if (!preventClick) {
        setFocus(e.target);
        triggerMouseEvent(getEventName(e, 'click'));
      }

      preventClick = false;
    },
    contextmenu: function contextmenu(e) {
      triggerMouseEvent('rightClick');
    },
    dblclick: function dblclick(e) {
      triggerMouseEvent('dblclick');
    }
  };
  each(uiEvents, function (i, v) {
    bind(root, i, handleUIEventWrapper(i, v), {
      capture: true,
      passive: false
    });
  });
  bind(root, {
    focusin: function focusin(e) {
      var target = e.target;
      windowFocusedOut = false;

      if (!focusable(target)) {
        target.blur();
      } else {
        if (focusPath.indexOf(target) < 0) {
          setFocus(target, lastEventSource);
        }

        scrollIntoView(target, 10);
      }
    },
    focusout: function focusout(e) {
      imeNode = null;
      hasCompositionUpdate = false;

      if (!e.relatedTarget) {
        if (!isVisible(e.target)) {
          // browser set focus to body if the focused element is no longer visible
          // which is not a desirable behavior in many cases
          // find the first visible element in focusPath to focus
          var cur = any(focusPath.slice(focusPath.indexOf(e.target) + 1), isVisible);

          if (cur) {
            setFocus(cur, lastEventSource);
          }
        } else if (!currentEvent) {
          setTimeout(function () {
            if (!windowFocusedOut && focusPath[0] === e.target) {
              setFocus(e.target.parentNode, lastEventSource);
            }
          });
        }
      }
    }
  }, true);
  bind(env_window, 'wheel', function (e) {
    if (currentMetaKey) {
      return;
    } // scrolling will happen on first scrollable element up the DOM tree
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

    if (!focusable(cur === root ? env_document.body : cur)) {
      e.preventDefault();
    }
  }, {
    passive: false
  });
  bind(env_window, 'blur', function (e) {
    if (e.target === env_window) {
      windowFocusedOut = true;
    }
  });
  listenDOMEvent('escape', function () {
    setFocus(getModalElement() || env_document.body);
  });
  setFocus(env_document.activeElement);
  watchElements(root, SELECTOR_FOCUSABLE, updateTabIndex);
});
setShortcut({
  undo: 'ctrlZ',
  redo: 'ctrlY ctrlShiftZ',
  selectAll: 'ctrlA'
});
/* --------------------------------------
 * Exports
 * -------------------------------------- */

function dom_focus(element, focusInput) {
  if (focusInput !== false && !matchSelector(element, SELECTOR_FOCUSABLE)) {
    element = jquery(SELECTOR_FOCUSABLE, element).filter(':visible:not(:disabled,.disabled)')[0] || element;
  }

  setFocus(element);
  return focusPath[0] === element;
}

function dom_blur(element) {
  setFocus(focusPath[focusPath.indexOf(element) + 1]);
  return !focusElements.has(element);
}

/* harmony default export */ const dom = ({
  get event() {
    return currentEvent;
  },

  get metaKey() {
    return currentMetaKey;
  },

  get context() {
    return getEventContext(getActiveElement()).context;
  },

  get activeElement() {
    return getActiveElement();
  },

  get modalElement() {
    return getModalElement();
  },

  get focusedElements() {
    cleanupFocusPath();
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
  setTabRoot: setTabRoot,
  unsetTabRoot: unsetTabRoot,
  setModal: setModal,
  releaseModal: releaseModal,
  retainFocus: retainFocus,
  releaseFocus: releaseFocus,
  iterateFocusPath: iterateFocusPath,
  focus: dom_focus,
  blur: dom_blur,
  beginDrag: beginDrag,
  beginPinchZoom: beginPinchZoom,
  insertText: insertText,
  getShortcut: getShortcut,
  setShortcut: setShortcut,
  getEventSource: getEventSource,
  getEventContext: getEventContext,
  on: listenDOMEvent,
  emit: emitDOMEvent,
  lock: lock,
  locked: locked,
  cancelLock: cancelLock,
  subscribeAsync: subscribeAsync,
  notifyAsync: notifyAsync,
  preventLeave: preventLeave,
  observe: observe,
  registerCleanup: registerCleanup,
  createAutoCleanupMap: createAutoCleanupMap,
  afterDetached: afterDetached,
  watchElements: watchElements,
  watchAttributes: watchAttributes,
  watchOwnAttributes: watchOwnAttributes
});

// CONCATENATED MODULE: ./src/events.js







var _ = createPrivateStore();

var containers = new WeakMap();
var domEventTrap = new ZetaEventContainer();
var domContainer = new ZetaEventContainer();
var asyncEventData = new Map();
var asyncEvents = [];
var beforeInputType = {
  insertFromDrop: 'drop',
  insertFromPaste: 'paste',
  deleteByCut: 'cut'
};
var eventSource;
var lastEventSource;
/* --------------------------------------
 * Helper functions
 * -------------------------------------- */

function ZetaEventSource(target, path) {
  var self = this;
  var source = getEventSourceName();

  if (!path) {
    if (eventSource) {
      path = eventSource.path;
    } else if (source === 'mouse' || source === 'touch') {
      path = grep(parentsAndSelf(target), focusable);
    } else {
      path = dom.focusedElements;
    }
  }

  self.path = path;
  self.source = !target || containsOrEquals(path[0] || root, target) || path.indexOf(target) >= 0 ? source : 'script';
  self.sourceKeyName = self.source !== 'keyboard' ? null : (eventSource || lastEventSource || '').sourceKeyName;
}

function setLastEventSource(source) {
  lastEventSource = new ZetaEventSource(source);
}

function prepEventSource(promise) {
  return resolve(promise);
}

function getEventSource(element) {
  return element ? new ZetaEventSource(element).source : getEventSourceName();
}

function getEventSourceName() {
  if (eventSource) {
    return eventSource.source;
  }

  var event = dom.event || env_window.event;
  var type = event && event.type || '';

  if (type === 'beforeinput') {
    return beforeInputType[event.inputType] || 'keyboard';
  }

  if (type === 'mousemove') {
    return event.button || event.buttons ? 'mouse' : 'script';
  }

  if (/^(touch|mouse)./.test(type)) {
    return RegExp.$1;
  }

  if (/^(?:key.|composition.|textInput$)/.test(type)) {
    return 'keyboard';
  }

  if (matchWord(type, 'wheel click dblclick contextmenu')) {
    return 'mouse';
  }

  return matchWord(type, 'drop cut copy paste') || 'script';
}

function getContainerForElement(element) {
  var container = mapGet(containers, element);
  return container && !_(container).destroyed && container;
}

function removeContainerForElement(element, container) {
  var cached = mapGet(containers, element);

  if (cached && cached === container) {
    mapRemove(containers, element);
  }
}

function getEventContext(element) {
  var container;

  for (; !container && element; element = element.parentNode) {
    container = getContainerForElement(element);
  }

  return _(container || domContainer).options;
}

function normalizeEventOptions(options, overrides) {
  if (typeof options === 'boolean') {
    options = {
      bubbles: options
    };
  }

  return extend({
    handleable: true,
    asyncResult: true
  }, options, overrides);
}

function emitDOMEvent(eventName, target, data, options) {
  if (!is(target, Node)) {
    options = data;
    data = target;
    target = dom.activeElement;
  }

  var emitter = new ZetaEventEmitter(eventName, domContainer, target, data, normalizeEventOptions(options));
  var visited = new Set();
  return single(parentsAndSelf(target), function (v) {
    var container = getContainerForElement(v);

    if (container && setAdd(visited, container)) {
      return emitter.emit(domEventTrap, 'tap', container, false);
    }
  }) || emitter.emit();
}

function wrapSelectorHandler(selector, callback) {
  return function (e) {
    var matched = jquery(e.target).closest(selector)[0];

    if (matched) {
      e.currentTarget = matched;
      return callback.call(matched, e, matched);
    }
  };
}

function listenDOMEvent(element, event, handler, extra) {
  if (!is(element, Node)) {
    extra = handler;
    handler = event;
    event = element;
    element = root;
  }

  if (typeof handler === 'string') {
    handler = wrapSelectorHandler(handler, extra);
  }

  return domContainer.add(element, event, handler);
}

function registerAsyncEvent(eventName, container, target, data, options, mergeData) {
  var map = mapGet(asyncEventData, container, Map);
  var dict = mapGet(map, target || container.element, Object);

  if (dict[eventName] && (isFunction(mergeData) || isUndefinedOrNull(data) && isUndefinedOrNull(dict[eventName].data))) {
    dict[eventName].data = mergeData && mergeData(dict[eventName].data, data);
  } else {
    dict[eventName] = new ZetaEventEmitter(eventName, container, target, data, normalizeEventOptions(options, {
      handleable: false
    }), true);
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
    arrRemove(asyncEvents, event);
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


function ZetaEventEmitter(eventName, container, target, data, options, async) {
  target = target || container.element;
  var self = this;
  var element = is(target.element, Node) || target;
  var source = options.source || new ZetaEventSource(element);
  var properties = {
    source: source.source,
    sourceKeyName: source.sourceKeyName,
    timestamp: performance.now(),
    clientX: options.clientX,
    clientY: options.clientY,
    originalEvent: options.originalEvent || null
  };
  extend(self, options, properties, {
    container: container,
    eventName: eventName,
    target: target,
    element: element,
    source: source,
    data: data,
    properties: properties,
    current: []
  });
  self.targets = async && map(emitterIterateTargets(self), function (v) {
    return {
      container: v.container,
      target: v.target,
      contexts: extend({}, v.contexts),
      handlers: kv(eventName, extend({}, v.handlers[eventName]))
    };
  });
}

definePrototype(ZetaEventEmitter, {
  emit: function emit(container, eventName, target, bubbles) {
    var self = this;
    var targets = self.targets;

    if (container && container !== self.container || target && target !== self.target) {
      var elements = parentsAndSelf(target || self.target);
      targets = emitterIterateTargets(self, container, elements, bubbles);
    } else if (!targets) {
      targets = emitterIterateTargets(self);
    }

    var emitting = self.current[0] || self;
    single(targets, function (v) {
      return emitterCallHandlers(self, v, emitting.eventName, eventName, emitting.data);
    });
    return self.result;
  }
});

function emitterGetElements(emitter, bubbles) {
  var target = emitter.target;

  if (!is(target, Node)) {
    return bubbles ? parentsAndSelf(target) : [target];
  }

  var originalEvent = emitter.originalEvent;
  var focusedElements = dom.focusedElements;
  var index = focusedElements.indexOf(target);

  if (!originalEvent || originalEvent !== dom.event || index < 0) {
    return bubbles ? iterateFocusPath(target) : [target];
  }

  var targets = focusedElements.slice(index);

  if (emitter.clientX === undefined || !document.elementFromPoint) {
    return targets;
  }

  var element = document.elementFromPoint(emitter.clientX, emitter.clientY) || root;
  return grep(targets, function (v) {
    return containsOrEquals(v, element);
  });
}

function emitterIterateTargets(emitter, container, elements, bubbles) {
  var components = _(container || emitter.container).components;

  if (isUndefinedOrNull(bubbles)) {
    bubbles = emitter.bubbles;
  }

  elements = elements || emitterGetElements(emitter, bubbles);

  if (!bubbles) {
    return makeArray(components.get(elements[0]));
  }

  if (isArray(elements)) {
    // convert plain array to iterator so that subsequent call to nextNode will
    // resume at the correct index
    elements = elements.values();
  }

  return {
    nextNode: function nextNode() {
      return single(elements, function (v) {
        return components.get(v);
      });
    }
  };
}

function emitterCallHandlers(emitter, component, eventName, handlerName, data) {
  if (!handlerName && matchWord(eventName, 'keystroke gesture') && emitterCallHandlers(emitter, component, data.data || data, handlerName)) {
    return true;
  }

  var sourceContainer = component.container;
  var prevEventSource = eventSource;
  var handlers = component.handlers[handlerName || eventName];
  var handled;

  if (handlers) {
    eventSource = emitter.source;
    emitter.current.unshift({
      eventName: eventName,
      data: data
    });
    handled = single(handlers, function (v, i) {
      var context = component.contexts[i];
      var event = new ZetaEvent(emitter, eventName, component, context, data);

      if (isUndefinedOrNull(data)) {
        data = removeAsyncEvent(eventName, sourceContainer, context);
      }

      var contextContainer = is(context, ZetaEventContainer) || sourceContainer;
      var prevEvent = contextContainer.event;
      sourceContainer.initEvent(event);
      contextContainer.event = event;

      try {
        var returnValue = v.call(event.context, event, event.context);

        if (returnValue !== undefined) {
          event.handled(returnValue);
        }
      } catch (e) {
        console.error(e);

        if (emitter.asyncResult) {
          event.handled(reject(e));
        }
      }

      contextContainer.event = prevEvent;
      return emitter.handled;
    });
    emitter.current.shift();
    eventSource = prevEventSource;
  }

  if (!handled && !emitter.current[0] && eventName === 'keystroke') {
    if (data.char && textInputAllowed(emitter.element)) {
      return emitterCallHandlers(emitter, component, 'textInput', handlerName, data.char);
    }

    return single(getShortcut(data.data), function (v) {
      return emitterCallHandlers(emitter, component, v, handlerName);
    });
  }

  return handled;
}
/* --------------------------------------
 * ZetaEvent
 * -------------------------------------- */


function ZetaEvent(event, eventName, component, context, data) {
  var self = extend(this, event.properties);
  self.eventName = eventName;
  self.type = eventName;
  self.context = context;
  self.currentTarget = component.target;
  self.target = event.element;
  self.data = null;

  if (isPlainObject(data)) {
    extend(self, data);
  } else if (data !== undefined) {
    self.data = data;
  }

  _(self, event);
}

definePrototype(ZetaEvent, {
  handled: function handled(value) {
    var event = _(this);

    if (event.handleable && !event.handled) {
      event.handled = true;
      event.result = event.asyncResult ? util_resolve(value) : value;
    }
  },
  isHandled: function isHandled() {
    return !!_(this).handled;
  },
  preventDefault: function preventDefault() {
    var event = this.originalEvent;

    if (event) {
      event.preventDefault();
    }
  },
  isDefaultPrevented: function isDefaultPrevented() {
    return !!(this.originalEvent || _(this)).defaultPrevented;
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
    autoDestroy: false,
    normalizeTouchEvents: false,
    captureDOMEvents: false,
    initEvent: noop
  }, options);

  _(self, {
    options: options,
    components: new WeakMap()
  });

  extend(self, options);

  if (element && self.captureDOMEvents) {
    containers.set(element, self);
  }

  if (self.autoDestroy) {
    registerCleanup(element, function () {
      self.destroy();
    });
  }
}

definePrototype(ZetaEventContainer, {
  event: null,
  tap: function tap(handler) {
    domEventTrap.add(this, 'tap', handler);
  },
  getContexts: function getContexts(element) {
    var state = _(this).components.get(element);

    var visited = new Set();
    return grep(state && state.contexts, function (v) {
      return v !== element && setAdd(visited, v);
    });
  },
  add: function add(target, event, handler) {
    var self = this;
    var key = randomId();
    var element = is(target.element, Node);
    containerRegisterHandler(self, target, key, target, event, handler);

    if (element) {
      containerRegisterHandler(self, element, key, target, event, handler);

      if (self.captureDOMEvents) {
        containers.set(element, self);
      }
    }

    return executeOnce(function () {
      containerRemoveHandler(self, target, key);

      if (element) {
        containerRemoveHandler(self, element, key);
      }
    });
  },
  delete: function _delete(target) {
    var self = this;

    if (mapRemove(_(self).components, target) && self.captureDOMEvents) {
      removeContainerForElement(target, self);
    }
  },
  emit: function emit(eventName, target, data, bubbles) {
    var options = normalizeEventOptions(bubbles);
    var emitter = is(_(eventName), ZetaEventEmitter) || new ZetaEventEmitter(eventName, this, target, data, options); // @ts-ignore: type inference issue

    return emitter.emit(this, null, target, options.bubbles);
  },
  emitAsync: function emitAsync(eventName, target, data, bubbles, mergeData) {
    registerAsyncEvent(eventName, this, target, data, bubbles, mergeData);
  },
  flushEvents: function flushEvents() {
    emitAsyncEvents(this);
  },
  destroy: function destroy() {
    var self = this;

    var state = _(self);

    if (self.captureDOMEvents) {
      domEventTrap.delete(self);
    }

    state.destroyed = true;
  }
});

function containerRegisterHandler(container, target, key, context, event, handler) {
  var cur = mapGet(_(container).components, target, function () {
    return {
      container: container,
      target: target.element || target,
      contexts: {},
      handlers: {}
    };
  });
  var handlers = cur.handlers;
  each(isPlainObject(event) || kv(event, handler), function (i, v) {
    (handlers[i] || (handlers[i] = {}))[key] = throwNotFunction(v);
  });
  cur.contexts[key] = context;
}

function containerRemoveHandler(container, target, key) {
  var cur = mapGet(_(container).components, target);

  if (!cur) {
    return;
  }

  var handlers = cur.handlers;
  each(handlers, function (i, v) {
    delete v[key];

    if (!keys(v)[0]) {
      delete handlers[i];
    }
  });
  delete cur.contexts[key];

  if (!keys(handlers)[0]) {
    container.delete(target);
  }
}


// CONCATENATED MODULE: ./src/domUtil.js



 // @ts-ignore: non-standard member

var elementsFromPoint = env_document.msElementsFromPoint || env_document.elementsFromPoint;
var compareDocumentPositionImpl = env_document.compareDocumentPosition;
var visualViewport = env_window.visualViewport;
var domUtil_parseFloat = env_window.parseFloat;
var helperDiv = jquery('<div style="position:fixed;top:0;left:0;right:0;bottom:0;visibility:hidden;pointer-events:none;--sai:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)">')[0];
var scrollbarWidth;
var safeAreaInset;
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

    if (l && l.top !== undefined) {
      t = t || 1;
      return self.expand(l.left * t, l.top * t, l.right * t, l.bottom * t);
    }

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

function attachHelperDiv() {
  if (!containsOrEquals(env_document.body, helperDiv)) {
    env_document.body.appendChild(helperDiv);
  }

  return helperDiv;
}

function tagName(element) {
  return element && element.tagName && element.tagName.toLowerCase();
}

function matchSelector(element, selector) {
  if (!element || !selector) {
    return false;
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
    for (var cur = element; cur && cur !== env_document; cur = cur.parentNode) {
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

  try {
    var matched = makeArray(container.querySelectorAll(selector));
    return matchSelector(container, selector) ? [container].concat(matched) : matched;
  } catch (e) {
    var matched = jquery(container).filter(selector).add(jquery(container).find(selector)).get();

    if (matched[0] || container === root) {
      return matched;
    }

    return jquery(container).find(jquery(selector)).get();
  }
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
  (element.getAttribute('class') || '').replace(re, function (v, a) {
    t[a ? t.length : 0] = a || true;
  });
  return t[1] ? t.slice(1) : t[0];
}

function setClass(element, className, values) {
  var value = element.getAttribute('class') || '';
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
  element.setAttribute('class', value);
}

function getSafeAreaInset() {
  if (!safeAreaInset) {
    var values = getComputedStyle(attachHelperDiv()).getPropertyValue('--sai').split(' ');
    safeAreaInset = freeze({
      top: domUtil_parseFloat(values[0]) || 0,
      left: domUtil_parseFloat(values[3]) || 0,
      right: domUtil_parseFloat(values[1]) || 0,
      bottom: domUtil_parseFloat(values[2]) || 0
    });
  }

  return safeAreaInset;
}

function getBoxValues(element, prop, sign) {
  var style = getComputedStyle(element);
  var t = domUtil_parseFloat(style[prop + 'Top']) || 0;
  var l = domUtil_parseFloat(style[prop + 'Left']) || 0;
  var r = domUtil_parseFloat(style[prop + 'Right']) || 0;
  var b = domUtil_parseFloat(style[prop + 'Bottom']) || 0;
  return sign === -1 ? [-l, -t, -r, -b] : [l, t, r, b];
}

function getScrollOffset(winOrElm) {
  return {
    x: winOrElm.pageXOffset || winOrElm.scrollLeft || 0,
    y: winOrElm.pageYOffset || winOrElm.scrollTop || 0
  };
}

function getScrollParent(element, skipSelf, target) {
  target = target || element;

  for (; element; element = element.parentNode) {
    var s = getComputedStyle(element);

    if (skipSelf) {
      return element === root || s.position === 'fixed' ? null : getScrollParent(element.parentNode, false, target);
    }

    if (element === root || s.overflow !== 'visible' || !matchWord(s.position, 'static relative') || getContentRectCustom(element, target)) {
      break;
    }
  }

  return element;
}

function scrollBy(element, x, y, behavior) {
  behavior = behavior || 'auto';
  var result = emitDOMEvent('scrollBy', element, {
    x: x,
    y: y,
    behavior: behavior
  }, {
    asyncResult: false
  });

  if (result) {
    return result;
  }

  element = element === env_window || element === env_document.body ? root : element;
  var style = getComputedStyle(element);

  if (style.overflowX !== 'scroll' && style.overflowX !== 'auto') {
    x = 0;
  } // include special case for root or body where scrolling is enabled when overflowY is visible


  if (style.overflowY !== 'scroll' && style.overflowY !== 'auto' && (element !== root || style.overflowY !== 'visible')) {
    y = 0;
  }

  if (!x && !y) {
    return {
      x: x,
      y: y
    };
  }

  var orig = getScrollOffset(element);

  var getResult = function getResult() {
    var cur = getScrollOffset(element);
    return {
      x: cur.x - orig.x,
      y: cur.y - orig.y
    };
  };

  var getOptions = function getOptions(left, top, behavior) {
    return {
      left: left,
      top: top,
      behavior: behavior
    };
  };

  if (element.scrollBy) {
    element.scrollBy(getOptions(x, y, 'instant'));

    if (behavior === 'smooth' || behavior === 'auto' && style.scrollBehavior === 'smooth') {
      result = getResult();
      element.scrollTo(getOptions(orig.x, orig.y, 'instant'));
      element.scrollBy(getOptions(x, y, behavior));
    }
  } else {
    element.scrollLeft = orig.x + x;
    element.scrollTop = orig.y + y;
  }

  return result || getResult();
}

function getContentRectCustom(element, target) {
  var result = emitDOMEvent('getContentRect', element, {
    target: target
  }, {
    asyncResult: false
  });
  return result && toPlainRect(result);
}

function getContentRectNative(element) {
  var isRoot = element === root || element === env_document.body;
  var parentRect = getRect(isRoot ? env_window : element, getBoxValues(element, 'scrollPadding', -1));

  if (isRoot) {
    var inset = getSafeAreaInset();
    var winRect = getRect();
    var rootRect = getRect(root);
    return toPlainRect({
      top: Math.max(parentRect.top, rootRect.top, winRect.top + inset.top),
      left: Math.max(parentRect.left, rootRect.left, winRect.left + inset.left),
      right: Math.min(parentRect.right, rootRect.right, winRect.right - inset.right),
      bottom: Math.min(parentRect.bottom, rootRect.bottom, winRect.bottom - inset.bottom)
    });
  }

  if (scrollbarWidth === undefined) {
    // detect native scrollbar size
    // height being picked because scrollbar may not be shown if container is too short
    var dummy = jquery('<div style="overflow:scroll;height:80px"><div style="height:100px"></div></div>').appendTo(env_document.body)[0];
    scrollbarWidth = getRect(dummy).width - getRect(dummy.children[0]).width;
    removeNode(dummy);
  }

  if (scrollbarWidth) {
    var style = getComputedStyle(element);

    if (style.overflowY === 'scroll' || style.overflowY === 'auto' && element.offsetHeight < element.scrollHeight) {
      parentRect.right -= scrollbarWidth;
    }

    if (style.overflowX === 'scroll' || style.overflowX === 'auto' && element.offsetWidth < element.scrollWidth) {
      parentRect.bottom -= scrollbarWidth;
    }
  }

  return parentRect;
}

function getContentRect(element) {
  return getContentRectCustom(element, element) || getContentRectNative(element);
}

function scrollIntoView(element, align, rect, within, behavior) {
  if (!isVisible(element)) {
    return false;
  }

  if (typeof align !== 'string') {
    behavior = within;
    within = rect;
    rect = align;
    align = '';
  }

  within = within || root;

  if (!rect || rect.top === undefined) {
    rect = getRect(element, typeof rect === 'number' ? rect : getBoxValues(element, 'scrollMargin'));
  }

  var dirX = matchWord(align, 'left right');
  var dirY = matchWord(align, 'top bottom');

  if (!dirX || !dirY) {
    var iter = matchWordMulti(align, 'auto center');
    var iterValue = iter();
    dirX = dirX || iterValue;
    dirY = dirY || iter() || iterValue;
  }

  var getDelta = function getDelta(a, b, dir, dStart, dEnd, dCenter) {
    if (dir === dStart || dir === dEnd) {
      return a[dir] - b[dir];
    } else if (dir === 'center') {
      return a[dCenter] - b[dCenter];
    } else {
      var d = a[dStart] - b[dStart];
      return Math.min(d, 0) || Math.max(0, Math.min(d, a[dEnd] - b[dEnd]));
    }
  };

  var parent = getScrollParent(element);
  var result = {
    x: 0,
    y: 0
  };

  while (containsOrEquals(within, parent)) {
    var parentRect = getContentRectCustom(parent, element) || getContentRectNative(parent);
    var deltaX = getDelta(rect, parentRect, dirX, 'left', 'right', 'centerX');
    var deltaY = getDelta(rect, parentRect, dirY, 'top', 'bottom', 'centerY');

    if (deltaX || deltaY) {
      var parentResult = scrollBy(parent, deltaX, deltaY, behavior);
      rect = rect.translate(-parentResult.x, -parentResult.y);
      result.x += parentResult.x;
      result.y += parentResult.y;
    }

    parent = getScrollParent(parent, true, element);
  }

  return result.x || result.y ? result : false;
}
/* --------------------------------------
 * Range and rect
 * -------------------------------------- */


function makeSelection(b, e) {
  var selection = getSelection();

  if (!selection) {
    return;
  }

  e = e || b; // for newer browsers that supports setBaseAndExtent
  // avoid undesirable effects when direction of editor's selection direction does not match native one

  if (selection.setBaseAndExtent) {
    selection.setBaseAndExtent(b.startContainer, b.startOffset, e.endContainer, e.endOffset);
    return;
  }

  var range = env_document.createRange();
  range.setStart(b.startContainer, b.startOffset);
  range.setEnd(e.endContainer, e.endOffset);
  selection.removeAllRanges();
  selection.addRange(range);
}

function getRect(elm, includeMargin) {
  var rect;
  elm = elm || env_window;

  if (elm.getRect) {
    rect = elm.getRect();
  } else {
    elm = elm.element || elm;

    if (elm === env_window) {
      rect = visualViewport ? toPlainRect(0, 0, visualViewport.width, visualViewport.height) : toPlainRect(0, 0, root.clientWidth, root.clientHeight);
    } else if (elm === root) {
      rect = getRect(attachHelperDiv());
    } else if (!containsOrEquals(root, elm)) {
      // IE10 throws Unspecified Error for detached elements
      rect = toPlainRect(0, 0, 0, 0);
    } else {
      rect = toPlainRect(elm.getBoundingClientRect());

      switch (includeMargin) {
        case true:
          includeMargin = getBoxValues(elm, 'margin');

          for (var i = 0; i <= 3; i++) {
            includeMargin[i] = Math.max(0, includeMargin[i]);
          }

          break;

        case 'margin-box':
          includeMargin = getBoxValues(elm, 'margin');
          break;

        case 'padding-box':
          includeMargin = getBoxValues(elm, 'border', -1);
          break;

        case 'content-box':
          var a = getBoxValues(elm, 'border', -1);
          var b = getBoxValues(elm, 'padding');
          includeMargin = [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]];
      }
    }
  }

  if (typeof includeMargin === 'number') {
    rect = rect.expand(includeMargin);
  } else if (isArray(includeMargin)) {
    rect = rect.expand.apply(rect, includeMargin);
  }

  return rect;
}

function getRects(range) {
  if (!is(range, Range)) {
    var r1 = env_document.createRange();
    r1.selectNodeContents(range);
    range = r1;
  }

  return map(range.getClientRects(), toPlainRect);
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






var getAnimationsImpl = root.getAnimations;

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
  return /(?:^|\s)(?:[+-]?(\d+(?:\.\d+)?)(cm|mm|Q|in|pc|pt|px|em|ex|ch|rem|lh|vw|vh|vmin|vmax|%)?|#[0-9a-f]{3,}|(rgba?|hsla?|matrix|calc)\(.+\))(?:$|\s)/.test(v) && (allowNumber || !RegExp.$1 || RegExp.$2);
}

function removeVendorPrefix(name) {
  return name.replace(/^-(webkit|moz|ms|o)-/, '');
}

function runCSSTransition(element, className, callback) {
  if (getClass(element, className)) {
    return reject(errorWithCode(invalidOperation));
  }

  callback = callback || noop;

  if (callback === true) {
    callback = setClass.bind(null, element, className, false);
  }

  function complete() {
    if (getClass(element, className)) {
      callback();
      return util_resolve(element);
    } else {
      return reject(errorWithCode(cancelled));
    }
  }

  if (getAnimationsImpl) {
    var anim = getAnimationsImpl.call(element, {
      subtree: true
    });
    setClass(element, className, true);
    anim = grep(getAnimationsImpl.call(element, {
      subtree: true
    }), function (v) {
      return !anim.includes(v);
    });

    if (!anim[0]) {
      return complete();
    }

    return resolveAll(anim.map(function (v) {
      return v.finished;
    })).then(complete, function () {
      return reject(errorWithCode(cancelled));
    });
  }

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

  setClass(element, className, true);
  iterateNode(createNodeIterator(element, 1, function (v) {
    if (!isVisible(v)) {
      return 2;
    }

    test(v, null);
    test(v, '::before');
    test(v, '::after');
  }));

  if (!arr[0]) {
    return complete();
  }

  var targets = arr.map(function (v) {
    return v.element;
  });
  setClass(element, className, false);
  jquery(targets).css({
    transition: 'none',
    animationDuration: '0s'
  });
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
  jquery(targets).css({
    transition: '',
    animationDuration: ''
  });
  setClass(element, className, true);

  if (!map.size) {
    return complete();
  }

  return new promise_polyfill(function (resolve, reject) {
    var unbind = bind(element, 'animationend transitionend', function (e) {
      var dict = map.get(e.target) || {}; // @ts-ignore: mixed type of Event

      delete dict[(e.propertyName ? removeVendorPrefix(e.propertyName) : '@' + e.animationName) + (e.pseudoElement || '')];

      if (!keys(dict)[0] && map.delete(e.target) && !map.size) {
        unbind();
        resolve(complete());
      }
    });
  });
}


// CONCATENATED MODULE: ./src/tree.js





var SNAPSHOT_PROPS = 'parentNode previousSibling nextSibling'.split(' ');

var tree_ = createPrivateStore();

var previous = new WeakMap();
var setPrototypeOf = Object.setPrototypeOf;
var collectMutations = observe(root, handleMutations);
/** @type {WeakMap<Element, VersionState>} */

var versionMap = new WeakMap();
var version = 0;
/* --------------------------------------
 * Helper functions
 * -------------------------------------- */

function throwOrReturn(result, throwError, message) {
  if (!result && throwError) {
    util_throws(message);
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
  var map = containsOrEquals(tree.element, element) ? tree_(tree).nodes : tree_(tree).detached;

  if (map.has(element)) {
    util_throws('Another node instance already exist');
  }

  var state = mapGet(versionMap, element, VersionState);

  var sNode = tree_(node, {
    version: version,
    tree: tree,
    node: node,
    traversable: is(node, TraversableNode),
    state: state,
    parentState: state,
    parentNode: null,
    previousSibling: null,
    nextSibling: null,
    childNodes: []
  });

  map.set(element, sNode);
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

function setParentNode(sNode, sParent) {
  sNode.parentNode = (sParent || '').node || null;
  sNode.parentState = (sParent || sNode).state;
}

function checkNodeState(sNode) {
  collectMutations();

  if (sNode.version !== sNode.parentState.version || tree_(sNode.tree).collectNewNodes()) {
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

function removeNodeFromMap(sNode) {
  var sTree = tree_(sNode.tree);

  var element = sNode.node.element;

  if (!mapRemove(sTree.nodes, element)) {
    // the node is already removed from the tree
    // therefore nothing to do
    return false;
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
      setParentNode(tree_(parentChildNodes[i]), sChild);
      childNodes.unshift(parentChildNodes.splice(i, 1)[0]);
    }
  }

  setParentNode(sChild, sParent);
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
      var p1 = parentChildNodes[pos - 1] || null;
      var p2 = parentChildNodes[pos + 1] || null;
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

  var newParent = (findParent(sNode) || '').node;

  if (!hardRemove && newParent === parent) {
    return false;
  }

  var childNodes = [];

  var sParent = tree_(parent);

  var parentChildNodes = sParent.childNodes;
  var pos = parentChildNodes.indexOf(sNode.node);

  if (hardRemove) {
    newParent = null;
    childNodes = sNode.childNodes.splice(0);

    if (!ignoreSibling && childNodes[0]) {
      var states = map(childNodes, function (v) {
        return tree_(v);
      });
      states[0].previousSibling = parentChildNodes[pos - 1] || null;
      states[states.length - 1].nextSibling = parentChildNodes[pos + 1] || null;
      each(states, function (i, v) {
        setParentNode(v, sParent);
      });
    }
  }

  if (!ignoreSibling && parentChildNodes[1]) {
    var empty = {};

    var s1 = tree_(parentChildNodes[pos - 1]);

    var s2 = tree_(parentChildNodes[pos + 1]);

    (s1 || empty).nextSibling = childNodes[0] || (s2 || empty).node || null;
    (s2 || empty).previousSibling = childNodes[childNodes.length - 1] || (s1 || empty).node || null;
  }

  if (!previous.has(sNode.node)) {
    previous.set(sNode.node, pick(sNode, SNAPSHOT_PROPS));
  }

  setParentNode(sNode, tree_(newParent));
  sNode.previousSibling = null;
  sNode.nextSibling = null;
  parentChildNodes.splice.apply(parentChildNodes, [pos, 1].concat(childNodes));
  return true;
}

function removeInheritedNode(sNode, hardRemove) {
  var updated = removeTraversableNode(sNode, hardRemove, true);

  if (updated) {
    setPrototypeOf(sNode.node, InheritedNode.prototype);

    if (hardRemove) {
      each(sNode.childNodes, function (i, v) {
        setPrototypeOf(v, sNode.parentNode);
      });
    }
  }

  return updated;
}

function reorderTraversableChildNodes(sNode) {
  var childNodes = sNode.childNodes;
  var copy = childNodes.slice();
  var updated = [];

  for (var i = copy.length - 1; i >= 0; i--) {
    if (!containsOrEquals(sNode.tree, copy[i]) && removeTraversableNode(tree_(copy[i]))) {
      updated[updated.length] = copy[i];
    }
  }

  if (childNodes.length > 1) {
    copy = childNodes.slice(0);
    childNodes.sort(comparePosition);

    if (!equal(childNodes, copy)) {
      each(childNodes, function (i, v) {
        var sChildNode = tree_(v);

        var oldValues = pick(sChildNode, SNAPSHOT_PROPS);
        var newValues = {
          parentNode: sNode.node,
          previousSibling: childNodes[i - 1] || null,
          nextSibling: childNodes[i + 1] || null
        };

        if (!equal(oldValues, newValues)) {
          extend(sChildNode, newValues);
          updated[updated.length] = v;

          if (!previous.has(v)) {
            previous.set(v, oldValues);
          }
        }
      });
    }
  }

  return updated;
}

function updateTree(tree) {
  var sTree = tree_(tree);

  var traversable = is(tree, TraversableNodeTree);
  var updatedNodes = [];
  each(sTree.nodes, function (element, sNode) {
    var newVersion = sNode.state.version;
    var connected = containsOrEquals(tree, element);

    if (!connected) {
      sTree.detached.set(element, mapRemove(sTree.nodes, element));
    }

    if (!connected || sNode.version !== newVersion) {
      var updated = false;

      if (traversable) {
        // @ts-ignore: boolean arithmetics
        updated |= updatedNodes.length !== updatedNodes.push.apply(updatedNodes, reorderTraversableChildNodes(sNode));
      } // @ts-ignore: boolean arithmetics


      updated |= (connected ? insertNode : tree_removeNode)(sNode);
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
            sTree.nodes.set(element, recovered);
            insertNode(recovered);
            updatedNodes[updatedNodes.length] = recovered.node;
          }
        });
      }
    }
  });
  sTree.collectNewNodes();
  sTree.version = version;

  if (updatedNodes[0]) {
    var records = map(updatedNodes, function (v) {
      return extend({
        node: v
      }, mapRemove(previous, v) || pick(v, SNAPSHOT_PROPS));
    });
    sTree.container.emit('update', tree, {
      updatedNodes: updatedNodes,
      records: records
    }, false);
  }
}

function handleMutations(mutations) {
  var empty = {};
  each(mutations, function (i, v) {
    var addedElm = grep(v.addedNodes, function (v) {
      return is(v, Element);
    });
    var removedElm = grep(v.removedNodes, function (v) {
      return is(v, Element);
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
    return checkNodeState(tree_(this)).parentNode;
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
    return checkNodeState(tree_(this)).previousSibling;
  },

  get nextSibling() {
    return checkNodeState(tree_(this)).nextSibling;
  }

});

function InheritedNode(tree, element) {
  initNode(tree, this, element);
}

definePrototype(InheritedNode, VirtualNode);

function NodeTree(baseClass, root, constructor, options) {
  var self = this;

  var state = tree_(self, extend({}, options, {
    collectNewNodes: noop,
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

  if (state.selector) {
    state.collectNewNodes = watchElements(root, state.selector, function (addedNodes) {
      each(addedNodes, function (i, v) {
        self.setNode(v);
      });
    });
  }
}

definePrototype(NodeTree, {
  on: function on(event, handler) {
    return tree_(this).container.add(this, isPlainObject(event) || kv(event, handler));
  },
  getNode: function getNode(element) {
    if (!assertDescendantOfTree(this, element)) {
      return null;
    }

    var self = this;
    var result = findNode(self, element, true);

    if (!result) {
      tree_(self).collectNewNodes();

      result = findNode(self, element, true);
    }

    return result && result.node;
  },
  setNode: function setNode(element) {
    var self = this;
    var result = findNode(self, element);
    return result ? result.node : new (tree_(self).nodeClass)(self, element);
  },
  removeNode: function removeNode(node) {
    assertSameTree(this, node, true);
    removeNodeFromMap(tree_(node));
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

  return null;
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

  return null;
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

    return null;
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

    return null;
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
  dom: dom,
  css: cssUtil_namespaceObject,
  ErrorCode: errorCode_namespaceObject,
  EventContainer: ZetaEventContainer,
  InheritedNode: InheritedNode,
  InheritedNodeTree: InheritedNodeTree,
  TraversableNode: TraversableNode,
  TraversableNodeTree: TraversableNodeTree,
  TreeWalker: TreeWalker
});


/***/ }),

/***/ 254:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__254__;

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
/******/ 	return __webpack_require__(702);
/******/ })()
;
});
//# sourceMappingURL=zeta.js.map