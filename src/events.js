import Promise from "./include/promise-polyfill.js";
import { window, root } from "./env.js";
import { createPrivateStore, definePrototype, each, extend, grep, is, isFunction, isPlainObject, isUndefinedOrNull, keys, kv, map, mapGet, mapRemove, matchWord, noop, randomId, reject, setAdd, setImmediateOnce, single, splice, throwNotFunction } from "./util.js";
import { containsOrEquals, parentsAndSelf } from "./domUtil.js";
import { afterDetached } from "./observe.js";
import dom, { textInputAllowed, getShortcut } from "./dom.js";

const _ = createPrivateStore();
const containers = new WeakMap();
const domEventTrap = new ZetaEventContainer();
const domContainer = new ZetaEventContainer();
const asyncEventData = new Map();
const asyncEvents = [];
const then = Promise.prototype.then;

export var eventSource;
export var lastEventSource;


/* --------------------------------------
 * Custom promise
 * -------------------------------------- */

function CustomPromise(executor) {
    var promise = new Promise(executor);
    Object.setPrototypeOf(promise, CustomPromise.prototype);
    _(promise, eventSource || new ZetaEventSource(dom.activeElement));
    return promise;
}

function wrapPromiseCallback(promise, callback) {
    throwNotFunction(callback);
    return function () {
        var prev = eventSource;
        try {
            eventSource = _(promise);
            return callback.apply(this, arguments);
        } finally {
            eventSource = prev;
        }
    };
}

definePrototype(CustomPromise, Promise, {
    then: function (onFulfilled, onRejected) {
        var self = this;
        var promise = then.call(self, onFulfilled && wrapPromiseCallback(self, onFulfilled), onRejected && wrapPromiseCallback(self, onRejected));
        _(promise, _(self));
        return promise;
    }
});


/* --------------------------------------
 * Helper functions
 * -------------------------------------- */

function ZetaEventSource(target, path) {
    var self = this;
    path = path || (eventSource ? eventSource.path : dom.focusedElements);
    target = (target || '').element || target;
    self.path = path;
    self.source = !target || containsOrEquals(path[0] || root, target) || path.indexOf(target) >= 0 ? getEventSourceName() : 'script';
    self.sourceKeyName = self.source !== 'keyboard' ? null : (eventSource || lastEventSource || '').sourceKeyName;
}

function setLastEventSource(source) {
    lastEventSource = new ZetaEventSource(source);
}

function prepEventSource(promise) {
    // @ts-ignore: CustomPromise is subclass of Promise
    return is(promise, CustomPromise) || CustomPromise.resolve(promise);
}

function getEventSource(element) {
    return element ? new ZetaEventSource(element).source : getEventSourceName();
}

function getEventSourceName() {
    if (eventSource) {
        return eventSource.source;
    }
    var event = dom.event || window.event;
    var type = (event && event.type) || '';
    if (/^(touch|mouse)./.test(type)) {
        return RegExp.$1;
    }
    if (/^(key|composition)./.test(type) || matchWord(type, 'beforeinput textInput')) {
        return 'keyboard';
    }
    if (matchWord(type, 'wheel click dblclick contextmenu')) {
        return 'mouse'
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
        options = { bubbles: options };
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
    return single(emitter.elements, function (v) {
        var container = getContainerForElement(v);
        if (container && setAdd(visited, container)) {
            return emitter.emit(domEventTrap, 'tap', container, false);
        }
    }) || emitter.emit();
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
    if (dict[eventName] && (isFunction(mergeData) || (isUndefinedOrNull(data) && isUndefinedOrNull(dict[eventName].data)))) {
        dict[eventName].data = mergeData && mergeData(dict[eventName].data, data);
    } else {
        dict[eventName] = new ZetaEventEmitter(eventName, container, target, data, normalizeEventOptions(options, { handleable: false }), true);
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
        return event.data || { data: event.data };
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
    var source = options.source || new ZetaEventSource(target);
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
        target: target.element || target,
        source: source,
        data: data,
        properties: properties,
        current: [],
    });
    var elements = emitterGetElements(self, target);
    var targets = containerGetComponents(container, elements, options.bubbles);
    if (async) {
        targets = map(targets, function (v) {
            return {
                container: v.container,
                target: v.target,
                contexts: extend({}, v.contexts),
                handlers: kv(eventName, extend({}, v.handlers[eventName]))
            };
        });
    }
    self.elements = elements;
    self.targets = targets;
}

definePrototype(ZetaEventEmitter, {
    emit: function (container, eventName, target, bubbles) {
        var self = this;
        var targets = self.targets;
        if ((container && container !== self.container) || (target && target !== self.target)) {
            var elements = parentsAndSelf(target || self.target);
            // @ts-ignore: type inference issue
            targets = containerGetComponents(container || self.container, elements, isUndefinedOrNull(bubbles) ? self.bubbles : bubbles);
        }
        var emitting = self.current[0] || self;
        single(targets, function (v) {
            return emitterCallHandlers(self, v, emitting.eventName, eventName, emitting.data);
        });
        return self.result;
    }
});

function emitterGetElements(emitter, target) {
    var focusedElements = emitter.source.path;
    var index = focusedElements.indexOf(target);
    if (index < 0) {
        return parentsAndSelf(target);
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

function emitterCallHandlers(emitter, component, eventName, handlerName, data) {
    if (!handlerName && matchWord(eventName, 'keystroke gesture') && emitterCallHandlers(emitter, component, data.data, handlerName)) {
        return true;
    }
    var sourceContainer = component.container;
    var prevEventSource = eventSource;
    var handlers = component.handlers[handlerName || eventName];
    var handled;
    if (handlers) {
        eventSource = emitter.source;
        emitter.current.unshift({ eventName, data });
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
        if (data.char && textInputAllowed(emitter.target)) {
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
    self.target = event.target;
    self.data = null;
    if (isPlainObject(data)) {
        extend(self, data);
    } else if (data !== undefined) {
        self.data = data;
    }
    _(self, event);
}

definePrototype(ZetaEvent, {
    handled: function (value) {
        var event = _(this);
        if (event.handleable && !event.handled) {
            event.handled = true;
            event.result = event.asyncResult ? prepEventSource(value) : value;
        }
    },
    isHandled: function () {
        return !!_(this).handled;
    },
    preventDefault: function () {
        var event = this.originalEvent;
        if (event) {
            event.preventDefault();
        }
    },
    isDefaultPrevented: function () {
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
        afterDetached(element, function () {
            self.destroy();
        });
    }
}

definePrototype(ZetaEventContainer, {
    event: null,
    tap: function (handler) {
        domEventTrap.add(this, 'tap', handler);
    },
    getContexts: function (element) {
        var state = _(this).components.get(element);
        var visited = new Set();
        return grep(state && state.contexts, function (v) {
            return v !== element && setAdd(visited, v);
        });
    },
    add: function (target, event, handler) {
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
        return function () {
            containerRemoveHandler(self, target, key);
            if (element) {
                containerRemoveHandler(self, element, key);
            }
        };
    },
    delete: function (target) {
        var self = this;
        if (mapRemove(_(self).components, target) && self.captureDOMEvents) {
            removeContainerForElement(target, self);
        }
    },
    emit: function (eventName, target, data, bubbles) {
        var options = normalizeEventOptions(bubbles);
        var emitter = is(_(eventName), ZetaEventEmitter) || new ZetaEventEmitter(eventName, this, target, data, options);
        // @ts-ignore: type inference issue
        return emitter.emit(this, null, target, options.bubbles);
    },
    emitAsync: function (eventName, target, data, bubbles, mergeData) {
        registerAsyncEvent(eventName, this, target, data, bubbles, mergeData);
    },
    flushEvents: function () {
        emitAsyncEvents(this);
    },
    destroy: function () {
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

function containerGetComponents(container, elements, bubbles) {
    var components = _(container).components;
    return map(bubbles ? elements : elements.slice(0, 1), function (v) {
        return components.get(v);
    });
}

export {
    ZetaEventContainer,
    ZetaEventSource,
    emitDOMEvent,
    listenDOMEvent,
    getEventContext,
    getEventSource,
    prepEventSource,
    setLastEventSource
};
