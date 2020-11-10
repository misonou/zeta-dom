import { Set } from "./shim.js";
import { any, each, extend, isFunction, makeArray, map, mapGet, mapRemove, setImmediateOnce, throwNotFunction } from "./util.js";
import { bind, containsOrEquals, is, selectIncludeSelf } from "./domUtil.js";

const root = document.documentElement;
const detachHandlers = new Map();
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

function elementDetached(element, callback) {
    var handlers = mapGet(detachHandlers, is(element, Element) || root, Array);
    var promise;
    callback = isFunction(element) || isFunction(callback);
    if (!callback) {
        promise = new Promise(function (resolve) {
            callback = resolve;
        });
    }
    handlers.push(callback);
    return promise;
}

function watchElements(element, selector, callback, fireInit) {
    var collection = new Set(selectIncludeSelf(selector, element));
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
            addedNodes.forEach(collection.add.bind(collection));
            removedNodes.forEach(collection.delete.bind(collection));
            callback(addedNodes, removedNodes);
        }
    });
    if (fireInit && collection.size) {
        callback(makeArray(collection), []);
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

observe(root, function (records) {
    var removedNodes = map(records, function (v) {
        return map(v.removedNodes, function (v) {
            return v.nodeType === 1 && !containsOrEquals(root, v) ? v : null;
        });
    });
    if (removedNodes[0]) {
        mapGet(detachHandlers, root, Array).forEach(function (callback) {
            callback(removedNodes.slice(0));
        });
        each(detachHandlers, function (element, handlers) {
            if (!containsOrEquals(root, element) && mapRemove(detachHandlers, element)) {
                handlers.forEach(function (callback) {
                    callback(element);
                });
            }
        });
    }
});

export {
    observe,
    elementDetached,
    watchElements,
    watchAttributes
};
