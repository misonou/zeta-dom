import { any, is, isFunction, isPlainObject, each, map, definePrototype, kv, noop, always, matchWord, makeArray, grep, freeze, isArray, matchWordMulti, executeOnce } from "./util.js";
import $ from "./include/jquery.js";
import { window, document, root, getSelection, getComputedStyle, domReady } from "./env.js";
import { emitDOMEvent } from "./events.js";

const elementsFromPoint = document.msElementsFromPoint || document.elementsFromPoint;
const compareDocumentPositionImpl = document.compareDocumentPosition;
const visualViewport = window.visualViewport;
const parseFloat = window.parseFloat;

var helperDiv = $('<div style="position:fixed;top:0;left:0;right:0;bottom:0;visibility:hidden;pointer-events:none;--sai:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)">')[0];
var safeAreaInset;

/* --------------------------------------
 * Custom class
 * -------------------------------------- */

function Rect(l, t, r, b) {
    var self = this;
    self.left = l;
    self.top = t;
    self.right = r;
    self.bottom = b;
}

definePrototype(Rect, {
    get width() {
        return this.right - this.left;
    },
    get height() {
        return this.bottom - this.top;
    },
    get centerX() {
        return (this.left + this.right) / 2;
    },
    get centerY() {
        return (this.top + this.bottom) / 2;
    },
    collapse: function (side, offset) {
        var rect = this;
        var pos = rect[side] + (offset || 0);
        return side === 'left' || side === 'right' ? toPlainRect(pos, rect.top, pos, rect.bottom) : toPlainRect(rect.left, pos, rect.right, pos);
    },
    translate: function (x, y) {
        var self = this;
        return toPlainRect(self.left + x, self.top + y, self.right + x, self.bottom + y);
    },
    expand: function (l, t, r, b) {
        var self = this;
        if (l && l.top !== undefined) {
            t = t || 1;
            return self.expand(l.left * t, l.top * t, l.right * t, l.bottom * t);
        }
        switch (arguments.length) {
            case 1:
                t = l;
            case 2:
                r = l;
            case 3:
                b = t;
        }
        var w = self.width;
        var h = self.height;
        var dx = l + r + w;
        var dy = t + b + h;
        if (dx < 0) {
            l -= (dx * l / (l + r)) | 0;
            r = -(l + w);
        }
        if (dy < 0) {
            t -= (dy * t / (t + b)) | 0;
            b = -(t + h);
        }
        return toPlainRect(self.left - l, self.top - t, self.right + r, self.bottom + b);
    }
});


/* --------------------------------------
 * General helper
 * -------------------------------------- */

function attachHelperDiv() {
    if (!containsOrEquals(document.body, helperDiv)) {
        document.body.appendChild(helperDiv);
    }
    return helperDiv;
}

function tagName(element) {
    return element && element.tagName && element.tagName.toLowerCase();
}

function matchSelector(element, selector) {
    if (!element || !selector) {
        return false;
    }
    return (selector === '*' || tagName(element) === selector || $(element).is(selector)) && element;
}

function comparePosition(a, b, strict) {
    if (a === b) {
        return 0;
    }
    var v = a && b && compareDocumentPositionImpl.call(a.element || a, b.element || b);
    if (v & 2) {
        return (strict && v & 8) || (v & 1) ? NaN : 1;
    }
    if (v & 4) {
        return (strict && v & 16) || (v & 1) ? NaN : -1;
    }
    return NaN;
}

function connected(a, b) {
    return a && b && !(compareDocumentPositionImpl.call(a.commonAncestorContainer || a, b.commonAncestorContainer || b) & 1);
}

function containsOrEquals(container, contained) {
    container = (container || '').element || container;
    contained = (contained || '').element || contained;
    return container === contained || $.contains(container, contained);
}

function isVisible(element) {
    if (!connected(root, element)) {
        return false;
    }
    if (!element.offsetWidth && !element.offsetHeight) {
        for (var cur = element; cur && cur !== document; cur = cur.parentNode) {
            if (getComputedStyle(cur).display === 'none') {
                return false;
            }
        }
    }
    return true;
}

function acceptNode(iterator, node) {
    node = node || iterator.currentNode;
    if (!node || !(iterator.whatToShow & (1 << (node.nodeType - 1)))) {
        return 3;
    }
    var filter = iterator.filter;
    return !filter ? 1 : (filter.acceptNode || filter).call(filter, node);
}

function combineNodeFilters() {
    var args = grep(makeArray(arguments), isFunction);
    if (!args[1]) {
        return args[0] || function () {
            return 1;
        };
    }
    return function (node) {
        var result = 1;
        for (var i = 0, len = args.length; i < len; i++) {
            var value = args[i].call(null, node);
            if (value === 2) {
                return 2;
            }
            result |= value;
        }
        return result;
    };
}

function iterateNode(iterator, callback, from, until) {
    var i = 0;
    iterator.currentNode = from = from || iterator.currentNode;
    callback = callback || noop;
    switch (acceptNode(iterator)) {
        case 2:
            return;
        case 1:
            callback(from, i++);
    }
    for (var cur; (cur = iterator.nextNode()) && (!until || (isFunction(until) ? until(cur) : cur !== until || void callback(cur, i++))); callback(cur, i++));
}

function iterateNodeToArray(iterator, callback, from, until) {
    var result = [];
    iterateNode(iterator, function (v) {
        result[result.length] = v;
    }, from, until);
    return callback ? map(result, callback) : result;
}


/* --------------------------------------
 * Advanced traversal
 * -------------------------------------- */

function getCommonAncestor(a, b) {
    for (b = b || a; a && a !== b && compareDocumentPositionImpl.call(a, b) !== 20; a = a.parentNode);
    return a;
}

function parentsAndSelf(element) {
    if (element === window) {
        return [];
    }
    for (var arr = []; element && element !== document && arr.push(element); element = element.parentNode || element.parent);
    return arr;
}

function selectIncludeSelf(selector, container) {
    container = container || root;
    try {
        var matched = makeArray(container.querySelectorAll(selector));
        return matchSelector(container, selector) ? [container].concat(matched) : matched;
    } catch (e) {
        var matched = $(container).filter(selector).add($(container).find(selector)).get();
        if (matched[0] || container === root) {
            return matched;
        }
        return $(container).find($(selector)).get();
    }
}

function selectClosestRelative(selector, container) {
    container = container || root;
    var element = $(selector, container)[0];
    if (!element) {
        var $matched = $(selector);
        for (; container !== root && !element; container = container.parentNode) {
            element = $matched.get().filter(function (v) {
                return containsOrEquals(container, v);
            })[0];
        }
    }
    return element;
}

function createNodeIterator(root, whatToShow, filter) {
    return document.createNodeIterator(root, whatToShow, isFunction(filter) || null, false);
}

function createTreeWalker(root, whatToShow, filter) {
    return document.createTreeWalker(root, whatToShow, isFunction(filter) || null, false);
}


/* --------------------------------------
 * Events
 * -------------------------------------- */

function addOrRemoveEventListener(method, element, event, listener, useCapture) {
    if (isPlainObject(event)) {
        each(event, function (i, v) {
            element[method](i, v, listener);
        });
    } else if (typeof event === 'string') {
        each(event.split(' '), function (i, v) {
            element[method](v, listener, useCapture);
        });
    }
}

function bind(element, event, listener, useCapture) {
    addOrRemoveEventListener('addEventListener', element, event, listener, useCapture);
    return executeOnce(function () {
        addOrRemoveEventListener('removeEventListener', element, event, listener);
    });
}

function bindOnce(element, event, listener, useCapture) {
    var unbind = bind(element, event, function () {
        unbind();
        return listener.apply(this, arguments);
    }, useCapture);
    return unbind;
}

function bindUntil(promise, element, event, listener, useCapture) {
    always(promise, bind(element, event, listener, useCapture));
}

function dispatchDOMMouseEvent(eventName, point, e) {
    if (typeof eventName !== 'string') {
        e = eventName;
        eventName = e.type;
    }
    var target = point ? elementFromPoint(point.clientX, point.clientY) || root : e.target;
    var event = document.createEvent('MouseEvent');
    point = point || e;
    event.initMouseEvent(eventName, e.bubbles, e.cancelable, e.view, e.detail, point.screenX, point.screenY, point.clientX, point.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
    return target.dispatchEvent(event);
}


/* --------------------------------------
 * DOM manip
 * -------------------------------------- */

function removeNode(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

function getClass(element, className) {
    var re = new RegExp('(?:^|\\s+)' + className + '(?:-(\\S+)|\\b)', 'ig');
    var t = [false];
    (element.getAttribute('class') || '').replace(re, function (v, a) {
        t[a ? t.length : 0] = a || true;
    });
    return t[1] ? t.slice(1) : t[0];
}

function setClass(element, className, values) {
    var value = element.getAttribute('class') || '';
    each(isPlainObject(className) || kv(className, values), function (i, v) {
        var re = new RegExp('(^|\\s)\\s*' + i + '(?:-(\\S+)|\\b)|\\s*$', 'ig');
        var replaced = 0;
        if (isPlainObject(v)) {
            v = map(v, function (v, i) {
                return v ? i : null;
            });
        }
        value = value.replace(re, function () {
            return replaced++ || !v || v.length === 0 ? '' : (' ' + i + (v[0] ? [''].concat(v).join(' ' + i + '-') : ''));
        });
    });
    element.setAttribute('class', value);
}

function getSafeAreaInset() {
    if (!safeAreaInset) {
        var values = getComputedStyle(attachHelperDiv()).getPropertyValue('--sai').split(' ');
        safeAreaInset = freeze({
            top: parseFloat(values[0]) || 0,
            left: parseFloat(values[3]) || 0,
            right: parseFloat(values[1]) || 0,
            bottom: parseFloat(values[2]) || 0
        });
    }
    return safeAreaInset;
}

function getBoxValues(element, prop, sign) {
    var style = getComputedStyle(element);
    var t = parseFloat(style[prop + 'Top']) || 0;
    var l = parseFloat(style[prop + 'Left']) || 0;
    var r = parseFloat(style[prop + 'Right']) || 0;
    var b = parseFloat(style[prop + 'Bottom']) || 0;
    return sign === -1 ? [-l, -t, -r, -b] : [l, t, r, b];
}

function getInnerBoxValues(element, prop) {
    var a = prop ? getBoxValues(element, prop, -1) : [0, 0, 0, 0];
    var b = getBoxValues(element, 'border');
    if (element !== root && element !== document.body) {
        var dx = element.offsetWidth - element.clientWidth - b[0] - b[2];
        var dy = element.offsetHeight - element.clientHeight - b[1] - b[3];
        if (dx > 0.5) {
            b[element.clientLeft - b[0] > 0.5 ? 0 : 2] += dx;
        }
        if (dy > 0.5) {
            b[element.clientTop - b[1] > 0.5 ? 1 : 3] += dy;
        }
    }
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]];
}

function applyBoxValues(rect, values) {
    return rect.expand.apply(rect, makeArray(values));
}

function getScrollOffset(winOrElm) {
    return {
        x: winOrElm.pageXOffset || winOrElm.scrollLeft || 0,
        y: winOrElm.pageYOffset || winOrElm.scrollTop || 0
    };
}

function getScrollParent(element, skipSelf, target) {
    target = target || element;
    for (; element; element = element.parentNode) {
        var s = getComputedStyle(element);
        if (skipSelf) {
            return element === root || s.position === 'fixed' ? null : getScrollParent(element.parentNode, false, target);
        }
        if (element === root || s.overflow !== 'visible' || !matchWord(s.position, 'static relative') || getContentRectCustom(element, target)) {
            break;
        }
    }
    return element;
}

function scrollBy(element, x, y, behavior) {
    behavior = behavior || 'auto';
    var result = emitDOMEvent('scrollBy', element, { x, y, behavior }, { asyncResult: false });
    if (result) {
        return result;
    }
    element = element === window || element === document.body ? root : element;

    var style = getComputedStyle(element);
    if (style.overflowX !== 'scroll' && style.overflowX !== 'auto') {
        x = 0;
    }
    // include special case for root or body where scrolling is enabled when overflowY is visible
    if (style.overflowY !== 'scroll' && style.overflowY !== 'auto' && (element !== root || style.overflowY !== 'visible')) {
        y = 0;
    }
    if (!x && !y) {
        return { x, y };
    }
    var orig = getScrollOffset(element);
    var getResult = function () {
        var cur = getScrollOffset(element);
        return {
            x: cur.x - orig.x,
            y: cur.y - orig.y
        };
    };
    var getOptions = function (left, top, behavior) {
        return { left, top, behavior };
    };
    if (element.scrollBy) {
        element.scrollBy(getOptions(x, y, 'instant'));
        if (behavior === 'smooth' || (behavior === 'auto' && style.scrollBehavior === 'smooth')) {
            result = getResult();
            element.scrollTo(getOptions(orig.x, orig.y, 'instant'));
            element.scrollBy(getOptions(x, y, behavior));
        }
    } else {
        element.scrollLeft = orig.x + x;
        element.scrollTop = orig.y + y;
    }
    return result || getResult();
}

function getContentRectCustom(element, target) {
    var result = emitDOMEvent('getContentRect', element, { target }, { asyncResult: false });
    return result && toPlainRect(result);
}

function getContentRectNative(element) {
    if (element === document.body) {
        element = root;
    }
    var parentRect = applyBoxValues(getRect(element), getInnerBoxValues(element, 'scrollPadding'));
    if (element === root) {
        var inset = getSafeAreaInset();
        var winRect = getRect();
        return toPlainRect({
            top: Math.max(parentRect.top, winRect.top + inset.top),
            left: Math.max(parentRect.left, winRect.left + inset.left),
            right: Math.min(parentRect.right, winRect.right - inset.right),
            bottom: Math.min(parentRect.bottom, winRect.bottom - inset.bottom)
        });
    }
    return parentRect;
}

function getContentRect(element) {
    return getContentRectCustom(element, element) || getContentRectNative(element);
}

function scrollIntoView(element, align, rect, within, behavior) {
    if (!isVisible(element)) {
        return false;
    }
    if (typeof align !== 'string') {
        behavior = within;
        within = rect;
        rect = align;
        align = '';
    }
    within = within || root;
    if (!rect || rect.top === undefined) {
        rect = getRect(element, typeof rect === 'number' ? rect : getBoxValues(element, 'scrollMargin'));
    }
    var dirX = matchWord(align, 'left right');
    var dirY = matchWord(align, 'top bottom');
    if (!dirX || !dirY) {
        var iter = matchWordMulti(align, 'auto center');
        var iterValue = iter();
        dirX = dirX || iterValue;
        dirY = dirY || iter() || iterValue;
    }
    var getDelta = function (a, b, dir, dStart, dEnd, dCenter) {
        if (dir === dStart || dir === dEnd) {
            return a[dir] - b[dir];
        } else if (dir === 'center') {
            return a[dCenter] - b[dCenter];
        } else {
            var d = a[dStart] - b[dStart];
            return Math.min(d, 0) || Math.max(0, Math.min(d, a[dEnd] - b[dEnd]));
        }
    };
    var parent = getScrollParent(element);
    var result = { x: 0, y: 0 };
    while (containsOrEquals(within, parent)) {
        var parentRect = getContentRectCustom(parent, element) || getContentRectNative(parent);
        var deltaX = getDelta(rect, parentRect, dirX, 'left', 'right', 'centerX');
        var deltaY = getDelta(rect, parentRect, dirY, 'top', 'bottom', 'centerY');
        if (deltaX || deltaY) {
            var parentResult = scrollBy(parent, deltaX, deltaY, behavior);
            rect = rect.translate(-parentResult.x, -parentResult.y);
            result.x += parentResult.x;
            result.y += parentResult.y;
        }
        parent = getScrollParent(parent, true, element);
    }
    return (result.x || result.y) ? result : false;
}


/* --------------------------------------
 * Range and rect
 * -------------------------------------- */

function makeSelection(b, e) {
    var selection = getSelection();
    if (!selection) {
        return;
    }
    e = e || b;

    // for newer browsers that supports setBaseAndExtent
    // avoid undesirable effects when direction of editor's selection direction does not match native one
    if (selection.setBaseAndExtent) {
        selection.setBaseAndExtent(b.startContainer, b.startOffset, e.endContainer, e.endOffset);
        return;
    }

    var range = document.createRange();
    range.setStart(b.startContainer, b.startOffset);
    range.setEnd(e.endContainer, e.endOffset);
    selection.removeAllRanges();
    selection.addRange(range);
}

function getRect(elm, includeMargin) {
    var rect, margins;
    elm = elm || window;
    if (elm === window) {
        rect = visualViewport ? toPlainRect(0, 0, visualViewport.width, visualViewport.height) : toPlainRect(0, 0, root.clientWidth, root.clientHeight);
    } else if (elm.getRect) {
        rect = elm.getRect();
    } else {
        elm = elm.element || elm;
        if (elm === root && (!includeMargin || typeof includeMargin === 'number')) {
            rect = getRect(attachHelperDiv());
        } else if (!isVisible(elm)) {
            // return zero rect at origin aligning with getBoundingClientRect
            rect = toPlainRect(0, 0, 0, 0);
            includeMargin = 0;
        } else {
            rect = toPlainRect(elm.getBoundingClientRect());
            switch (includeMargin) {
                case true:
                case 'margin-box':
                    margins = getBoxValues(elm, 'margin');
                    includeMargin = includeMargin === true ? margins.map(function (v) {
                        return Math.max(0, v);
                    }) : margins;
                    break;
                case 'border-box':
                    includeMargin = 0;
                    break;
                case 'padding-box':
                    includeMargin = getInnerBoxValues(elm);
                    break;
                case 'content-box':
                    includeMargin = getInnerBoxValues(elm, 'padding');
            }
        }
    }
    return includeMargin ? applyBoxValues(rect, includeMargin) : rect;
}

function getRects(range) {
    if (!is(range, Range)) {
        var r1 = document.createRange();
        r1.selectNodeContents(range);
        range = r1;
    }
    return map(range.getClientRects(), toPlainRect);
}

function toPlainRect(l, t, r, b) {
    function clip(v) {
        // IE provides precision up to 0.05 but with floating point errors that hinder comparisons
        return Math.round(v * 1000) / 1000;
    }
    if (l.top !== undefined) {
        return new Rect(clip(l.left), clip(l.top), clip(l.right), clip(l.bottom));
    }
    if (r === undefined) {
        return new Rect(l, t, l, t);
    }
    return new Rect(l, t, r, b);
}

function rectEquals(a, b) {
    function check(prop) {
        return Math.abs(a[prop] - b[prop]) < 1;
    }
    return check('left') && check('top') && check('bottom') && check('right');
}

function rectCovers(a, b) {
    return b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom;
}

function rectIntersects(a, b) {
    return !(b.right < a.left || b.left > a.right) && !(b.bottom < a.top || b.top > a.bottom);
}

function pointInRect(x, y, rect, within) {
    within = within || 0;
    return rect.width && rect.height && x - rect.left >= -within && x - rect.right <= within && y - rect.top >= -within && y - rect.bottom <= within;
}

function mergeRect(a, b) {
    return toPlainRect(Math.min(a.left, b.left), Math.min(a.top, b.top), Math.max(a.right, b.right), Math.max(a.bottom, b.bottom));
}

function elementFromPoint(x, y, container) {
    container = container || document.body;
    return any(elementsFromPoint.call(document, x, y), function (v) {
        return containsOrEquals(container, v) && getComputedStyle(v).pointerEvents !== 'none';
    }) || null;
}


export {
    domReady,
    tagName,
    isVisible,
    matchSelector,
    comparePosition,
    connected,
    containsOrEquals,
    acceptNode,
    combineNodeFilters,
    iterateNode,
    iterateNodeToArray,

    getCommonAncestor,
    parentsAndSelf,
    selectIncludeSelf,
    selectClosestRelative,

    createNodeIterator,
    createTreeWalker,

    bind,
    bindOnce,
    bindUntil,
    dispatchDOMMouseEvent,

    removeNode,
    getClass,
    setClass,
    getSafeAreaInset,
    getScrollOffset,
    getScrollParent,
    getContentRect,
    scrollBy,
    scrollIntoView,
    makeSelection,

    getRect,
    getRects,
    toPlainRect,
    rectEquals,
    rectCovers,
    rectIntersects,
    pointInRect,
    mergeRect,
    elementFromPoint
};
