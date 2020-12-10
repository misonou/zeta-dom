import { window, root } from "./env.js";
import { createPrivateStore, definePrototype, each, extend, isFunction, isPlainObject, keys, kv, mapGet, mapRemove, matchWord, randomId, reject, resolve, setImmediateOnce, single, splice, throwNotFunction } from "./util.js";
import { containsOrEquals, is, parentsAndSelf } from "./domUtil.js";
import { afterDetached } from "./observe.js";
import dom, { textInputAllowed } from "./dom.js";

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

function ZetaEventSource(target, path) {
    var self = this;
    path = path || (eventSource ? eventSource.path : dom.focusedElements);
    self.path = path;
    self.source = 'script';
    if (containsOrEquals(path[0] || root, target) || path.indexOf(target) >= 0) {
        self.source = eventSource ? eventSource.source : getEventSourceName();
    }
    self.sourceKeyName = self.source !== 'keyboard' ? null : (eventSource || lastEventSource || '').sourceKeyName;
}

function setLastEventSource(source) {
    lastEventSource = new ZetaEventSource(source);
}

function prepEventSource(promise) {
    var source = eventSource || new ZetaEventSource(dom.activeElement);
    var wrap = function (callback) {
        return function () {
            var prev = eventSource;
            try {
                eventSource = source;
                return callback.apply(this, arguments);
            } finally {
                eventSource = prev;
            }
        };
    };
    return {
        then: function (a, b) {
            return promise.then(a && wrap(a), b && wrap(b));
        },
        catch: function (a) {
            return promise.catch(a && wrap(a));
        }
    };
}

function getEventSource(element) {
    return element ? new ZetaEventSource(element).source : getEventSourceName();
}

function getEventSourceName() {
    var event = dom.event || window.event;
    var type = (event && event.type) || '';
    return type[0] === 'k' || type.substr(0, 3) === 'com' ? 'keyboard' : type[0] === 't' ? 'touch' : type[0] === 'm' || matchWord(type, 'wheel click dblclick contextmenu') ? 'mouse' : matchWord(type, 'drop cut copy paste') || 'script';
}

function getEventContext(element) {
    for (var cur = element; cur && !containers.has(cur); cur = cur.parentNode);
    var container = mapGet(containers, cur) || domContainer;
    return _(container).options;
}

function normalizeEventOptions(options) {
    if (typeof options === 'boolean') {
        options = { bubbles: options };
    }
    return extend({
        handleable: true,
        asyncResult: true
    }, options);
}

function emitDOMEvent(eventName, target, data, options) {
    var emitter = new ZetaEventEmitter(eventName, domContainer, target, data, normalizeEventOptions(options));
    return emitter.emit(domEventTrap, 'tap', target, true) || emitter.emit();
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
    if (dict[eventName] && (isFunction(mergeData) || (data === undefined && dict[eventName].data === undefined))) {
        dict[eventName].data = mergeData && mergeData(dict[eventName].data, data);
    } else {
        dict[eventName] = new ZetaEventEmitter(eventName, container, target, data, normalizeEventOptions(options));
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

function ZetaEventEmitter(eventName, container, target, data, options) {
    target = target || container.element;
    var source = options.source || new ZetaEventSource(target);
    var properties = {
        source: source.source,
        sourceKeyName: source.sourceKeyName,
        timestamp: performance.now(),
        originalEvent: options.originalEvent || null
    };
    extend(this, options, properties, {
        container: container,
        eventName: eventName,
        target: target,
        data: data,
        bubbles: !!options.bubbles,
        properties: properties,
        sourceObj: source
    });
}

definePrototype(ZetaEventEmitter, {
    emit: function (container, eventName, target, bubbles) {
        var self = this;
        container = container || self.container;
        if (bubbles === undefined) {
            bubbles = self.bubbles;
        }
        var components = _(container).components;
        // @ts-ignore: type inference issue
        var targets = !bubbles ? [target || self.target] : self.originalEvent && target === undefined ? self.sourceObj.path : parentsAndSelf(target || self.target);
        single(targets, function (v) {
            var component = components.get(v);
            return component && emitterCallHandlers(self, component, self.eventName, eventName, self.data);
        });
        return self.result;
    }
});

function emitterCallHandlers(emitter, component, eventName, handlerName, data) {
    handlerName = handlerName || eventName;
    if (matchWord(handlerName, 'keystroke gesture') && emitterCallHandlers(emitter, component, data.data)) {
        return true;
    }
    if (data === undefined) {
        data = removeAsyncEvent(eventName, component.container, context);
    }
    var handlers = component.handlers[handlerName];
    var handled;
    if (handlers) {
        var context = component.context;
        var contextContainer = is(context, ZetaEventContainer) || component.container;
        var event = new ZetaEvent(emitter, eventName, component, data);
        var prevEventSource = eventSource;
        var prevEvent = contextContainer.event;
        contextContainer.event = event;
        eventSource = emitter.sourceObj;
        handled = single(handlers, function (v) {
            try {
                var returnValue = v.call(context, event, context);
                if (returnValue !== undefined) {
                    event.handled(returnValue);
                }
            } catch (e) {
                console.error(e);
                if (emitter.asyncResult) {
                    event.handled(reject(e));
                }
            }
            return emitter.handled;
        });
        eventSource = prevEventSource;
        contextContainer.event = prevEvent;
    }
    if (!handled && handlerName === 'keystroke' && data.char && textInputAllowed(emitter.target)) {
        return emitterCallHandlers(emitter, component, 'textInput', null, data.char);
    }
    return handled;
}

/* --------------------------------------
 * ZetaEvent
 * -------------------------------------- */

function ZetaEvent(event, eventName, component, data) {
    var self = extend(this, event.properties);
    self.eventName = eventName;
    self.type = eventName;
    self.context = component.context;
    self.currentTarget = component.element;
    self.target = containsOrEquals(event.target, component.element) ? component.element : event.target;
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
        autoDestroy: containsOrEquals(root, element),
        normalizeTouchEvents: false,
        captureDOMEvents: false
    }, options);
    _(self, {
        options: options,
        components: new Map()
    });
    extend(self, options);
    if (element && self.captureDOMEvents) {
        domEventTrap.setContext(element, self);
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
        domEventTrap.add(this.element, 'tap', handler);
    },
    getContext: function (element) {
        var components = _(this).components;
        var component;
        for (var cur = element; cur && !component; cur = cur.parentNode) {
            component = components.get(cur);
        }
        return component && component.context;
    },
    setContext: function (element, context) {
        containerCreateContext(this, element, context);
    },
    add: function (target, event, handler) {
        var self = this;
        var key = randomId();
        var handlers = containerCreateContext(self, target).handlers;
        each(isPlainObject(event) || kv(event, handler), function (i, v) {
            var dict = handlers[i] || (handlers[i] = {});
            dict[key] = throwNotFunction(v);
        });
        return function () {
            each(handlers, function (i, v) {
                delete v[key];
                if (!keys(v)[0]) {
                    delete handlers[i];
                }
            });
            if (!keys(handlers)[0]) {
                self.delete(target);
            }
        };
    },
    delete: function (target) {
        var self = this;
        var component = mapRemove(_(self).components, target);
        if (component && self.captureDOMEvents) {
            containers.delete(component.element);
        }
    },
    emit: function (eventName, target, data, bubbles) {
        var options = normalizeEventOptions(bubbles);
        var emitter = is(eventName, ZetaEvent) ? _(eventName) : new ZetaEventEmitter(eventName, this, target, data, options);
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
        if (self.captureDOMEvents) {
            domEventTrap.delete(self.element);
            containers.delete(self.element);
            each(_(self).components, function (i) {
                containers.delete(i);
            });
        }
    }
});

function containerCreateContext(container, element, context) {
    var cur = mapGet(_(container).components, element, function () {
        return {
            container: container,
            element: element,
            context: context || element,
            handlers: {}
        };
    });
    if (context && (cur.context || context) !== context) {
        throw new Error('Element has already been set to another context');
    }
    if (container.captureDOMEvents && is(element, Element)) {
        containers.set(element, container);
    }
    return cur;
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
