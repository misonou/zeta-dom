import { Set, Map, WeakMap, Promise } from "./shim.js";
import { any, each, extend, isFunction, makeArray, map, mapGet, mapRemove, setImmediateOnce, throwNotFunction } from "./util.js";
import { bind, containsOrEquals, selectIncludeSelf } from "./domUtil.js";
import dom from "./dom.js";

const root = document.documentElement;
const detachHandlers = new WeakMap();
const optionsForChildList = {
    subtree: true,
    childList: true
};

const MutationObserver = window.MutationObserver || (function () {
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
            var attributeFilter = init.attributeFilter;
            if (attributeFilter) {
                attributeFilter = attributeFilter.map(function (v) {
                    return String(v).toLowerCase();
                });
            }
            bind(element, 'DOMNodeInserted DOMNodeRemoved DOMAttrModified DOMCharacterDataModified', function (e) {
                var type = e.type.charAt(7);
                // @ts-ignore: non-standard member
                var oldValue = e.prevValue;
                var record = {};
                record.addedNodes = [];
                record.removedNodes = [];
                if (type === 'M') {
                    // @ts-ignore: non-standard member
                    if (!attributeFilter || attributeFilter.indexOf(e.attrName.toLowerCase()) >= 0) {
                        record.type = 'attributes';
                        record.target = e.target;
                        // @ts-ignore: non-standard member
                        record.attributeName = e.attrName;
                        if (init.attributeOldValue) {
                            record.oldValue = oldValue;
                        }
                    }
                } else if (type === 'a') {
                    record.type = 'characterData';
                    record.target = e.target;
                    if (init.characterDataOldValue) {
                        record.oldValue = oldValue;
                    }
                } else {
                    record.type = 'childList';
                    // @ts-ignore: e.target is Element
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
                    setImmediateOnce(self.handler);
                }
            });
        },
        takeRecords: function () {
            return this.records.splice(0);
        }
    };
    return MutationObserver;
}());

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
        var removedNodes = map(collection, function (v) {
            return matched.indexOf(v) < 0 ? v : null;
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

function watchAttributes(element, attributes, callback) {
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
}

function initDetachWatcher(element) {
    observe(element, function (records) {
        var state = mapGet(detachHandlers, element);
        var removedNodes = map(records, function (v) {
            return map(v.removedNodes, function (v) {
                return v.nodeType === 1 && !containsOrEquals(element, v) ? v : null;
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
