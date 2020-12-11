import { initBody, mockFn, root, verifyCalls } from "./testUtil";
import { InheritedNode, InheritedNodeTree, TraversableNode, TraversableNodeTree, TreeWalker } from "../src/tree";

/** @type {<T extends Zeta.VirtualNode>(tree: Zeta.NodeTree<T>, ...nodes: Element[]) => T[]} */
function setNodes(tree, ...nodes) {
    return nodes.map(v => Object.assign(tree.setNode(v), { id: v.id }));
}

describe('NodeTree', () => {
    it('should create node of correct type', () => {
        const tree1 = new TraversableNodeTree(root);
        expect(tree1.rootNode).toBeInstanceOf(TraversableNode);

        const tree2 = new InheritedNodeTree(root);
        expect(tree2.rootNode).toBeInstanceOf(InheritedNode);

        /** @class */
        function A() { }
        const tree3 = new TraversableNodeTree(root, A);
        expect(tree3.rootNode).toBeInstanceOf(TraversableNode);
        expect(tree3.rootNode).toBeInstanceOf(A);

        /** @class */
        function B() { }
        const tree4 = new InheritedNodeTree(root, B);
        expect(tree4.rootNode).toBeInstanceOf(InheritedNode);
        expect(tree4.rootNode).toBeInstanceOf(B);

        class C extends TraversableNode { }
        const tree5 = new TraversableNodeTree(root, C);
        expect(tree5.rootNode).toBeInstanceOf(C);

        class D extends InheritedNode { }
        const tree6 = new InheritedNodeTree(root, D);
        expect(tree6.rootNode).toBeInstanceOf(D);
    });

    it('should handle removal of a sub-tree', () => {
        // fix @ 459f9a0
        const { node1, node2, node3, node4, node5 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3">
                    <div id="node5"></div>
                </div>
                <div id="node4"></div>
            </div>
        `);
        const tree = new TraversableNodeTree(node1);
        const [vnode1, vnode2, vnode3, vnode4, vnode5] = setNodes(tree, node1, node2, node3, node4, node5);

        node1.removeChild(node3);
        expect(vnode3.parentNode).toBeNull();
        expect(vnode2.nextSibling).toBe(vnode4);
        expect(vnode4.previousSibling).toBe(vnode2);
        expect(vnode1.childNodes.length).toBe(2);
        expect(vnode5.parentNode).toBe(vnode3);
    });
});

describe('NodeTree.setNode', () => {
    it('should not throw error with element that is not descandant of root element', () => {
        // fix @ 61f40ff
        const { node1, node2 } = initBody(`
            <div id="node1"></div>
            <div id="node2"></div>
        `);
        const tree = new TraversableNodeTree(node1);
        expect(() => tree.setNode(node2)).not.toThrow();

        // const vnode = tree.setNode(node2);
        // expect(vnode.parentNode).toBeNull();
        // expect(vnode.previousSibling).toBeNull();
    });
});

describe('NodeTree.removeNode', () => {
    it('should set properties of affected nodes properly', () => {
        // fix @ 459f9a0
        const { node1, node2, node3, node4, node5 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3">
                    <div id="node5"></div>
                </div>
                <div id="node4"></div>
            </div>
        `);
        const tree = new TraversableNodeTree(node1);
        const [vnode1, vnode2, vnode3, vnode4, vnode5] = setNodes(tree, node1, node2, node3, node4, node5);

        tree.removeNode(vnode3);
        expect(vnode1.childNodes).toEqual([vnode2, vnode5, vnode4]);
        expect(vnode2.nextSibling).toBe(vnode5);
        expect(vnode5.nextSibling).toBe(vnode4);
        expect(vnode4.previousSibling).toBe(vnode5);
        expect(vnode5.previousSibling).toBe(vnode2);

        expect(vnode3.parentNode).toBeNull();
        expect(vnode3.previousSibling).toBeNull();
        expect(vnode3.nextSibling).toBeNull();
    });
});

describe('NodeTree.update', () => {
    it('should force an update on its node members', () => {
        const { node1, node2, node3 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3"></div>
            </div>
        `);
        const tree = new InheritedNodeTree(node1);
        const [vnode1, vnode2, vnode3] = setNodes(tree, node1, node2, node3);
        expect(Object.getPrototypeOf(vnode3)).toBe(vnode1);

        node2.appendChild(node3);
        expect(Object.getPrototypeOf(vnode3)).toBe(vnode1);

        tree.update();
        expect(Object.getPrototypeOf(vnode3)).toBe(vnode2);
    });
});

describe('NodeTree update event', () => {
    it('should include re-attached nodes', () => {
        const { node1, node2, node3 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3"></div>
            </div>
        `);
        const tree = new InheritedNodeTree(node1);
        const [vnode1, vnode2, vnode3] = setNodes(tree, node1, node2, node3);
        node1.removeChild(node2);
        tree.update();

        tree.on('update', e => {
            expect(e.updatedNodes).toContain(vnode2);
        });
        node1.appendChild(node2);
        tree.update();
        expect.hasAssertions();
    });
});

describe('TraversableNodeTree.acceptNode', () => {
    it('should be called when traversing', () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const cb = mockFn().mockReturnValue(1);
        const tree = new TraversableNodeTree(node1);
        tree.acceptNode = cb;
        setNodes(tree, node1, node2);

        const iterator = new TreeWalker(tree.rootNode);
        iterator.nextNode();
        expect(cb).toBeCalledTimes(1);
    });

    it('should be called with correct this and arguments', () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const cb = mockFn().mockReturnValue(1);
        const tree = new TraversableNodeTree(node1);
        tree.acceptNode = function () {
            return cb(this, ...arguments);
        };
        const [vnode1, vnode2] = setNodes(tree, node1, node2);
        const iterator = new TreeWalker(tree.rootNode);
        iterator.nextNode();
        verifyCalls(cb, [
            [expect.sameObject(tree), expect.sameObject(vnode2), expect.sameObject(iterator)]
        ]);
    });

    it('should be called before TreeWalker.filter', () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const cb = mockFn().mockReturnValue(1);
        const tree = new TraversableNodeTree(node1);
        tree.acceptNode = function () {
            return cb('tree.acceptNode');
        };
        setNodes(tree, node1, node2);

        const iterator = new TreeWalker(tree.rootNode, -1, () => cb('iterator.acceptNode'));
        iterator.nextNode();
        verifyCalls(cb, [
            ['tree.acceptNode'],
            ['iterator.acceptNode']
        ]);
    });

    it('should stop TreeWalker.filter to be called if node is skipped', () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const cb = mockFn().mockReturnValue(3);
        const tree = new TraversableNodeTree(node1);
        tree.acceptNode = function () {
            return cb('tree.acceptNode');
        };
        setNodes(tree, node1, node2);

        const iterator = new TreeWalker(tree.rootNode, -1, () => cb('iterator.acceptNode'));
        iterator.nextNode();
        verifyCalls(cb, [
            ['tree.acceptNode']
        ]);
    });
});

describe('InheritedNodeTree.descendants', () => {
    it('should iterate all descendants in node order', () => {
        const { node1, node2, node3, node4, node5 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3">
                    <div id="node5"></div>
                </div>
                <div id="node4"></div>
            </div>
        `);
        const tree = new InheritedNodeTree(node1);
        const [vnode1, vnode2, vnode3, vnode4, vnode5] = setNodes(tree, node1, node2, node3, node4, node5);

        const iterator = tree.descendants(vnode1);
        expect(iterator.next()).toEqual({ done: false, value: vnode1 });
        expect(iterator.next()).toEqual({ done: false, value: vnode2 });
        expect(iterator.next()).toEqual({ done: false, value: vnode3 });
        expect(iterator.next()).toEqual({ done: false, value: vnode5 });
        expect(iterator.next()).toEqual({ done: false, value: vnode4 });
        expect(iterator.next()).toEqual({ done: true });
        expect(iterator.next()).toEqual({ done: true });
    });
});

describe('TreeWalker.nextNode', () => {
    it('should iterate all descendants in node order', () => {
        const { node1, node2, node3, node4, node5 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3">
                    <div id="node5"></div>
                </div>
                <div id="node4"></div>
            </div>
        `);
        const tree = new TraversableNodeTree(node1);
        const [vnode1, vnode2, vnode3, vnode4, vnode5] = setNodes(tree, node1, node2, node3, node4, node5);

        const iterator = new TreeWalker(tree.rootNode);
        expect(iterator.currentNode).toEqual(vnode1);
        expect(iterator.nextNode()).toEqual(vnode2);
        expect(iterator.nextNode()).toEqual(vnode3);
        expect(iterator.nextNode()).toEqual(vnode5);
        expect(iterator.nextNode()).toEqual(vnode4);
        expect(iterator.nextNode()).toBeNull();
        expect(iterator.nextNode()).toBeNull();
    });

    it('should honor the return value of tree.acceptNode', () => {
        const { node1, node2, node3, node4, node5 } = initBody(`
            <div id="node1">
                <div id="node2">
                    <div id="node4"></div>
                </div>
                <div id="node3">
                    <div id="node5"></div>
                </div>
            </div>
        `);
        const tree = new TraversableNodeTree(node1);
        const [vnode1, vnode2, vnode3, vnode4, vnode5] = setNodes(tree, node1, node2, node3, node4, node5);
        tree.acceptNode = function (node) {
            return node === vnode2 ? 2 : node === vnode3 ? 3 : 1;
        };

        const iterator = new TreeWalker(tree.rootNode);
        expect(iterator.nextNode()).toBe(vnode5);
        expect(iterator.nextNode()).toBeNull();
    });
});
