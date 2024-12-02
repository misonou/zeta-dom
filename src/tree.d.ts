/// <reference path="types.d.ts" />

export interface NodeTreeOptions {
    /**
     * If supplied, new element matching the selector will have its
     * correspoding virtual nodes created.
     */
    selector?: string
}

export interface TraversableNodeTreeOptions<T> extends NodeTreeOptions {
}

export interface InheritedNodeTreeOptions<T> extends NodeTreeOptions {
}

export interface NodeTreeEventMap<T extends VirtualNode> {
    update: NodeTreeUpdateEvent<T>;
}

export interface NodeTreeUpdateEvent<T extends VirtualNode> extends Zeta.ZetaEventBase {
    /**
     * @deprecated Use `records` property instead.
     */
    readonly updatedNodes: T[];
    readonly records: NodeTreeMutationRecord<T>[];
}

export interface NodeTreeMutationRecord<T extends VirtualNode> {
    /**
     * Gets the node that has been removed or relocated as child or sibling of other nodes.
     */
    readonly node: T;

    /**
     * Gets the original parent node before mutation.
     */
    readonly parentNode: T | null;

    /**
     * Gets the original previous sibling before mutation.
     */
    readonly previousSilbing: T | null;

    /**
     * Gets the original next sibiling before mutation.
     */
    readonly nextSibling: T | null;
}

export abstract class NodeTree<T extends VirtualNode> implements Zeta.ZetaEventDispatcher<NodeTreeEventMap<T>, NodeTree<T>>, Zeta.HasElement<Element> {
    readonly element: Element;
    readonly rootNode: T;

    getNode(element: Element): T | null;
    setNode(element: Element): T;
    removeNode(node: T): void;
    update(): void;

    on(handlers: Zeta.ZetaEventHandlers<NodeTreeEventMap<T>, NodeTree<T>>): Zeta.UnregisterCallback;
    on<E extends keyof NodeTreeEventMap<T>>(event: E, handler: Zeta.ZetaEventHandler<E, NodeTreeEventMap<T>, NodeTree<T>>): Zeta.UnregisterCallback;
}

export class TraversableNodeTree<T extends TraversableNode> extends NodeTree<T> {
    constructor(element: Element, constructor?: new (...args: any[]) => T, options?: TraversableNodeTreeOptions<T>);
    constructor(element: Element, constructor?: Zeta.AnyConstructor, options?: TraversableNodeTreeOptions<T>);

    isNodeVisible(node: T, iterator: TreeWalker<T>): boolean;
    acceptNode(node: T, iterator: TreeWalker<T>): Zeta.IteratorNodeFilterResult;
}

export class InheritedNodeTree<T extends InheritedNode> extends NodeTree<T> {
    constructor(element: Element, constructor?: new (...args: any[]) => T, options?: InheritedNodeTreeOptions<T>);
    constructor(element: Element, constructor?: Zeta.AnyConstructor, options?: InheritedNodeTreeOptions<T>);

    descendants(node: T | Element): Iterator<T>;
}

export abstract class VirtualNode implements Zeta.HasElement {
    readonly element: HTMLElement;
}

export class TraversableNode extends VirtualNode {
    constructor(tree: NodeTree<TraversableNode>, element: Element);

    readonly parentNode: TraversableNode | null;
    readonly firstChild: TraversableNode | null;
    readonly lastChild: TraversableNode | null;
    readonly previousSibling: TraversableNode | null;
    readonly nextSibling: TraversableNode | null;
    readonly childNodes: TraversableNode[];
}

export class InheritedNode extends VirtualNode {
    constructor(tree: NodeTree<InheritedNode>, element: Element);
}

export class TreeWalker<T extends TraversableNode> implements Zeta.NodeIterator<T> {
    constructor(root: T, whatToShow?: number, filter?: Zeta.IteratorNodeFilter<T>);

    readonly root: T;
    readonly whatToShow: number;
    readonly filter: Zeta.IteratorNodeFilter<T>;

    currentNode: T;

    nextNode(): T | null;
    previousNode(): T | null;
    parentNode(): T | null;
    firstChild(): T | null;
    lastChild(): T | null;
    previousSibling(): T | null;
    nextSibling(): T | null;
}
