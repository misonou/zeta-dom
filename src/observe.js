import { Map, Set, WeakMap } from "./shim.js";
import { any, each, keys, makeArray, map, mapGet, setImmediate, setImmediateOnce, throwNotFunction } from "./util.js";
import { bind, containsOrEquals, selectIncludeSelf } from "./domUtil.js";

const observedElements = new WeakMap();

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

function WatchAttributeState() {
    this.oldValues = {};
    this.newValues = {};
}

function setValues(dict, key, oldValue, newValue) {
    if (!(key in dict.oldValues)) {
        dict.oldValues[key] = oldValue;
    }
    dict.newValues[key] = newValue;
}

function createObserverState(element) {
    var handlers = [];
    var processRecords = function (records, callback) {
        records = records.filter(function (v) {
            // filter out changes due to sizzle engine
            // to prevent excessive invocation due to querying elements through jQuery
            return v.attributeName !== 'id' || ((v.oldValue || '').slice(0, 6) !== 'sizzle' && (v.target.id !== (v.oldValue || '')));
        });
        if (records[0]) {
            handlers.forEach(function (v) {
                if (v === callback) {
                    v(records.slice(0));
                } else {
                    setImmediate(v, records.slice(0));
                }
            });
        }
    };
    var observer = new MutationObserver(processRecords);
    observer.observe(element, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeOldValue: true
    });
    return {
        handlers: handlers,
        checkChanges: function (callback) {
            processRecords(observer.takeRecords(), callback);
        }
    };
}

function observe(element, callback) {
    var state = mapGet(observedElements, element, function () {
        return createObserverState(element);
    });
    state.handlers.push(callback);
    return state.checkChanges.bind(null, callback);
}

function watchElements(element, selector, callback) {
    var collection = new Set(selectIncludeSelf(selector, element));
    observe(element, function () {
        var matched = selectIncludeSelf(selector, element);
        var removedNodes = map(collection, function (v) {
            return matched.indexOf(v) < 0 ? v : null;
        });
        var addedNodes = matched.filter(function (v) {
            return !collection.has(v);
        });
        if (addedNodes[0] || removedNodes[0]) {
            addedNodes.forEach(collection.add.bind(collection));
            removedNodes.forEach(collection.delete.bind(collection));
            callback(addedNodes, removedNodes);
        }
    });
}

function watchAttributes(element, attributes, callback) {
    var handleResult = function (map) {
        each(map, function (i, v) {
            var oldValues = v.oldValues;
            var newValues = v.newValues;
            each(oldValues, function (i, w) {
                if (newValues[i] === w) {
                    delete oldValues[i];
                    delete newValues[i];
                }
            });
            if (!keys(oldValues)) {
                map.delete(i);
            }
        });
        if (map.size) {
            callback(map);
        }
    };
    attributes = makeArray(attributes);
    observe(element, function (records) {
        var map = new Map();
        each(records, function (i, v) {
            var attr = v.attributeName;
            if (attributes.indexOf(attr) >= 0) {
                var dict = mapGet(map, v.target, WatchAttributeState);
                setValues(dict, attr, v.oldValue, v.target.getAttribute(attr));
            }
        });
        handleResult(map);
    });
    watchElements(element, '[' + attributes.join('],[') + ']', function (addedNodes, removedNodes) {
        var map = new Map();
        var processElements = function (map, arr, pos) {
            each(arr, function (i, v) {
                var dict = mapGet(map, v, WatchAttributeState);
                each(attributes, function (i, w) {
                    var value = v.getAttribute(w);
                    if (value !== null) {
                        var args = [dict, w, null, null];
                        args[pos] = value;
                        // @ts-ignore: argument count always matches
                        setValues.apply(null, args);
                    }
                });
            });
        };
        processElements(map, addedNodes, 3);
        processElements(map, removedNodes, 2);
        handleResult(map);
    });
}

export {
    observe,
    watchElements,
    watchAttributes
};
