import $ from "./include/jquery.js";
import { root } from "./env.js";
import { arrRemove, createPrivateStore, definePrototype, each, executeOnce, extend, grep, is, isFunction, isPlainObject, isUndefinedOrNull, keys, kv, mapGet, mapRemove, noop, randomId, reject, resolve, setAdd, setImmediateOnce, single, splice, throwNotFunction } from "./util.js";
import { containsOrEquals, parentsAndSelf } from "./domUtil.js";
import { registerCleanup } from "./observe.js";
import dom, { iterateFocusPath } from "./dom.js";

const _ = createPrivateStore();
const containers = new WeakMap();
const domEventTrap = new ZetaEventContainer();
const domContainer = new ZetaEventContainer();
const asyncEventData = new Map();
const asyncEvents = [];

export var eventSource;
export var lastEventSource;


/* --------------------------------------
 * Helper functions
 * -------------------------------------- */

function ZetaEventSource() {
    this.path = dom.eventSourcePath;
    this.source = dom.eventSource;
    this.sourceKeyName = dom.pressedKey || null;
}

function setLastEventSource() {
}

function prepEventSource(promise) {
    return resolve(promise);
}

function getEventSource() {
    return dom.eventSource;
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
    return single(parentsAndSelf(target), function (v) {
        var container = getContainerForElement(v);
        if (container && setAdd(visited, container)) {
            return emitter.emit(domEventTrap, 'tap', container, false);
        }
    }) || emitter.emit();
}

function wrapSelectorHandler(selector, callback) {
    return function (e) {
        var matched = $(e.target).closest(selector)[0];
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
    if (dict[eventName] && (isFunction(mergeData) || (isUndefinedOrNull(data) && isUndefinedOrNull(dict[eventName].data)))) {
        dict[eventName].data = mergeData && mergeData(dict[eventName].data, data);
    } else {
        dict[eventName] = new ZetaEventEmitter(eventName, container, target, data, normalizeEventOptions(options, { handleable: false }));
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

function ZetaEventEmitter(eventName, container, target, data, options) {
    target = target || container.element;
    var self = this;
    var element = is(target.element, Node) || target;
    var source = options.source || new ZetaEventSource();
    var properties = {
        eventName: eventName,
        target: target,
        source: source.source,
        sourceKeyName: source.sourceKeyName,
        timestamp: performance.now(),
        clientX: options.clientX,
        clientY: options.clientY,
        originalEvent: options.originalEvent || null
    };
    extend(self, options, properties, {
        container: container,
        element: element,
        data: data,
        properties: properties,
        current: [],
    });
}

definePrototype(ZetaEventEmitter, {
    emit: function (container, eventName, target, bubbles) {
        var self = this;
        container = container || self.container;
        target = target || self.target;
        if (isUndefinedOrNull(bubbles)) {
            bubbles = self.bubbles;
        }
        var targets = bubbles ? emitterIterateTargets(self, container, target) : [target];
        var emitting = self.current[0] || self;
        var components = _(container).components;
        single(targets, function (v) {
            var component = components.get(v);
            return component && emitterCallHandlers(self, component, emitting.eventName, eventName, emitting.data);
        });
        return self.result;
    }
});

function emitterIterateTargets(emitter, container, target) {
    if (container !== domContainer || !is(target, Node)) {
        return container.getEventPath(target, emitter.properties);
    }
    var targets = iterateFocusPath(target);
    if (emitter.clientX !== undefined) {
        return grep(targets, function (v) {
            return containsOrEquals(v, target);
        });
    }
    return targets;
}

function emitterCallHandlers(emitter, component, eventName, handlerName, data) {
    var shouldForward = eventName === emitter.eventName;
    var forwardEvent = function (entries) {
        return single(entries, function (v) {
            return emitterCallHandlers(emitter, component, v.eventName || v, handlerName, v.data);
        });
    };
    if (!handlerName && shouldForward && forwardEvent(emitter.preAlias)) {
        return true;
    }
    var sourceContainer = component.container;
    var handlers = component.handlers[handlerName || eventName];
    var handled;
    if (handlers) {
        emitter.current.unshift({ eventName, data });
        handled = single(handlers, function (v, i) {
            var context = component.contexts[i];
            var event = new ZetaEvent(emitter, eventName, component, context, data);
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
    }
    return handled || (!emitter.current[0] && shouldForward && forwardEvent(emitter.postAlias));
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
    handled: function (value) {
        var event = _(this);
        if (event.handleable && !event.handled) {
            event.handled = true;
            event.result = event.asyncResult ? resolve(value) : value;
            if (event.preventNative) {
                this.preventDefault();
            }
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
        registerCleanup(element, function () {
            self.destroy();
        });
    }
}

definePrototype(ZetaEventContainer, {
    event: null,
    tap: function (handler) {
        return domEventTrap.add(this, 'tap', handler);
    },
    getEventPath: function (element, props) {
        return parentsAndSelf(element);
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
        return executeOnce(function () {
            containerRemoveHandler(self, target, key);
            if (element) {
                containerRemoveHandler(self, element, key);
            }
        });
    },
    delete: function (target) {
        var self = this;
        if (mapRemove(_(self).components, target) && self.captureDOMEvents) {
            removeContainerForElement(target, self);
        }
    },
    emit: function (eventName, target, data, bubbles) {
        var self = this;
        var options = normalizeEventOptions(bubbles);
        var emitter = is(_(eventName), ZetaEventEmitter) || new ZetaEventEmitter(eventName, self, target, isUndefinedOrNull(data) ? removeAsyncEvent(eventName, self, target) : data, options);
        return emitter.emit(self, null, target, options.bubbles);
    },
    emitAsync: function (eventName, target, data, bubbles, mergeData) {
        registerAsyncEvent(eventName, this, target, data, bubbles, mergeData);
    },
    flushEvents: function () {
        emitAsyncEvents(this);
    },
    destroy: function () {
        domEventTrap.delete(this);
        _(this).destroyed = true;
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
