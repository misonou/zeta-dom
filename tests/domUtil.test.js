import { setBoxStyle, setInitialScreenSize, setRootSize } from "@misonou/test-utils/mock/boxModel";
import { setViewportSize } from "@misonou/test-utils/mock/visualViewport";
import { acceptNode, bind, bindOnce, bindUntil, combineNodeFilters, comparePosition, createNodeIterator, createTreeWalker, dispatchDOMMouseEvent, elementFromPoint, getClass, getCommonAncestor, getContentRect, getRect, getScrollOffset, getScrollParent, isVisible, iterateNode, iterateNodeToArray, matchSelector, mergeRect, parentsAndSelf, pointInRect, rectCovers, rectEquals, rectIntersects, removeNode, scrollBy, scrollIntoView, selectClosestRelative, selectIncludeSelf, setClass, toPlainRect } from "../src/domUtil";
import { bindEvent, body, delay, initBody, mockFn, root, verifyCalls, _ } from "./testUtil";
import { jest } from "@jest/globals";

function defaultAcceptNode(node) {
    return node.attributes['reject'] ? 2 : node.attributes['skip'] ? 3 : 1;
}

const { objectContaining } = expect;
const { getBoundingClientRect } = Element.prototype;

jest.spyOn(document, 'createNodeIterator');
jest.spyOn(document, 'createTreeWalker');

setInitialScreenSize(100, 100);

describe('combineNodeFilters', () => {
    /** @type {() => 1} */
    const return1 = () => 1;
    /** @type {() => 2} */
    const return2 = () => 2;
    /** @type {() => 3} */
    const return3 = () => 3;

    it('should return 2 if any callback return 2', () => {
        expect(combineNodeFilters(return1, return2, return3)({})).toBe(2);
    });

    it('should return 3 if any callback return 3 and no callback return 2', () => {
        expect(combineNodeFilters(return1, return1, return3)({})).toBe(3);
    });

    it('should return 1 if all callback return 1', () => {
        expect(combineNodeFilters(return1, return1, return1)({})).toBe(1);
    });

    it('should return 1 if there is no callback', () => {
        expect(combineNodeFilters()({})).toBe(1);
    });

    it('does not throw when argument is not function', () => {
        // @ts-ignore
        expect(() => combineNodeFilters(1, 2, 3)()).not.toThrow();
    });
});

describe('matchSelector', () => {
    it('should return false if either argument is empty', () => {
        // @ts-ignore
        expect(matchSelector(null, '*')).toBe(false);
        expect(matchSelector(body, '')).toBe(false);
    });

    it('should return the element if selector is "*"', () => {
        expect(matchSelector(body, '*')).toBe(body);
    });
});

describe('comparePosition', () => {
    it('should return 0, -1, 1 or NaN', () => {
        const { parent, node1, node2 } = initBody(`
            <div id="parent">
                <div id="node1"></div>
                <div id="node2"></div>
                <div id="node3"></div>
            </div>
        `);
        const detached = document.createElement('div');
        expect(comparePosition(node1, node1)).toEqual(0); // `0` for the same node
        expect(comparePosition(node1, node2)).toEqual(-1); // `-1` when first node precedes second node
        expect(comparePosition(node2, node1)).toEqual(1); // `1` when second node precedes first node
        expect(comparePosition(parent, node1)).toEqual(-1); // `-1` when first node contains second node
        expect(comparePosition(node1, parent)).toEqual(1); // `1` when second node contains first node
        expect(comparePosition(parent, detached)).toBeNaN(); // `NaN` for disconnected nodes
        expect(comparePosition(parent, node1, true)).toBeNaN(); // `NaN` when first node contains second node when `strict` is set to true
        expect(comparePosition(node1, parent, true)).toBeNaN(); // `NaN` when second node contains first node when `strict` is set to true
    });
});

describe('isVisible', () => {
    it('should return true when element has non-zero sized bounding rect', () => {
        const { node } = initBody(`<div id="node" x-rect="0 0 10 10"></div>`);
        expect(isVisible(node)).toBe(true);
    });

    it('should return false if element or any ancestor has `display` style property equal to none', () => {
        const { node, child } = initBody(`
            <div id="node" style="display: none">
                <div id="child" style="display: block"></div>
            </div>
        `);
        expect(isVisible(node)).toBe(false);
        expect(isVisible(child)).toBe(false);
    });

    it('should return false for detached element', () => {
        const node = document.createElement('div');
        node.style.display = 'block';
        expect(isVisible(node)).toBe(false);
    });
});

describe('acceptNode', () => {
    it('should return SKIP if node is falsy', () => {
        // @ts-ignore
        expect(acceptNode(createNodeIterator(body, 1), null)).toEqual(NodeFilter.FILTER_SKIP);
    });

    it('should return SKIP if node is not of allowed node types', () => {
        expect(acceptNode(createNodeIterator(body, 1), document.createTextNode(''))).toEqual(NodeFilter.FILTER_SKIP);
        expect(acceptNode(createNodeIterator(body, 4), body)).toEqual(NodeFilter.FILTER_SKIP);
    });

    it('should return ACCEPT if node is of allowed node types and there is no filter callback', () => {
        expect(acceptNode(createNodeIterator(body, 1), body)).toEqual(NodeFilter.FILTER_ACCEPT);
    });

    it('should return value from filter callback', () => {
        const cb = mockFn().mockReturnValue(42);
        expect(acceptNode(createNodeIterator(body, 1, cb), body)).toEqual(42);
        expect(cb).toBeCalledWith(body);
    });
});

describe('iterateNode', () => {
    it('should fire callback for starting node if it is accepted', () => {
        const cb = mockFn();
        iterateNode(createTreeWalker(body, 1), cb);
        verifyCalls(cb, [
            [body, 0]
        ]);
    });

    it('should not fire callback if starting node is rejected', () => {
        const { node1 } = initBody(`
            <div id="node1" reject>
                <div id="node2"></div>
            </div>
        `);
        const cb = mockFn();
        iterateNode(createTreeWalker(node1, 1, defaultAcceptNode), cb);
        expect(cb).not.toBeCalled();
    });

    it('should fire callback with all accepted nodes in order', () => {
        const { node1, node2, node3, node4, node5, node6 } = initBody(`
            <div id="node1">
                <div id="node2" skip>
                    <div id="node5"></div>
                </div>
                <div id="node3"></div>
                <div id="node4" reject>
                    <div id="node6"></div>
                </div>
            </div>
        `);
        const cb = mockFn();
        iterateNode(createTreeWalker(node1, 1, defaultAcceptNode), cb);
        verifyCalls(cb, [
            [node1, 0],
            [node5, 1],
            [node3, 2],
        ]);
    });

    it('should start iterating from the specified node', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3"></div>
                <div id="node4"></div>
            </div>
        `);
        const cb = mockFn();
        iterateNode(createTreeWalker(node1, 1, defaultAcceptNode), cb, node2);
        verifyCalls(cb, [
            [node2, 0],
            [node3, 1],
            [node4, 2]
        ]);
    });

    it('should stop iterating after it reaches the until node', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3"></div>
                <div id="node4"></div>
            </div>
        `);
        const cb = mockFn();
        iterateNode(createTreeWalker(node1, 1, defaultAcceptNode), cb, null, node3);
        verifyCalls(cb, [
            [node1, 0],
            [node2, 1],
            [node3, 2]
        ]);
    });

    it('should stop iterating when until callback returned false', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3"></div>
                <div id="node4"></div>
            </div>
        `);
        const cb = mockFn();
        iterateNode(createTreeWalker(node1, 1, defaultAcceptNode), cb, null, v => v !== node4);
        verifyCalls(cb, [
            [node1, 0],
            [node2, 1],
            [node3, 2]
        ]);
    });
});

describe('iterateNodeToArray', () => {
    it('should return an array containing starting node if it is accepted', () => {
        expect(iterateNodeToArray(createTreeWalker(body, 1))).toEqual([body]);
    });

    it('should return an empty array if starting node is rejected', () => {
        const { node1 } = initBody(`
            <div id="node1" reject>
                <div id="node2"></div>
            </div>
        `);
        expect(iterateNodeToArray(createTreeWalker(node1, 1, defaultAcceptNode))).toEqual([]);
    });

    it('should return an array containing all accepted nodes in order', () => {
        const { node1, node2, node3, node4, node5, node6 } = initBody(`
            <div id="node1">
                <div id="node2" skip>
                    <div id="node5"></div>
                </div>
                <div id="node3"></div>
                <div id="node4" reject>
                    <div id="node6"></div>
                </div>
            </div>
        `);
        expect(iterateNodeToArray(createTreeWalker(node1, 1, defaultAcceptNode))).toEqual([node1, node5, node3]);
    });

    it('should start iterating from the specified node', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3"></div>
                <div id="node4"></div>
            </div>
        `);
        expect(iterateNodeToArray(createTreeWalker(node1, 1, defaultAcceptNode), null, node2)).toEqual([node2, node3, node4]);
    });

    it('should stop iterating after it reaches the until node', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3"></div>
                <div id="node4"></div>
            </div>
        `);
        expect(iterateNodeToArray(createTreeWalker(node1, 1, defaultAcceptNode), null, null, node3)).toEqual([node1, node2, node3]);
    });

    it('should stop iterating when until callback returned false', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3"></div>
                <div id="node4"></div>
            </div>
        `);
        expect(iterateNodeToArray(createTreeWalker(node1, 1, defaultAcceptNode), null, null, v => v !== node4)).toEqual([node1, node2, node3]);
    });

    it('should fire callback for each accepted node and return an array containing the results of callback', () => {
        const { node1, node2, node3, node4, node5, node6 } = initBody(`
            <div id="node1">
                <div id="node2" skip>
                    <div id="node5"></div>
                </div>
                <div id="node3"></div>
                <div id="node4" reject>
                    <div id="node6"></div>
                </div>
            </div>
        `);
        const cb = mockFn(/** @param {Element} v */ v => v.id);
        expect(iterateNodeToArray(createTreeWalker(node1, 1, defaultAcceptNode), cb)).toEqual(['node1', 'node5', 'node3']);
        verifyCalls(cb, [
            [node1, 0],
            [node5, 1],
            [node3, 2],
        ]);
    });
});

describe('getCommonAncestor', () => {
    it('should return falsy value if the two nodes belong to different tree', () => {
        expect(getCommonAncestor(body, document.createElement('div'))).toBeFalsy();
    });
});

describe('parentsAndSelf', () => {
    it('should return an empty array if the argument is the window object', () => {
        expect(parentsAndSelf(window)).toEqual([]);
    });

    it('should return an array containing all ancestors including the given node', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3">
                    <div id="node4"></div>
                </div>
            </div>
        `);
        expect(parentsAndSelf(node4)).toEqual([node4, node3, node1, body, root]);

        const fragment = document.createDocumentFragment();
        fragment.appendChild(node1);
        expect(parentsAndSelf(node4)).toEqual([node4, node3, node1, fragment]);
    });

    it('should support any object with parent or parentNode property', () => {
        const obj1 = { id: 1 };
        const obj2 = { id: 2, parent: obj1 };
        const obj3 = { id: 3, parent: obj2 };
        expect(parentsAndSelf(obj3)).toEqual([obj3, obj2, obj1]);
    });
});

describe('selectIncludeSelf', () => {
    it('should include the given element in the returned array if it matches the selector', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1" class="selected">
                <div id="node2"></div>
                <div id="node3" class="selected">
                    <div id="node4" class="selected"></div>
                </div>
            </div>
        `);
        expect(selectIncludeSelf('.selected', node1)).toEqual([node1, node3, node4]);
    });

    it('should default container to the root element', () => {
        expect(selectIncludeSelf(':root')).toEqual([root]);
    });
});

describe('selectClosestRelative', () => {
    it('should return the first matched element within the container', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3">
                    <div id="node4" class="selected"></div>
                </div>
            </div>
        `);
        expect(selectClosestRelative('.selected', node1)).toEqual(node4);
    });

    it('should return closest matched ancestor', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1" class="selected">
                <div id="node2"></div>
                <div id="node3">
                    <div id="node4" class="selected"></div>
                </div>
            </div>
        `);
        expect(selectClosestRelative('.selected', node2)).toEqual(node1);
    });

    it('should return matched element that has the closest common ancestor', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3">
                    <div id="node4" class="selected"></div>
                </div>
            </div>
        `);
        expect(selectClosestRelative('.selected', node2)).toEqual(node4);
    });
});

describe('createNodeIterator', () => {
    it('should call document.createNodeIterator with correct arguments', () => {
        createNodeIterator(body, 1, defaultAcceptNode);
        createNodeIterator(body, 1, 0);
        verifyCalls(document.createNodeIterator, [
            [body, 1, defaultAcceptNode, false],
            [body, 1, null, false],
        ]);
    });
});

describe('createTreeWalker', () => {
    it('should call document.createTreeWalker with correct arguments', () => {
        createTreeWalker(body, 1, defaultAcceptNode);
        createTreeWalker(body, 1, 0);
        verifyCalls(document.createTreeWalker, [
            [body, 1, defaultAcceptNode, false],
            [body, 1, null, false],
        ]);
    });
});

describe('bind', () => {
    it('should add event listener to the specified element', () => {
        const cb = mockFn();
        bind(body, 'customEvent', cb);
        body.dispatchEvent(new CustomEvent('customEvent'));
        expect(cb).toBeCalledTimes(1);

        cb.mockClear();
        body.removeEventListener('customEvent', cb);
        body.dispatchEvent(new CustomEvent('customEvent'));
        expect(cb).not.toBeCalled();
    });

    it('should return a callback which remove the event listener', () => {
        const cb = mockFn();
        const unbind = bind(body, 'customEvent', cb);
        body.dispatchEvent(new CustomEvent('customEvent'));
        expect(cb).toBeCalledTimes(1);

        cb.mockClear();
        unbind();
        body.dispatchEvent(new CustomEvent('customEvent'));
        expect(cb).not.toBeCalled();

        // unbind only be effective exactly once
        bind(body, 'customEvent', cb);
        unbind();
        body.dispatchEvent(new CustomEvent('customEvent'));
        expect(cb).toBeCalledTimes(1);
    });

    it('should add multiple event listeners when given a dictionary', () => {
        const cb = mockFn();
        const unbind = bind(body, {
            customEvent1: cb,
            customEvent2: cb
        });
        body.dispatchEvent(new CustomEvent('customEvent1'));
        body.dispatchEvent(new CustomEvent('customEvent2'));
        verifyCalls(cb, [
            [objectContaining({ type: 'customEvent1' })],
            [objectContaining({ type: 'customEvent2' })],
        ]);
        unbind();
    });
});

describe('bindOnce', () => {
    it('should remove event listener when callback is invoked', () => {
        const cb = mockFn();
        bindOnce(body, 'customEvent1 customEvent2', cb);
        body.dispatchEvent(new CustomEvent('customEvent1'));
        body.dispatchEvent(new CustomEvent('customEvent2'));
        verifyCalls(cb, [
            [objectContaining({ type: 'customEvent1' })],
        ]);
    });

    it('should return a callback which remove the event listener', () => {
        const cb = mockFn();
        const unbind = bind(body, 'customEvent1 customEvent2', cb);
        unbind();
        body.dispatchEvent(new CustomEvent('customEvent1'));
        body.dispatchEvent(new CustomEvent('customEvent2'));
        expect(cb).not.toBeCalled();
    });
});

describe('bindUntil', () => {
    it('should remove event listener once the promise is fulfilled or rejected', async () => {
        const cb = mockFn();
        const promise = delay();
        bindUntil(promise, body, 'customEvent', cb);
        body.dispatchEvent(new CustomEvent('customEvent'));
        expect(cb).toBeCalledTimes(1);

        await promise;
        body.dispatchEvent(new CustomEvent('customEvent'));
        expect(cb).toBeCalledTimes(1);
    });
});

describe('dispatchDOMMouseEvent', () => {
    it('should re-emit the mouse event', () => {
        var returnValue;
        const cb = mockFn(/** @param e {MouseEvent} */ e => {
            if (!cb.mock.calls[1]) {
                returnValue = dispatchDOMMouseEvent(e);
            } else {
                e.preventDefault();
            }
        });
        const unbind = bind(body, 'click', cb);
        body.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 100
        }));
        unbind();
        expect(cb).toBeCalledTimes(2);
        expect(returnValue).toBe(false);
    });
});

describe('removeNode', () => {
    it('should remove node from its parent', () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        removeNode(node2);
        expect(node1.childElementCount).toBe(0);
    });

    it('should not throw if the node has no parent', () => {
        expect(() => removeNode(document.createElement('div'))).not.toThrow();
    });
});

describe('getClass', () => {
    it('should return false if no matching class or class-*', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1" class=""></div>
            <div id="node2" class="test"></div>
            <div id="node3" class="test-a test-b"></div>
            <div id="node4" class="test-a test-b test-sub test-sub-c"></div>
        `);
        expect(getClass(node1, 'test')).toEqual(false);
        expect(getClass(node2, 'test')).toEqual(true);
        expect(getClass(node3, 'test')).toEqual(['a', 'b']);
        expect(getClass(node4, 'test')).toEqual(['a', 'b', 'sub', 'sub-c']);
        expect(getClass(node4, 'test-sub')).toEqual(['c']);
    });

    it('should work on svg elements', () => {
        const { svg } = initBody(`
            <svg id="svg" height="100" width="100" class="test">
                <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
            </svg>
        `);
        expect(getClass(svg, 'test')).toEqual(true);
    });
});

describe('setClass', () => {
    it('should update element\'s classList', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1" class=""></div>
            <div id="node2" class="test other"></div>
            <div id="node3" class="test-a test-b"></div>
            <div id="node4" class="test-a test-b test-sub test-sub-c"></div>
        `);
        setClass(node1, 'test', true);
        setClass(node2, 'test', false);
        expect(node1.classList).toContain('test');
        expect(node2.classList).not.toContain('test');
        expect(node2.classList).toContain('other');

        setClass(node1, 'test', ['a', 'b']);
        expect(node1.classList).toContain('test');
        expect(node1.classList).toContain('test-a');
        expect(node1.classList).toContain('test-b');

        setClass(node3, 'test', ['c']);
        expect(node3.classList).toContain('test-c');
        expect(node3.classList).not.toContain('test-a');
        expect(node3.classList).not.toContain('test-b');

        setClass(node4, 'test-sub', false);
        expect(node4.classList).not.toContain('test-sub');
        expect(node4.classList).not.toContain('test-sub-c');
        expect(node4.classList).toContain('test-a');
        expect(node4.classList).toContain('test-b');
    });

    it('should update the list of classes starting with the prefix based on key-value pairs of an object', () => {
        const div = document.createElement('div');
        div.className = 'test-d';

        setClass(div, 'test', {
            a: 1,
            b: 0,
            c: {}
        });
        expect(div.classList).toContain('test-a');
        expect(div.classList).toContain('test-c');
        expect(div.classList).not.toContain('test-b');
        expect(div.classList).not.toContain('test-d');
    });

    it('should work on svg elements', () => {
        const { svg } = initBody(`
            <svg id="svg" height="100" width="100">
                <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
            </svg>
        `);
        setClass(svg, 'test', true);
        expect(svg.classList.contains('test'));
    });
});

describe('getScrollOffset', () => {
    it('should return value from pageXOffset and pageYOffset if property exists', () => {
        // @ts-ignore
        expect(getScrollOffset({
            pageXOffset: 42,
            pageYOffset: 84
        })).toEqual({ x: 42, y: 84 });
    });

    it('should return value from scrollLeft and scrollTop if property exists', () => {
        // @ts-ignore
        expect(getScrollOffset({
            scrollLeft: 42,
            scrollTop: 84
        })).toEqual({ x: 42, y: 84 });
    });

    it('should return default value otherwise', () => {
        // @ts-ignore
        expect(getScrollOffset({})).toEqual({ x: 0, y: 0 });
    });
});

describe('getScrollParent', () => {
    it('should return `absolute`-positioned ancestor', () => {
        const { node1, node2, node3 } = initBody(`
            <div id="node1" style="position: absolute; overflow: visible;">
                <div id="node2" style="position: absolute; overflow: visible;">
                    <div id="node3" style="position: static; overflow: visible;"></div>
                </div>
            </div>
        `);
        expect(getScrollParent(node3)).toBe(node2);
    });

    it('should return `auto`-overflowing ancestor', () => {
        const { node1, node2, node3 } = initBody(`
            <div id="node1" style="position: absolute; overflow: visible;">
                <div id="node2" style="position: static; overflow: auto;">
                    <div id="node3" style="position: static; overflow: visible;"></div>
                </div>
            </div>
        `);
        expect(getScrollParent(node3)).toBe(node2);
    });
});

describe('scrollBy', () => {
    it('should emit scrollBy event and return the result', () => {
        const result = { x: 0, y: 0 };
        const cb = mockFn().mockReturnValue(result);
        bindEvent(body, 'scrollBy', cb);

        expect(scrollBy(body, 10, 20)).toBe(result);
        expect(cb).toBeCalledWith(objectContaining({ type: 'scrollBy', target: body, x: 10, y: 20, behavior: 'auto' }), _);

        expect(scrollBy(body, 10, 20, 'instant')).toBe(result);
        expect(cb).toBeCalledWith(objectContaining({ type: 'scrollBy', target: body, x: 10, y: 20, behavior: 'instant' }), _);

        expect(scrollBy(body, 10, 20, 'smooth')).toBe(result);
        expect(cb).toBeCalledWith(objectContaining({ type: 'scrollBy', target: body, x: 10, y: 20, behavior: 'smooth' }), _);
    });

    it('should call scrollBy on root for window, root and body element', () => {
        scrollBy(window, 10, 10);
        expect(root.scrollBy).toBeCalledTimes(1);
        scrollBy(root, 10, 10);
        expect(root.scrollBy).toBeCalledTimes(2);
        scrollBy(body, 10, 10);
        expect(root.scrollBy).toBeCalledTimes(3);
    });

    it('should set scrollLeft and scrollTop property for element when overflow is set to scroll', () => {
        const { node } = initBody(`<div id="node" x-rect="0 0 100 100" x-scroll="0 0 110 110"></div>`);
        node.scrollBy = mockFn(() => {
            node.setAttribute('x-scroll', '110 110 110 110');
        });
        expect(scrollBy(node, 20, 30)).toEqual({ x: 10, y: 10 });
        expect(node.scrollBy).toBeCalledWith({ behavior: 'instant', left: 20, top: 30 });
    });

    it('should not set scrollLeft and scrollTop property for element when overflow is not set to scroll', () => {
        const { node } = initBody(`<div id="node" style="overflow-x: visible; overflow-y: visible" x-rect="0 0 100 100" x-scroll="0 0 110 110"></div>`);
        node.scrollBy = mockFn(() => {
            node.setAttribute('x-scroll', '110 110 110 110');
        });
        expect(scrollBy(node, 20, 30)).toEqual({ x: 0, y: 0 });
        expect(node.scrollBy).not.toBeCalled();
    });
});

describe('getContentRect', () => {
    it('should emit getContentRect event and return the result', () => {
        const result = toPlainRect(0, 0, 0, 0);
        const cb = mockFn().mockReturnValue(result);
        bindEvent(body, 'getContentRect', cb);
        expect(getContentRect(body)).toEqual(result);
        expect(cb).toBeCalledWith(objectContaining({ type: 'getContentRect', target: body }), _);
    });

    it('should deduct scrollbar size if overflow is not visible', () => {
        const { node } = initBody(`<div id="node" x-rect="0 0 100 100" x-rect-inner="0 0 90 90"></div>`);
        getBoundingClientRect.mockReturnValueOnce(toPlainRect(0, 0, 100, 100));
        expect(getContentRect(node)).toEqual(toPlainRect(0, 0, 90, 90));

        node.setAttribute('x-rect-inner', '10 10 90 90');
        getBoundingClientRect.mockReturnValueOnce(toPlainRect(0, 0, 100, 100));
        expect(getContentRect(node)).toEqual(toPlainRect(10, 10, 100, 100));
    });

    it('should return correct rect for root when it is scrollable', () => {
        setRootSize(200, 200);
        getBoundingClientRect.mockReturnValueOnce(root.getBoundingClientRect());
        expect(getContentRect(root)).toEqual(toPlainRect(0, 0, 100, 100));
    });

    it('should return correct rect for root with scroll padding when viewport is shifted', () => {
        setBoxStyle(root, 'scrollPadding', '20px');
        getBoundingClientRect.mockReturnValueOnce(root.getBoundingClientRect());
        expect(getContentRect(root)).toEqual(toPlainRect(20, 20, 80, 80));

        // bounding rect of root element is shifted up when scrolled
        getBoundingClientRect.mockReturnValueOnce(toPlainRect(root.getBoundingClientRect()).translate(0, -50));
        expect(getContentRect(root)).toEqual(toPlainRect(20, 0, 80, 30));
    });
});

describe('scrollIntoView', () => {
    it('should return false if scrolling did not happen', () => {
        const { node1, node2, node3 } = initBody(`
            <div id="node1" style="position: static; overflow: auto;">
                <div id="node2" style="position: static; overflow: auto;">
                    <div id="node3" style="position: static; overflow: visible;"></div>
                </div>
            </div>
        `);
        expect(scrollIntoView(node3)).toBe(false);
    });
});

describe('getRect', () => {
    it('should call getRect() of the given object if method exists', () => {
        const cb = mockFn().mockReturnValue(42);
        expect(getRect({ getRect: cb })).toEqual(42);
        expect(cb).toBeCalledTimes(1);
    });

    it('should return rect representating viewport of the current window', () => {
        const result = toPlainRect(0, 0, root.clientWidth, root.clientHeight);
        expect(getRect()).toEqual(result);
        expect(getRect(window)).toEqual(result);

        setViewportSize(60, 60);
        expect(getRect()).toEqual(toPlainRect(0, 0, 60, 60));
        expect(getRect(window)).toEqual(toPlainRect(0, 0, 60, 60));
    });

    it('should return a zero rect at (0, 0) for detached element', () => {
        expect(getRect(document.createElement('div'))).toEqual(toPlainRect(0, 0, 0, 0));
    });

    it('should call getBoundingClientRect for element', () => {
        const { node } = initBody(`<div id="node"></div>`);
        expect(getRect(node)).toEqual(toPlainRect(0, 0, 0, 0));
        expect(getBoundingClientRect).toBeCalledTimes(1);
        getBoundingClientRect.mockClear();

        // normal case
        getRect(node);
        getRect(node, 10);
        getRect(node, true);
        getRect(node, 'margin-box');
        getRect(node, 'border-box');
        getRect(node, 'padding-box');
        getRect(node, 'content-box');

        const arr0 = getBoundingClientRect.mock.instances;
        expect(arr0.at(-1)).toBe(node);
        expect(arr0).toEqual(new Array(arr0.length).fill(arr0.at(-1)));
        getBoundingClientRect.mockClear();

        // special case for root
        getRect(root);
        getRect(root, 10);

        const arr1 = getBoundingClientRect.mock.instances;
        expect(arr1.at(-1)).toBeInstanceOf(Element);
        expect(arr1.at(-1)).not.toBe(root);
        expect(arr1).toEqual(new Array(arr1.length).fill(arr1.at(-1)));
        getBoundingClientRect.mockClear();

        getRect(root, true);
        getRect(root, 'margin-box');
        getRect(root, 'border-box');
        getRect(root, 'padding-box');
        getRect(root, 'content-box');

        const arr2 = getBoundingClientRect.mock.instances;
        expect(arr2.at(-1)).toBe(root);
        expect(arr2).toEqual(new Array(arr2.length).fill(arr2.at(-1)));
    });

    it('should return a rect including element\'s margin if second argument is true', () => {
        const { node } = initBody(`
            <div id="node" style="margin-left: 1px; margin-top: 2px; margin-right: 3px; margin-bottom: 4px;"></div>
        `);
        expect(getRect(node, true)).toEqual(toPlainRect(-1, -2, 3, 4));
    });

    it('should return a rect expanded by the specified amount', () => {
        const { node } = initBody(`<div id="node"></div>`);
        const cb = mockFn().mockReturnValue(toPlainRect(0, 0, 0, 0));
        expect(getRect(node, 10)).toEqual(toPlainRect(-10, -10, 10, 10));
        expect(getRect({ getRect: cb }, 10)).toEqual(toPlainRect(-10, -10, 10, 10));
    });

    it('should return a rect representating the specified box of an element', () => {
        const { node } = initBody(`<div id="node" x-rect="100 100 100 100"></div>`);
        setBoxStyle(node, 'margin', '10px');
        setBoxStyle(node, 'padding', '10px');
        setBoxStyle(node, 'borderWidth', '10px');
        setBoxStyle(node, 'borderStyle', 'solid');

        expect(getRect(node, 'border-box')).toEqual(toPlainRect(100, 100, 200, 200));
        expect(getRect(node, 'padding-box')).toEqual(toPlainRect(110, 110, 190, 190));
        expect(getRect(node, 'content-box')).toEqual(toPlainRect(120, 120, 180, 180));
        expect(getRect(node, 'margin-box')).toEqual(toPlainRect(90, 90, 210, 210));

        setBoxStyle(node, 'margin', '-5px');
        expect(getRect(node, 'margin-box')).toEqual(toPlainRect(105, 105, 195, 195));
    });

    it('should ignore second parameter is element is not visible', () => {
        const { node } = initBody(`<div id="node" style="display: none"></div>`);
        expect(isVisible(node)).toBe(false);
        expect(getRect(node)).toEqual(toPlainRect(0, 0, 0, 0));
        expect(getRect(node, 5)).toEqual(toPlainRect(0, 0, 0, 0));
    });
});

describe('toPlainRect', () => {
    it('should return a Rect object', () => {
        const rect = toPlainRect(0, 10, 20, 30);
        expect(rect).toMatchObject({
            left: 0,
            top: 10,
            right: 20,
            bottom: 30,
            centerX: 10,
            centerY: 20,
            width: 20,
            height: 20
        });
        expect(rect.translate).toBeInstanceOf(Function);
        expect(rect.collapse).toBeInstanceOf(Function);
        expect(rect.expand).toBeInstanceOf(Function);
        expect(Object.getPrototypeOf(rect)).not.toBe(Object.prototype);
    });

    it('should accept two arguments as left and top coordinates', () => {
        expect(toPlainRect(0, 10)).toMatchObject({
            left: 0,
            top: 10,
            right: 0,
            bottom: 10
        });
    });

    it('should accept object as the single argument', () => {
        const rect = {
            left: 0,
            top: 10,
            right: 20,
            bottom: 30,
        };
        // @ts-ignore
        expect(toPlainRect(rect)).toMatchObject(rect);
    });
});

describe('rectEquals', () => {
    it('should return true when all coordinates differs within 1 pixel', () => {
        const rect1 = toPlainRect(1, 1, 10, 10);
        const rect2 = toPlainRect(0.5, 1.5, 10.5, 9.5);
        const rect3 = toPlainRect(1, 1, 8, 8);
        expect(rectEquals(rect1, rect1)).toBe(true);
        expect(rectEquals(rect1, rect2)).toBe(true);
        expect(rectEquals(rect1, rect3)).toBe(false);
    });
});

describe('rectCovers', () => {
    it('should return true if the first rect covers the second rect', () => {
        const rect1 = toPlainRect(1, 1, 10, 10);
        const rect2 = toPlainRect(2, 2, 9, 9);
        expect(rectCovers(rect1, rect1)).toBe(true);
        expect(rectCovers(rect1, rect2)).toBe(true);
        expect(rectCovers(rect2, rect1)).toBe(false);
    });
});

describe('rectIntersects', () => {
    it('should return true if the two rects intersects', () => {
        const rect1 = toPlainRect(1, 1, 10, 10);
        const rect2 = toPlainRect(2, 2, 9, 9);
        const rect3 = toPlainRect(0, 0, 2, 2);
        const rect4 = toPlainRect(1, 11, 10, 20);
        expect(rectIntersects(rect1, rect1)).toBe(true);
        expect(rectIntersects(rect1, rect2)).toBe(true);
        expect(rectIntersects(rect2, rect1)).toBe(true);
        expect(rectIntersects(rect1, rect3)).toBe(true);
        expect(rectIntersects(rect1, rect4)).toBe(false);
        expect(rectIntersects(rect4, rect1)).toBe(false);
    });
});

describe('pointInRect', () => {
    it('should return true if the point is in the rect', () => {
        const rect1 = toPlainRect(1, 1, 10, 10);
        expect(pointInRect(1, 1, rect1)).toBe(true);
        expect(pointInRect(1, 10, rect1)).toBe(true);
        expect(pointInRect(10, 1, rect1)).toBe(true);
        expect(pointInRect(10, 10, rect1)).toBe(true);
        expect(pointInRect(5, 5, rect1)).toBe(true);
        expect(pointInRect(11, 1, rect1)).toBe(false);
    });

    it('should return true if the point is within the specified distance', () => {
        const rect1 = toPlainRect(1, 1, 10, 10);
        expect(pointInRect(0, 0, rect1, 1)).toBe(true);
    });
});

describe('mergeRect', () => {
    it('should return a rect than inscribe the two rects', () => {
        const rect1 = toPlainRect(1, 1, 10, 10);
        const rect2 = toPlainRect(2, 2, 9, 9);
        const rect4 = toPlainRect(11, 11, 20, 20);
        expect(mergeRect(rect1, rect1)).toEqual(rect1);
        expect(mergeRect(rect1, rect2)).toEqual(rect1);
        expect(mergeRect(rect1, rect4)).toEqual(toPlainRect(1, 1, 20, 20));
    });
});

describe('elementFromPoint', () => {
    it('should call document.elementsFromPoint and return the first element within container', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1">
                <div id="node3">
                    <div id="node4" style="pointer-events: none"></div>
                </div>
            </div>
            <div id="node2"></div>
        `);
        // @ts-ignore
        document.elementsFromPoint.mockReturnValueOnce([node2, node4, node3, node1]);
        expect(elementFromPoint(0, 0, node1)).toBe(node3);
        expect(document.elementsFromPoint).toBeCalledWith(0, 0);
    });
});

describe('Rect.collapse', () => {
    it('should return a new rect collapsed to the specified side', () => {
        const rect = toPlainRect(0, 10, 20, 30);
        expect(rect.collapse('left')).toEqual(toPlainRect(0, 10, 0, 30));
        expect(rect.collapse('right')).toEqual(toPlainRect(20, 10, 20, 30));
        expect(rect.collapse('top')).toEqual(toPlainRect(0, 10, 20, 10));
        expect(rect.collapse('bottom')).toEqual(toPlainRect(0, 30, 20, 30));
    });

    it('should not modify the original rect', () => {
        const rect = toPlainRect(0, 10, 20, 30);
        rect.collapse('top');
        expect(rect).toEqual(toPlainRect(0, 10, 20, 30));
    });
});

describe('Rect.translate', () => {
    it('should return a new rect translated by the specified amount', () => {
        const rect = toPlainRect(0, 10, 20, 30);
        expect(rect.translate(1, 1)).toEqual(toPlainRect(1, 11, 21, 31));
    });

    it('should not modify the original rect', () => {
        const rect = toPlainRect(0, 10, 20, 30);
        rect.translate(1, 1);
        expect(rect).toEqual(toPlainRect(0, 10, 20, 30));
    });
});

describe('Rect.expand', () => {
    it('should return a new rect expanded or shrinked by the specified amount', () => {
        const rect = toPlainRect(0, 10, 20, 30);
        expect(rect.expand(1, 2, 3, 4)).toEqual(toPlainRect(-1, 8, 23, 34));
        expect(rect.expand(1, 2, 3)).toEqual(toPlainRect(-1, 8, 23, 32));
        expect(rect.expand(1, 2)).toEqual(toPlainRect(-1, 8, 21, 32));
        expect(rect.expand(1)).toEqual(toPlainRect(-1, 9, 21, 31));
        expect(rect.expand(-1, -2, -3, -4)).toEqual(toPlainRect(1, 12, 17, 26));
    });

    it('should accept object as first argument', () => {
        const rect = toPlainRect(0, 10, 20, 30);
        expect(rect.expand({
            left: 1,
            top: 2,
            right: 3,
            bottom: 4
        })).toEqual(toPlainRect(-1, 8, 23, 34));
        expect(rect.expand({
            left: 1,
            top: 2,
            right: 3,
            bottom: 4
        }, -1)).toEqual(toPlainRect(1, 12, 17, 26));
    });

    it('should shrinked each side on pro rata when shrink amount is greater than the dimension', () => {
        const rect = toPlainRect(0, 0, 10, 10);
        expect(rect.expand(-10, -10)).toEqual(toPlainRect(5, 5, 5, 5));
        expect(rect.expand(-10, -10, -40, -40)).toEqual(toPlainRect(2, 2, 2, 2));
    });

    it('should not modify the original rect', () => {
        const rect = toPlainRect(0, 10, 20, 30);
        rect.expand(1, 1);
        expect(rect).toEqual(toPlainRect(0, 10, 20, 30));
    });
});
