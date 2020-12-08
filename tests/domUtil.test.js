import { combineNodeFilters, comparePosition, getClass, is, setClass } from "../src/domUtil";
import { initBody } from "./testUtil";

describe('is', () => {
    xit('[need fix] should check DOM node with node type enum', () => {
        // fix @ 19d1d38
        const cases = [
            document.createElement('div'),
            document.createTextNode(''),
            document.createDocumentFragment(),
            document.createComment('')
        ];
        cases.forEach((node) => {
            for (var i = 1; i <= 11; i++) {
                expect(`(${node.nodeType}, ${i}) = ${!!is(node, i)}`).toBe(`(${node.nodeType}, ${i}) = ${i === node.nodeType}`);
            }
        });
    });
});

describe('combineNodeFilters', () => {
    const return1 = () => 1;
    const return2 = () => 2;
    const return3 = () => 3;

    it('should return 2 if any callback return 2', () => {
        expect(combineNodeFilters(return1, return2, return3)()).toBe(2);
    });

    it('should return 3 if any callback return 3 and no callback return 2', () => {
        expect(combineNodeFilters(return1, return1, return3)()).toBe(3);
    });

    it('should return 1 if all callback return 1', () => {
        expect(combineNodeFilters(return1, return1, return1)()).toBe(1);
    });

    it('should return 1 if there is no callback', () => {
        expect(combineNodeFilters()()).toBe(1);
    });

    it('does not throw when argument is not function', () => {
        expect(() => combineNodeFilters(1, 2, 3)()).not.toThrow();
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
});
