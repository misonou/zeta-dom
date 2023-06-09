/// <reference path="types.d.ts" />

/* --------------------------------------
 * General helper
 * -------------------------------------- */

/**
 * Gets a promise to be resolved when the document is ready.
 * @deprecated Use `dom.ready` instead.
 */
export const domReady: Promise<void>;

/**
 * Returns the tag name of the given element in lower case.
 * @param element A DOM element.
 * @returns The tag name of the given element in lower case.
 */
export function tagName(element: Element): string;

/**
 * Tests whether a given element matches a CSS selector.
 * @param a A DOM element to test against.
 * @param b A valid CSS selector.
 * @returns Returns the given element if the given selector matches the element; otherwise false.
 */
export function matchSelector(a: Element, b: string): Element | false;

/**
 * Gets whether an HTML element is visually painted.
 * @param a A DOM element.
 * @returns true if visible; otherwise false.
 */
export function isVisible(a: Element): boolean;

/**
 * Returns whether one node precedes the other node in document order.
 * @param a A DOM node.
 * @param b A DOM node.
 * @param [strict] Do not compare if one node is containing another.
 * @returns -1 if the first node precedes the second; 1 if the second node precedes the first; 0 if they are the same node; or NaN if one containing the other when strict to set to true.
 */
export function comparePosition(a: Node | Zeta.HasElement, b: Node | Zeta.HasElement, strict?: boolean): number;

/**
 * Tests whether two elements is in the same node tree (i.e. document or same fragment).
 * @param a A DOM element.
 * @param b A DOM element.
 * @returns true if the two given elements are connected.
 */
export function connected(a: Element, b: Element): boolean;

/**
 * Tests whether the first node refers the same or contains the second node.
 * @param a A DOM node or other other object with property element set to a DOM node.
 * @param b A DOM node or other other object with property element set to a DOM node.
 * @returns true if the first node refers the same or contains the second node.
 */
export function containsOrEquals(a: Node | Zeta.HasElement, b: Node | Zeta.HasElement): boolean;

/**
 * Tests whether a node is accepted by a NodeIterator or TreeWalker.
 * @param iterator A NodeIterator or TreeWalker object.
 * @param node A DOM node to be tested.
 * @returns Returns a number representing the node should be visited, skipped, or the whole subtree should be skipped.
 */
export function acceptNode(iterator: Zeta.NodeIterator<Node>, node: Node): Zeta.IteratorNodeFilterResult;

/**
 * Combines multiple node filters.
 *
 * If any one of the filter returns 2 meaning to skip the given node and its descendants, the combined filter will also return 2 and no subsequent filters will be called.
 * If any one of the filter returns 3 meaning to skip the given node, the combined filter will also return 3.
 * @param args Node filters to be chained.
 */
export function combineNodeFilters<T>(...args: (Zeta.IteratorNodeFilter<T> | undefined)[]): Zeta.IteratorNodeFilter<T>;

/**
 * Iterates and invoke the given callback for each node.
 * @param iterator Any iterable object with the previousNode and nextNode methods.
 * @param [callback] Function to be called on each node.
 * @param [from] If given, invocation of the callback will be skipped until the specified node.
 * @param [until] If given, iteration will be stopped once the specified node is iterated, callback will not be fired for this node.
 */
export function iterateNode<T>(iterator: Zeta.NodeIterator<T>, callback?: (node: T) => void, from?: T, until?: T | ((node: NonNullable<T>) => boolean)): void;

/**
 * Creates an array containing each node in the iterated order.
 * @param iterator Any iterable object with the previousNode and nextNode methods.
 * @returns An array containing all nodes.
 */
export function iterateNodeToArray<T>(iterator: Zeta.NodeIterator<T>): T[];

/**
 * Creates an array containing resulting items from each node in the iterated order.
 * @param iterator Any iterable object with the previousNode and nextNode methods.
 * @param callback Function called for each original item which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @param [from] If given, invocation of the callback will be skipped until the specified node.
 * @param [until] If given, iteration will be stopped once the specified node is iterated, callback will not be fired for this node.
 * @returns An array containing resulting items.
 */
export function iterateNodeToArray<T, R>(iterator: Zeta.NodeIterator<T>, callback: Zeta.IterateCallbackOrNull<T, R>, from?: T, until?: T | ((node: NonNullable<T>) => boolean)): Zeta.IterateCallbackOrNull<T, R> extends null ? T[] : R[];


/* --------------------------------------
 * Advanced traversal
 * -------------------------------------- */

/**
 * Gets the common ancestor of the two node.
 * @param a A DOM node.
 * @param b A DOM node.
 * @returns The common ancestor of the two node if they are connected.
 */
export function getCommonAncestor(a: Node, b: Node): Element;

export function parentsAndSelf(node: Node | Window): Element[];

export function parentsAndSelf<T extends Zeta.HasParent | Zeta.HasParentNode>(node: T | null): T[];

export function selectIncludeSelf(sel: string, node?: Node | NodeList | Node[] | ArrayLike<Node>): Element[];

export function selectClosestRelative(sel: string, node?: Node): Element;

/**
 * Creates a DOM node iterator. It is essentially the same as Document#createNodeIterator but allows arguments to be optional.
 * @param root A DOM node.
 * @param whatToShow A bitmask specifying which types of DOM node should be iterated.
 * @returns A DOM node iterator.
 */
export function createNodeIterator<T extends number>(root: Element, whatToShow: T, filter?: Zeta.IteratorNodeFilter<T extends 1 ? Element : T extends 4 ? Text : Node>): Zeta.NodeIterator<T extends 1 ? Element : T extends 4 ? Text : Node>;

/**
 * Creates a DOM tree walker. It is essentially the same as Document#createTreeWalker but allows arguments to be optional.
 * @param root A DOM node.
 * @param whatToShow A bitmask specifying which types of DOM node should be iterated.
 * @returns A DOM node iterator.
 */
export function createTreeWalker<T extends number>(root: Element, whatToShow: T, filter?: Zeta.IteratorNodeFilter<T extends 1 ? Element : T extends 4 ? Text : Node>): Zeta.TreeTraverser<T extends 1 ? Element : T extends 4 ? Text : Node>;


/* --------------------------------------
 * Events
 * -------------------------------------- */

/**
 * Adds event listeners to the Window object or other DOM elements.
 * @param element The Window object or a DOM element which event listeners are attached to.
 * @param event A whitespace-separated list of event names.
 * @param listener Function to be called when the specified event(s) is/are dispatched.
 * @param [useCapture] Optionally set the event listeners to be triggered in capture phase.
 * @returns A callback that unregistered the event listeners.
 */
export function bind<T extends EventTarget, K extends Zeta.DOMEventsOf<T>>(element: T, event: K, listener: (this: T, e: Zeta.DOMEventType<T, K>) => any, useCapture?: boolean | AddEventListenerOptions): Zeta.UnregisterCallback;

/**
 * Adds event listeners to the Window object or other DOM elements.
 * @param element The Window object or a DOM element which event listeners are attached to.
 * @param event A whitespace-separated list of event names.
 * @param listener Function to be called when the specified event(s) is/are dispatched.
 * @param [useCapture] Optionally set the event listeners to be triggered in capture phase.
 * @returns A callback that unregistered the event listeners.
 */
export function bind<T extends EventTarget, K extends string>(element: T, event: K, listener: (this: T, e: Zeta.DOMEventType<T, Zeta.WhitespaceDelimited<K>>) => any, useCapture?: boolean | AddEventListenerOptions): Zeta.UnregisterCallback;

/**
 * Adds event listeners to the Window object or other DOM elements.
 * @param element The Window object or a DOM element which event listeners are attached to.
 * @param event A dictionary which each property represents a event listener associated to an event.
 * @param [useCapture] Optionally set the event listeners to be triggered in capture phase.
 * @returns A callback that unregistered the event listeners.
 */
export function bind<T extends EventTarget>(element: T, event: { [K in Zeta.DOMEventsOf<T>]?: (this: T, e: Zeta.DOMEventType<T, K>) => any }, useCapture?: boolean | AddEventListenerOptions): Zeta.UnregisterCallback;

/**
 * Adds event listeners to the Window object or other DOM elements.
 * @param element The Window object or a DOM element which event listeners are attached to.
 * @param event A dictionary which each property represents a event listener associated to an event.
 * @param [useCapture] Optionally set the event listeners to be triggered in capture phase.
 * @returns A callback that unregistered the event listeners.
 */
export function bind<T extends EventTarget>(element: T, event: { [K in string]: (this: T, e: Zeta.DOMEventType<T, K>) => any }, useCapture?: boolean | AddEventListenerOptions): Zeta.UnregisterCallback;

export function bindUntil<T extends EventTarget, K extends Zeta.DOMEventsOf<T>>(promise: PromiseLike<any>, element: T, event: K, listener: (this: T, e: Zeta.DOMEventType<T, K>) => any, useCapture?: boolean | AddEventListenerOptions): void;

export function bindUntil<T extends EventTarget, K extends string>(promise: PromiseLike<any>, element: T, event: string, listener: (this: T, e: Zeta.DOMEventType<T, Zeta.WhitespaceDelimited<K>>) => any, useCapture?: boolean | AddEventListenerOptions): void;

export function bindUntil<T extends EventTarget>(promise: PromiseLike<any>, element: T, event: { [K in Zeta.DOMEventsOf<T>]?: (this: T, e: Zeta.DOMEventType<T, K>) => any }, useCapture?: boolean | AddEventListenerOptions): void;

export function bindUntil<T extends EventTarget>(promise: PromiseLike<any>, element: T, event: { [K in string]: (this: T, e: Zeta.DOMEventType<T, K>) => any }, useCapture?: boolean | AddEventListenerOptions): void;

export function dispatchDOMMouseEvent(nativeEvent: MouseEvent | TouchEvent | JQuery.UIEventBase): boolean;

export function dispatchDOMMouseEvent(eventName: string, point: Zeta.PointLike, nativeEvent: MouseEvent | TouchEvent | JQuery.UIEventBase): boolean;


/* --------------------------------------
 * DOM manip
 * -------------------------------------- */

/**
 * Removes the specified DOM node from the DOM tree where it currently belongs to.
 * @param node A DOM node.
 */
export function removeNode(node: Node): void;

/**
 * Gets the state of an element using the given class name.
 * If the element has class names prefixed with the given name ("class-*"), an array of string is returned.
 * @param element A DOM element to be tested.
 * @param className A string specifying the class name.
 */
export function getClass(element: Element, className: string): boolean | string[];

/**
 * Sets the element to the specified states using class names.
 * @param element A DOM element.
 * @param dict An object which its key-value pair represents each state.
 */
export function setClass(element: Element, dict: Zeta.Dictionary<boolean | string[] | object>): void;

/**
 * Sets the element to the specified states using the given class name.
 * @param element A DOM element.
 * @param className A string specifying the class name.
 * @param values If given true, the class name is added to the element.
 */
export function setClass(element: Element, className: string, values: boolean | string[] | object): void;

export function getSafeAreaInset(): Readonly<Zeta.Inset>;

export function getScrollOffset(winOrElm: Window | Element): { x: number; y: number };

export function getScrollParent(element: Element): Element;

export function getContentRect(element: Element): Zeta.Rect;

export function scrollBy(element: Window | Element, x: number, y: number): { x: number; y: number } | false;

/**
 * Scroll all ancestor container so that the specified element is in view.
 * @param element Element to be scrolled into view.
 * @param rect A rect represent a region inside the element to be scrolled into view.
 * @param within When specified, only this element and its descendants will be scrolled.
 * @returns Number of pixels in x and y direction actually scrolled; or `false` if scrolling did not happened,
 * either because the element or the region is already in view, or parent elements cannot be further scrolled.
 */
export function scrollIntoView(element: Element, rect?: Zeta.RectLike, within?: Element): { x: number; y: number } | false;

/**
 * Scroll all ancestor container so that the specified element is in view.
 * @param element Element to be scrolled into view.
 * @param margin Number of pixels away from the edge where element should be positioned.
 * @param within When specified, only this element and its descendants will be scrolled.
 * @returns Number of pixels in x and y direction actually scrolled; or `false` if scrolling did not happened,
 * either because the element or the region is already in view, or parent elements cannot be further scrolled.
 */
export function scrollIntoView(element: Element, margin: number, within?: Element): { x: number; y: number } | false;


/* --------------------------------------
 * Range and rect
 * -------------------------------------- */

/**
 * Gets a rect object referring the size of current window. Same as passing window as the first argument.
 * @returns A rect object.
 */
export function getRect(): Zeta.Rect;

/**
 * Gets a rect object containing position and dimension information of the specified node.
 * @param element A DOM node, or other object that is associated to a DOM element or a DOM rect.
 * @param [includeMargin] Optionally including margin of a DOM element in calculation.
 * @returns A rect object.
 */
export function getRect(element: Window | Node | Zeta.HasRect | Zeta.HasElement, includeMargin?: boolean): Zeta.Rect;

export function getRect(element: Window | Node | Zeta.HasRect | Zeta.HasElement, margin: number): Zeta.Rect;

/**
 * Gets all rect objects that are visually painted for the specified element or text node.
 * @param node A DOM node.
 * @returns An array containing all visually painted rects.
 */
export function getRects(node: Node | Range): Zeta.Rect[];

/**
 * Converts DOM rect which is read-only, to a custom rect object.
 * @param rect A DOM rect object.
 * @returns A custom rect object.
 */
export function toPlainRect(rect: DOMRect | ClientRect): Zeta.Rect;

/**
 * Creates a custom rect object of zero size in the specified position, relative to the top-left corner of the window.
 * @param left X-coordinate in pixels.
 * @param top Y-coordinate in pixels.
 * @returns A custom rect object.
 */
export function toPlainRect(left: number, top: number): Zeta.Rect;

/**
 * Creates a custom rect object with the specified left-top and right-bottom corner positions, relative to the top-left corner of the window.
 * @param left X-coordinate in pixels of left side.
 * @param top Y-coordinate in pixels of top side.
 * @param right X-coordinate in pixels of right side.
 * @param bottom Y-coordinate in pixels of bottom side.
 * @returns A custom rect object.
 */
export function toPlainRect(left: number, top: number, right: number, bottom: number): Zeta.Rect;

/**
 * Tests whether two rects having the same size and in the same position.
 * Subpixeling is handled by considering each side is at the same position when different is less than 1 pixel.
 * @param a A rect object.
 * @param b A rect object.
 * @returns true if two rects have the same size and in the same position.
 */
export function rectEquals(a: Zeta.Rect | ClientRect, b: Zeta.Rect | ClientRect): boolean;

/**
 * Tests whether the first rect covers the second rect.
 * @param a A rect object.
 * @param b A rect object.
 * @returns true if the first rect covers the second rect.
 */
export function rectCovers(a: Zeta.Rect | ClientRect, b: Zeta.Rect | ClientRect): boolean;

export function rectIntersects(a: Zeta.Rect | ClientRect, b: Zeta.Rect | ClientRect): boolean;

/**
 * Tests whether a point, relative to the top-left corner of the window, is contained by or is in proximity to the specified region.
 * @param x X-coordinate in pixels.
 * @param y Y-coordinate in pixels.
 * @param b A rect object specifying the region in the window.
 * @param [within] If set, in number of pixels, the proximity of the point to the region will be tested.
 * @returns true if the point is contained by or is in proximity to the region.
 */
export function pointInRect(x: number, y: number, b: Zeta.RectLike, within?: number): boolean;

/**
 * Computes a rect that covers all given rects.
 * @param a Rect objects that the resulting rect covers.
 * @param b Rect objects that the resulting rect covers.
 * @returns A rect object.
 */
export function mergeRect(a: Zeta.RectLike, b: Zeeta.RectLike): Zeta.Rect;

/**
 * Gets the topmost element that is visually painted, and reactable in the given coordinate relative to the top-left corner of the window.
 * This method handles IE 10 which does not support the CSS property pointer-events: none.
 * @param x X-coordinate in pixels.
 * @param y Y-coordinate in pixels.
 * @param [within] Optionally restrict to descandent elements of the given element.
 * @returns A DOM element if any.
 */
export function elementFromPoint(x: number, y: number, within?: Element): Element;

/**
 * Selects a range of contents.
 * If the ending position is before the starting position, i.e. select contents backwards,
 * directionality is preserved if browser supports.
 * @param base Starting position.
 * @param extent Ending position.
 */
export function makeSelection(base: Range, extent?: Range): void;
