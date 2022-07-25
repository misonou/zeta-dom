import { IS_MAC, IS_TOUCH, window, document, root, getSelection, getComputedStyle, domReady } from "./env.js";
import { KEYNAMES } from "./constants.js";
import * as ErrorCode from "./errorCode.js";
import $ from "./include/jquery.js";
import { always, any, combineFn, each, errorWithCode, extend, grep, is, isFunction, isPlainObject, keys, lcfirst, makeArray, map, mapRemove, matchWord, noop, reject, setImmediateOnce, single, ucfirst } from "./util.js";
import { bind, bindUntil, containsOrEquals, dispatchDOMMouseEvent, elementFromPoint, getRect, getScrollParent, isVisible, makeSelection, matchSelector, parentsAndSelf, scrollIntoView, toPlainRect } from "./domUtil.js";
import { ZetaEventSource, lastEventSource, getEventContext, setLastEventSource, getEventSource, emitDOMEvent, listenDOMEvent, prepEventSource } from "./events.js";
import { lock, cancelLock, locked, notifyAsync, preventLeave } from "./domLock.js";
import { afterDetached, createAutoCleanupMap, observe, registerCleanup, watchAttributes, watchElements } from "./observe.js";

const SELECTOR_FOCUSABLE = ':input,[contenteditable],a[href],area[href],iframe';
const META_KEYS = [16, 17, 18, 91, 93, 224];

const focusPath = [root];
const focusFriends = new WeakMap();
const focusElements = new Set([root]);
const modalElements = createAutoCleanupMap(releaseModal);
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

function createIterator(callback) {
    return {
        next: function () {
            var value = callback();
            return {
                value: value,
                done: !value
            };
        }
    };
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

function getModalElement() {
    var element = focusPath.slice(-2)[0];
    if (element === document.body) {
        return null;
    }
    if (!containsOrEquals(root, element)) {
        cleanupFocusPath();
        return getModalElement();
    }
    return element;
}

function focused(element, strict) {
    // @ts-ignore: activeElement is not null
    return element === window ? !windowFocusedOut : focusElements.has(element) && (!strict || containsOrEquals(element, document.activeElement));
}

function focusable(element) {
    if (element === root) {
        return root;
    }
    var friends = map(parentsAndSelf(element), function (v) {
        return focusFriends.get(v);
    });
    return any(focusPath, function (v) {
        return v !== root && (containsOrEquals(v, element) || friends.indexOf(v) >= 0);
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
    emitDOMEvent('modalchange', root, {
        modalElement: getModalElement()
    });
}

function setFocus(element, source, path, suppressFocusChange) {
    var removed = [];
    path = path || focusPath;
    if (path[1]) {
        var within = path !== focusPath ? element : focusable(element);
        if (!within) {
            var lockParent = focusLockedWithin(element);
            element = focused(lockParent) ? path[0] : lockParent;
            within = focusable(element);
        }
        if (!within) {
            return false;
        }
        removed = path.splice(0, path.indexOf(within));
        each(removed, function (i, v) {
            focusElements.delete(v);
        });
        triggerFocusEvent('focusout', removed, element, source);
    }
    var unchanged = path.slice(0);
    var result;
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
            result = setFocus(friend, null, null, true);
        }
        if (result === undefined) {
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
            result = !!added[0];
        }
    }
    if (!suppressFocusChange && (removed[0] || result)) {
        triggerFocusEvent('focuschange', unchanged, null, source);
    }
    return result;
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
    var until = focusWithin === root || document.body ? focusPath.length - 1 : focusPath.indexOf(focusWithin);
    modalElements.set(element, focusPath.splice(from, until - from));
    if (!focusPath[1]) {
        setFocus(element);
    }
    setImmediateOnce(triggerModalChangeEvent);
    return true;
}

function releaseModal(element, modalPath) {
    modalPath = mapRemove(modalElements, element) || modalPath;
    var index = focusPath.indexOf(element);
    if (modalPath && index >= 0) {
        var index2 = modalPath.findIndex(function (v) {
            return containsOrEquals(v, element);
        });
        if (index2 >= 0) {
            // trigger focusout event for previously focused element
            // which focus is lost to modal element
            setFocus(modalPath[index2], null, modalPath)
        }
        focusPath.splice.apply(focusPath, [index + 1, 0].concat(modalPath));
        setFocus(focusPath[0]);
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

function iterateFocusPath(element) {
    var returnedOnce;
    if (element === root || !focused(element)) {
        return createIterator(function () {
            if (!returnedOnce || !element) {
                returnedOnce = true;
            } else {
                var friend = focusFriends.get(element);
                // make sure the next iterated element in connected in DOM and
                // not being the descendants of current element
                element = friend && containsOrEquals(root, friend) && !containsOrEquals(element, friend) ? friend : element.parentNode;
            }
            return element;
        });
    }
    var elements = focusPath.slice(0);
    var next = function () {
        var cur = elements.shift();
        var modalPath = modalElements.get(cur);
        if (modalPath) {
            elements.unshift.apply(elements, modalPath);
        }
        return cur;
    };
    return createIterator(function () {
        var cur = next();
        if (!returnedOnce) {
            for (; cur !== element; cur = next());
            returnedOnce = true;
        }
        element = cur;
        return element;
    });
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
        if (callback) {
            trackCallbacks.push(callback);
        }
        return trackPromise;
    }
    var lastPoint = currentEvent;
    var scrollWithin = grep(focusPath, function (v) {
        return containsOrEquals(v, currentEvent.target);
    }).slice(-1)[0];
    var scrollParent = getScrollParent(currentEvent.target);
    var scrollTimeout;
    var resolve, reject;

    trackCallbacks = callback ? [callback] : [];
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
                reject(errorWithCode(ErrorCode.cancelled));
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
            if (!points[1] && trackCallbacks[0]) {
                startScroll();
                lastPoint = points[0];
            }
            callback.apply(0, points);
        }
    }, true);
    always(trackPromise, function () {
        stopScroll();
        trackCallbacks = null;
        trackPromise = null;
        if (root.releaseCapture) {
            root.releaseCapture();
        }
    });
    return trackPromise;
}

function beginDrag(within, callback) {
    if (!currentEvent || !matchWord(currentEvent.type, 'mousedown mousemove touchstart touchmove')) {
        return reject(errorWithCode(ErrorCode.invalidOperation));
    }
    var initialPoint = (currentEvent.touches || [currentEvent])[0];
    callback = isFunction(callback || within);
    return trackPointer(callback && function (p) {
        var x = p.clientX;
        var y = p.clientY;
        callback(x, y, x - initialPoint.clientX, y - initialPoint.clientY);
    });
}

function beginPinchZoom(callback) {
    var initialPoints = (currentEvent || '').touches;
    if (!initialPoints || !initialPoints[1]) {
        return reject(errorWithCode(ErrorCode.invalidOperation));
    }
    var m0 = measureLine(initialPoints[0], initialPoints[1]);
    return trackPointer(isFunction(callback) && function (p1, p2) {
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
    var swipeDir;
    var hasCompositionUpdate;
    var imeModifyOnUpdate;
    var imeNodeText;
    var imeNode;
    var imeOffset;
    var imeText;

    function getEventName(e, suffix) {
        var mod = ((e.ctrlKey || e.metaKey) ? 'Ctrl' : '') + (e.altKey ? 'Alt' : '') + (e.shiftKey ? 'Shift' : '');
        return mod ? lcfirst(mod + ucfirst(suffix)) : suffix;
    }

    function inputValueImpl(element, method, value) {
        // React defines its own getter and setter on input elements
        var desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');
        if (desc && desc[method]) {
            return desc[method].call(element, value);
        }
        return method === 'get' ? element.value : (element.value = value);
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
            imeOffset = [element.selectionStart, element.selectionEnd];
            imeNodeText = inputValueImpl(element, 'get');
        } else {
            imeNode = selection.anchorNode;
            imeOffset = [selection.focusOffset, selection.anchorOffset];
            if (imeNode && imeNode.nodeType === 1) {
                // IE puts selection at element level
                // however it will insert text in the previous text node
                var child = imeNode.childNodes[imeOffset - 1];
                if (child && child.nodeType === 3) {
                    imeNode = child;
                    // @ts-ignore: child is Text
                    imeOffset = [child.length, child.length];
                } else {
                    imeNode = imeNode.childNodes[imeOffset];
                    imeOffset = [0, 0];
                }
            }
            imeNodeText = imeNode.data || '';
        }
    }

    function triggerUIEvent(eventName, data, point, target) {
        return emitDOMEvent(eventName, target || focusPath[0], data, {
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
        var target = mouseInitialPoint.target;
        mouseInitialPoint = null;
        return triggerUIEvent('gesture', gesture, null, target);
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
                        emitDOMEvent('focusreturn', focusPath.slice(-2)[0]);
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
            imeModifyOnUpdate = false;
            imeText = '';
        },
        compositionupdate: function (e) {
            if (!hasCompositionUpdate && imeOffset[0] !== imeOffset[1]) {
                triggerUIEvent('textInput', '');
            }
            imeText = e.data;
            hasCompositionUpdate = true;
            // check whether input value or node data
            // are updated immediately after compositionupdate event
            if (!imeModifyOnUpdate) {
                setImmediate(function () {
                    var prevNodeText = imeNodeText;
                    var prevOffset = imeOffset;
                    updateIMEState();
                    imeModifyOnUpdate = imeNodeText !== prevNodeText;
                    imeOffset[0] = prevOffset[0];
                });
            }
        },
        compositionend: function (e) {
            var isInputElm = 'selectionEnd' in imeNode;
            var prevText = imeText;
            var prevOffset = imeOffset;
            var prevNodeText = imeNodeText;
            updateIMEState();

            imeText = e.data;
            // some IME lacks inserted character sequence when selecting from phrase candidate list
            // also legacy Microsoft Changjie IME reports full-width spaces (U+3000) instead of actual characters
            if (!imeText || /^\u3000+$/.test(imeText)) {
                imeText = imeNodeText.slice(prevOffset[1], imeOffset[1]);
            }

            var afterNodeText = imeNodeText;
            var afterOffset = imeOffset[1];
            var startOffset = afterOffset;
            if (imeModifyOnUpdate) {
                // in some case the node does not contain the final input text
                if (prevOffset[0] + imeText.length !== afterOffset) {
                    afterNodeText = imeNodeText.slice(0, afterOffset) + imeText + imeNodeText.slice(afterOffset);
                    afterOffset += imeText.length;
                }
            } else {
                // some old mobile browsers fire compositionend event before replacing final character sequence
                // need to compare both to truncate the correct range of characters
                // three cases has been observed: XXX{imeText}|, XXX{prevText}| and XXX|{imeText}
                var o1 = afterOffset - imeText.length;
                var o2 = afterOffset - prevText.length;
                if (imeNodeText.slice(o1, afterOffset) === imeText) {
                    startOffset = o1;
                } else if (imeNodeText.slice(o2, afterOffset) === prevText) {
                    startOffset = o2;
                } else if (imeNodeText.substr(afterOffset, imeText.length) === imeText) {
                    afterOffset += imeText.length;
                }
                prevNodeText = imeNodeText.substr(0, startOffset) + imeNodeText.slice(afterOffset);
            }
            var range = document.createRange();
            if (isInputElm) {
                inputValueImpl(imeNode, 'set', prevNodeText);
                imeNode.setSelectionRange(startOffset, startOffset);
            } else {
                imeNode.data = prevNodeText;
                range.setStart(imeNode, startOffset);
                makeSelection(range);
            }
            if (!triggerUIEvent('textInput', imeText)) {
                if (isInputElm) {
                    var event = document.createEvent('Event');
                    event.initEvent('change', true);
                    inputValueImpl(imeNode, 'set', afterNodeText);
                    imeNode.setSelectionRange(afterOffset, afterOffset);
                    imeNode.dispatchEvent(event);
                } else {
                    imeNode.data = afterNodeText;
                    range.setStart(imeNode, afterOffset);
                    makeSelection(range);
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
            if (e.inputType !== 'insertCompositionText') {
                hasCompositionUpdate = false;
            }
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
            swipeDir = '';
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
                    if (swipeDir !== false && line.length > 50 && approxMultipleOf(line.deg, 90)) {
                        var dir = approxMultipleOf(line.deg, 180) ? (line.dx > 0 ? 'Right' : 'Left') : (line.dy > 0 ? 'Down' : 'Up');
                        swipeDir = !swipeDir || swipeDir === dir ? dir : false;
                        mouseInitialPoint = extend({}, e.touches[0]);
                    }
                } else if (!e.touches[2]) {
                    triggerGestureEvent('pinchZoom');
                }
            }
        },
        touchend: function (e) {
            clearTimeout(pressTimeout);
            if (swipeDir) {
                triggerGestureEvent('swipe' + swipeDir);
            } else {
                setFocus(e.target);
                if (normalizeTouchEvents && mouseInitialPoint && pressTimeout) {
                    triggerMouseEvent('click');
                    dispatchDOMMouseEvent('click', mouseInitialPoint, e);
                    e.preventDefault();
                }
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
            if (mousedownFocus && document.activeElement !== mousedownFocus) {
                mousedownFocus.focus();
            }
        },
        wheel: function (e) {
            var dir = e.deltaY || e.deltaX || e.detail;
            if (dir && !textInputAllowed(e.target) && triggerUIEvent('mousewheel', dir / Math.abs(dir) * (IS_MAC ? -1 : 1), e, e.target)) {
                e.stopPropagation();
            }
        },
        click: function (e) {
            if (mouseInitialPoint) {
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
                setFocus(e.target, lastEventSource);
                scrollIntoView(e.target, 10);
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
                    setFocus(cur, lastEventSource);
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

    listenDOMEvent('escape', function () {
        setFocus(getModalElement() || document.body);
    });
    setFocus(document.activeElement);
    lock(root);
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
    if (!matchSelector(element, SELECTOR_FOCUSABLE)) {
        element = $(SELECTOR_FOCUSABLE, element).filter(':visible:not(:disabled,.disabled)')[0] || element;
    }
    setFocus(element);
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
    get modalElement() {
        return getModalElement();
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
    iterateFocusPath,
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
    notifyAsync,
    preventLeave,

    observe,
    registerCleanup,
    createAutoCleanupMap,
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
    iterateFocusPath,
    focus
}
