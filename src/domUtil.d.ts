/// <reference path="types.d.ts" />

/* --------------------------------------
 * General helper
 * -------------------------------------- */

/**
 * Returns the tag name of the given element in lower case.
 * @param element A DOM element.
 * @returns The tag name of the given element in lower case.
 */
export function tagName(element: Element): string;

/**
 * Tests whether a given object is an instance of the specified function.
 * @param a An input object to test against.
 * @param b A function.
 * @returns Returns the same object if it is an instance of the function; otherwise false.
 */
export function is<T extends (Zeta.AnyFunction | Zeta.AnyConstructor)>(a: any, b: T): InstanceType<T> | false;

/**
 * Tests whether a given element matches a CSS selector.
 * @param a A DOM element to test against.
 * @param b A valid CSS selector.
 * @returns Returns the given element if the given selector matches the element; otherwise false.
 */
export function is(a: Element, b: string): Element | false;

/**
 * Tests whether a given element matches a CSS selector.
 * @param a A DOM node to test against.
 * @param b Node type.
 * @returns Returns the given node if the given node is of the specified node type; otherwise false.
 */
export function is<T extends number>(a: Node, b: T): Zeta.NodeOfType<T> | false;

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
 * Iterates and invoke the given callback for each node.
 * @param iterator Any iterable object with the previousNode and nextNode methods.
 * @param [callback] Function to be called on each node.
 * @param [from] If given, invocation of the callback will be skipped until the specified node.
 */
export function iterateNode<T>(iterator: Zeta.Iterator<T>, callback?: (node: T) => void, from?: T): void;

/**
 * Creates an array containing each node in the iterated order.
 * @param iterator Any iterable object with the previousNode and nextNode methods.
 * @returns An array containing all nodes.
 */
export function iterateNodeToArray<T>(iterator: Zeta.Iterator<T>): T[];

/**
 * Creates an array containing resulting items from each node in the iterated order.
 * @param iterator Any iterable object with the previousNode and nextNode methods.
 * @param callback Function called for each original item which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @param [from] If given, invocation of the callback will be skipped until the specified node.
 * @param [until] If given, iteration will be stopped once the specified node is iterated, callback will not be fired for this node.
 * @returns An array containing resulting items.
 */
export function iterateNodeToArray<T, R>(iterator: Zeta.Iterator<T>, callback: Zeta.IterateCallbackOrNull<T, R>, from?: T, until?: T): Zeta.IterateCallbackOrNull<T, R> extends null ? T[] : R[];


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

export function parentsAndSelf(node: Node): Element[];

export function selectIncludeSelf(sel: string, node: Node | NodeList | Node[] | ArrayLike<Node>): Element[];

export function selectClosestRelative(sel: string, node: Node): Element;

/**
 * Creates a DOM node iterator. It is essentially the same as Document#createNodeIterator but allows arguments to be optional.
 * @param root A DOM node.
 * @param whatToShow A bitmask specifying which types of DOM node should be iterated.
 * @returns A DOM node iterator.
 */
export function createNodeIterator<T extends number>(root: Element, whatToShow: T, filter?: Zeta.IteratorNodeFilter<T extends 1 ? Element : T extends 4 ? Text : Node>): Zeta.Iterator<T extends 1 ? Element : T extends 4 ? Text : Node>;

/**
 * Creates a DOM tree walker. It is essentially the same as Document#createTreeWalker but allows arguments to be optional.
 * @param root A DOM node.
 * @param whatToShow A bitmask specifying which types of DOM node should be iterated.
 * @returns A DOM node iterator.
 */
export function createTreeWalker<T extends number>(root: Element, whatToShow: T, filter?: Zeta.IteratorNodeFilter<T extends 1 ? Element : T extends 4 ? Text : Node>): Zeta.TreeWalker<T extends 1 ? Element : T extends 4 ? Text : Node>;


/* --------------------------------------
 * Events
 * -------------------------------------- */

/**
 * Adds event listeners to the Window object or other DOM elements.
 * @param element The Window object or a DOM element which event listeners are attached to.
 * @param event A whitespace-separated list of event names.
 * @param listener Function to be called when the specified event(s) is/are dispatched.
 * @param [useCapture] Optionally set the event listeners to be triggered in capture phase.
 */
export function bind<T extends keyof GlobalEventHandlersEventMap>(element: EventTarget, event: T, listener: (e: GlobalEventHandlersEventMap[T]) => any, useCapture?: boolean | AddEventListenerOptions): (() => void);

export function bind(element: EventTarget, event: string, listener: (e: Event) => any, useCapture?: boolean | AddEventListenerOptions): (() => void);

export function bind(element: EventTarget, event: { [T in keyof GlobalEventHandlersEventMap]?: (e: GlobalEventHandlersEventMap[T]) => any }, useCapture?: boolean | AddEventListenerOptions): (() => void);

/**
 * Adds event listeners to the Window object or other DOM elements.
 * @param element The Window object or a DOM element which event listeners are attached to.
 * @param event A dictionary which each property represents a event listener associated to an event.
 * @param [useCapture] Optionally set the event listeners to be triggered in capture phase.
 */
export function bind(element: EventTarget, event: Record<string, (e: infer E extends Event ? E : never) => any>, useCapture?: boolean | AddEventListenerOptions): (() => void);

export function bindUntil<T extends keyof GlobalEventHandlersEventMap>(promise: PromiseLike<any>, element: EventTarget, event: T, listener: (e: GlobalEventHandlersEventMap[T]) => any, useCapture?: boolean | AddEventListenerOptions): (() => void);

export function bindUntil(promise: PromiseLike<any>, element: EventTarget, event: string, listener: (e: Event) => any, useCapture?: boolean | AddEventListenerOptions): (() => void);

export function bindUntil(promise: PromiseLike<any>, element: EventTarget, event: { [T in keyof GlobalEventHandlersEventMap]?: (e: GlobalEventHandlersEventMap[T]) => any }, useCapture?: boolean | AddEventListenerOptions): (() => void);

export function bindUntil(promise: PromiseLike<any>, element: EventTarget, event: Record<string, (e: infer E extends Event ? E : never) => any>, useCapture?: boolean | AddEventListenerOptions): (() => void);

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

export function getScrollOffset(winOrElm: Window | Element): { x: number; y: number };

export function getScrollParent(element: Window | Element): Window | Element;

export function getContentRect(element: Element): Zeta.Rect;

export function scrollBy(element: Window | Element, x: number, y: number): { x: number; y: number } | false;

/**
 * Scroll all ancestor container so that the specified element is in view.
 * @param element Element to be scrolled into view.
 * @param rect A rect represent a region inside the element to be scrolled into view.
 * @returns Number of pixels in x and y direction actually scrolled; or `false` if scrolling did not happened,
 * either because the element or the region is already in view, or parent elements cannot be further scrolled.
 */
export function scrollIntoView(element: Element, rect?: Zeta.RectLike): { x: number; y: number } | false;

/**
 * Scroll all ancestor container so that the specified element is in view.
 * @param element Element to be scrolled into view.
 * @param margin Number of pixels away from the edge where element should be positioned.
 * @returns Number of pixels in x and y direction actually scrolled; or `false` if scrolling did not happened,
 * either because the element or the region is already in view, or parent elements cannot be further scrolled.
 */
export function scrollIntoView(element: Element, margin: number): { x: number; y: number } | false;


/* --------------------------------------
 * Range and rect
 * -------------------------------------- */

/**
 * Creates a range that select DOM contents describe by the object.
 * @param range An object that encloses part of contents in DOM.
 * @returns A DOM range.
 */
export function createRange(range: Zeta.HasRange | Node): Range;

/**
 * Creates a range that select inner content of a DOM node.
 * If the given node is a DOM element, the element itself is excluded from the result range.
 * @param startNode A DOM node.
 * @param mode Must be the string 'content'.
 * @returns A DOM range.
 */
export function createRange(startNode: Node, mode: 'contents'): Range;

/**
 * Creates a collapsed range before or after, the start or the end of the specified node.
 * @param startNode A DOM node.
 * @param collapse Indicating the position of resulting range: before the start of a node for true; after the end of a node for false; after the start of a node (0-th child) for 0; and before the end of a node (last child) for -0.
 * @returns A DOM range.
 */
export function createRange(startNode: Node, collapse: boolean | 0 | -0): Range;

/**
 * Creates a collapsed range at the specified node and offset.
 * @param startNode A DOM node.
 * @param startOffset A number representing the n-th child of an element or the n-th characters of a text node.
 * @returns A DOM range.
 */
export function createRange(startNode: Node, startOffset: number): Range;

/**
 * Creates a range that starts and ends at the specified node and offset.
 * @param startNode A DOM node.
 * @param startOffset A number representing the n-th child of an element or the n-th characters of a text node.
 * @param endNode A DOM node.
 * @param endOffset A number representing the n-th child of an element or the n-th characters of a text node.
 * @returns A DOM range.
 */
export function createRange(startNode: Node, startOffset: number, endNode: Node, endOffset: number): Range;

/**
 * Creates a range that only includes the starting or ending point of a range.
 * @param range A DOM range.
 * @param collapse Includes starting point if true; ending point otherwise.
 * @returns A new DOM range.
 */
export function createRange(range: Range, collapse: boolean): Range;

/**
 * Creates a range that only starts from the starting or ending point of the first range, and ends at the ending point of the second range.
 * @param start A DOM range indicating the starting point.
 * @param end A DOM range indicating the ending point.
 * @returns A new DOM range.
 */
export function createRange(start: Range, end: Range): Range;

/**
 * Tests if the first range covers the second range.
 * @param a A range.
 * @param b A range.
 * @returns true if covers.
 */
export function rangeCovers(a: Zeta.RangeLike, b: Zeta.RangeLike): boolean;

/**
 * Tests if the two given ranges are equal.
 * @param a A range.
 * @param b A range.
 * @returns true if equals.
 */
export function rangeEquals(a: Zeta.RangeLike, b: Zeta.RangeLike): boolean;

/**
 * Tests if the two given ranges intersect, i.e. has common content selected.
 * @param a A range.
 * @param b A range.
 * @returns true if intersects
 */
export function rangeIntersects(a: Zeta.RangeLike, b: Zeta.RangeLike): boolean;

/**
 * Compares if the first range selects content that comes first in document order or vice versa.
 * @param a A range.
 * @param b A range.
 * @param [strict] Do not compare if two ranges intersect.
 * @returns -1 if the first range precedes the second; 1 if the second range precedes the first; 0 if they selects the same range; or NaN if two ranges intersect when strict to set to true.
 */
export function compareRangePosition(a: Zeta.RangeLike, b: Zeta.RangeLike, strict?: boolean): number;

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
 * @param rects Rect objects that the resulting rect covers.
 * @returns A rect object.
 */
export function mergeRect(...rects: Zeta.RectLike[]): Zeta.Rect;

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
export function makeSelection(base: Zeta.RangeLike, extent: Zeta.RangeLike): void;

/**
 * Places a text cursor at the specified position.
 * @param node A DOM element or text node.
 * @param offset A number representing the n-th child of an element or the n-th characters of a text node.
 */
export function makeSelection(node: Node, offset: number): void;
