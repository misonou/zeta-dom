import { IS_MAC, IS_TOUCH, window, document, root, getSelection, getComputedStyle, domReady } from "./env.js";
import { KEYNAMES } from "./constants.js";
import $ from "./include/jquery.js";
import { always, any, each, extend, is, isFunction, isPlainObject, keys, lcfirst, map, mapRemove, matchWord, noop, reject, single, ucfirst } from "./util.js";
import { bind, bindUntil, containsOrEquals, dispatchDOMMouseEvent, getScrollParent, isVisible, makeSelection, matchSelector, parentsAndSelf, scrollIntoView, toPlainRect } from "./domUtil.js";
import { ZetaEventSource, lastEventSource, getEventContext, setLastEventSource, getEventSource, emitDOMEvent, listenDOMEvent, prepEventSource } from "./events.js";
import { lock, cancelLock, locked } from "./domLock.js";
import { afterDetached, observe, registerCleanup, watchAttributes, watchElements } from "./observe.js";

const SELECTOR_FOCUSABLE = ':input,[contenteditable],a[href],area[href],iframe';
const META_KEYS = [16, 17, 18, 91, 93];

const focusPath = [];
const focusFriends = new WeakMap();
const focusElements = new Set();
const modalElements = new Map();
const shortcuts = {};

var windowFocusedOut;
var currentEvent;


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

/* --------------------------------------
 * Focus management
 * -------------------------------------- */

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
    var focusWithin = is(within, Node) || root;
    if (!focused(focusWithin)) {
        setFocus(focusWithin);
    }
    modalElements.set(element, focusPath.splice(0, focusWithin === root || document.body ? focusPath.length : focusPath.indexOf(focusWithin)));
    setFocus(element);
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
    var lastPoint = currentEvent;
    var resolve, reject;
    var promise = new Promise(function (res, rej) {
        resolve = res.bind(0, undefined);
        reject = rej;
    });
    bindUntil(promise, window, {
        mouseup: resolve,
        touchend: resolve,
        keydown: function (e) {
            if (e.which === 27) {
                reject();
            }
        },
        mousemove: function (e) {
            e.preventDefault();
            if (!e.which && !lastPoint.touches) {
                resolve();
            } else if (e.clientX !== lastPoint.clientX || e.clientY !== lastPoint.clientY) {
                lastPoint = e;
                callback([lastPoint]);
            }
        },
        touchmove: function (e) {
            callback(e.touches);
        }
    });
    return prepEventSource(promise);
}

function beginDrag(within, callback) {
    if (!currentEvent || currentEvent.type !== 'mousedown') {
        return reject();
    }
    callback = isFunction(callback || within) || noop;
    within = is(within, Node) || currentEvent.target;

    var lastPoint = currentEvent;
    var scrollParent = getScrollParent(within);
    var scrollTimeout;
    var callbackWrapper = function (points) {
        lastPoint = points[0];
        callback(lastPoint.clientX, lastPoint.clientY);
    };
    var cleanUp = function () {
        clearInterval(scrollTimeout);
        scrollTimeout = null;
    };
    var promise = trackPointer(callbackWrapper);
    bindUntil(promise, scrollParent, {
        mouseout: function (e) {
            var relatedTarget = e.relatedTarget;
            // @ts-ignore: relatedTarget is Element
            if (!scrollTimeout && (!containsOrEquals(scrollParent, relatedTarget) || (scrollParent === root && relatedTarget === root))) {
                scrollTimeout = setInterval(function () {
                    if (scrollIntoView(scrollParent, toPlainRect(lastPoint.clientX, lastPoint.clientY).expand(50))) {
                        callbackWrapper([lastPoint]);
                    } else {
                        cleanUp();
                    }
                }, 20);
            }
        },
        mouseover: function (e) {
            if (e.target !== root) {
                cleanUp();
            }
        }
    });
    always(promise, cleanUp);
    return promise;
}

function beginPinchZoom(callback) {
    var initialPoints = (currentEvent || '').touches;
    if (!initialPoints || !initialPoints[1]) {
        return reject();
    }
    var m0 = measureLine(initialPoints[0], initialPoints[1]);
    return trackPointer(function (points) {
        var m1 = measureLine(points[0], points[1]);
        callback((m1.deg - m0.deg + 540) % 360 - 180, m1.length / m0.length, points[0].clientX - initialPoints[0].clientX + (m0.dx - m1.dx) / 2, points[0].clientY - initialPoints[0].clientY + (m0.dy - m1.dy) / 2);
    });
}

domReady.then(function () {
    var body = document.body;
    var modifierCount;
    var modifiedKeyCode;
    var mouseInitialPoint;
    var mousedownFocus;
    var normalizeTouchEvents;
    var pressTimeout;
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

    function triggerMouseEvent(eventName) {
        var data = {
            target: currentEvent.target,
            metakey: getEventName(currentEvent) || ''
        };
        return triggerUIEvent(eventName, data, mouseInitialPoint || currentEvent);
    }

    function triggerGestureEvent(gesture) {
        mouseInitialPoint = null;
        return triggerUIEvent('gesture', gesture);
    }

    function handleUIEventWrapper(type, callback) {
        return function (e) {
            currentEvent = e;
            setTimeout(function () {
                currentEvent = null;
            });
            setLastEventSource(null);
            if (!focusable(e.target)) {
                e.stopImmediatePropagation();
                e.preventDefault();
                if (matchWord(type, 'touchstart mousedown keydown')) {
                    emitDOMEvent('focusreturn', focusPath.slice(-1)[0]);
                }
            }
            setLastEventSource(e.target);
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
            setTimeout(function () {
                imeText = null;
            });
        },
        textInput: function (e) {
            // required for older mobile browsers that do not support beforeinput event
            // ignore in case browser fire textInput before/after compositionend
            if (!imeNode && (e.data === imeText || triggerUIEvent('textInput', e.data))) {
                e.preventDefault();
            }
        },
        keydown: function (e) {
            if (!imeNode) {
                var keyCode = e.keyCode;
                var isModifierKey = (META_KEYS.indexOf(keyCode) >= 0);
                if (isModifierKey && keyCode !== modifiedKeyCode) {
                    triggerUIEvent('metakeychange', getEventName(e));
                }
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
                if (isModifierKey) {
                    triggerUIEvent('metakeychange', getEventName(e) || '');
                }
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
            if (!imeNode && e.cancelable) {
                switch (e.inputType) {
                    case 'insertText':
                        return triggerUIEvent('textInput', e.data);
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
                        triggerMouseEvent('longPress');
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
            if ((e.buttons || e.which) === 1) {
                triggerMouseEvent('mousedown');
            }
            mouseInitialPoint = e;
            mousedownFocus = document.activeElement;
        },
        mousemove: function (e) {
            if (mouseInitialPoint && measureLine(e, mouseInitialPoint).length > 5) {
                mouseInitialPoint = null;
            }
        },
        mouseup: function () {
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
        bind(root, i, matchWord(i, 'mousemove touchmove') ? v : handleUIEventWrapper(i, v), true);
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
        each(modalElements, function (element, modelPath) {
            if (!containsOrEquals(root, element) && mapRemove(modalElements, element) && focused(element)) {
                var path = any(modalElements, function (w) {
                    return w.indexOf(element) >= 0;
                }) || focusPath;
                path.push.apply(path, modelPath);
                setFocus(modelPath[0], false, null, path);
            }
        });
        for (var i = focusPath.length - 1; i >= 0; i--) {
            if (!containsOrEquals(root, focusPath[i])) {
                setFocus(focusPath[i + 1] || body);
                break;
            }
        }
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
    get context() {
        return getEventContext(focusPath[0]).context;
    },
    get activeElement() {
        return focusPath[0];
    },
    get focusedElements() {
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
    retainFocus,
    releaseFocus,
    focus
}
