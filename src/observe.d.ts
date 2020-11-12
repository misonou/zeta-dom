/// <reference path="types.d.ts" />

export function observe(element: Element, callback: (records: MutationRecord[]) => any): () => void;

export function observe(element: Element, options: MutationObserverInit, callback: (records: MutationRecord[]) => any): () => void;

export function watchElements(element: Element, selector: string, callback: (addedNodes: Element[], removedNodes: Element[]) => any, fireInit?: boolean): void;

export function watchAttributes(element: Element, attributes: string | string[], callback: (nodes: Element[]) => any): void;

export function registerCleanup(callback: () => any): void;

export function afterDetached<T extends Element>(element: T, container?: Element): Promise<T>;

export function afterDetached<T extends Element>(element: T, callback: (element: T) => any): void;

export function afterDetached<T extends Element>(element: T, container: Element, callback: (element: T) => any): void;
