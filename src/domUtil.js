import { any, is, isFunction, isPlainObject, each, map, definePrototype, kv, noop, always, matchWord, makeArray, grep } from "./util.js";
import $ from "./include/jquery.js";
import { window, document, root, getSelection, getComputedStyle, domReady } from "./env.js";
import { emitDOMEvent } from "./events.js";

// @ts-ignore: non-standard member
const elementsFromPoint = document.msElementsFromPoint || document.elementsFromPoint;
const compareDocumentPositionImpl = document.compareDocumentPosition;
const visualViewport = window.visualViewport;
const OFFSET_ZERO = Object.freeze({
    x: 0,
    y: 0
});

var originDiv;
var scrollbarWidth;

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
            // @ts-ignore: type inference issue
            r = -(l + w);
        }
        if (dy < 0) {
            t -= (dy * t / (t + b)) | 0;
            // @ts-ignore: type inference issue
            b = -(t + h);
        }
        // @ts-ignore: type inference issue
        return toPlainRect(self.left - l, self.top - t, self.right + r, self.bottom + b);
    }
});


/* --------------------------------------
 * General helper
 * -------------------------------------- */

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
    var rect = getRect(element);
    if (!rect.top && !rect.left && !rect.width && !rect.height) {
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
    var matched = $.uniqueSort($(container).find(selector).add($(container).filter(selector)).get());
    if (matched[0] || container === root) {
        return matched;
    }
    return $(container).find($(selector)).get();
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
    // @ts-ignore: assume filter is of correct signature
    return document.createNodeIterator(root, whatToShow, isFunction(filter) || null, false);
}

function createTreeWalker(root, whatToShow, filter) {
    // @ts-ignore: assume filter is of correct signature
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
    return function () {
        unbind(element, event, listener);
    };
}

function unbind(element, event, listener) {
    addOrRemoveEventListener('removeEventListener', element, event, listener);
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
    (element.className || '').replace(re, function (v, a) {
        t[a ? t.length : 0] = a || true;
    });
    return t[1] ? t.slice(1) : t[0];
}

function setClass(element, className, values) {
    var value = element.className || '';
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
    element.className = value;
}

function getScrollOffset(winOrElm) {
    return {
        x: winOrElm.pageXOffset || winOrElm.scrollLeft || 0,
        y: winOrElm.pageYOffset || winOrElm.scrollTop || 0
    };
}

function getScrollParent(element) {
    for (var target = element; element && element !== root; element = element.parentNode) {
        var s = getComputedStyle(element);
        if (s.overflow !== 'visible' || !matchWord(s.position, 'static relative') || emitDOMEvent('getContentRect', element, { target }, { asyncResult: false })) {
            break;
        }
    }
    return element;
}

function scrollBy(element, x, y) {
    var result = emitDOMEvent('scrollBy', element, { x, y }, { asyncResult: false });
    if (result) {
        return result;
    }
    var winOrElm = element === root || element === document.body ? window : element;
    if (winOrElm !== window && getComputedStyle(winOrElm).overflow !== 'scroll') {
        return OFFSET_ZERO;
    }
    var orig = getScrollOffset(winOrElm);
    if (winOrElm.scrollBy) {
        winOrElm.scrollBy(x, y);
    } else {
        winOrElm.scrollLeft = orig.x + x;
        winOrElm.scrollTop = orig.y + y;
    }
    var cur = getScrollOffset(winOrElm);
    return {
        x: cur.x - orig.x,
        y: cur.y - orig.y
    };
}

function getContentRect(element) {
    var result = emitDOMEvent('getContentRect', element, null, { asyncResult: false });
    if (result) {
        return toPlainRect(result);
    }
    if (scrollbarWidth === undefined) {
        // detect native scrollbar size
        // height being picked because scrollbar may not be shown if container is too short
        var dummy = $('<div style="overflow:scroll;height:80px"><div style="height:100px"></div></div>').appendTo(document.body)[0];
        scrollbarWidth = getRect(dummy).width - getRect(dummy.children[0]).width;
        removeNode(dummy);
    }
    var style = getComputedStyle(element);
    var hasOverflowX = element.offsetWidth < element.scrollWidth;
    var hasOverflowY = element.offsetHeight < element.scrollHeight;
    var parentRect = getRect(element === root || element === document.body ? window : element);
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

function scrollIntoView(element, rect, within) {
    within = within || root;
    if (!rect || rect.top === undefined) {
        rect = getRect(element, rect);
    }
    var parent = getScrollParent(element);
    if (!containsOrEquals(within, parent) || !isVisible(element)) {
        return false;
    }
    var parentRect = getContentRect(parent);
    var deltaX = rect.left - parentRect.left;
    var deltaY = rect.top - parentRect.top;
    deltaX = Math.min(deltaX, 0) || Math.max(0, Math.min(deltaX, rect.right - parentRect.right));
    deltaY = Math.min(deltaY, 0) || Math.max(0, Math.min(deltaY, rect.bottom - parentRect.bottom));
    var result = (deltaX || deltaY) && scrollBy(parent, deltaX, deltaY) || OFFSET_ZERO;
    if (parent !== root) {
        var parentResult = scrollIntoView(parent.parentNode, rect.translate(-result.x, -result.y), within);
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
    var rect;
    elm = elm || window;
    if (elm.getRect) {
        rect = elm.getRect();
    } else {
        elm = elm.element || elm;
        if (elm === window) {
            rect = visualViewport ? toPlainRect(0, 0, visualViewport.width, visualViewport.height) : toPlainRect(0, 0, root.clientWidth, root.clientHeight);
        } else if (elm === root) {
            var div = originDiv || (originDiv = $('<div style="position:fixed;top:0;left:0;right:0;bottom:0;visibility:hidden;pointer-events:none;">')[0]);
            if (!containsOrEquals(document.body, div)) {
                document.body.appendChild(div);
            }
            rect = getRect(div);
        } else if (!containsOrEquals(root, elm)) {
            // IE10 throws Unspecified Error for detached elements
            rect = toPlainRect(0, 0, 0, 0);
        } else {
            rect = toPlainRect(elm.getBoundingClientRect());
            if (includeMargin === true) {
                var style = getComputedStyle(elm);
                var marginTop = Math.max(0, parseFloat(style.marginTop));
                var marginLeft = Math.max(0, parseFloat(style.marginLeft));
                var marginRight = Math.max(0, parseFloat(style.marginRight));
                var marginBottom = Math.max(0, parseFloat(style.marginBottom));
                rect = rect.expand(marginLeft, marginTop, marginRight, marginBottom);
            }
        }
    }
    if (typeof includeMargin === 'number') {
        rect = rect.expand(includeMargin);
    }
    return rect;
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
    bindUntil,
    dispatchDOMMouseEvent,

    removeNode,
    getClass,
    setClass,
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
