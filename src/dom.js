import { } from "./libCheck.js";
import { IS_MAC, window, document, root, getSelection, getComputedStyle, domReady } from "./env.js";
import { KEYNAMES } from "./constants.js";
import * as ErrorCode from "./errorCode.js";
import $ from "./include/jquery.js";
import { always, any, combineFn, each, errorWithCode, extend, fill, grep, isFunction, isPlainObject, isUndefinedOrNull, keys, lcfirst, makeArray, map, mapRemove, matchWord, noop, reject, setAdd, setImmediate, setImmediateOnce, setTimeoutOnce, ucfirst } from "./util.js";
import { bind, bindUntil, containsOrEquals, elementFromPoint, getContentRect, getScrollParent, isVisible, makeSelection, matchSelector, parentsAndSelf, scrollIntoView, tagName, toPlainRect } from "./domUtil.js";
import { getEventContext, getEventSource, emitDOMEvent, listenDOMEvent } from "./events.js";
import { lock, cancelLock, locked, notifyAsync, preventLeave, subscribeAsync } from "./domLock.js";
import { afterDetached, createAutoCleanupMap, observe, registerCleanup, watchAttributes, watchElements, watchOwnAttributes } from "./observe.js";

const SELECTOR_FOCUSABLE = 'input,select,button,textarea,[contenteditable],a[href],area[href],iframe';

const focusPath = [root];
const focusFriends = new WeakMap();
const focusElements = new Set([root]);
const modalElements = createAutoCleanupMap(releaseModal);
const tabIndex = new WeakMap();
const tabRoots = new WeakSet();
const shortcuts = {};
const metaKeys = {
    alt: true,
    ctrl: true,
    meta: true,
    shift: true
};
const beforeInputType = {
    insertFromDrop: 'drop',
    insertFromPaste: 'paste',
    deleteByCut: 'cut'
};
const sourceDict = {
    cut: 'cut',
    copy: 'copy',
    drop: 'drop',
    paste: 'paste',
    wheel: 'mouse'
};

var windowFocusedOut;
var currentEvent = null;
var currentKeyName = '';
var currentMetaKey = '';
var currentTabRoot = root;
var eventSource;
var trustedEvent;
var trackPromise;
var trackCallbacks;
var touchedClick;

fill(sourceDict, 'touchstart touchend touchmove', 'touch');
fill(sourceDict, 'compositionstart compositionupdate compositionend keydown keyup keypress', 'keyboard');
fill(sourceDict, 'beforeinput input textInput', function (e) {
    return beforeInputType[e.inputType] || eventSource || 'input';
});
fill(sourceDict, 'pointerdown', function (e) {
    touchedClick = e.pointerType !== 'mouse';
    return touchedClick ? 'touch' : 'mouse';
});
fill(sourceDict, 'mousedown mouseup mousemove click contextmenu dblclick', function (e) {
    return touchedClick ? 'touch' : e.type !== 'mousemove' || e.button || e.buttons ? 'mouse' : 'script';
});

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
    if (v.disabled || v.readOnly) {
        return false;
    }
    if (v.isContentEditable) {
        return true;
    }
    if (tagName(v) === 'input') {
        return !matchWord(v.type, 'button checkbox color file image radio range reset submit');
    }
    return matchSelector(v, 'textarea,select');
}

function isMouseDown(e) {
    return (isUndefinedOrNull(e.buttons) ? e.which : e.buttons) === 1;
}

function normalizeKey(e) {
    var key = KEYNAMES[e.code || e.keyCode];
    return {
        key: key || lcfirst(e.code) || e.key,
        char: e.char || ((e.key || '').length === 1 && e.key) || (e.charCode && String.fromCharCode(e.charCode)) || (key === 'enter' ? '\r' : ''),
        meta: !!metaKeys[key]
    };
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

function inputValueImpl(element, method, value) {
    // React defines its own getter and setter on input elements
    var desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');
    if (desc && desc[method]) {
        return desc[method].call(element, value);
    }
    return method === 'get' ? element.value : (element.value = value);
}

function setTextData(node, text, offset) {
    if (node.tagName) {
        inputValueImpl(node, 'set', text);
        node.setSelectionRange(offset, offset);
    } else {
        var range = document.createRange();
        node.data = text;
        range.setStart(node, offset);
        makeSelection(range);
    }
}

function dispatchInputEvent(element, text) {
    element.dispatchEvent(new InputEvent('input', {
        inputType: text ? 'insertText' : 'deleteContent',
        data: text || null,
        bubbles: true
    }));
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

function updateTabRoot() {
    var tabRoot = any(focusPath, function (v) {
        return tabRoots.has(v);
    }) || getModalElement() || root;
    if (tabRoot !== currentTabRoot) {
        currentTabRoot = tabRoot;
        updateTabIndex();
    }
}

function updateTabIndex(newNodes) {
    $(newNodes || SELECTOR_FOCUSABLE).each(function (i, v) {
        if (!containsOrEquals(currentTabRoot, v)) {
            if (v.tabIndex !== -1) {
                tabIndex.set(v, $(v).attr('tabindex') || null);
                v.tabIndex = -1;
            }
        } else if (tabIndex.has(v)) {
            $(v).attr('tabindex', mapRemove(tabIndex, v));
        }
    });
}

function setFocus(element, source, suppressFocusChange) {
    if (element === root) {
        element = document.body;
    }
    var len = focusPath.length;
    var index = focusPath.indexOf(element);
    if (index === 0) {
        setFocusUnsafe(focusPath, [], source);
        return len;
    }
    if (index > 0) {
        removeFocusUnsafe(focusPath, element, source, element);
        len = len - index;
    } else {
        var added = [];
        var friend;
        any(parentsAndSelf(element), function (v) {
            return focusPath.indexOf(v) >= 0 || (added.push(v) && (friend = focusFriends.get(v)));
        });
        if (friend && added.indexOf(friend) < 0 && focusPath.indexOf(friend) < 0) {
            len = setFocus(friend, source, true);
        }
        var within = focusable(element);
        if (within) {
            removeFocusUnsafe(focusPath, within, source, element, true);
            len = Math.min(len, focusPath.length);
            // check whether the element is still attached in ROM
            // which can be detached while dispatching focusout event above
            if (containsOrEquals(root, element)) {
                each(added, function (i, element) {
                    if (focusElements.has(element) && focusPath.indexOf(element) < 0) {
                        any(modalElements, function (v) {
                            return removeFocusUnsafe(v, element, source, element, true) && v.shift();
                        });
                    }
                });
            } else {
                added = [];
            }
            setFocusUnsafe(focusPath, added, source);
        }
    }
    if (!suppressFocusChange) {
        triggerFocusEvent('focuschange', focusPath.slice(-len), null, source);
    }
    return len;
}

function setFocusUnsafe(path, elements, source, suppressFocus) {
    if (elements[0]) {
        path.unshift.apply(path, elements);
        elements = grep(elements, function (v) {
            return setAdd(focusElements, v);
        });
    }
    if (path === focusPath && !suppressFocus) {
        var activeElement = any(focusPath, function (v) {
            return matchSelector(v, SELECTOR_FOCUSABLE);
        });
        if (activeElement) {
            activeElement.focus();
        } else {
            document.activeElement.blur();
        }
        setTimeoutOnce(updateTabRoot);
    }
    triggerFocusEvent('focusin', elements.reverse(), null, source);
}

function removeFocusUnsafe(path, element, source, relatedTarget, suppressFocus) {
    var index = path.indexOf(element);
    if (index > 0) {
        var removed = path.splice(0, index);
        each(removed, function (i, v) {
            focusElements.delete(v);
        });
        triggerFocusEvent('focusout', removed, relatedTarget, source);
        setFocusUnsafe(path, [], source, suppressFocus);
    }
    return index >= 0;
}

function setModal(element) {
    if (modalElements.has(element)) {
        return true;
    }
    if (element === root || element === document.body || (element.parentNode !== document.body && !focusable(element))) {
        return false;
    }
    var from = focusPath.indexOf(element) + 1;
    var modalPath = focusPath.splice(from, focusPath.length - from - 1);
    modalElements.set(element, modalPath);
    if (!focused(element)) {
        var added = parentsAndSelf(element).filter(function (v) {
            return !focusElements.has(v);
        });
        setFocusUnsafe(modalPath, added.slice(1));
        setFocusUnsafe(focusPath, [element]);
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
            removeFocusUnsafe(modalPath, inner);
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

function setTabRoot(a) {
    if (a !== root && a !== document.body && setAdd(tabRoots, a)) {
        setTimeoutOnce(updateTabRoot);
    }
}

function unsetTabRoot(a) {
    if (tabRoots.delete(a)) {
        setTimeoutOnce(updateTabRoot);
    }
}

function retainFocus(a, b) {
    if (a !== root && a !== document.body) {
        focusFriends.set(b, a);
    }
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
    var target = currentEvent.target;
    var lastPoint = currentEvent;
    var scrollWithin = grep(focusPath, function (v) {
        return containsOrEquals(v, target);
    }).slice(-1)[0];
    var scrollParent = getScrollParent(target);
    var scrollTimeout;
    var resolve, reject;

    trackCallbacks = callback ? [callback] : [];
    trackPromise = new Promise(function (res, rej) {
        resolve = res.bind(0, undefined);
        reject = rej;
    });
    callback = combineFn(trackCallbacks);
    if (root.setCapture) {
        root.setCapture();
    }

    var stopScroll = function () {
        cancelAnimationFrame(scrollTimeout);
        scrollTimeout = null;
    };
    var startScroll = function () {
        var last;
        scrollTimeout = scrollTimeout || requestAnimationFrame(function next(ts) {
            if (last) {
                var f = ((ts - last) / 16) - 1;
                var x = lastPoint.clientX;
                var y = lastPoint.clientY;
                var r = getContentRect(scrollParent);
                var dx = Math.max(x - r.right + 5, 0) || Math.min(x - r.left - 5, 0);
                var dy = Math.max(y - r.bottom + 5, 0) || Math.min(y - r.top - 5, 0);
                if ((!dx && !dy) || !scrollIntoView(target, toPlainRect(x + dx * f, y + dy * f).expand(5), scrollWithin, 'instant')) {
                    scrollTimeout = null;
                    return;
                }
                callback(lastPoint);
            }
            last = ts;
            scrollTimeout = requestAnimationFrame(next);
        });
    };
    bindUntil(trackPromise, root, {
        mouseup: resolve,
        touchend: resolve,
        keydown: function (e) {
            if (normalizeKey(e).key === 'escape') {
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

function insertText(element, text, startOffset, endOffset) {
    if (isUndefinedOrNull(element.selectionStart)) {
        throw errorWithCode(ErrorCode.invalidOperation);
    }
    var prevText = inputValueImpl(element, 'get');
    var maxLength = element.maxLength;
    if (startOffset === undefined) {
        startOffset = element.selectionStart;
        endOffset = element.selectionEnd;
    } else {
        startOffset = Math.max(0, Math.min(startOffset, prevText.length));
        endOffset = Math.max(startOffset, endOffset || startOffset);
    }
    if (maxLength >= 0) {
        text = text.slice(0, Math.max(0, maxLength - prevText.length + endOffset - startOffset));
    }
    if (text || startOffset !== endOffset) {
        var newtext = prevText.slice(0, startOffset) + text + prevText.slice(endOffset);
        setTextData(element, newtext, startOffset + text.length);
        dispatchInputEvent(element, text);
        return true;
    }
    return false;
}

domReady.then(function () {
    var eventTimeout;
    var modifierCount;
    var modifiedKeyCode;
    var mouseInitialPoint;
    var preventClick;
    var pressTimeout;
    var hasBeforeInput;
    var hasCompositionUpdate;
    var imeModifyOnUpdate;
    var imeNodeText;
    var imeNode;
    var imeOffset;
    var imeText;

    function getEventSource(e) {
        var value = sourceDict[e.type];
        return value && (typeof value === 'string' ? value : value(e));
    }

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
            imeOffset = [element.selectionStart, element.selectionEnd];
            imeNodeText = inputValueImpl(element, 'get');
        } else {
            imeNode = selection.anchorNode;
            imeOffset = [selection.focusOffset, selection.anchorOffset];
            if (imeNode && imeNode.nodeType === 1) {
                // IE puts selection at element level
                // however it will insert text in the previous text node
                var child = imeNode.childNodes[imeOffset[1] - 1];
                if (child && child.nodeType === 3) {
                    imeNode = child;
                    imeOffset = [child.length, child.length];
                } else {
                    imeNode = imeNode.childNodes[imeOffset[1]];
                    imeOffset = [0, 0];
                }
            }
            imeNodeText = imeNode.data || '';
        }
    }

    function triggerUIEvent(eventName, data, preventNative, point, target) {
        var originalEvent = currentEvent;
        var handled = emitDOMEvent(eventName, target || getActiveElement(), data, {
            clientX: (point || '').clientX,
            clientY: (point || '').clientY,
            bubbles: true,
            originalEvent: originalEvent
        });
        if (handled && preventNative) {
            originalEvent.preventDefault();
        }
        return handled;
    }

    function triggerKeystrokeEvent(keyName, char) {
        var data = {
            data: keyName,
            char: char
        };
        return triggerUIEvent('keystroke', data, true);
    }

    function triggerMouseEvent(eventName, event) {
        event = event || currentEvent;
        var target = event.target;
        var data = {
            target: target,
            metakey: getEventName(event) || ''
        };
        return focusable(target) && triggerUIEvent(eventName, data, true, event, target);
    }

    function triggerGestureEvent(gesture) {
        var target = mouseInitialPoint.target;
        return focusable(target) && triggerUIEvent('gesture', gesture, true, null, target);
    }

    function handleUIEventWrapper(type, callback) {
        var isMoveEvent = matchWord(type, 'mousemove touchmove');
        var isKeyboardEvent = matchWord(type, 'keydown keyup keypress');
        var fireFocusReturn = matchWord(type, 'mousedown touchstart');
        return function (e) {
            currentEvent = e;
            if (e.isTrusted !== false) {
                clearTimeout(eventTimeout);
                trustedEvent = e;
                eventSource = getEventSource(e);
                eventTimeout = setTimeout(function () {
                    eventSource = '';
                }, 20);
            }
            setImmediate(function () {
                currentEvent = currentEvent === e ? null : currentEvent;
                trustedEvent = trustedEvent === e ? null : trustedEvent;
            });
            if ('ctrlKey' in e) {
                var metaKey = getEventName(e, '');
                if (metaKey !== currentMetaKey) {
                    currentMetaKey = metaKey;
                    triggerUIEvent('metakeychange', metaKey, false);
                }
            }
            if (!isMoveEvent && !focusable(e.target)) {
                e.stopImmediatePropagation();
                if (!isKeyboardEvent) {
                    e.preventDefault();
                }
                if (fireFocusReturn) {
                    emitDOMEvent('focusreturn', focusPath.slice(-2)[0]);
                }
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
                triggerUIEvent('textInput', '', false);
            }
            imeText = e.data || '';
            hasCompositionUpdate = true;
        },
        compositionend: function (e) {
            if (!imeNode || imeOffset[0] === null) {
                return;
            }
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
            if ((!hasCompositionUpdate || imeModifyOnUpdate) && (prevOffset[0] + imeText.length !== afterOffset)) {
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
            hasCompositionUpdate = false;

            setTextData(imeNode, prevNodeText, startOffset);
            if (!triggerUIEvent('textInput', imeText, false)) {
                setTextData(imeNode, afterNodeText, afterOffset);
                dispatchInputEvent(e.target, imeText);
            }
            imeNode = null;
            setTimeout(function () {
                imeText = null;
            });
        },
        textInput: function (e) {
            // required for older mobile browsers that do not support beforeinput event
            // ignore in case browser fire textInput before/after compositionend
            if (!hasCompositionUpdate && (e.data === imeText || (!hasBeforeInput && triggerUIEvent('textInput', e.data, true)))) {
                e.preventDefault();
            }
            hasBeforeInput = false;
        },
        keydown: function (e) {
            var data = normalizeKey(e);
            modifierCount = e.ctrlKey + e.shiftKey + e.altKey + e.metaKey + !data.meta;
            modifierCount *= !data.meta && (!data.char || modifierCount > 2 || (modifierCount > 1 && !e.shiftKey));
            modifiedKeyCode = data.meta ? modifiedKeyCode : data.key;
            currentKeyName = getEventName(e, modifiedKeyCode);
            if (!imeNode && modifierCount) {
                triggerKeystrokeEvent(currentKeyName, '');
            }
        },
        keyup: function (e) {
            var data = normalizeKey(e);
            if (modifiedKeyCode === data.key) {
                modifiedKeyCode = null;
            }
            currentKeyName = getEventName(e, modifiedKeyCode || '');
        },
        keypress: function (e) {
            var data = normalizeKey(e).char;
            currentKeyName = getEventName(e, modifiedKeyCode || data);
            if (!imeNode && !modifierCount) {
                triggerKeystrokeEvent(currentKeyName, data);
            }
        },
        beforeinput: function (e) {
            if (e.inputType !== 'insertCompositionText') {
                hasCompositionUpdate = false;
            }
            if (!imeNode && e.cancelable) {
                hasBeforeInput = true;
                if (!currentKeyName || beforeInputType[e.inputType]) {
                    switch (e.inputType) {
                        case 'insertText':
                        case 'insertFromPaste':
                        case 'insertFromDrop':
                            return triggerUIEvent('textInput', e.data, true);
                        case 'deleteByCut':
                        case 'deleteContent':
                        case 'deleteContentBackward':
                            return triggerKeystrokeEvent('backspace', '');
                        case 'deleteContentForward':
                            return triggerKeystrokeEvent('delete', '');
                    }
                }
            }
        },
        input: function (e) {
            if (hasCompositionUpdate) {
                updateIMEState();
                imeModifyOnUpdate = true;
                imeOffset[0] = imeOffset[1] - imeText.length;
            } else if (e.inputType) {
                triggerUIEvent('input');
            }
        },
        touchstart: function (e) {
            mouseInitialPoint = extend({}, e.touches[0]);
            triggerMouseEvent('touchstart', mouseInitialPoint);
            if (!e.touches[1]) {
                pressTimeout = setTimeout(function () {
                    triggerMouseEvent('longPress', mouseInitialPoint);
                    mouseInitialPoint = null;
                }, 1000);
            }
        },
        touchmove: function (e) {
            clearTimeout(pressTimeout);
            if (mouseInitialPoint) {
                if (!e.touches[1]) {
                    var line = measureLine(e.touches[0], mouseInitialPoint);
                    if (line.length > 5) {
                        var swipeDir = approxMultipleOf(line.deg, 90) && (approxMultipleOf(line.deg, 180) ? (line.dx > 0 ? 'Right' : 'Left') : (line.dy > 0 ? 'Down' : 'Up'));
                        if (!swipeDir || !triggerGestureEvent('swipe' + swipeDir)) {
                            triggerMouseEvent('drag', mouseInitialPoint);
                        }
                        mouseInitialPoint = null;
                    }
                } else if (!e.touches[2]) {
                    triggerGestureEvent('pinchZoom');
                    mouseInitialPoint = null;
                }
            }
        },
        touchend: function (e) {
            clearTimeout(pressTimeout);
        },
        mousedown: function (e) {
            mouseInitialPoint = e;
            preventClick = false;
            if (isMouseDown(e)) {
                triggerMouseEvent('mousedown');
            }
        },
        mousemove: function (e) {
            if (mouseInitialPoint && measureLine(e, mouseInitialPoint).length > 5) {
                var target = mouseInitialPoint.target;
                if (isMouseDown(e) && containsOrEquals(target, elementFromPoint(mouseInitialPoint.clientX, mouseInitialPoint.clientY))) {
                    triggerMouseEvent('drag', mouseInitialPoint);
                }
                mouseInitialPoint = null;
                preventClick = true;
            }
        },
        wheel: function (e) {
            var dir = e.deltaY || e.deltaX || e.detail;
            if (dir && !textInputAllowed(e.target) && triggerUIEvent('mousewheel', dir / Math.abs(dir) * (IS_MAC ? -1 : 1), false, e, e.target)) {
                e.stopPropagation();
            }
        },
        click: function (e) {
            if (!preventClick) {
                if (e.isTrusted !== false) {
                    setFocus(e.target);
                }
                triggerMouseEvent(getEventName(e, 'click'));
            }
            preventClick = false;
        },
        contextmenu: function (e) {
            triggerMouseEvent('rightClick');
        },
        dblclick: function (e) {
            triggerMouseEvent('dblclick');
        }
    };
    // required for setup event source by event wrapper
    fill(uiEvents, 'drop cut copy paste pointerdown mouseup', noop);

    each(uiEvents, function (i, v) {
        bind(root, i, handleUIEventWrapper(i, v), { capture: true, passive: false });
    });

    bind(root, {
        focusin: function (e) {
            var target = e.target;
            windowFocusedOut = false;
            if (!focusable(target)) {
                target.blur();
            } else {
                if (focusPath.indexOf(target) < 0) {
                    setFocus(target);
                }
                scrollIntoView(target, 10);
            }
        },
        focusout: function (e) {
            imeNode = null;
            hasCompositionUpdate = false;
            if (!e.relatedTarget) {
                if (!isVisible(e.target)) {
                    // browser set focus to body if the focused element is no longer visible
                    // which is not a desirable behavior in many cases
                    // find the first visible element in focusPath to focus
                    var cur = any(focusPath.slice(focusPath.indexOf(e.target) + 1), isVisible);
                    if (cur) {
                        setFocus(cur);
                    }
                } else if (!currentEvent) {
                    setTimeout(function () {
                        if (!windowFocusedOut && focusPath[0] === e.target) {
                            setFocus(e.target.parentNode);
                        }
                    });
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
        for (var cur = e.target; cur && cur !== root; cur = cur.parentNode) {
            var style = getComputedStyle(cur);
            if (cur.scrollWidth > cur.offsetWidth && matchWord(style.overflowX, 'auto scroll') && ((deltaX > 0 && cur.scrollLeft > 0) || (deltaX < 0 && cur.scrollLeft + cur.offsetWidth < cur.scrollWidth))) {
                break;
            }
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
            currentKeyName = '';
            modifiedKeyCode = '';
        }
    });

    listenDOMEvent('escape', function () {
        setFocus(getModalElement() || document.body);
    });
    setFocus(document.activeElement);
    watchElements(root, SELECTOR_FOCUSABLE, updateTabIndex);
});

setShortcut({
    undo: 'ctrlZ',
    redo: 'ctrlY ctrlShiftZ',
    selectAll: 'ctrlA'
});

/* --------------------------------------
 * Exports
 * -------------------------------------- */

function focus(element, focusInput) {
    if (focusInput !== false && !matchSelector(element, SELECTOR_FOCUSABLE)) {
        element = $(SELECTOR_FOCUSABLE, element).filter(':visible:not(:disabled,.disabled)')[0] || element;
    }
    setFocus(element);
    return focusPath[0] === element;
}

function blur(element) {
    setFocus(focusPath[focusPath.indexOf(element) + 1]);
    return !focusElements.has(element);
}

export default {
    get event() {
        return currentEvent;
    },
    get metaKey() {
        return currentMetaKey;
    },
    get pressedKey() {
        return currentKeyName;
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
        return trustedEvent ? eventSource : 'script';
    },
    get eventSourcePath() {
        return !trustedEvent || eventSource === 'keyboard' ? this.focusedElements : grep(parentsAndSelf(trustedEvent.target), focusable);
    },
    root,
    ready: domReady,

    textInputAllowed,
    focusable,
    focused,
    setTabRoot,
    unsetTabRoot,
    setModal,
    releaseModal,
    retainFocus,
    releaseFocus,
    iterateFocusPath,
    focus,
    blur,
    beginDrag,
    beginPinchZoom,
    insertText,
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
    insertText,
    getShortcut,
    setShortcut,
    focusable,
    focused,
    setTabRoot,
    unsetTabRoot,
    setModal,
    releaseModal,
    retainFocus,
    releaseFocus,
    iterateFocusPath,
    focus,
    blur
}
