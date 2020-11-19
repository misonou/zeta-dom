/// <reference path="types.d.ts" />

export declare var ZetaEventSource: typeof Zeta.ZetaEventSource;
export declare var ZetaEventContainer: typeof Zeta.ZetaEventContainer;
export declare var lastEventSource: Zeta.ZetaEventSource;

export declare function prepEventSource<T>(promise: Promise<T>): Promise<T>;
export declare function getEventSource(element?: Element): Zeta.ZetaEventSourceName;
export declare function emitEvent(eventName: string, container: Zeta.ZetaEventContainer, target: Element, data?: any, bubbles?: boolean): Promise<any> | undefined;
export declare function emitDOMEvent(eventName: string, nativeEvent: Event | null, target: Element, data?: any, bubbles?: boolean, source?: string): Promise<any> | undefined;
export declare function listenDOMEvent(element: Element, event: string, handler: (e: Event) => any);
export declare function listenDOMEvent(element: Element, handlers: Record<string, (e: Event) => any>);
export declare function getContainer(element: Element, self?: boolean): Zeta.ZetaEventContainer;
export declare function setLastEventSource(element: Element | EventTarget | null);
