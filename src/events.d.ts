/// <reference path="types.d.ts" />

export declare var ZetaEventSource: typeof Zeta.ZetaEventSource;
export declare var ZetaEventContainer: typeof Zeta.ZetaEventContainer;
export declare var lastEventSource: Zeta.ZetaEventSource;

export declare function prepEventSource<T>(promise: Promise<T>): Promise<T>;
export declare function getEventSource(element?: Element): Zeta.ZetaEventSourceName;

/**
 * Emits an event to a DOM element.
 * @param eventName Name of the event.
 * @param nativeEvent A native event object dispatched from browser.
 * @param target A DOM element or a custom event target which the event should be dispatched on.
 * @param data Any data to be set on ZetaEvent#data property. If an object is given, the properties will be copied to the ZetaEvent object during dispatch.
 * @param bubbles Specifies whether the event should bubble up through the component tree. Default is true.
 */
export declare function emitDOMEvent(eventName: string, nativeEvent: Event | null, target: Element, data?: any, bubbles?: boolean, source?: string): Promise<any> | undefined;

/**
 * Registers event handlers to the root element.
 * @param event Name of the event.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<T extends Zeta.ZetaDOMEventName>(event: T, handler: Zeta.ZetaEventHandler<T, Zeta.ZetaDOMEventMap>): () => void;

/**
 * Registers event handlers to the root element.
 * @param handlers An object which each entry represent the handler to be registered on the event.
 * @returns A function that will unregister the handler when called.
 */
export declare function listenDOMEvent(handlers: Zeta.ZetaEventHandlers<Zeta.ZetaDOMEventName, Zeta.ZetaDOMEventMap>): () => void;

/**
 * Registers event handlers to a DOM element.
 * @param element A DOM element.
 * @param event Name of the event.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<T extends Zeta.ZetaDOMEventName>(element: Element, event: T, handler: Zeta.ZetaEventHandler<T, Zeta.ZetaDOMEventMap>): () => void;

/**
 * Registers event handlers to a DOM element.
 * @param element A DOM element.
 * @param handlers An object which each entry represent the handler to be registered on the event.
 * @returns A function that will unregister the handler when called.
 */
export declare function listenDOMEvent(element: Element, handlers: Zeta.ZetaEventHandlers<Zeta.ZetaDOMEventName, Zeta.ZetaDOMEventMap>): () => void;
export declare function getEventContext(element: Element): Zeta.ZetaEventContainerOptions & { element: Element; context: any };
export declare function setLastEventSource(element: Element | EventTarget | null): void;
