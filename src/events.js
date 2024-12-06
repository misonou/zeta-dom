import $ from "./include/jquery.js";
import { root, reportError } from "./env.js";
import { arrRemove, createPrivateStore, deferrable, defineHiddenProperty, definePrototype, each, executeOnce, extend, grep, is, isFunction, isPlainObject, isUndefinedOrNull, kv, map, mapGet, mapRemove, noop, reject, resolve, setAdd, setImmediateOnce, single, splice, throwNotFunction } from "./util.js";
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
    var self = this;
    self.path = dom.eventSourcePath;
    self.source = dom.eventSource;
    self.sourceKeyName = self.source === 'keyboard' ? dom.pressedKey : null;
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
    var result = options.deferrable ? deferrable() : undefined;
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
        result: result,
        current: [],
    });
    if (result) {
        self.handleable = false;
        properties.waitFor = result.waitFor;
    }
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
            return component && emitterCallHandlers(self, container, component, emitting.eventName, eventName, emitting.data);
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

function emitterCallHandlers(emitter, container, component, eventName, handlerName, data) {
    var shouldForward = eventName === emitter.eventName;
    var forwardEvent = function (entries) {
        return single(entries, function (v) {
            return emitterCallHandlers(emitter, container, component, v.eventName || v, handlerName, v.data);
        });
    };
    if (!handlerName && shouldForward && forwardEvent(emitter.preAlias)) {
        return true;
    }
    var handlers = component.handlers[handlerName || eventName];
    var handled;
    if (handlers && handlers.count) {
        emitter.current.unshift({ eventName, data });
        handled = single(handlers, function (v) {
            var event = new ZetaEvent(emitter, eventName, component, v.context, data);
            var contextContainer = is(v.context, ZetaEventContainer) || container;
            var prevEvent = contextContainer.event;
            container.initEvent(event);
            contextContainer.event = event;
            try {
                var returnValue = v.callback.call(event.context, event, event.context);
                if (returnValue !== undefined) {
                    event.handled(returnValue);
                }
            } catch (e) {
                if (emitter.asyncResult) {
                    emitterHandleResult(emitter, e, reject);
                }
                reportError(e);
            }
            contextContainer.event = prevEvent;
            return emitter.handled;
        });
        emitter.current.shift();
    }
    return handled || (!emitter.current[0] && shouldForward && forwardEvent(emitter.postAlias));
}

function emitterHandleResult(emitter, value, reject) {
    if (emitter.handleable && !emitter.handled) {
        emitter.handled = true;
        emitter.result = emitter.asyncResult ? (reject || resolve)(value) : value;
        if (emitter.originalEvent && emitter.preventNative) {
            emitter.originalEvent.preventDefault();
        }
    }
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
        emitterHandleResult(_(this), value);
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
        components: options.willDestroy || options.autoDestroy ? new Map() : new WeakMap()
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
        return map(state && state.handlers, function (v) {
            return map(v, function (v) {
                return v.context !== element && setAdd(visited, v.context) ? v.context : null;
            });
        });
    },
    add: function (target, event, handler) {
        var self = this;
        var state = _(self);
        if (state.destroyed) {
            return noop;
        }
        var element = is(target.element, Node);
        if (element && self.captureDOMEvents) {
            containers.set(element, self);
        }
        return containerCreateDispose(
            containerRegisterHandler(state, target, target, event, handler),
            element && containerRegisterHandler(state, element, target, event, handler));
    },
    delete: function (target) {
        var self = this;
        var cur = mapRemove(_(self).components, target);
        if (self.captureDOMEvents) {
            removeContainerForElement(target, self);
        }
        each(cur && cur.refs, function (i, v) {
            v.dispose = noop;
        });
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
        var self = this;
        var state = _(self);
        domEventTrap.delete(this);
        each(state.components, function (i) {
            self.delete(i);
        });
        state.destroyed = true;
        state.components = new WeakMap();
    }
});

function containerCreateDispose(ref, ref2) {
    return executeOnce(function () {
        ref.dispose();
        if (ref2) {
            ref2.dispose();
        }
    });
}

function ContainerComponent(target) {
    var self = this;
    self.target = target.element || target;
    self.refs = new Set();
    self.index = 0;
    self.handlers = {};
}

function containerRegisterHandler(state, target, context, event, handler) {
    var cur = mapGet(state.components, target, ContainerComponent, true);
    var key = cur.index++;
    var handlers = cur.handlers;
    var dispose = function () {
        cur.refs.delete(controller);
        each(handlers, function (i, v) {
            if (v[key]) {
                v.count -= delete v[key];
            }
        });
    };
    each(isPlainObject(event) || kv(event, handler), function (i, v) {
        var dict = handlers[i] || (handlers[i] = {});
        if (dict.count === undefined) {
            defineHiddenProperty(dict, 'count', 0);
        }
        dict[key] = {
            context: context,
            callback: throwNotFunction(v)
        };
        dict.count++;
    });
    var controller = { dispose };
    cur.refs.add(controller);
    return controller;
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
