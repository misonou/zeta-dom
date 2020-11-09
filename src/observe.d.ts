/// <reference path="types.d.ts" />

export function observe(element: Element, callback: (records: MutationRecord[]) => any): () => void;

export function watchElements(element: Element, selector: string, callback: (addedNodes: Element[], removedNodes: Element[]) => any): void;

export function watchAttributes(element: Element, attributes: string | string[], callback: (map: Map<Element, { oldValues: Zeta.Dictionary<string | null>, newValues: Zeta.Dictionary<string | null> }>) => any): void;
