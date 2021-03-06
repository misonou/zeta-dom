import Promise from "./include/promise-polyfill.js";
import $ from "./include/jquery.js";
import { window, document, getComputedStyle } from "./env.js";
import { getClass, setClass, iterateNode, createNodeIterator, isVisible, bind } from "./domUtil.js";
import { reject, noop, resolve, each, matchWord, keys } from "./util.js";

function parseCSS(value) {
    var styles = {};
    var div = document.createElement('div');
    div.setAttribute('style', value);
    each(div.style, function (i, v) {
        styles[v] = div.style[v];
    });
    return styles;
}

function isCssUrlValue(value) {
    return value && value !== 'none' && /url\((?:'(.+)'|"(.+)"|([^)]+))\)/.test(value) && (RegExp.$1 || RegExp.$2 || RegExp.$3);
}

function normalizeCSSValue(curValue) {
    if (curValue === 'matrix(1, 0, 0, 1, 0, 0)') {
        return 'none';
    }
    return curValue;
}

function styleToJSON(style) {
    var t = {};
    each(style, function (i, v) {
        t[v] = style[v];
    });
    return t;
}

function animatableValue(v, allowNumber) {
    return /\b(?:[+-]?(\d+(?:\.\d+)?)(px|%)?|#[0-9a-f]{3,}|(rgba?|hsla?|matrix|calc)\(.+\))\b/.test(v) && (allowNumber || !RegExp.$1 || RegExp.$2);
}

function removeVendorPrefix(name) {
    return name.replace(/^-(webkit|moz|ms|o)-/, '');
}

function runCSSTransition(element, className, callback) {
    if (getClass(element, className)) {
        return reject();
    }
    callback = callback || noop;
    if (callback === true) {
        callback = setClass.bind(null, element, className, false);
    }
    setClass(element, className, true);
    var arr = [];
    var map1 = new Map();
    var test = function (element, pseudoElement) {
        var style = getComputedStyle(element, pseudoElement);
        if (style.transitionDuration !== '0s' || style.animationName != 'none') {
            var key = { element: element, pseudoElement: pseudoElement };
            map1.set(key, style.transitionProperty.split(/,\s*/));
            arr.push(key);
        }
    };
    iterateNode(createNodeIterator(element, 1, function (v) {
        if (!isVisible(v)) {
            return 2;
        }
        test(v, null);
        test(v, '::before');
        test(v, '::after');
    }));
    if (!arr[0]) {
        callback();
        return resolve();
    }

    var targets = arr.map(function (v) {
        return v.element;
    });
    setClass(element, className, false);
    $(targets).css({
        transition: 'none',
        animationDuration: '0s',
    });
    setClass(element, className, true);
    var newStyle = arr.map(function (v) {
        return styleToJSON(getComputedStyle(v.element, v.pseudoElement));
    });
    setClass(element, className, false);

    var appendPseudoToAnim = window.AnimationEvent && 'pseudoElement' in AnimationEvent.prototype;
    var map = new Map();
    each(arr, function (i, v) {
        var pseudoElement = v.pseudoElement;
        var curStyle = getComputedStyle(v.element, pseudoElement);
        var transitionProperties = map1.get(v);
        var dict = {};
        each(curStyle, function (j, v) {
            var curValue = normalizeCSSValue(curStyle[v]);
            var newValue = normalizeCSSValue(newStyle[i][v]);
            if (curValue !== newValue) {
                var prop = removeVendorPrefix(v);
                var allowNumber = matchWord(v, 'opacity line-height');
                if (prop === 'animation-name') {
                    var prevAnim = curValue.replace(/,/g, '');
                    each(newValue.split(/,\s*/), function (i, v) {
                        if (v !== 'none' && !matchWord(prevAnim, v)) {
                            dict['@' + v + ((appendPseudoToAnim && pseudoElement) || '')] = true;
                        }
                    });
                } else if (prop === 'transform' || (animatableValue(curValue, allowNumber) && animatableValue(newValue, allowNumber) && !/^scroll-limit/.test(prop))) {
                    if (transitionProperties[0] === 'all' || transitionProperties.indexOf(v + (pseudoElement || '')) >= 0) {
                        dict[prop + (pseudoElement || '')] = true;
                    }
                }
            }
        });
        if (keys(dict)[0]) {
            map.set(v.element, dict);
        }
    });
    $(targets).css({
        transition: '',
        animationDuration: '',
    });
    setClass(element, className, true);
    if (!map.size) {
        callback();
        return resolve();
    }

    return new Promise(function (resolve, reject) {
        var unbind = bind(element, 'animationend transitionend', function (e) {
            var dict = map.get(e.target) || {};
            // @ts-ignore: mixed type of Event
            delete dict[(e.propertyName ? removeVendorPrefix(e.propertyName) : '@' + e.animationName) + (e.pseudoElement || '')];
            if (!keys(dict)[0] && map.delete(e.target) && !map.size) {
                unbind();
                if (getClass(element, className)) {
                    callback();
                    resolve(element);
                } else {
                    reject(element);
                }
            }
        });
    });
}

export {
    parseCSS,
    isCssUrlValue,
    runCSSTransition
};
