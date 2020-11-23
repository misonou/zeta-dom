import dom from "./dom.js";
import { comparePosition, containsOrEquals, createTreeWalker, is, iterateNode, parentsAndSelf } from "./domUtil.js";
import { ZetaEventContainer } from "./events.js";
import { observe } from "./observe.js";
import { Map, WeakMap } from "./shim.js"
import { createPrivateStore, defineHiddenProperty, defineOwnProperty, definePrototype, each, equal, extend, grep, isPlainObject, kv, map, mapGet, mapRemove } from "./util.js";

const _ = createPrivateStore();
const setPrototypeOf = Object.setPrototypeOf;
const collectMutations = observe(dom.root, handleMutations);

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
    var sNode = _(node, {
        version: version,
        tree: tree,
        node: node,
        traversable: is(node, TraversableNode),
        state: mapGet(versionMap, element, VersionState),
        childNodes: []
    });
    (containsOrEquals(tree.element, element) ? _(tree).nodes : _(tree).detached).set(element, sNode);
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
        for (; element !== tree.element; element = element.parentNode) {
            var result = sTree.nodes.get(element) || sTree.detached.get(element);
            if (result) {
                return result;
            }
        }
    }
    return _(tree.rootNode);
}

function checkNodeState(sNode) {
    collectMutations();
    if (sNode.version !== sNode.state.version) {
        updateTree(sNode.tree);
    }
    return sNode;
}

function insertNode(sNode) {
    return (sNode.traversable ? insertTraversableNode : insertInheritedNode)(sNode);
}

function removeNode(sNode, keepNode) {
    if (!keepNode) {
        var sTree = _(sNode.tree);
        var element = sNode.node.element;
        if (!mapRemove(sTree.nodes, element)) {
            // the node is already removed from the tree
            // therefore nothing to do
            return false;
        }
        sTree.detached.set(element, sNode);
    }
    return (sNode.traversable ? removeTraversableNode : removeInheritedNode)(sNode);
}

function insertChildNode(sParent, sChild) {
    if (sParent === sChild || sChild.parentNode === sParent.node) {
        return false;
    }
    if (sChild.parentNode) {
        removeNode(sChild, true);
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
            _(parentChildNodes[i]).parentNode = sChild.node;
            childNodes.unshift(parentChildNodes.splice(i, 1)[0]);
        }
    }
    sChild.parentNode = sParent.node;
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
            var previousSilbing = s1.previousSilbing;
            var nextSibling = s2.nextSibling;
            (_(previousSilbing) || empty).nextSibling = nextSibling;
            (_(nextSibling) || empty).previousSilbing = previousSilbing;
            (s1 || empty).previousSilbing = null;
            (s2 || empty).nextSibling = null;
        }
        var parentChildNodes = result[2];
        if (parentChildNodes[1]) {
            var pos = result[0];
            var p1 = parentChildNodes[pos - 1];
            var p2 = parentChildNodes[pos + 1];
            sNode.nextSibling = p2;
            sNode.previousSilbing = p1;
            (_(p1) || empty).nextSibling = sNode.node;
            (_(p2) || empty).previousSilbing = sNode.node;
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

function removeTraversableNode(sNode) {
    var parent = sNode.parentNode;
    if (!parent) {
        return false;
    }
    var childNodes = sNode.childNodes.splice();
    var parentChildNodes = _(parent).childNodes;
    var pos = parentChildNodes.indexOf(sNode.node);
    sNode.parentNode = null;
    if (childNodes[0]) {
        var states = map(childNodes, function (v) {
            return _(v);
        });
        states[0].previousSilbing = parentChildNodes[pos - 1];
        states[states.length - 1].nextSibling = parentChildNodes[pos + 1];
        each(states, function (i, v) {
            v.parentNode = parent;
        });
    }
    parentChildNodes.splice.apply(parentChildNodes, [pos, 1].concat(childNodes));
    return true;
}

function removeInheritedNode(sNode) {
    var updated = removeTraversableNode(sNode);
    each(sNode.childNodes, function (i, v) {
        setPrototypeOf(v, sNode.parentNode);
    });
    setPrototypeOf(sNode.node, InheritedNode.prototype);
    return updated;
}

function reorderTraversableChildNodes(sNode) {
    var childNodes = sNode.childNodes;
    var copy = childNodes.slice();
    var updated = false;
    for (var i = copy.length - 1; i >= 0; i--) {
        if (!containsOrEquals(sNode.tree, copy[i])) {
            // @ts-ignore: boolean arithmetics
            updated |= removeTraversableNode(_(copy[i]));
        }
    }
    if (childNodes.length > 1) {
        copy = childNodes.slice(0);
        childNodes.sort(comparePosition);
        if (!equal(childNodes, copy)) {
            each(childNodes, function (i, v) {
                extend(_(v), {
                    previousSilbing: childNodes[i - 1],
                    nextSibling: childNodes[i + 1]
                });
            });
            updated = true;
        }
    }
    return updated;
}

function updateTree(tree) {
    var sTree = _(tree);
    var updatedNodes = map(sTree.nodes, function (sNode, element) {
        var newVersion = sNode.state.version;
        var updated = false;
        if (sNode.version !== newVersion) {
            var connected = containsOrEquals(tree, element);
            if (sNode.traversable) {
                // @ts-ignore: boolean arithmetics
                updated |= reorderTraversableChildNodes(sNode);
            }
            // @ts-ignore: boolean arithmetics
            updated |= (connected ? insertNode : removeNode)(sNode);
            sNode.version = newVersion;
            if (connected) {
                var iterator = createTreeWalker(element, 1, function (v) {
                    return v !== element && sTree.nodes.has(v) ? 2 : 1;
                });
                iterateNode(iterator, function (element) {
                    var recovered = mapRemove(sTree.detached, element);
                    if (recovered) {
                        insertNode(recovered);
                    }
                });
            }
        }
        return updated ? sNode.node : null;
    });
    sTree.version = version;
    if (updatedNodes[0]) {
        sTree.container.emit('update', tree, { updatedNodes }, false);
    }
}

function handleMutations(mutations) {
    var empty = {};
    each(mutations, function (i, v) {
        var addedElm = grep(v.addedNodes, function (v) {
            return is(v, 1);
        });
        var removedElm = grep(v.removedNodes, function (v) {
            return is(v, 1);
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
        return checkNodeState(_(this)).parentNode || null;
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
    get previousSilbing() {
        return checkNodeState(_(this)).previousSilbing || null;
    },
    get nextSibling() {
        return checkNodeState(_(this)).nextSibling || null;
    }
});

function InheritedNode(tree, element) {
    initNode(tree, this, element);
}

definePrototype(InheritedNode, VirtualNode, {
    getComputedValues: function () {
        checkNodeState(_(this));
        return extend({}, this);
    }
});

function NodeTree(baseClass, root, constructor, options) {
    var self = this;
    _(self, extend({}, options, {
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
}

definePrototype(NodeTree, {
    on: function(event, handler) {
        _(this).container.add(this, isPlainObject(event) || kv(event, handler));
    },
    getNode: function (element) {
        if (!assertDescendantOfTree(this, element)) {
            return null;
        }
        var result = findNode(this, element, true);
        return result && result.node;
    },
    setNode: function (element) {
        var self = this;
        var result = findNode(self, element);
        return result ? result.node : new (_(self).nodeClass)(self, element);
    },
    removeNode: function (node) {
        assertSameTree(this, node, true);
        removeNode(_(node));
    }
});

function TraversableNodeTree(root, constructor, options) {
    NodeTree.call(this, TraversableNode, root, constructor, options);
}

definePrototype(TraversableNodeTree, NodeTree);

function InheritedNodeTree(root, constructor, options) {
    NodeTree.call(this, InheritedNode, root, constructor, options);
}

definePrototype(InheritedNodeTree, NodeTree);

export {
    TraversableNode,
    TraversableNodeTree,
    InheritedNode,
    InheritedNodeTree
};