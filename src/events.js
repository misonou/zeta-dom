import { createPrivateStore, definePrototype, each, extend, isFunction, isPlainObject, kv, mapGet, matchWord, randomId, reject, resolve, single } from "./util.js";
import { containsOrEquals, is, parentsAndSelf } from "./domUtil.js";
import { observe } from "./observe.js";
import dom from "./dom.js";

const root = document.documentElement;
const containers = new WeakMap();
const domEventTrap = new ZetaContainer();
const domContainer = new ZetaContainer();
const _ = createPrivateStore();

export var eventSource;
export var lastEventSource;


/* --------------------------------------
 * Helper functions
 * -------------------------------------- */

/** @type {Zeta.ZetaComponentConstructor} */
function ZetaComponent() {
    this.states = {};
}

function ZetaEventHandlerState(element, context, handlers) {
    var self = this;
    var copy = {};
    each(handlers, function (i, v) {
        if (isFunction(v)) {
            copy[i] = v;
        }
    });
    self.element = element;
    self.context = context;
    self.handlers = copy;
}

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

function getContainer(element, exact) {
    if (exact) {
        return mapGet(containers, element);
    }
    for (var cur = element; cur && !containers.has(cur); cur = cur.parentNode);
    return mapGet(containers, cur) || domContainer;
}

function emitEvent(eventName, container, target, data, bubbles) {
    var event = is(eventName, ZetaEvent) ? _(eventName) : new ZetaEventEmitter(eventName, container, target, data, null, bubbles);
    return event.emit(container, null, target, bubbles);
}

function emitDOMEvent(eventName, nativeEvent, target, data, bubbles, source) {
    var event = new ZetaEventEmitter(eventName, domContainer, target, data, nativeEvent, bubbles, source);
    return event.emit(domEventTrap, 'tap', getContainer(target).element, false) || event.emit();
}

function listenDOMEvent(element, event, handler) {
    if (!is(element, Node)) {
        handler = event;
        event = element;
        element = root;
    }
    domContainer.setContext(element, element);
    domContainer.add(element, isPlainObject(event) || kv(event, handler));
}


/* --------------------------------------
 * ZetaEventEmitter
 * -------------------------------------- */

function ZetaEventEmitter(eventName, container, target, data, originalEvent, bubbles, source) {
    target = target || container.element;
    source = source || new ZetaEventSource(target);
    var properties = {
        source: source.source,
        sourceKeyName: source.sourceKeyName,
        timestamp: performance.now(),
        originalEvent: originalEvent || null
    };
    extend(this, {
        container: container,
        eventName: eventName,
        target: target,
        data: data,
        bubbles: bubbles,
        properties: properties,
        sourceObj: source
    }, properties);
}

definePrototype(ZetaEventEmitter, {
    emit: function (container, eventName, target, bubbles) {
        var self = this;
        container = container || self.container;
        bubbles = bubbles === undefined ? self.bubbles : bubbles;

        var callHandler = function (state, handlerName, eventName, data) {
            if (handlerName === 'init' || handlerName === 'destroy') {
                // prevent init and destroy event from called consecutively twice
                if (state.lastEvent === handlerName) {
                    return false;
                }
                state.lastEvent = handlerName;
            }
            if (matchWord(handlerName || eventName, 'keystroke gesture') && callHandler(state, null, data.data, null)) {
                return self.handled;
            }
            var handler = state.handlers[handlerName || eventName];
            if (!handler) {
                return false;
            }
            var contextContainer = is(state.context, ZetaContainer) || container;
            var event = new ZetaEvent(self, eventName, state, data === undefined ? containerRemoveAsyncEvent(container, eventName, state) : data);
            var prevEventSource = eventSource;
            var prevEvent = contextContainer.event;
            contextContainer.event = event;
            eventSource = self.sourceObj;
            try {
                var returnValue = handler.call(event.context, event, event.context);
                if (returnValue !== undefined) {
                    // @ts-ignore: type inference issue
                    self.handled = resolve(returnValue);
                }
            } catch (e) {
                console.error(e);
                // @ts-ignore: type inference issue
                self.handled = reject(e);
            }
            eventSource = prevEventSource;
            contextContainer.event = prevEvent;
            return self.handled;
        };
        if (is(target, ZetaEventHandlerState)) {
            return callHandler(target, eventName, self.eventName, self.data);
        }
        // find the nearest ancestor that has widget or context set
        var context = container.getContext(target || self.target);
        return !!context && single(bubbles ? parentsAndSelf(context) : [context], function (v) {
            var component = container.components.get(v.element || v);
            return component && single(component.states, function (v) {
                return callHandler(v, eventName, self.eventName, self.data);
            });
        });
    }
});


/* --------------------------------------
 * ZetaEvent
 * -------------------------------------- */

function ZetaEvent(event, eventName, state, data) {
    var self = extend(this, event.properties);
    self.eventName = eventName;
    self.type = eventName;
    self.context = state.context;
    self.target = containsOrEquals(event.target, state.element) ? state.element : event.target;
    self.data = null;
    if (isPlainObject(data)) {
        extend(self, data);
    } else if (data !== undefined) {
        self.data = data;
    }
    _(self, event);
}

definePrototype(ZetaEvent, {
    handled: function (promise) {
        var event = _(this);
        if (!event.handled) {
            event.handled = resolve(promise);
        }
    },
    isHandled: function () {
        return !!_(this).handled;
    },
    preventDefault: function () {
        var event = this.originalEvent;
        if (event) {
            event.preventDefault();
        } else {
            _(this).defaultPrevented = true;
        }
    },
    isDefaultPrevented: function () {
        return !!(this.originalEvent || _(this)).defaultPrevented;
    }
});


/* --------------------------------------
 * ZetaContainer
 * -------------------------------------- */

function ZetaContainer(element, context, options) {
    var self = this;
    if (element) {
        containers.set(element, self);
    }
    extend(self, {
        element: element || root,
        context: context || null,
        components: new Map(),
        asyncEvents: new Map(),
        autoDestroy: containsOrEquals(root, element),
        normalizeTouchEvents: false
    }, options);
}

definePrototype(ZetaContainer, {
    event: null,
    tap: function (handler) {
        domEventTrap.setContext(this.element, this);
        domEventTrap.add(this.element, {
            tap: handler
        });
    },
    getContext: function (element) {
        return (containerGetContext(this, element) || '').context;
    },
    setContext: function (element, context) {
        containerSetContext(this, element, context);
        if (this !== domEventTrap && is(element, Node)) {
            containers.set(element, this);
        }
    },
    add: function (element, key, handlers) {
        if (typeof key !== 'string') {
            handlers = key;
            key = randomId();
        }
        var self = this;
        var target = is(element, Node) || element.element || element;
        var component = is(target, Node) ? containerGetContext(self, target) : containerSetContext(self, element, element);
        if (component) {
            var state = component.states[key] || new ZetaEventHandlerState(target, is(element, Node) ? component.context : element, handlers);
            component.attached = true;
            component.states[key] = state;
            containerRegisterWidgetEvent(self, state, true);
        }
    },
    delete: function (element, key) {
        var self = this;
        var component = mapGet(self.components, element);
        if (component) {
            if (key) {
                var state = component.states[key];
                if (state) {
                    delete component.states[key];
                    containerRegisterWidgetEvent(self, state, false);
                }
            } else {
                component.attached = false;
                each(component.states, function (i, v) {
                    containerRegisterWidgetEvent(self, v, false);
                });
            }
        }
    },
    observe: function (callback, options) {
        return containerCreateObserver(this, callback, options);
    },
    emit: function (eventName, target, data, bubbles) {
        return emitEvent(eventName, this, data, target, bubbles);
    },
    emitAsync: function (event, target, data, bubbles, mergeData) {
        containerRegisterAsyncEvent(this, event, target || this.element, data, bubbles, mergeData);
    },
    flushEvents: function () {
        containerEmitAsyncEvents(this);
    },
    destroy: function () {
        var self = this;
        domEventTrap.delete(self.element);
        containers.delete(self.element);
        each(self.components, function (i, v) {
            containers.delete(i);
            self.emit('destroy', i);
        });
    }
});


function containerEmitAsyncEvents(inst) {
    inst.timeout = null;
    while (inst.asyncEvents.size) {
        var map = inst.asyncEvents;
        inst.asyncEvents = new Map();
        each(map, function (i, v) {
            each(v, function (j, v) {
                if (!isPlainObject(i) || i.handlers[j]) {
                    v.emit(null, null, i);
                }
            });
        });
        each(map, function (i, v) {
            var obj = mapGet(inst.components, i.element || i);
            if (obj && !obj.attached) {
                inst.components.delete(i.element || i);
            }
        });
    }
}

function containerRemoveAsyncEvent(inst, eventName, target) {
    var obj = mapGet(inst.asyncEvents, target);
    if (obj && obj[eventName]) {
        var data = obj[eventName].data;
        delete obj[eventName];
        return data || {
            data: data
        };
    }
}

function containerRegisterAsyncEvent(inst, eventName, target, data, bubbles, mergeData) {
    var obj = mapGet(inst.asyncEvents, target, Object);
    obj[eventName] = new ZetaEventEmitter(eventName, inst, target.element || target, mergeData && obj[eventName] ? mergeData(obj[eventName].data, data) : data, null, bubbles);
    inst.timeout = inst.timeout || setTimeout(containerEmitAsyncEvents, 0, inst);
}

function containerRegisterWidgetEvent(container, state, isInit) {
    var event = ['destroy', 'init'];
    if (state.attached ^ isInit && !containerRemoveAsyncEvent(container, event[+!isInit], state)) {
        containerRegisterAsyncEvent(container, event[+isInit], state);
    }
    state.attached = isInit;
}

function containerValidTarget(container, element) {
    return container === domEventTrap || (containers.get(element) || container) === container;
}

function containerCreateObserver(container, callback, options) {
    return observe(container, function (mutations) {
        var changes = [];
        var orphans = new Map();
        each(mutations, function (i, v) {
            if (!containsOrEquals(container.element, v.target)) {
                mapGet(orphans, v.target, Array).push(v);
            } else if (containerValidTarget(container, v.target)) {
                each(v.removedNodes, function (i, v) {
                    if (orphans.has(v)) {
                        changes.push.apply(changes, orphans.get(v));
                    }
                });
                changes.push(v);
            }
        });
        changes = changes.filter(function (v) {
            return options[v.type];
        });
        if (changes[0]) {
            callback(changes);
        }
    });
}

function containerGetContext(inst, element) {
    var component;
    for (var cur = element; cur && !component; cur = cur.parentNode) {
        component = inst.components.get(cur);
    }
    return component || null;
}

function containerSetContext(inst, element, context) {
    var cur = mapGet(inst.components, element, ZetaComponent);
    // @ts-ignore: undeclared property added to ZetaComponent
    if ((cur.context || context) !== context) {
        throw new Error('Element has already been set to another context');
    }
    // @ts-ignore: undeclared property added to ZetaComponent
    cur.element = element;
    // @ts-ignore: undeclared property added to ZetaComponent
    cur.context = context;
    return cur;
}

export {
    ZetaEventSource,
    emitEvent,
    emitDOMEvent,
    listenDOMEvent,
    getContainer,
    getEventSource,
    prepEventSource,
    setLastEventSource
};
