import { IS_IE10, IS_MAC, IS_TOUCH } from "./env.js";
import { Map, Set, WeakMap, Promise, $ } from "./shim.js";
import { any, each, extend, lcfirst, makeArray, map, mapRemove, matchWord, single, ucfirst } from "./util.js";
import { bind, containsOrEquals, dispatchDOMMouseEvent, getRect, is, isVisible, makeSelection, parentsAndSelf, removeNode, scrollBy, selectIncludeSelf } from "./domUtil.js";
import { ZetaEventSource, lastEventSource, getContainer, setLastEventSource, getEventSource, emitDOMEvent, listenDOMEvent } from "./events.js";
import { lock, cancelLock, locked, removeLock } from "./domLock.js";

const KEYNAMES = JSON.parse('{"8":"backspace","9":"tab","13":"enter","16":"shift","17":"ctrl","18":"alt","19":"pause","20":"capsLock","27":"escape","32":"space","33":"pageUp","34":"pageDown","35":"end","36":"home","37":"leftArrow","38":"upArrow","39":"rightArrow","40":"downArrow","45":"insert","46":"delete","48":"0","49":"1","50":"2","51":"3","52":"4","53":"5","54":"6","55":"7","56":"8","57":"9","65":"a","66":"b","67":"c","68":"d","69":"e","70":"f","71":"g","72":"h","73":"i","74":"j","75":"k","76":"l","77":"m","78":"n","79":"o","80":"p","81":"q","82":"r","83":"s","84":"t","85":"u","86":"v","87":"w","88":"x","89":"y","90":"z","91":"leftWindow","92":"rightWindowKey","93":"select","96":"numpad0","97":"numpad1","98":"numpad2","99":"numpad3","100":"numpad4","101":"numpad5","102":"numpad6","103":"numpad7","104":"numpad8","105":"numpad9","106":"multiply","107":"add","109":"subtract","110":"decimalPoint","111":"divide","112":"f1","113":"f2","114":"f3","115":"f4","116":"f5","117":"f6","118":"f7","119":"f8","120":"f9","121":"f10","122":"f11","123":"f12","144":"numLock","145":"scrollLock","186":"semiColon","187":"equalSign","188":"comma","189":"dash","190":"period","191":"forwardSlash","192":"backtick","219":"openBracket","220":"backSlash","221":"closeBracket","222":"singleQuote"}');
const SELECTOR_FOCUSABLE = ':input, [contenteditable], a[href], area[href], iframe';
const META_KEYS = [16, 17, 18, 91, 93];
const OFFSET_ZERO = {
    x: 0,
    y: 0
};

const root = document.documentElement;
const selection = window.getSelection();
const focusPath = [];
const focusFriends = new WeakMap();
const focusElements = new Set();
const modalElements = new Map();
const domReady = new Promise($);

var windowFocusedOut;
var currentEvent;
var scrollbarWidth;


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
    return v.isContentEditable || is(v, 'input,textarea,select');
}

function getScrollParent(element) {
    for (var s; element !== root && (s = getComputedStyle(element)) && s.overflow === 'visible' && matchWord(s.position, 'static relative'); element = element.parentNode);
    return element;
}

function getUnobscuredRect(element) {
    var style = getComputedStyle(element);
    var hasOverflowX = element.offsetWidth < element.scrollWidth;
    var hasOverflowY = element.offsetHeight < element.scrollHeight;
    var parentRect = getRect(element === document.body ? root : element);
    if ((style.overflow !== 'visible' || element === document.body) && (hasOverflowX || hasOverflowY)) {
        if (style.overflowY === 'scroll' || ((style.overflowY !== 'hidden' || element === document.body) && hasOverflowY)) {
            parentRect.right -= scrollbarWidth;
        }
        if (style.overflowX === 'scroll' || ((style.overflowX !== 'hidden' || element === document.body) && hasOverflowX)) {
            parentRect.bottom -= scrollbarWidth;
        }
    }
    return parentRect;
}

function scrollIntoView(element, rect) {
    var parent = getScrollParent(element);
    var parentRect = getUnobscuredRect(parent);
    rect = rect || getRect(element);

    var deltaX = Math.max(0, rect.right - parentRect.right) || Math.min(rect.left - parentRect.left, 0);
    var deltaY = Math.max(0, rect.bottom - parentRect.bottom) || Math.min(rect.top - parentRect.top, 0);
    var result = (deltaX || deltaY) && scrollBy(parent, deltaX, deltaY) || OFFSET_ZERO;
    if (parent !== root) {
        var parentResult = scrollIntoView(parent.parentNode, rect.translate(result.x, result.y));
        if (parentResult) {
            result = {
                x: result.x + parentResult.x,
                y: result.y + parentResult.y
            };
        }
    }
    return (result.x || result.y) ? result : false;
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
    each(elements, function (i, v) {
        if (getContainer(v, true)) {
            emitDOMEvent(eventName, null, v, {
                relatedTarget: relatedTarget
            }, false, source);
        }
    });
}

function setFocus(element, focusOnInput, source, path) {
    if (focusOnInput && !is(element, SELECTOR_FOCUSABLE)) {
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
            triggerFocusEvent('focusin', added, null, source || new ZetaEventSource(added[0], path));
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
 * Observe
 * -------------------------------------- */

function watchElements(element, selector, callback) {
    var collection = new Set();
    var observer = new MutationObserver(function (records) {
        var removedNodes = map(records, function (v) {
            return selectIncludeSelf(selector, v.removedNodes);
        });
        var addedNodes = map(records, function (v) {
            return selectIncludeSelf(selector, v.addedNodes);
        });
        addedNodes = addedNodes.filter(function (v) {
            return containsOrEquals(element, v) && !collection.has(v);
        });
        removedNodes = removedNodes.filter(function (v) {
            return !containsOrEquals(element, v);
        });
        addedNodes.forEach(collection.add.bind(collection));
        removedNodes.forEach(collection.delete.bind(collection));
        callback(addedNodes, removedNodes);
    });
    observer.observe(element, {
        subtree: true,
        childList: true
    });
}

/* --------------------------------------
 * DOM event handling
 * -------------------------------------- */


domReady.then(function () {
    var body = document.body;
    var modifierCount;
    var modifiedKeyCode;
    var mouseInitialPoint;
    var mousedownFocus;
    var pressTimeout;
    var imeNode;
    var imeOffset;
    var imeText;
    
    // detect native scrollbar size
    // height being picked because scrollbar may not be shown if container is too short
    var dummy = $('<div style="overflow:scroll;height:80px"><div style="height:100px"></div></div>').appendTo(body)[0];
    scrollbarWidth = getRect(dummy).width - getRect(dummy.children[0]).width;
    removeNode(dummy);

    function getEventName(e, suffix) {
        var mod = ((e.ctrlKey || e.metaKey) ? 'Ctrl' : '') + (e.altKey ? 'Alt' : '') + (e.shiftKey ? 'Shift' : '');
        return mod ? lcfirst(mod + ucfirst(suffix)) : suffix;
    }

    function updateIMEState() {
        var element = document.activeElement || root;
        if ('selectionEnd' in element) {
            imeNode = element;
            // @ts-ignore: guranteed having selectionEnd property
            imeOffset = element.selectionEnd;
        } else {
            // @ts-ignore: selection is not null
            imeNode = selection.anchorNode;
            // @ts-ignore: selection is not null
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

    function triggerUIEvent(eventName, nativeEvent, elements, data, bubbles) {
        var prev = null;
        return any(makeArray(elements), function (v) {
            var container = getContainer(v);
            if (prev !== container) {
                prev = container;
                if (emitDOMEvent(eventName, nativeEvent, v, data, bubbles)) {
                    return true;
                }
                if (data.char && textInputAllowed(v)) {
                    return emitDOMEvent('textInput', nativeEvent, v, data.char, true);
                }
            }
        });
    }

    function triggerKeystrokeEvent(keyName, char, nativeEvent) {
        var data = {
            data: keyName,
            char: char
        };
        lastEventSource.sourceKeyName = keyName;
        if (triggerUIEvent('keystroke', nativeEvent, focusPath, data, true)) {
            nativeEvent.preventDefault();
            return true;
        }
    }

    function triggerMouseEvent(eventName, nativeEvent) {
        var point = mouseInitialPoint || nativeEvent;
        return emitDOMEvent(eventName, nativeEvent, nativeEvent.target, {
            target: nativeEvent.target,
            clientX: point.clientX,
            clientY: point.clientY,
            metakey: getEventName(nativeEvent)
        });
    }

    function triggerGestureEvent(gesture, nativeEvent) {
        mouseInitialPoint = null;
        return triggerUIEvent('gesture', nativeEvent, focusPath.slice(-1), gesture);
    }

    function unmount(mutations) {
        // automatically free resources when DOM nodes are removed from document
        each(mutations, function (i, v) {
            each(v.removedNodes, function (i, v) {
                if (v.nodeType === 1 && !containsOrEquals(root, v)) {
                    var container = getContainer(v, true);
                    if (container && container.autoDestroy && container.element === v) {
                        container.destroy();
                    }
                    removeLock(v);
                    var modalPath = mapRemove(modalElements, v);
                    if (modalPath && focused(v)) {
                        var path = any(modalElements, function (w) {
                            return w.indexOf(v) >= 0;
                        }) || focusPath;
                        path.push.apply(path, modalPath);
                        setFocus(modalPath[0], false, null, path);
                    }
                    var index = focusPath.indexOf(v);
                    if (index >= 0) {
                        setFocus(focusPath[index + 1] || body);
                    }
                }
            });
        });
    }

    if (IS_IE10) {
        // polyfill for pointer-events: none for IE10
        bind(body, 'mousedown mouseup mousemove mouseenter mouseleave click dblclick contextmenu wheel', function (e) {
            // @ts-ignore: e.target is Element
            if (getComputedStyle(e.target).pointerEvents === 'none') {
                e.stopPropagation();
                e.stopImmediatePropagation();
                // @ts-ignore: e.target is Element
                if (!e.bubbles || !dispatchDOMMouseEvent(e.type, e, e)) {
                    e.preventDefault();
                }
            }
        }, true);
    }

    bind(window, 'mousedown mouseup wheel compositionstart compositionend beforeinput textInput keydown keyup keypress touchstart touchend cut copy paste drop click dblclick contextmenu', function (e) {
        currentEvent = e;
        setTimeout(function () {
            currentEvent = null;
        });
        setLastEventSource(null);
        if (!focusable(e.target)) {
            e.stopImmediatePropagation();
            e.preventDefault();
            if (matchWord(e.type, 'touchstart mousedown keydown')) {
                emitDOMEvent('focusreturn', null, focusPath.slice(-1)[0]);
            }
        }
        setLastEventSource(e.target);
    }, true);

    bind(root, {
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
            if (!triggerUIEvent('textInput', e, focusPath[0], imeText)) {
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
            if (!imeNode && (e.data === imeText || triggerUIEvent('textInput', e, focusPath[0], e.data))) {
                e.preventDefault();
            }
        },
        keydown: function (e) {
            if (!imeNode) {
                var keyCode = e.keyCode;
                var isModifierKey = (META_KEYS.indexOf(keyCode) >= 0);
                if (isModifierKey && keyCode !== modifiedKeyCode) {
                    triggerUIEvent('metakeychange', e, focusPath, getEventName(e), true);
                }
                var isSpecialKey = !isModifierKey && (KEYNAMES[keyCode] || '').length > 1 && !(keyCode >= 186 || (keyCode >= 96 && keyCode <= 111));
                // @ts-ignore: boolean arithmetic
                modifierCount = e.ctrlKey + e.shiftKey + e.altKey + e.metaKey + !isModifierKey;
                // @ts-ignore: boolean arithmetic
                modifierCount *= isSpecialKey || ((modifierCount > 2 || (modifierCount > 1 && !e.shiftKey)) && !isModifierKey);
                modifiedKeyCode = keyCode;
                if (modifierCount) {
                    triggerKeystrokeEvent(getEventName(e, KEYNAMES[keyCode] || e.key), keyCode === 32 ? ' ' : '', e);
                }
            }
        },
        keyup: function (e) {
            var isModifierKey = (META_KEYS.indexOf(e.keyCode) >= 0);
            if (!imeNode && (isModifierKey || modifiedKeyCode === e.keyCode)) {
                modifiedKeyCode = null;
                modifierCount--;
                if (isModifierKey) {
                    triggerUIEvent('metakeychange', e, focusPath, getEventName(e) || '', true);
                }
            }
        },
        keypress: function (e) {
            var data = e.char || e.key || String.fromCharCode(e.charCode);
            // @ts-ignore: non-standard member
            if (!imeNode && !modifierCount && (e.synthetic || !('onbeforeinput' in e.target))) {
                triggerKeystrokeEvent(getEventName(e, KEYNAMES[modifiedKeyCode] || data), data, e);
            }
        },
        beforeinput: function (e) {
            if (!imeNode && e.cancelable) {
                switch (e.inputType) {
                    case 'insertText':
                        return triggerUIEvent('textInput', e, focusPath[0], e.data);
                    case 'deleteContent':
                    case 'deleteContentBackward':
                        return triggerKeystrokeEvent('backspace', '', e);
                    case 'deleteContentForward':
                        return triggerKeystrokeEvent('delete', '', e);
                }
            }
        },
        touchstart: function (e) {
            mouseInitialPoint = extend({}, e.touches[0]);
            if (!e.touches[1]) {
                // @ts-ignore: e.target is Element
                if (focused(getContainer(e.target).element)) {
                    triggerMouseEvent('mousedown', e);
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
                    if (line.length > 50 && approxMultipleOf(line.deg, 90)) {
                        triggerGestureEvent('swipe' + (approxMultipleOf(line.deg, 180) ? (line.dx > 0 ? 'Right' : 'Left') : (line.dy > 0 ? 'Bottom' : 'Top')), e);
                    }
                } else if (!e.touches[2]) {
                    triggerGestureEvent('pinchZoom', e);
                }
            }
        },
        touchend: function (e) {
            clearTimeout(pressTimeout);
            if (mouseInitialPoint && pressTimeout) {
                setFocus(e.target);
                triggerMouseEvent('click', e);
                dispatchDOMMouseEvent('click', mouseInitialPoint, e);
                e.preventDefault();
            }
        },
        mousedown: function (e) {
            setFocus(e.target);
            if ((e.buttons || e.which) === 1) {
                triggerMouseEvent('mousedown', e);
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
                if (dir && triggerUIEvent('mousewheel', e, e.target, dir / Math.abs(dir) * (IS_MAC ? -1 : 1), true)) {
                    e.preventDefault();
                }
            }
        },
        click: function (e) {
            if (!IS_TOUCH && mouseInitialPoint) {
                triggerMouseEvent('click', e);
            }
        },
        contextmenu: function (e) {
            triggerMouseEvent('rightClick', e);
        },
        dblclick: function (e) {
            triggerMouseEvent('dblclick', e);
        },
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

    new MutationObserver(unmount).observe(root, {
        subtree: true,
        childList: true
    });
    setFocus(document.activeElement);
});


/* --------------------------------------
 * Exports
 * -------------------------------------- */

export default {
    get event() {
        return currentEvent;
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

    focusable,
    focused,
    setModal,
    setFocus,
    retainFocus,
    releaseFocus,
    focus: function (element) {
        setFocus(element, true);
    },

    getEventSource,
    on: listenDOMEvent,
    emit: function (eventName, element, data, bubbles) {
        return emitDOMEvent(eventName, null, element, data, bubbles);
    },

    lock,
    locked,
    cancelLock,
    removeLock,

    scrollIntoView,
    watchElements,
};
