import Promise from "./include/promise-polyfill.js";
import { root } from "./env.js";
import { combineFn, each, extend, grep, is, isFunction, makeArray, map, mapGet, mapRemove, noop, throwNotFunction } from "./util.js";
import { containsOrEquals, selectIncludeSelf } from "./domUtil.js";

const detachHandlers = new WeakMap();
const optionsForChildList = {
    subtree: true,
    childList: true
};
const globalCleanups = createAutoCleanupMap(function (element, arr) {
    combineFn(arr)();
});

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
    var collect = function () {
        processRecords(observer.takeRecords());
    };
    var dispose = function () {
        observer.disconnect();
    };
    if (element !== root) {
        registerCleanup(element, dispose);
    }
    return extend(collect, { dispose });
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
        promise = new Promise(function (resolve) {
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
    var options = extend({}, optionsForChildList, {
        attributes: /[[.:]/.test(selector)
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

export {
    observe,
    registerCleanup,
    createAutoCleanupMap,
    afterDetached,
    watchElements,
    watchAttributes,
    watchOwnAttributes
};
