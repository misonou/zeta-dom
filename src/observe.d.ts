/// <reference path="types.d.ts" />

interface ObserveCallback {
    /**
     * Collect mutations immediately and fires mutation handler if there is any mutations.
     */
    (): void;

    /**
     * Disconnects mutation observer.
     */
    dispose(): void;
}

/**
 * Observe DOM child list mutations from the specified element.
 * @param element A DOM element from which mutations are observed.
 * @param callback A callback to be fired when mutation occurs.
 * @returns A callback which collects mutation immediately and fires mutation handler if there is any mutations.
 */
export function observe(element: Node, callback: (records: MutationRecord[]) => any): ObserveCallback;

/**
 * Observe DOM mutations with specified options from the specified element.
 * @param element A DOM element from which mutations are observed.
 * @param options A dictionary specifying what mutations to observe.
 * @param callback A callback to be fired when mutation occurs.
 * @returns A callback which collects mutation immediately and fires mutation handler if there is any mutations.
 */
export function observe(element: Node, options: MutationObserverInit, callback: (records: MutationRecord[]) => any): ObserveCallback;

/**
 * Registers a callback to be fired when descandent elements matching the selector is added or removed from the element.
 * @param element A DOM element to observe.
 * @param selector A valid CSS selector.
 * @param callback A callback to be fired when matching element is added or removed.
 * @param fireInit Optionally fired when DOM content is ready.
 * @returns A callback which collects mutation immediately and fires mutation handler if there is any mutations.
 */
export function watchElements<K extends string>(element: Element, selector: K, callback: (addedNodes: Zeta.ElementType<K>[], removedNodes: Zeta.ElementType<K>[]) => any, fireInit?: boolean): ObserveCallback;

/**
 * Registers a callback to be fired when specified attributes of descandent elements are changed.
 * @param element A DOM element to observe.
 * @param attributes A string or a list of string specifying attributes to observe.
 * @param callback A callback to be fired when mutation occurs.
 * @param fireInit Optionally fired when DOM content is ready.
 * @returns A callback which collects mutation immediately and fires mutation handler if there is any mutations.
 */
export function watchAttributes(element: Element, attributes: string | readonly string[], callback: (nodes: Element[], addedNodes: Element[], removedNodes: Element[], changedNodes: Element[]) => any, fireInit?: boolean): ObserveCallback

/**
 * Registers a callback to be fired when specified attributes of the givne element has changed.
 * @param element A DOM element to observe.
 * @param attributes A string or a list of string specifying attributes to observe.
 * @param callback A callback to be fired when mutation occurs.
 */
export function watchOwnAttributes(element: Element, attributes: string | readonly string[], callback: () => any): ObserveCallback;

/**
 * Registers a callback to be fired whenever there are elements detached from document.
 * @param callback A callback to be fired when mutation occurs.
 * @deprecated Use overload with element instead.
 */
export function registerCleanup(callback: () => any): void;

/**
 * Registers a callback to be fired when the given element is detached from document.
 */
export function registerCleanup(element: Element, callback: Zeta.UnregisterCallback): void;

/**
 * Creates a map with DOM element as keys.
 * When an element is detached from the document, the element will be removed from the map.
 * If value associated with element is a callback, the callback will be invoked when the element will be removed from the map.
 */
export function createAutoCleanupMap<T = Zeta.UnregisterCallback, E extends Element = Element>(): Map<E, T>;

/**
 * Creates a map with DOM element as keys.
 * When an element is detached from the element, the element will be removed from the map.
 * If value associated with element is a callback, the callback will be invoked when the element will be removed from the map.
 */
export function createAutoCleanupMap<T = Zeta.UnregisterCallback, E extends Element = Element>(root: Element): Map<E, T>;

/**
 * Creates a map with DOM element as keys.
 * When an element is detached from the document, the element will be removed from the map, and the given handler is called with the element and its associated value in the map.
 * @param callback A callback to be invoked when an element is detached.
 */
export function createAutoCleanupMap<T, E extends Element = Element>(callback: (element: E, value: T) => void): Map<E, T>;

/**
 * Creates a map with DOM element as keys.
 * When an element is detached from the element, the element will be removed from the map, and the given handler is called with the element and its associated value in the map.
 * @param callback A callback to be invoked when an element is detached.
 */
export function createAutoCleanupMap<T, E extends Element = Element>(root: Element, callback: (element: E, value: T) => void): Map<E, T>;

/**
 * Get a promise that will be resolved when the element is removed from the specified parent.
 * @param element A DOM element to observe.
 * @param container A DOM element that is an ancestor of the first argument. If not specified, it is set to the root element.
 * @deprecated Use {@link createAutoCleanupMap} instead.
 */
export function afterDetached<T extends Element>(element: T, container?: Element): Promise<T>;

/**
 * Registers a callback to be fired when when the element is removed from the document.
 * @param element A DOM element to observe.
 * @param callback A callback to be fired when mutation occurs.
 * @deprecated Use {@link registerCleanup} instead.
 */
export function afterDetached<T extends Element>(element: T, callback: (element: T) => any): void;

/**
 * Registers a callback to be fired when when the element is removed from the specified parent.
 * @param element A DOM element to observe.
 * @param container A DOM element that is an ancestor of the first argument.
 * @param callback A callback to be fired when mutation occurs.
 * @deprecated Use {@link createAutoCleanupMap} instead.
 */
export function afterDetached<T extends Element>(element: T, container: Element, callback: (element: T) => any): void;
