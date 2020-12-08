/// <reference path="types.d.ts" />

/**
 * Observe DOM child list mutations from the specified element.
 * @param element A DOM element from which mutations are observed.
 * @param callback A callback to be fired when mutation occurs.
 * @returns A callback which collects mutation immediately and fires mutation handler if there is any mutations.
 */
export function observe(element: Element, callback: (records: MutationRecord[]) => any): () => void;

/**
 * Observe DOM mutations with specified options from the specified element.
 * @param element A DOM element from which mutations are observed.
 * @param options A dictionary specifying what mutations to observe.
 * @param callback A callback to be fired when mutation occurs.
 * @returns A callback which collects mutation immediately and fires mutation handler if there is any mutations.
 */
export function observe(element: Element, options: MutationObserverInit, callback: (records: MutationRecord[]) => any): () => void;

/**
 * Registers a callback to be fired when descandent elements matching the selector is added or removed from the element.
 * @param element A DOM element to observe.
 * @param selector A valid CSS selector.
 * @param callback A callback to be fired when matching element is added or removed.
 * @param fireInit Optionally fired when DOM content is ready.
 */
export function watchElements(element: Element, selector: string, callback: (addedNodes: Element[], removedNodes: Element[]) => any, fireInit?: boolean): void;

/**
 * Registers a callback to be fired when specified attributes of descandent elements are changed.
 * @param element A DOM element to observe.
 * @param attributes A string or a list of string specifying attributes to observe.
 * @param callback A callback to be fired when mutation occurs.
 * @param fireInit Optionally fired when DOM content is ready.
 */
export function watchAttributes(element: Element, attributes: string | string[], callback: (nodes: Element[]) => any, fireInit?: boolean): void;

/**
 * Registers a callback to be fired whenever there are elements detached from document.
 * @param callback A callback to be fired when mutation occurs.
 */
export function registerCleanup(callback: () => any): void;

/**
 * Get a promise that will be resolved when the element is removed from the specified parent.
 * @param element A DOM element to observe.
 * @param container A DOM element that is an ancestor of the first argument. If not specified, it is set to the root element.
 */
export function afterDetached<T extends Element>(element: T, container?: Element): Promise<T>;

/**
 * Registers a callback to be fired when when the element is removed from the document.
 * @param element A DOM element to observe.
 * @param callback A callback to be fired when mutation occurs.
 */
export function afterDetached<T extends Element>(element: T, callback: (element: T) => any): void;

/**
 * Registers a callback to be fired when when the element is removed from the specified parent.
 * @param element A DOM element to observe.
 * @param container A DOM element that is an ancestor of the first argument.
 * @param callback A callback to be fired when mutation occurs.
 */
export function afterDetached<T extends Element>(element: T, container: Element, callback: (element: T) => any): void;
