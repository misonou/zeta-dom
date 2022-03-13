import { IS_MAC, IS_TOUCH, window, document, root, getSelection, getComputedStyle, domReady } from "./env.js";
import { KEYNAMES } from "./constants.js";
import $ from "./include/jquery.js";
import { always, any, combineFn, each, extend, grep, is, isFunction, isPlainObject, keys, lcfirst, makeArray, map, mapRemove, matchWord, noop, reject, setImmediateOnce, single, ucfirst } from "./util.js";
import { bind, bindUntil, containsOrEquals, dispatchDOMMouseEvent, elementFromPoint, getRect, getScrollParent, isVisible, makeSelection, matchSelector, parentsAndSelf, scrollIntoView, toPlainRect } from "./domUtil.js";
import { ZetaEventSource, lastEventSource, getEventContext, setLastEventSource, getEventSource, emitDOMEvent, listenDOMEvent, prepEventSource } from "./events.js";
import { lock, cancelLock, locked } from "./domLock.js";
import { afterDetached, observe, registerCleanup, watchAttributes, watchElements } from "./observe.js";

const SELECTOR_FOCUSABLE = ':input,[contenteditable],a[href],area[href],iframe';
const META_KEYS = [16, 17, 18, 91, 93, 224];

const focusPath = [];
const focusFriends = new WeakMap();
const focusElements = new Set();
const modalElements = new Map();
const shortcuts = {};

var windowFocusedOut;
var currentEvent;
var currentMetaKey = '';
var trackPromise;
var trackCallbacks;


/* --------------------------------------
 * Helper functions
 * -------------------------------------- */

function approxMultipleOf(a, b) {
    return Math.abs(Math.round(a / b) - a / b) < 0.2;
}

function measureLine(p1, p2) {
    var dx = p1.clientX - p2.clientX;
    var dy = p1.clientY - p2.clientY;
    return {
        dx: dx,
        dy: dy,
        deg: Math.atan2(dy, dx) / Math.PI * 180,
        length: Math.sqrt(dx * dx + dy * dy)
    };
}

function textInputAllowed(v) {
    return v.isContentEditable || matchSelector(v, 'input,textarea,select');
}

function isMouseDown(e) {
    return (e.buttons || e.which) === 1;
}

/* --------------------------------------
 * Focus management
 * -------------------------------------- */

function cleanupFocusPath() {
    for (var i = focusPath.length - 1; i >= 0; i--) {
        if (!containsOrEquals(root, focusPath[i])) {
            setFocus(focusPath[i + 1] || document.body);
            break;
        }
    }
}

function getActiveElement() {
    if (!containsOrEquals(root, focusPath[0])) {
        cleanupFocusPath();
    }
    return focusPath[0];
}

function focused(element, strict) {
    // @ts-ignore: activeElement is not null
    return element === window ? !windowFocusedOut : focusElements.has(element) && (!strict || containsOrEquals(element, document.activeElement));
}

function focusable(element) {
    var friends = map(parentsAndSelf(element), function (v) {
        return focusFriends.get(v);
    });
    return any(focusPath, function (v) {
        return containsOrEquals(v, element) || friends.indexOf(v) >= 0;
    });
}

function focusLockedWithin(element) {
    return single(modalElements, function (v, i) {
        return $(v).find(element)[0] && i;
    });
}

function triggerFocusEvent(eventName, elements, relatedTarget, source) {
    var data = {
        relatedTarget: relatedTarget
    };
    each(elements, function (i, v) {
        emitDOMEvent(eventName, v, data, {
            source: source,
            handleable: false
        });
    });
}

function triggerModalChangeEvent() {
    emitDOMEvent('modalchange', root);
}

function setFocus(element, focusOnInput, source, path) {
    if (focusOnInput && !matchSelector(element, SELECTOR_FOCUSABLE)) {
        element = $(SELECTOR_FOCUSABLE, element).filter(':visible:not(:disabled,.disabled)')[0] || element;
    }
    path = path || focusPath;
    if (path[0]) {
        var within = path !== focusPath ? element : focusable(element);
        if (!within) {
            var lockParent = focusLockedWithin(element);
            element = focused(lockParent) ? path[0] : lockParent;
            within = focusable(element);
        }
        if (!within) {
            return false;
        }
        var removed = path.splice(0, path.indexOf(within));
        each(removed, function (i, v) {
            focusElements.delete(v);
        });
        triggerFocusEvent('focusout', removed, element, source);
    }
    // check whether the element is still attached in ROM
    // which can be detached while dispatching focusout event above
    if (containsOrEquals(root, element)) {
        var added = parentsAndSelf(element).filter(function (v) {
            return !focusElements.has(v);
        });
        var friend = map(added, function (v) {
            return focusFriends.get(v);
        })[0];
        if (friend && !focused(friend)) {
            var result = setFocus(friend);
            if (result !== undefined) {
                return result && setFocus(element);
            }
        }
        if (added[0]) {
            path.unshift.apply(path, added);
            each(added, function (i, v) {
                focusElements.add(v);
            });
            triggerFocusEvent('focusin', added.reverse(), null, source || new ZetaEventSource(added[0], path));
        }
        var activeElement = document.activeElement;
        if (path[0] !== activeElement) {
            path[0].focus();
            // ensure previously focused element is properly blurred
            // in case the new element is not focusable
            if (activeElement && activeElement !== document.body && activeElement !== root && document.activeElement === activeElement) {
                // @ts-ignore: activeElement is HTMLElement
                activeElement.blur();
            }
        }
        return true;
    }
}

function setModal(element, within) {
    if (modalElements.has(element)) {
        return true;
    }
    if (!focusable(element)) {
        return false;
    }
    var focusWithin = is(within, Node) || root;
    if (!focused(focusWithin)) {
        setFocus(focusWithin);
    }
    var from = focusPath.indexOf(element) + 1;
    var until = focusWithin === root || document.body ? focusPath.length : focusPath.indexOf(focusWithin);
    modalElements.set(element, focusPath.splice(from, until - from));
    if (!focusPath[0]) {
        setFocus(element);
    }
    setImmediateOnce(triggerModalChangeEvent);
    return true;
}

function releaseModal(element) {
    var modalPath = mapRemove(modalElements, element);
    var index = focusPath.indexOf(element);
    if (modalPath && index >= 0) {
        var index2 = modalPath.findIndex(function (v) {
            return containsOrEquals(v, element);
        });
        if (index2 >= 0) {
            // trigger focusout event for previously focused element
            // which focus is lost to modal element
            setFocus(modalPath[index2], false, null, modalPath)
        }
        focusPath.splice.apply(focusPath, [index + 1, 0].concat(modalPath));
        setFocus(focusPath[0], false);
        cleanupFocusPath();
        setImmediateOnce(triggerModalChangeEvent);
    }
}

function retainFocus(a, b) {
    focusFriends.set(b, a);
}

function releaseFocus(b) {
    focusFriends.delete(b);
}


/* --------------------------------------
 * DOM event handling
 * -------------------------------------- */

function getShortcut(key) {
    return keys(shortcuts[key] || {});
}

function setShortcut(command, keystroke) {
    if (isPlainObject(command)) {
        each(command, setShortcut);
    } else {
        var dict = shortcuts[command] || (shortcuts[command] = {});
        var copy = extend({}, dict);
        each(keystroke, function (i, v) {
            if (copy[v]) {
                delete copy[v];
            } else {
                dict[v] = true;
                (shortcuts[v] || (shortcuts[v] = {}))[command] = true;
            }
        });
        each(copy, function (v) {
            delete shortcuts[command][v];
            delete shortcuts[v][command];
        });
    }
}

function trackPointer(callback) {
    if (trackCallbacks) {
        trackCallbacks.push(callback);
        return trackPromise;
    }
    var lastPoint = currentEvent;
    var scrollWithin = grep(focusPath, function (v) {
        return containsOrEquals(v, currentEvent.target);
    }).slice(-1)[0];
    var scrollParent = getScrollParent(currentEvent.target);
    var scrollTimeout;
    var resolve, reject;

    trackCallbacks = [callback];
    trackPromise = prepEventSource(new Promise(function (res, rej) {
        resolve = res.bind(0, undefined);
        reject = rej;
    }));
    callback = combineFn(trackCallbacks);
    if (root.setCapture) {
        root.setCapture();
    }

    var stopScroll = function () {
        clearInterval(scrollTimeout);
        scrollTimeout = null;
    };
    var startScroll = function () {
        scrollTimeout = scrollTimeout || setInterval(function () {
            var x = lastPoint.clientX;
            var y = lastPoint.clientY;
            var r = getRect(scrollParent);
            var dx = Math.max(x - r.right + 5, r.left - x + 5, 0);
            var dy = Math.max(y - r.bottom + 5, r.top - y + 5, 0);
            if ((dx || dy) && scrollIntoView(scrollParent, toPlainRect(x, y).expand(dx, dy), scrollWithin)) {
                callback(lastPoint);
            } else {
                stopScroll();
            }
        }, 20);
    };
    bindUntil(trackPromise, root, {
        mouseup: resolve,
        touchend: resolve,
        keydown: function (e) {
            if (e.which === 27) {
                reject();
            }
        },
        mousemove: function (e) {
            startScroll();
            if (!e.which && !lastPoint.touches) {
                resolve();
            } else if (e.clientX !== lastPoint.clientX || e.clientY !== lastPoint.clientY) {
                lastPoint = e;
                callback(lastPoint);
            }
        },
        touchmove: function (e) {
            var points = makeArray(e.touches);
            if (!points[1]) {
                startScroll();
                lastPoint = points[0];
            }
            callback.apply(0, points);
        }
    }, true);
    always(trackPromise, function () {
        stopScroll();
        trackCallbacks = null;
        if (root.releaseCapture) {
            root.releaseCapture();
        }
    });
    return trackPromise;
}

function beginDrag(within, callback) {
    if (!currentEvent || !matchWord(currentEvent.type, 'mousedown mousemove touchstart touchmove')) {
        return reject();
    }
    var initialPoint = (currentEvent.touches || [currentEvent])[0];
    callback = isFunction(callback || within) || noop;
    return trackPointer(function (p) {
        var x = p.clientX;
        var y = p.clientY;
        callback(x, y, x - initialPoint.clientX, y - initialPoint.clientY);
    });
}

function beginPinchZoom(callback) {
    var initialPoints = (currentEvent || '').touches;
    if (!initialPoints || !initialPoints[1]) {
        return reject();
    }
    var m0 = measureLine(initialPoints[0], initialPoints[1]);
    return trackPointer(function (p1, p2) {
        var m1 = measureLine(p1, p2);
        callback((m1.deg - m0.deg + 540) % 360 - 180, m1.length / m0.length, p1.clientX - initialPoints[0].clientX + (m0.dx - m1.dx) / 2, p1.clientY - initialPoints[0].clientY + (m0.dy - m1.dy) / 2);
    });
}

domReady.then(function () {
    var modifierCount;
    var modifiedKeyCode;
    var mouseInitialPoint;
    var mousedownFocus;
    var normalizeTouchEvents;
    var pressTimeout;
    var hasCompositionUpdate;
    var imeNode;
    var imeOffset;
    var imeText;

    function getEventName(e, suffix) {
        var mod = ((e.ctrlKey || e.metaKey) ? 'Ctrl' : '') + (e.altKey ? 'Alt' : '') + (e.shiftKey ? 'Shift' : '');
        return mod ? lcfirst(mod + ucfirst(suffix)) : suffix;
    }

    function updateIMEState() {
        var element = document.activeElement || root;
        var selection = getSelection();
        if (!selection) {
            return;
        }
        if ('selectionEnd' in element) {
            imeNode = element;
            // @ts-ignore: guranteed having selectionEnd property
            imeOffset = element.selectionEnd;
        } else {
            imeNode = selection.anchorNode;
            imeOffset = selection.anchorOffset;
            if (imeNode && imeNode.nodeType === 1) {
                // IE puts selection at element level
                // however it will insert text in the previous text node
                var child = imeNode.childNodes[imeOffset - 1];
                if (child && child.nodeType === 3) {
                    imeNode = child;
                    // @ts-ignore: child is Text
                    imeOffset = child.length;
                } else {
                    imeNode = imeNode.childNodes[imeOffset];
                    imeOffset = 0;
                }
            }
        }
    }

    function triggerUIEvent(eventName, data, point) {
        return emitDOMEvent(eventName, focusPath[0], data, {
            clientX: (point || '').clientX,
            clientY: (point || '').clientY,
            bubbles: true,
            originalEvent: currentEvent
        });
    }

    function triggerKeystrokeEvent(keyName, char) {
        var data = {
            data: keyName,
            char: char
        };
        lastEventSource.sourceKeyName = keyName;
        if (triggerUIEvent('keystroke', data)) {
            currentEvent.preventDefault();
            return true;
        }
    }

    function triggerMouseEvent(eventName, event) {
        event = event || currentEvent;
        var data = {
            target: event.target,
            metakey: getEventName(event) || ''
        };
        return triggerUIEvent(eventName, data, mouseInitialPoint || event);
    }

    function triggerGestureEvent(gesture) {
        mouseInitialPoint = null;
        return triggerUIEvent('gesture', gesture);
    }

    function handleUIEventWrapper(type, callback) {
        var isMoveEvent = matchWord(type, 'mousemove touchmove');
        return function (e) {
            currentEvent = e;
            setTimeout(function () {
                if (currentEvent === e) {
                    currentEvent = null;
                }
            });
            if ('ctrlKey' in e) {
                var metaKey = getEventName(e, '');
                if (metaKey !== currentMetaKey) {
                    currentMetaKey = metaKey;
                    triggerUIEvent('metakeychange', metaKey);
                }
            }
            if (!isMoveEvent) {
                setLastEventSource(null);
                if (!focusable(e.target)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    if (matchWord(type, 'touchstart mousedown keydown')) {
                        emitDOMEvent('focusreturn', focusPath.slice(-1)[0]);
                    }
                }
                setLastEventSource(e.target);
            }
            callback(e);
        };
    }

    var uiEvents = {
        compositionstart: function () {
            updateIMEState();
            imeText = '';
        },
        compositionupdate: function (e) {
            imeText = e.data;
            hasCompositionUpdate = true;
        },
        compositionend: function (e) {
            var isInputElm = 'selectionEnd' in imeNode;
            var prevText = imeText;
            var prevOffset = imeOffset;
            updateIMEState();

            var curText = imeNode.value || imeNode.data || '';
            imeText = e.data;
            // some IME lacks inserted character sequence when selecting from phrase candidate list
            // also legacy Microsoft Changjie IME reports full-width spaces (U+3000) instead of actual characters
            if (!imeText || /^\u3000+$/.test(imeText)) {
                imeText = curText.slice(prevOffset, imeOffset);
            }

            // some old mobile browsers fire compositionend event before replacing final character sequence
            // need to compare both to truncate the correct range of characters
            // three cases has been observed: XXX{imeText}|, XXX{prevText}| and XXX|{imeText}
            var o1 = imeOffset - imeText.length;
            var o2 = imeOffset - prevText.length;
            var startOffset = imeOffset;
            if (curText.slice(o1, imeOffset) === imeText) {
                startOffset = o1;
            } else if (curText.slice(o2, imeOffset) === prevText) {
                startOffset = o2;
            } else if (curText.substr(imeOffset, imeText.length) === imeText) {
                imeOffset += imeText.length;
            }
            var newText = curText.substr(0, startOffset) + curText.slice(imeOffset);
            if (isInputElm) {
                imeNode.value = newText;
                imeNode.setSelectionRange(startOffset, startOffset);
            } else {
                imeNode.data = newText;
                makeSelection(imeNode, startOffset);
            }
            if (!triggerUIEvent('textInput', imeText)) {
                if (isInputElm) {
                    imeNode.value = curText;
                    imeNode.setSelectionRange(imeOffset, imeOffset);
                } else {
                    imeNode.data = curText;
                    makeSelection(imeNode, imeOffset);
                }
            }
            imeNode = null;
            hasCompositionUpdate = false;
            setTimeout(function () {
                imeText = null;
            });
        },
        textInput: function (e) {
            // required for older mobile browsers that do not support beforeinput event
            // ignore in case browser fire textInput before/after compositionend
            if (!hasCompositionUpdate && (e.data === imeText || triggerUIEvent('textInput', e.data))) {
                e.preventDefault();
            }
        },
        keydown: function (e) {
            if (!imeNode) {
                var keyCode = e.keyCode;
                var isModifierKey = (META_KEYS.indexOf(keyCode) >= 0);
                var isSpecialKey = !isModifierKey && (KEYNAMES[keyCode] || '').length > 1 && !(keyCode >= 186 || (keyCode >= 96 && keyCode <= 111));
                // @ts-ignore: boolean arithmetic
                modifierCount = e.ctrlKey + e.shiftKey + e.altKey + e.metaKey + !isModifierKey;
                // @ts-ignore: boolean arithmetic
                modifierCount *= isSpecialKey || ((modifierCount > 2 || (modifierCount > 1 && !e.shiftKey)) && !isModifierKey);
                modifiedKeyCode = keyCode;
                if (modifierCount) {
                    triggerKeystrokeEvent(getEventName(e, KEYNAMES[keyCode] || e.key), keyCode === 32 ? ' ' : '');
                }
            }
        },
        keyup: function (e) {
            var isModifierKey = (META_KEYS.indexOf(e.keyCode) >= 0);
            if (!imeNode && (isModifierKey || modifiedKeyCode === e.keyCode)) {
                modifiedKeyCode = null;
                modifierCount--;
            }
        },
        keypress: function (e) {
            var data = e.char || e.key || String.fromCharCode(e.charCode);
            // @ts-ignore: non-standard member
            if (!imeNode && !modifierCount && (e.synthetic || !('onbeforeinput' in e.target))) {
                triggerKeystrokeEvent(getEventName(e, KEYNAMES[modifiedKeyCode] || data), data);
            }
        },
        beforeinput: function (e) {
            hasCompositionUpdate = false;
            if (!imeNode && e.cancelable) {
                switch (e.inputType) {
                    case 'insertText':
                        if (triggerUIEvent('textInput', e.data)) {
                            e.preventDefault();
                        }
                        return;
                    case 'deleteContent':
                    case 'deleteContentBackward':
                        return triggerKeystrokeEvent('backspace', '');
                    case 'deleteContentForward':
                        return triggerKeystrokeEvent('delete', '');
                }
            }
        },
        touchstart: function (e) {
            // @ts-ignore: e.target is Element
            var container = getEventContext(e.target);
            normalizeTouchEvents = container.normalizeTouchEvents;
            mouseInitialPoint = extend({}, e.touches[0]);
            if (!e.touches[1]) {
                // @ts-ignore: e.target is Element
                if (normalizeTouchEvents && focused(container.element)) {
                    triggerMouseEvent('mousedown');
                }
                pressTimeout = setTimeout(function () {
                    if (mouseInitialPoint) {
                        triggerMouseEvent('longPress', e);
                        mouseInitialPoint = null;
                    }
                }, 1000);
            }
        },
        touchmove: function (e) {
            clearTimeout(pressTimeout);
            pressTimeout = null;
            if (mouseInitialPoint) {
                if (!e.touches[1]) {
                    var line = measureLine(e.touches[0], mouseInitialPoint);
                    if (line.length > 5 && triggerMouseEvent('drag', mouseInitialPoint)) {
                        mouseInitialPoint = null;
                        return;
                    }
                    if (line.length > 50 && approxMultipleOf(line.deg, 90)) {
                        triggerGestureEvent('swipe' + (approxMultipleOf(line.deg, 180) ? (line.dx > 0 ? 'Right' : 'Left') : (line.dy > 0 ? 'Bottom' : 'Top')));
                    }
                } else if (!e.touches[2]) {
                    triggerGestureEvent('pinchZoom');
                }
            }
        },
        touchend: function (e) {
            clearTimeout(pressTimeout);
            if (normalizeTouchEvents && mouseInitialPoint && pressTimeout) {
                setFocus(e.target);
                triggerMouseEvent('click');
                dispatchDOMMouseEvent('click', mouseInitialPoint, e);
                e.preventDefault();
            }
        },
        mousedown: function (e) {
            setFocus(e.target);
            if (isMouseDown(e)) {
                triggerMouseEvent('mousedown');
            }
            mouseInitialPoint = e;
            mousedownFocus = document.activeElement;
        },
        mousemove: function (e) {
            if (mouseInitialPoint && measureLine(e, mouseInitialPoint).length > 5) {
                var target = mouseInitialPoint.target;
                if (isMouseDown(e) && containsOrEquals(target, elementFromPoint(mouseInitialPoint.clientX, mouseInitialPoint.clientY))) {
                    triggerMouseEvent('drag', mouseInitialPoint);
                }
                mouseInitialPoint = null;
            }
        },
        mouseup: function () {
            mouseInitialPoint = null;
            if (mousedownFocus && document.activeElement !== mousedownFocus) {
                mousedownFocus.focus();
            }
        },
        wheel: function (e) {
            // @ts-ignore: e.target is Element
            if (containsOrEquals(e.target, focusPath[0]) || !textInputAllowed(e.target)) {
                var dir = e.deltaY || e.detail;
                if (dir && triggerUIEvent('mousewheel', dir / Math.abs(dir) * (IS_MAC ? -1 : 1))) {
                    e.preventDefault();
                }
            }
        },
        click: function (e) {
            if (!IS_TOUCH && mouseInitialPoint) {
                triggerMouseEvent(getEventName(e, 'click'));
            }
        },
        contextmenu: function (e) {
            triggerMouseEvent('rightClick');
        },
        dblclick: function (e) {
            triggerMouseEvent('dblclick');
        }
    };

    each(uiEvents, function (i, v) {
        bind(root, i, handleUIEventWrapper(i, v), true);
    });

    bind(root, {
        focusin: function (e) {
            windowFocusedOut = false;
            if (focusable(e.target)) {
                setFocus(e.target, false, lastEventSource);
            } else {
                // @ts-ignore: e.target is Element
                e.target.blur();
            }
        },
        focusout: function (e) {
            imeNode = null;
            hasCompositionUpdate = false;
            // browser set focus to body if the focused element is no longer visible
            // which is not a desirable behavior in many cases
            // find the first visible element in focusPath to focus
            // @ts-ignore: e.target is Element
            if (!e.relatedTarget && !isVisible(e.target)) {
                var cur = any(focusPath.slice(focusPath.indexOf(e.target) + 1), isVisible);
                if (cur) {
                    setFocus(cur, false, lastEventSource);
                }
            }
        }
    }, true);

    bind(window, {
        wheel: function (e) {
            // scrolling will happen on first scrollable element up the DOM tree
            // prevent scrolling if interaction on such element should be blocked by modal element
            var deltaX = -e.deltaX;
            var deltaY = -e.deltaY;
            // @ts-ignore: e.target is Element
            for (var cur = e.target; cur && cur !== root; cur = cur.parentNode) {
                // @ts-ignore: e.target is Element
                var style = getComputedStyle(cur);
                // @ts-ignore: e.target is Element
                if (cur.scrollWidth > cur.offsetWidth && matchWord(style.overflowX, 'auto scroll') && ((deltaX > 0 && cur.scrollLeft > 0) || (deltaX < 0 && cur.scrollLeft + cur.offsetWidth < cur.scrollWidth))) {
                    break;
                }
                // @ts-ignore: e.target is Element
                if (cur.scrollHeight > cur.offsetHeight && matchWord(style.overflowY, 'auto scroll') && ((deltaY > 0 && cur.scrollTop > 0) || (deltaY < 0 && cur.scrollTop + cur.offsetHeight < cur.scrollHeight))) {
                    break;
                }
            }
            if (!focusable(cur)) {
                e.preventDefault();
            }
        },
        blur: function (e) {
            if (e.target === window) {
                windowFocusedOut = true;
            }
        }
    });

    registerCleanup(function () {
        each(modalElements, function (element) {
            if (!containsOrEquals(root, element)) {
                releaseModal(element);
            }
        });
    });

    listenDOMEvent('escape', function () {
        setFocus(document.body);
    });
    setFocus(document.activeElement);
});

setShortcut({
    undo: 'ctrlZ',
    redo: 'ctrlY ctrlShiftZ',
    selectAll: 'ctrlA'
});

/* --------------------------------------
 * Exports
 * -------------------------------------- */

function focus(element) {
    setFocus(element, true);
}

export default {
    get event() {
        return currentEvent;
    },
    get metaKey() {
        return currentMetaKey;
    },
    get context() {
        return getEventContext(getActiveElement()).context;
    },
    get activeElement() {
        return getActiveElement();
    },
    get focusedElements() {
        cleanupFocusPath();
        return focusPath.slice(0);
    },
    get eventSource() {
        return getEventSource();
    },
    root,
    ready: domReady,

    textInputAllowed,
    focusable,
    focused,
    setModal,
    releaseModal,
    retainFocus,
    releaseFocus,
    focus,
    beginDrag,
    beginPinchZoom,
    getShortcut,
    setShortcut,

    getEventSource,
    getEventContext,
    on: listenDOMEvent,
    emit: emitDOMEvent,

    lock,
    locked,
    cancelLock,

    observe,
    registerCleanup,
    afterDetached,
    watchElements,
    watchAttributes
};

export {
    textInputAllowed,
    beginDrag,
    beginPinchZoom,
    getShortcut,
    setShortcut,
    focusable,
    focused,
    setModal,
    releaseModal,
    retainFocus,
    releaseFocus,
    focus
}
