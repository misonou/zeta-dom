import { any, isFunction, isPlainObject, each, map, definePrototype, kv, noop, always, matchWord } from "./util.js";
import { $ } from "./shim.js";

const root = document.documentElement;
const selection = window.getSelection();
// @ts-ignore: non-standard member
const elementsFromPoint = document.msElementsFromPoint || document.elementsFromPoint;
const compareDocumentPositionImpl = document.compareDocumentPosition;
const compareBoundaryPointsImpl = Range.prototype.compareBoundaryPoints;
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
    }
});


/* --------------------------------------
 * General helper
 * -------------------------------------- */

function tagName(element) {
    return element && element.tagName && element.tagName.toLowerCase();
}

function is(element, selector) {
    if (!element || !selector) {
        return false;
    }
    // constructors of native DOM objects in Safari refuse to be functions
    // use a fairly accurate but fast checking instead of isFunction
    if (selector.prototype) {
        return element instanceof selector && element;
    }
    if (selector.toFixed) {
        return (element.nodeType & selector) && element;
    }
    return (selector === '*' || tagName(element) === selector || $(element).is(selector)) && element;
}

function sameElementSpec(a, b) {
    if (tagName(a) !== tagName(b)) {
        return false;
    }
    var thisAttr = a.attributes;
    var prevAttr = b.attributes;
    return thisAttr.length === prevAttr.length && !any(thisAttr, function (v) {
        return !prevAttr[v.nodeName] || v.value !== prevAttr[v.nodeName].value;
    });
}

function comparePosition(a, b, strict) {
    if (a === b) {
        return 0;
    }
    var v = a && b && compareDocumentPositionImpl.call(a, b);
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
        for (var cur = element; cur; cur = cur.parentNode) {
            if (getComputedStyle(cur).display === 'none') {
                return false;
            }
        }
    }
    return true;
}

function acceptNode(iterator, node) {
    node = node || iterator.currentNode;
    if (!node || !(iterator.whatToShow & (is(node, Node) ? (1 << (node.nodeType - 1)) : node.nodeType))) {
        return 3;
    }
    return !iterator.filter ? 1 : (iterator.filter.acceptNode || iterator.filter).call(iterator.filter, node);
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


/* --------------------------------------
 * Create
 * -------------------------------------- */

function createDocumentFragment(node) {
    return is(node, DocumentFragment) || $(document.createDocumentFragment()).append(node)[0];
}

function createTextNode(text) {
    return document.createTextNode(text || '\u200b');
}

function createElement(name) {
    return document.createElement(name);
}

function createNodeIterator(root, whatToShow, filter) {
    // @ts-ignore: assume filter is of correct signature
    return document.createNodeIterator(root, whatToShow, isFunction(filter) || null, false);
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
    for (var s; element !== root && (s = getComputedStyle(element)) && s.overflow === 'visible' && matchWord(s.position, 'static relative'); element = element.parentNode);
    return element;
}

function scrollBy(element, x, y) {
    var winOrElm = element === root || element === document.body ? window : element;
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
    var parentRect = getContentRect(parent);
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
 * Range and rect
 * -------------------------------------- */

function createRange(startNode, startOffset, endNode, endOffset) {
    if (startNode && isFunction(startNode.getRange)) {
        return startNode.getRange();
    }
    var range;
    if (is(startNode, Node)) {
        range = document.createRange();
        if (+startOffset !== startOffset) {
            range[(startOffset === 'contents' || !startNode.parentNode) ? 'selectNodeContents' : 'selectNode'](startNode);
            if (typeof startOffset === 'boolean') {
                range.collapse(startOffset);
            }
        } else {
            range.setStart(startNode, getOffset(startNode, startOffset));
        }
        if (is(endNode, Node) && connected(startNode, endNode)) {
            range.setEnd(endNode, getOffset(endNode, endOffset));
        }
    } else if (is(startNode, Range)) {
        range = startNode.cloneRange();
        if (!range.collapsed && typeof startOffset === 'boolean') {
            range.collapse(startOffset);
        }
    }
    if (is(startOffset, Range) && connected(range, startOffset)) {
        var inverse = range.collapsed && startOffset.collapsed ? -1 : 1;
        if (compareBoundaryPointsImpl.call(range, 0, startOffset) * inverse < 0) {
            range.setStart(startOffset.startContainer, startOffset.startOffset);
        }
        if (compareBoundaryPointsImpl.call(range, 2, startOffset) * inverse > 0) {
            range.setEnd(startOffset.endContainer, startOffset.endOffset);
        }
    }
    return range;
}

function rangeIntersects(a, b) {
    a = is(a, Range) || createRange(a);
    b = is(b, Range) || createRange(b);
    return connected(a, b) && compareBoundaryPointsImpl.call(a, 3, b) <= 0 && compareBoundaryPointsImpl.call(a, 1, b) >= 0;
}

function rangeCovers(a, b) {
    a = is(a, Range) || createRange(a);
    b = is(b, Range) || createRange(b);
    return connected(a, b) && compareBoundaryPointsImpl.call(a, 0, b) <= 0 && compareBoundaryPointsImpl.call(a, 2, b) >= 0;
}

function rangeEquals(a, b) {
    a = is(a, Range) || createRange(a);
    b = is(b, Range) || createRange(b);
    return connected(a, b) && compareBoundaryPointsImpl.call(a, 0, b) === 0 && compareBoundaryPointsImpl.call(a, 2, b) === 0;
}

function compareRangePosition(a, b, strict) {
    a = is(a, Range) || createRange(a);
    b = is(b, Range) || createRange(b);
    var value = !connected(a, b) ? NaN : compareBoundaryPointsImpl.call(a, 0, b) + compareBoundaryPointsImpl.call(a, 2, b);
    return (strict && ((value !== 0 && rangeIntersects(a, b)) || (value === 0 && !rangeEquals(a, b)))) ? NaN : value && value / Math.abs(value);
}

function makeSelection(b, e) {
    if (!selection) {
        return;
    }
    // for newer browsers that supports setBaseAndExtent
    // avoid undesirable effects when direction of editor's selection direction does not match native one
    if (selection.setBaseAndExtent && is(e, Range)) {
        selection.setBaseAndExtent(b.startContainer, b.startOffset, e.startContainer, e.startOffset);
        return;
    }

    var range = createRange(b, e);
    try {
        selection.removeAllRanges();
    } catch (e) {
        // IE fails to clear ranges by removeAllRanges() in occasions mentioned in
        // http://stackoverflow.com/questions/22914075
        // @ts-ignore: non-standard member
        var r = document.body.createTextRange();
        r.collapse();
        r.select();
        selection.removeAllRanges();
    }
    try {
        selection.addRange(range);
    } catch (e) {
        // IE may throws unspecified error even though the selection is successfully moved to the given range
        // if the range is not successfully selected retry after selecting other range
        if (!selection.rangeCount) {
            selection.addRange(createRange(document.body));
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}

function getRect(elm, includeMargin) {
    var rect;
    elm = elm || root;
    if (elm.getRect) {
        return elm.getRect();
    }
    elm = elm.element || elm;
    if (elm === root || elm === window) {
        var div = originDiv || (originDiv = $('<div style="position:fixed; top:0; left:0;">')[0]);
        if (!containsOrEquals(document.body, div)) {
            document.body.appendChild(div);
        }
        // origin used by CSS, DOMRect and properties like clientX/Y may move away from the top-left corner of the window
        // when virtual keyboard is shown on mobile devices
        var o = getRect(div);
        rect = toPlainRect(0, 0, root.offsetWidth, root.offsetHeight).translate(o.left, o.top);
    } else if (!containsOrEquals(root, elm)) {
        // IE10 throws Unspecified Error for detached elements
        rect = toPlainRect(0, 0, 0, 0);
    } else {
        rect = toPlainRect(elm.getBoundingClientRect());
        if (includeMargin) {
            var style = getComputedStyle(elm);
            rect.top -= Math.max(0, parseFloat(style.marginTop));
            rect.left -= Math.max(0, parseFloat(style.marginLeft));
            rect.right += Math.max(0, parseFloat(style.marginRight));
            rect.bottom += Math.max(0, parseFloat(style.marginBottom));
        }
    }
    return rect;
}

function getOffset(node, offset) {
    var len = node.length || node.childNodes.length;
    return 1 / offset < 0 ? Math.max(0, len + offset) : Math.min(len, offset);
}

function getRects(range) {
    return map((is(range, Range) || createRange(range, 'contents')).getClientRects(), toPlainRect);
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
    if (elementsFromPoint) {
        return any(elementsFromPoint.call(document, x, y), function (v) {
            return containsOrEquals(container, v) && getComputedStyle(v).pointerEvents !== 'none';
        }) || null;
    }
    var element = document.elementFromPoint(x, y);
    if (!containsOrEquals(container, element) && pointInRect(x, y, getRect(container))) {
        var tmp = [];
        try {
            while (element && comparePosition(container, element, true)) {
                var target = $(element).parentsUntil(getCommonAncestor(container, element)).slice(-1)[0] || element;
                if (target === tmp[tmp.length - 1]) {
                    return null;
                }
                // @ts-ignore: assume we are working with HTMLElement
                target.style.pointerEvents = 'none';
                tmp[tmp.length] = target;
                element = document.elementFromPoint(x, y);
            }
        } finally {
            $(tmp).css('pointer-events', '');
        }
    }
    return containsOrEquals(container, element) ? element : null;
}


export {
    tagName,
    is,
    isVisible,
    sameElementSpec,
    comparePosition,
    connected,
    containsOrEquals,
    iterateNode,
    iterateNodeToArray,

    getCommonAncestor,
    parentsAndSelf,
    selectIncludeSelf,
    selectClosestRelative,

    createDocumentFragment,
    createTextNode,
    createElement,
    createNodeIterator,

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

    createRange,
    rangeIntersects,
    rangeEquals,
    rangeCovers,
    compareRangePosition,
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
