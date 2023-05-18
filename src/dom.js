import { } from "./libCheck.js";
import { IS_MAC, window, document, root, getSelection, getComputedStyle, domReady } from "./env.js";
import { KEYNAMES } from "./constants.js";
import * as ErrorCode from "./errorCode.js";
import $ from "./include/jquery.js";
import { always, any, combineFn, each, errorWithCode, extend, grep, isFunction, isPlainObject, keys, lcfirst, makeArray, map, mapRemove, matchWord, reject, setImmediate, setImmediateOnce, single, ucfirst } from "./util.js";
import { bind, bindUntil, containsOrEquals, elementFromPoint, getRect, getScrollParent, isVisible, makeSelection, matchSelector, parentsAndSelf, scrollIntoView, toPlainRect } from "./domUtil.js";
import { ZetaEventSource, lastEventSource, getEventContext, setLastEventSource, getEventSource, emitDOMEvent, listenDOMEvent, prepEventSource } from "./events.js";
import { lock, cancelLock, locked, notifyAsync, preventLeave, subscribeAsync } from "./domLock.js";
import { afterDetached, createAutoCleanupMap, observe, registerCleanup, watchAttributes, watchElements, watchOwnAttributes } from "./observe.js";

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
        releaseModal(element);
        return getModalElement();
    }
    return element;
}

function focused(element, strict) {
    // @ts-ignore: activeElement is not null
    return element === window ? !windowFocusedOut : focusElements.has(element) && (!strict || containsOrEquals(element, document.activeElement));
}

function focusable(element) {
    if (!containsOrEquals(root, element)) {
        return false;
    }
    if (element === root || !focusPath[1]) {
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
        return containsOrEquals(v, element) && i;
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

function setFocus(element, source, path, suppressFocus, suppressFocusChange) {
    var removed = [];
    if (element === root) {
        element = document.body;
    }
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
        var friend = single(added, function (v) {
            return focusFriends.get(v);
        });
        if (friend && added.indexOf(friend) < 0 && !focused(friend)) {
            result = setFocus(friend, source, path, suppressFocus, true);
        }
        if (result === undefined) {
            setFocusUnsafe(added, source, path, suppressFocus);
            result = !!added[0];
        }
    }
    if (!suppressFocusChange && (removed[0] || result)) {
        triggerFocusEvent('focuschange', unchanged, null, source);
    }
    return result;
}

function setFocusUnsafe(elements, source, path, suppressFocus) {
    path = path || focusPath;
    if (elements[0]) {
        path.unshift.apply(path, elements);
        each(elements, function (i, v) {
            focusElements.add(v);
        });
        triggerFocusEvent('focusin', elements.reverse(), null, source || new ZetaEventSource(elements[0], path));
    }
    if (path === focusPath && !suppressFocus) {
        var activeElement = document.activeElement;
        if (path[0] !== activeElement) {
            path[0].focus();
            // ensure previously focused element is properly blurred
            // in case the new element is not focusable
            if (activeElement && activeElement !== document.body && activeElement !== root && document.activeElement === activeElement) {
                activeElement.blur();
            }
        }
    }
}

function setModal(element) {
    if (modalElements.has(element)) {
        return true;
    }
    if (!focusable(element)) {
        return false;
    }
    var from = focusPath.indexOf(element) + 1;
    var modalPath = focusPath.splice(from, focusPath.length - from - 1);
    modalElements.set(element, modalPath);
    if (!focused(element)) {
        var added = parentsAndSelf(element).filter(function (v) {
            return !focusElements.has(v);
        });
        setFocusUnsafe(added.slice(1), null, modalPath);
        setFocusUnsafe([element]);
    }
    setImmediateOnce(triggerModalChangeEvent);
    return true;
}

function releaseModal(element, modalPath) {
    modalPath = mapRemove(modalElements, element) || modalPath;
    if (!modalPath) {
        return;
    }
    if (focusPath.indexOf(element) >= 0) {
        var inner = any(modalPath, function (v) {
            return containsOrEquals(v, element);
        });
        if (inner && inner !== modalPath[0]) {
            // trigger focusout event for previously focused element
            // which focus is lost to modal element
            setFocus(inner, null, modalPath);
        }
        // find the index again as focusPath might be updated
        var index = focusPath.indexOf(element);
        focusPath.splice.apply(focusPath, [index + 1, 0].concat(modalPath));
        setFocus(focusPath[0]);
        cleanupFocusPath();
        setImmediateOnce(triggerModalChangeEvent);
    } else {
        each(modalElements, function (i, v) {
            var index = v.indexOf(element);
            if (index >= 0) {
                v.splice.apply(v, [0, index + 1].concat(modalPath));
                return false;
            }
        });
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
        var visited = new Set();
        return createIterator(function () {
            if (!returnedOnce || !element) {
                returnedOnce = true;
            } else {
                var friend = focusFriends.get(element);
                // make sure the next iterated element in connected in DOM and
                // not being the descendants of current element
                element = friend && !visited.has(friend) && containsOrEquals(root, friend) && !containsOrEquals(element, friend) ? friend : element.parentNode;
            }
            visited.add(element);
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
    var pressTimeout;
    var hasBeforeInput;
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
        var isKeyboardEvent = matchWord(type, 'keydown keyup keypress');
        var fireFocusReturn = matchWord(type, 'mousedown touchstart');
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
                    if (!isKeyboardEvent) {
                        e.preventDefault();
                    }
                    if (fireFocusReturn) {
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
            if (!imeNode || imeOffset[0] === null) {
                return;
            }
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
            if (!imeNode || imeOffset[0] === null) {
                return;
            }
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
            // in some case the node does not contain the final input text
            if (imeModifyOnUpdate && (prevOffset[0] + imeText.length !== afterOffset)) {
                afterNodeText = imeNodeText.slice(0, afterOffset) + imeText + imeNodeText.slice(afterOffset);
                afterOffset += imeText.length;
            }
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
            if (!hasCompositionUpdate && (e.data === imeText || (!hasBeforeInput && triggerUIEvent('textInput', e.data)))) {
                e.preventDefault();
            }
            hasBeforeInput = false;
        },
        keydown: function (e) {
            if (!imeNode) {
                var keyCode = e.keyCode;
                var isModifierKey = (META_KEYS.indexOf(keyCode) >= 0);
                var isSpecialKey = !isModifierKey && (KEYNAMES[keyCode] || '').length > 1 && !(keyCode >= 186 || keyCode === 32 || (keyCode >= 96 && keyCode <= 111));
                // @ts-ignore: boolean arithmetic
                modifierCount = e.ctrlKey + e.shiftKey + e.altKey + e.metaKey + !isModifierKey;
                // @ts-ignore: boolean arithmetic
                modifierCount *= isSpecialKey || ((modifierCount > 2 || (modifierCount > 1 && !e.shiftKey)) && !isModifierKey);
                modifiedKeyCode = keyCode;
                if (modifierCount) {
                    triggerKeystrokeEvent(getEventName(e, KEYNAMES[keyCode] || e.key), '');
                }
            }
        },
        keyup: function (e) {
            var isModifierKey = (META_KEYS.indexOf(e.keyCode) >= 0);
            if (!imeNode && (isModifierKey || modifiedKeyCode === e.keyCode)) {
                modifiedKeyCode = null;
                modifierCount--;
            }
            lastEventSource.sourceKeyName = null;
        },
        keypress: function (e) {
            if (!imeNode) {
                var data = e.char || e.key || String.fromCharCode(e.charCode);
                var keyName = getEventName(e, KEYNAMES[modifiedKeyCode] || data);
                lastEventSource.sourceKeyName = keyName;
                if (!modifierCount) {
                    triggerKeystrokeEvent(keyName, data);
                }
            }
        },
        beforeinput: function (e) {
            if (e.inputType !== 'insertCompositionText') {
                hasCompositionUpdate = false;
            }
            if (!imeNode && e.cancelable) {
                hasBeforeInput = true;
                switch (e.inputType) {
                    case 'insertText':
                        if (lastEventSource.sourceKeyName) {
                            return;
                        }
                    case 'insertFromPaste':
                    case 'insertFromDrop':
                        if (triggerUIEvent('textInput', e.data)) {
                            e.preventDefault();
                        }
                        return;
                    case 'deleteByCut':
                    case 'deleteContent':
                    case 'deleteContentBackward':
                        return triggerKeystrokeEvent('backspace', '');
                    case 'deleteContentForward':
                        return triggerKeystrokeEvent('delete', '');
                }
            }
        },
        touchstart: function (e) {
            mouseInitialPoint = extend({}, e.touches[0]);
            setFocus(e.target, null, null, true);
            triggerMouseEvent('touchstart');
            if (!e.touches[1]) {
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
                    if (line.length > 5) {
                        var swipeDir = approxMultipleOf(line.deg, 90) && (approxMultipleOf(line.deg, 180) ? (line.dx > 0 ? 'Right' : 'Left') : (line.dy > 0 ? 'Down' : 'Up'));
                        if (!swipeDir || !triggerGestureEvent('swipe' + swipeDir)) {
                            triggerMouseEvent('drag', mouseInitialPoint);
                        }
                        mouseInitialPoint = null;
                        return;
                    }
                } else if (!e.touches[2]) {
                    triggerGestureEvent('pinchZoom');
                }
            }
        },
        touchend: function (e) {
            clearTimeout(pressTimeout);
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
        bind(root, i, handleUIEventWrapper(i, v), { capture: true, passive: false });
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

    bind(window, 'wheel', function (e) {
        if (currentMetaKey) {
            return;
        }
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
        if (!focusable(cur === root ? document.body : cur)) {
            e.preventDefault();
        }
    }, { passive: false });

    bind(window, 'blur', function (e) {
        if (e.target === window) {
            windowFocusedOut = true;
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
    return !!setFocus(element);
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
    subscribeAsync,
    notifyAsync,
    preventLeave,

    observe,
    registerCleanup,
    createAutoCleanupMap,
    afterDetached,
    watchElements,
    watchAttributes,
    watchOwnAttributes
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
