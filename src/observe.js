import Promise from "./include/promise-polyfill.js";
import { root, domReady } from "./env.js";
import { combineFn, each, extend, grep, is, isFunction, makeArray, map, mapGet, mapRemove, noop, throwNotFunction } from "./util.js";
import { containsOrEquals, selectIncludeSelf } from "./domUtil.js";

const detachHandlers = new WeakMap();
const optionsForChildList = {
    subtree: true,
    childList: true
};

let globalCleanups;

function DetachHandlerState() {
    this.handlers = []
    this.map = new Map();
}

function observe(element, options, callback) {
    callback = throwNotFunction(callback || options);
    if (isFunction(options)) {
        options = optionsForChildList;
    }
    var processRecords = callback;
    if (options.attributes) {
        processRecords = function (records) {
            records = records.filter(function (v) {
                // filter out changes due to sizzle engine
                // to prevent excessive invocation due to querying elements through jQuery
                return v.attributeName !== 'id' || ((v.oldValue || '').slice(0, 6) !== 'sizzle' && (v.target.id !== (v.oldValue || '')));
            });
            if (records[0]) {
                callback(records);
            }
        };
    }
    var observer = new MutationObserver(processRecords);
    observer.observe(element, options);
    return function () {
        processRecords(observer.takeRecords());
    };
}

function registerCleanup(element, callback) {
    if (isFunction(element)) {
        var state = initDetachWatcher(root);
        state.handlers.push(element);
    } else {
        var map = globalCleanups || (globalCleanups = createAutoCleanupMap(function (element, arr) {
            combineFn(arr)();
        }));
        mapGet(map, element, Set).add(callback);
    }
}

function createAutoCleanupMap(callback) {
    var map = new Map();
    callback = isFunction(callback) || noop;
    observe(root, function () {
        each(map, function (i) {
            if (!root.contains(i)) {
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
        promise = new Promise(function (resolve) {
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
    var fn = observe(element, options, function () {
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
    return fn;
}

function watchAttributes(element, attributes, callback, fireInit) {
    var options = {
        subtree: true,
        attributes: true,
        attributeFilter: makeArray(attributes)
    };
    var fn = observe(element, options, function (records) {
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
    return fn;
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

export {
    observe,
    registerCleanup,
    createAutoCleanupMap,
    afterDetached,
    watchElements,
    watchAttributes
};
