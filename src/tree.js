import { comparePosition, containsOrEquals, createTreeWalker, iterateNode, parentsAndSelf } from "./domUtil.js";
import { root } from "./env.js";
import { ZetaEventContainer } from "./events.js";
import { observe, watchElements } from "./observe.js";
import { createPrivateStore, defineHiddenProperty, defineOwnProperty, definePrototype, each, equal, extend, grep, is, isFunction, isPlainObject, kv, map, mapGet, mapRemove, noop, pick } from "./util.js";

const SNAPSHOT_PROPS = 'parentNode previousSibling nextSibling'.split(' ');

const _ = createPrivateStore();
const previous = new WeakMap();
const setPrototypeOf = Object.setPrototypeOf;
const collectMutations = observe(root, handleMutations);

/** @type {WeakMap<Element, VersionState>} */
var versionMap = new WeakMap();
var version = 0;

/* --------------------------------------
 * Helper functions
 * -------------------------------------- */

function throwOrReturn(result, throwError, message) {
    if (!result && throwError) {
        throw new Error(message);
    }
    return result;
}

function assertSameTree(tree, node, throwError) {
    var assert = _(node).tree === tree;
    return throwOrReturn(assert, throwError, 'Node does not belongs to this tree');
}

function assertDescendantOfTree(tree, element, throwError) {
    var assert = containsOrEquals(tree, element);
    return throwOrReturn(assert, throwError, 'Element must be a descendant of the root node');
}

/**
 * @class
 * @property {number} version
 */
function VersionState() {
    this.version = version;
}

function initNode(tree, node, element) {
    var map = (containsOrEquals(tree.element, element) ? _(tree).nodes : _(tree).detached);
    if (map.has(element)) {
        throw new Error('Another node instance already exist');
    }
    var state = mapGet(versionMap, element, VersionState);
    var sNode = _(node, {
        version: version,
        tree: tree,
        node: node,
        traversable: is(node, TraversableNode),
        state: state,
        parentState: state,
        parentNode: null,
        previousSibling: null,
        nextSibling: null,
        childNodes: []
    });
    map.set(element, sNode);
    defineHiddenProperty(node, 'element', element, true);
    if (tree.rootNode) {
        insertNode(sNode);
    }
    return sNode;
}

function findNode(tree, element, returnParent) {
    var sTree = _(tree);
    var sNode = sTree.nodes.get(element) || sTree.detached.get(element) || (returnParent && findParent(tree, element));
    return sNode && checkNodeState(sNode);
}

function findParent(tree, element) {
    if (!element) {
        element = tree.node.element;
        tree = tree.tree;
    }
    if (element !== tree.element) {
        var sTree = _(tree);
        element = element.parentNode;
        for (; element && element !== tree.element; element = element.parentNode) {
            var result = sTree.nodes.get(element) || sTree.detached.get(element);
            if (result) {
                return result;
            }
        }
    }
    return containsOrEquals(tree, element) && _(tree.rootNode);
}

function setParentNode(sNode, sParent) {
    sNode.parentNode = (sParent || '').node || null;
    sNode.parentState = (sParent || sNode).state;
}

function checkNodeState(sNode) {
    collectMutations();
    if (sNode.version !== sNode.parentState.version || _(sNode.tree).collectNewNodes()) {
        updateTree(sNode.tree);
    }
    return sNode;
}

function insertNode(sNode) {
    return (sNode.traversable ? insertTraversableNode : insertInheritedNode)(sNode);
}

function removeNode(sNode, hardRemove) {
    return (sNode.traversable ? removeTraversableNode : removeInheritedNode)(sNode, hardRemove);
}

function removeNodeFromMap(sNode) {
    var sTree = _(sNode.tree);
    var element = sNode.node.element;
    if (!mapRemove(sTree.nodes, element)) {
        // the node is already removed from the tree
        // therefore nothing to do
        return false;
    }
    return removeNode(sNode, true);
}

function insertChildNode(sParent, sChild) {
    if (!sParent || sParent === sChild || sChild.parentNode === sParent.node) {
        return false;
    }
    if (sChild.parentNode) {
        removeNode(sChild);
    }
    var childNodes = sChild.childNodes;
    var parentChildNodes = sParent.childNodes;
    var pos = parentChildNodes.length;
    for (var i = pos - 1; i >= 0; i--) {
        var v = comparePosition(parentChildNodes[i], sChild.node, true);
        if (v < 0) {
            break;
        }
        pos = i;
        if (v !== v) {
            setParentNode(_(parentChildNodes[i]), sChild);
            childNodes.unshift(parentChildNodes.splice(i, 1)[0]);
        }
    }
    setParentNode(sChild, sParent);
    parentChildNodes.splice(pos, 0, sChild.node);
    return [pos, childNodes, parentChildNodes];
}

function insertTraversableNode(sNode) {
    var sParent = findParent(sNode);
    var result = insertChildNode(sParent, sNode);
    if (result) {
        var empty = {};
        var childNodes = result[1];
        if (childNodes[0]) {
            var s1 = _(childNodes[0]);
            var s2 = _(childNodes[childNodes.length - 1]);
            var previousSibling = s1.previousSibling;
            var nextSibling = s2.nextSibling;
            (_(previousSibling) || empty).nextSibling = nextSibling;
            (_(nextSibling) || empty).previousSibling = previousSibling;
            (s1 || empty).previousSibling = null;
            (s2 || empty).nextSibling = null;
        }
        var parentChildNodes = result[2];
        if (parentChildNodes[1]) {
            var pos = result[0];
            var p1 = parentChildNodes[pos - 1] || null;
            var p2 = parentChildNodes[pos + 1] || null;
            sNode.nextSibling = p2;
            sNode.previousSibling = p1;
            (_(p1) || empty).nextSibling = sNode.node;
            (_(p2) || empty).previousSibling = sNode.node;
        }
    }
    return !!result;
}

function insertInheritedNode(sNode) {
    var sParent = findParent(sNode);
    var result = insertChildNode(sParent, sNode);
    if (result) {
        setPrototypeOf(sNode.node, sParent.node);
        each(result[1], function (i, v) {
            setPrototypeOf(v, sNode.node);
        });
    }
    return !!result;
}

function removeTraversableNode(sNode, hardRemove, ignoreSibling) {
    var parent = sNode.parentNode;
    if (!parent) {
        return false;
    }
    var newParent = (findParent(sNode) || '').node;
    if (!hardRemove && newParent === parent) {
        return false;
    }
    var childNodes = [];
    var sParent = _(parent);
    var parentChildNodes = sParent.childNodes;
    var pos = parentChildNodes.indexOf(sNode.node);
    if (hardRemove) {
        newParent = null;
        childNodes = sNode.childNodes.splice(0);
        if (!ignoreSibling && childNodes[0]) {
            var states = map(childNodes, function (v) {
                return _(v);
            });
            states[0].previousSibling = parentChildNodes[pos - 1] || null;
            states[states.length - 1].nextSibling = parentChildNodes[pos + 1] || null;
            each(states, function (i, v) {
                setParentNode(v, sParent);
            });
        }
    }
    if (!ignoreSibling && parentChildNodes[1]) {
        var empty = {};
        var s1 = _(parentChildNodes[pos - 1]);
        var s2 = _(parentChildNodes[pos + 1]);
        (s1 || empty).nextSibling = childNodes[0] || (s2 || empty).node || null;
        (s2 || empty).previousSibling = childNodes[childNodes.length - 1] || (s1 || empty).node || null;
    }
    if (!previous.has(sNode.node)) {
        previous.set(sNode.node, pick(sNode, SNAPSHOT_PROPS));
    }
    setParentNode(sNode, _(newParent));
    sNode.previousSibling = null;
    sNode.nextSibling = null;
    parentChildNodes.splice.apply(parentChildNodes, [pos, 1].concat(childNodes));
    return true;
}

function removeInheritedNode(sNode, hardRemove) {
    var updated = removeTraversableNode(sNode, hardRemove, true);
    if (updated) {
        setPrototypeOf(sNode.node, InheritedNode.prototype);
        if (hardRemove) {
            each(sNode.childNodes, function (i, v) {
                setPrototypeOf(v, sNode.parentNode);
            });
        }
    }
    return updated;
}

function reorderTraversableChildNodes(sNode) {
    var childNodes = sNode.childNodes;
    var copy = childNodes.slice();
    var updated = [];
    for (var i = copy.length - 1; i >= 0; i--) {
        if (!containsOrEquals(sNode.tree, copy[i]) && removeTraversableNode(_(copy[i]))) {
            updated[updated.length] = copy[i];
        }
    }
    if (childNodes.length > 1) {
        copy = childNodes.slice(0);
        childNodes.sort(comparePosition);
        if (!equal(childNodes, copy)) {
            each(childNodes, function (i, v) {
                var sChildNode = _(v);
                var oldValues = pick(sChildNode, SNAPSHOT_PROPS);
                var newValues = {
                    parentNode: sNode.node,
                    previousSibling: childNodes[i - 1] || null,
                    nextSibling: childNodes[i + 1] || null
                };
                if (!equal(oldValues, newValues)) {
                    extend(sChildNode, newValues);
                    updated[updated.length] = v;
                    if (!previous.has(v)) {
                        previous.set(v, oldValues);
                    }
                }
            });
        }
    }
    return updated;
}

function updateTree(tree) {
    var sTree = _(tree);
    var traversable = is(tree, TraversableNodeTree);
    var updatedNodes = [];
    each(sTree.nodes, function (element, sNode) {
        var newVersion = sNode.state.version;
        var connected = containsOrEquals(tree, element);
        if (!connected) {
            sTree.detached.set(element, mapRemove(sTree.nodes, element));
        }
        if (!connected || sNode.version !== newVersion) {
            var updated = false;
            if (traversable) {
                // @ts-ignore: boolean arithmetics
                updated |= updatedNodes.length !== updatedNodes.push.apply(updatedNodes, reorderTraversableChildNodes(sNode));
            }
            // @ts-ignore: boolean arithmetics
            updated |= (connected ? insertNode : removeNode)(sNode);
            sNode.version = newVersion;
            if (updated) {
                updatedNodes[updatedNodes.length] = sNode.node;
            }
            if (connected) {
                var iterator = createTreeWalker(element, 1, function (v) {
                    return v !== element && sTree.nodes.has(v) ? 2 : 1;
                });
                iterateNode(iterator, function (element) {
                    var recovered = mapRemove(sTree.detached, element);
                    if (recovered) {
                        sTree.nodes.set(element, recovered);
                        insertNode(recovered);
                        updatedNodes[updatedNodes.length] = recovered.node;
                    }
                });
            }
        }
    });
    sTree.collectNewNodes();
    sTree.version = version;
    if (updatedNodes[0]) {
        var records = map(updatedNodes, function (v) {
            return extend({ node: v }, mapRemove(previous, v) || pick(v, SNAPSHOT_PROPS));
        });
        sTree.container.emit('update', tree, { updatedNodes, records }, false);
    }
}

function handleMutations(mutations) {
    var empty = {};
    each(mutations, function (i, v) {
        var addedElm = grep(v.addedNodes, function (v) {
            return is(v, Element);
        });
        var removedElm = grep(v.removedNodes, function (v) {
            return is(v, Element);
        });
        if (addedElm[0] || removedElm[0]) {
            version++;
            each(parentsAndSelf(v.target).concat(addedElm, removedElm), function (i, v) {
                (mapGet(versionMap, v) || empty).version = version;
            });
        }
    });
}

/* --------------------------------------
 * Classes
 * -------------------------------------- */

function createNodeClass(baseClass, constructor) {
    constructor = constructor || function () { };
    if (is(constructor.prototype, baseClass)) {
        return constructor;
    }
    function Node(tree, element) {
        baseClass.call(this, tree, element);
        constructor.call(this, tree, element);
    }
    definePrototype(constructor, baseClass, constructor.prototype);
    return extend(Node, { prototype: constructor.prototype });
}

function VirtualNode() {
}

function TraversableNode(tree, element) {
    initNode(tree, this, element);
}

definePrototype(TraversableNode, VirtualNode, {
    get parentNode() {
        return checkNodeState(_(this)).parentNode;
    },
    get childNodes() {
        return checkNodeState(_(this)).childNodes.slice(0);
    },
    get firstChild() {
        return checkNodeState(_(this)).childNodes[0] || null;
    },
    get lastChild() {
        var arr = checkNodeState(_(this)).childNodes;
        return arr[arr.length - 1] || null;
    },
    get previousSibling() {
        return checkNodeState(_(this)).previousSibling;
    },
    get nextSibling() {
        return checkNodeState(_(this)).nextSibling;
    }
});

function InheritedNode(tree, element) {
    initNode(tree, this, element);
}

definePrototype(InheritedNode, VirtualNode);

function NodeTree(baseClass, root, constructor, options) {
    var self = this;
    var state = _(self, extend({}, options, {
        collectNewNodes: noop,
        nodeClass: createNodeClass(baseClass, constructor),
        nodes: new Map(),
        detached: new WeakMap(),
        container: new ZetaEventContainer()
    }));
    defineOwnProperty(self, 'element', root, true);
    defineOwnProperty(self, 'rootNode', self.setNode(root), true);
    observe(root, function () {
        updateTree(self);
    });
    if (state.selector) {
        state.collectNewNodes = watchElements(root, state.selector, function (addedNodes) {
            each(addedNodes, function (i, v) {
                self.setNode(v);
            });
        });
    }
}

definePrototype(NodeTree, {
    on: function (event, handler) {
        return _(this).container.add(this, isPlainObject(event) || kv(event, handler));
    },
    getNode: function (element) {
        if (!assertDescendantOfTree(this, element)) {
            return null;
        }
        var self = this;
        var result = findNode(self, element, true);
        if (!result) {
            _(self).collectNewNodes();
            result = findNode(self, element, true);
        }
        return result && result.node;
    },
    setNode: function (element) {
        var self = this;
        var result = findNode(self, element);
        return result ? result.node : new (_(self).nodeClass)(self, element);
    },
    removeNode: function (node) {
        assertSameTree(this, node, true);
        removeNodeFromMap(_(node));
    },
    update: function () {
        collectMutations();
        updateTree(this);
    }
});

function TraversableNodeTree(root, constructor, options) {
    NodeTree.call(this, TraversableNode, root, constructor, options);
}

definePrototype(TraversableNodeTree, NodeTree, {
    isNodeVisible: function () {
        return true;
    },
    acceptNode: function () {
        return 1;
    }
});

function InheritedNodeTree(root, constructor, options) {
    NodeTree.call(this, InheritedNode, root, constructor, options);
}

definePrototype(InheritedNodeTree, NodeTree, {
    descendants: function (node) {
        if (is(node, Node)) {
            node = this.setNode(node);
        } else {
            assertSameTree(this, node, true);
        }
        var arr = [node];
        var next = function () {
            var cur = arr.shift();
            if (cur) {
                arr.unshift.apply(arr, checkNodeState(_(cur)).childNodes);
            }
            return { done: !cur, value: cur };
        };
        return { next };
    }
});

function TreeWalker(root, whatToShow, filter) {
    var self = this;
    self.whatToShow = whatToShow || -1;
    self.filter = filter;
    self.currentNode = root;
    self.root = root;
}

function treeWalkerIsNodeVisible(inst, node) {
    return node && _(node).tree.isNodeVisible(node, inst) && node;
}

function treeWalkerAcceptNode(inst, node, checkVisibility) {
    if (checkVisibility && node !== inst.root && !treeWalkerIsNodeVisible(inst, node)) {
        return 2;
    }
    var rv = _(node).tree.acceptNode(node, inst);
    if (rv !== 1) {
        return rv;
    }
    var filter = isFunction(inst.filter);
    return filter ? filter(node) : 1;
}
treeWalkerAcceptNode.$1 = 0;

function treeWalkerNodeAccepted(inst, node, checkVisibility) {
    treeWalkerAcceptNode.$1 = treeWalkerAcceptNode(inst, node, checkVisibility);
    if (treeWalkerAcceptNode.$1 === 1) {
        inst.currentNode = node;
        return true;
    }
}

function treeWalkerTraverseChildren(inst, pChild, pSib) {
    var node = inst.currentNode[pChild];
    while (node) {
        if (treeWalkerNodeAccepted(inst, node, true)) {
            return node;
        }
        if (treeWalkerAcceptNode.$1 === 3 && node[pChild]) {
            node = node[pChild];
            continue;
        }
        while (!node[pSib]) {
            node = treeWalkerIsNodeVisible(inst, node.parentNode);
            if (!node || node === inst.root || node === inst.currentNode) {
                return null;
            }
        }
        node = node[pSib];
    }
    return null;
}

function treeWalkerTraverseSibling(inst, pChild, pSib) {
    var node = inst.currentNode;
    while (node && node !== inst.root) {
        var sibling = node[pSib];
        while (sibling) {
            if (treeWalkerNodeAccepted(inst, sibling)) {
                return sibling;
            }
            sibling = (treeWalkerAcceptNode.$1 === 2 || !sibling[pChild]) ? sibling[pSib] : sibling[pChild];
        }
        node = treeWalkerIsNodeVisible(inst, node.parentNode);
        if (!node || node === inst.root || treeWalkerAcceptNode(inst, node, true) === 1) {
            return null;
        }
    }
    return null;
}

definePrototype(TreeWalker, {
    previousSibling: function () {
        return treeWalkerTraverseSibling(this, 'lastChild', 'previousSibling');
    },
    nextSibling: function () {
        return treeWalkerTraverseSibling(this, 'firstChild', 'nextSibling');
    },
    firstChild: function () {
        return treeWalkerTraverseChildren(this, 'firstChild', 'nextSibling');
    },
    lastChild: function () {
        return treeWalkerTraverseChildren(this, 'lastChild', 'previousSibling');
    },
    parentNode: function () {
        // @ts-ignore: type inference issue
        for (var node = this.currentNode; node && node !== this.root; node = node.parentNode) {
            // @ts-ignore: type inference issue
            var parentNode = node.parentNode;
            if (treeWalkerNodeAccepted(this, parentNode, true)) {
                return parentNode;
            }
        }
        return null;
    },
    previousNode: function () {
        var self = this;
        for (var node = self.currentNode; node && node !== self.root;) {
            // @ts-ignore: type inference issue
            for (var sibling = node.previousSibling; sibling; sibling = node.previousSibling) {
                node = sibling;
                var rv = treeWalkerAcceptNode(self, sibling);
                // @ts-ignore: type inference issue
                while (rv !== 2 && treeWalkerIsNodeVisible(self, node.firstChild)) {
                    // @ts-ignore: type inference issue
                    node = node.lastChild;
                    rv = treeWalkerAcceptNode(self, node, true);
                }
                if (rv === 1) {
                    // @ts-ignore: type inference issue
                    self.currentNode = node;
                    return node;
                }
            }
            // @ts-ignore: type inference issue
            node = treeWalkerIsNodeVisible(self, node.parentNode);
            if (!node || node === self.root) {
                return null;
            }
            if (treeWalkerNodeAccepted(self, node, true)) {
                return node;
            }
        }
        return null;
    },
    nextNode: function () {
        var self = this;
        var rv = 1;
        for (var node = self.currentNode; node;) {
            // @ts-ignore: type inference issue
            while (rv !== 2 && node.firstChild) {
                // @ts-ignore: type inference issue
                node = node.firstChild;
                if (treeWalkerNodeAccepted(self, node, true)) {
                    return node;
                }
                rv = treeWalkerAcceptNode.$1;
            }
            // @ts-ignore: type inference issue
            while (node && node !== self.root && !node.nextSibling) {
                // @ts-ignore: type inference issue
                node = treeWalkerIsNodeVisible(self, node.parentNode);
            }
            if (!node || node === self.root) {
                return null;
            }
            // @ts-ignore: type inference issue
            node = node.nextSibling;
            if (treeWalkerNodeAccepted(self, node, true)) {
                return node;
            }
            rv = treeWalkerAcceptNode.$1;
        }
    }
});

export {
    TraversableNode,
    TraversableNodeTree,
    InheritedNode,
    InheritedNodeTree,
    TreeWalker
};
