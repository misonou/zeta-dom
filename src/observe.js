import Promise from "./include/promise-polyfill.js";
import { root } from "./env.js";
import { each, extend, grep, isFunction, makeArray, map, mapGet, mapRemove, throwNotFunction } from "./util.js";
import { containsOrEquals, selectIncludeSelf } from "./domUtil.js";
import dom from "./dom.js";

const detachHandlers = new WeakMap();
const optionsForChildList = {
    subtree: true,
    childList: true
};

function DetachHandlerState() {
    this.handlers = []
    this.map = new Map();
}

function observe(element, options, callback) {
    callback = throwNotFunction(callback || options);
    if (isFunction(options)) {
        options = optionsForChildList;
    }
    var processRecords = function (records) {
        records = records.filter(function (v) {
            // filter out changes due to sizzle engine
            // to prevent excessive invocation due to querying elements through jQuery
            return v.attributeName !== 'id' || ((v.oldValue || '').slice(0, 6) !== 'sizzle' && (v.target.id !== (v.oldValue || '')));
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
    var state = mapGet(detachHandlers, root, DetachHandlerState);
    state.handlers.push(throwNotFunction(callback));
}

function afterDetached(element, from, callback) {
    if (isFunction(from)) {
        callback = from;
        from = root;
    }
    if (!mapGet(detachHandlers, from)) {
        initDetachWatcher(from);
    }
    var promise;
    if (!isFunction(callback)) {
        promise = new Promise(function (resolve) {
            callback = resolve;
        });
    }
    var state = mapGet(detachHandlers, from, DetachHandlerState);
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
        dom.ready.then(function () {
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
        dom.ready.then(function () {
            var matched = selectIncludeSelf('[' + options.attributeFilter.join('],[') + ']', element);
            if (matched[0]) {
                callback(matched);
            }
        });
    }
}

function initDetachWatcher(element) {
    observe(element, function (records) {
        var state = mapGet(detachHandlers, element);
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
}

initDetachWatcher(root);

export {
    observe,
    registerCleanup,
    afterDetached,
    watchElements,
    watchAttributes
};
