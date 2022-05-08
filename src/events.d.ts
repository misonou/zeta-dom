/// <reference path="types.d.ts" />

export declare var ZetaEventSource: typeof Zeta.ZetaEventSource;
export declare var ZetaEventContainer: typeof Zeta.ZetaEventContainer;
export declare var lastEventSource: Zeta.ZetaEventSource;

export declare function prepEventSource<T>(promise: Promise<T>): Promise<T>;
export declare function getEventSource(element?: Element): Zeta.ZetaEventSourceName;
export declare function getEventContext(element: Element): Zeta.EventContainerOptions & { element: Element; context: any };
export declare function setLastEventSource(element: Element | EventTarget | null): void;

/**
 * Emits an event to a DOM element.
 * @param eventName Name of the event.
 * @param nativeEvent A native event object dispatched from browser.
 * @param target A DOM element or a custom event target which the event should be dispatched on.
 * @param data Any data to be set on ZetaEvent#data property. If an object is given, the properties will be copied to the ZetaEvent object during dispatch.
 * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
 */
export declare function emitDOMEvent(eventName: string, target: Element, data?: any, options?: boolean | Zeta.EventEmitOptions): any;

/**
 * Emits an event to the active DOM element.
 * @param eventName Name of the event.
 * @param nativeEvent A native event object dispatched from browser.
 * @param data Any data to be set on ZetaEvent#data property. If an object is given, the properties will be copied to the ZetaEvent object during dispatch.
 * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
 */
export declare function emitDOMEvent(eventName: string, data?: any, options?: boolean | Zeta.EventEmitOptions): any;

/**
 * Registers event handlers to the root element.
 * @param event Name of the event.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<E extends Zeta.ZetaDOMEventName>(event: E, handler: Zeta.ZetaEventHandler<E, Zeta.ZetaDOMEventMap, HTMLHtmlElement>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to the root element.
 * @param event Name of the event.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent(event: string, handler: Zeta.ZetaEventHandler<string, Zeta.ZetaDOMEventMap, HTMLHtmlElement>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to the root element, where the handler is fired only when there exists an ancestor of the event target matches the specified selector.
 * @param event Name of the event.
 * @param selector A valid CSS selector.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<E extends Zeta.ZetaDOMEventName>(event: E, selector: string, handler: Zeta.ZetaEventHandler<E, Zeta.ZetaDOMEventMap, HTMLHtmlElement>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to the root element, where the handler is fired only when there exists an ancestor of the event target matches the specified selector.
 * @param event Name of the event.
 * @param selector A valid CSS selector.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent(event: string, selector: string, handler: Zeta.ZetaEventHandler<string, Zeta.ZetaDOMEventMap>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to the root element.
 * @param handlers An object which each entry represent the handler to be registered on the event.
 * @returns A function that will unregister the handler when called.
 */
export declare function listenDOMEvent(handlers: Zeta.ZetaEventHandlers<Zeta.ZetaDOMEventName, Zeta.ZetaDOMEventMap, HTMLHtmlElement>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to a DOM element.
 * @param element A DOM element.
 * @param event Name of the event.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<T extends Element, E extends Zeta.ZetaDOMEventName>(element: T, event: E, handler: Zeta.ZetaEventHandler<E, Zeta.ZetaDOMEventMap, T>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to a DOM element.
 * @param element A DOM element.
 * @param event Name of the event.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<T extends Element>(element: T, event: string, handler: Zeta.ZetaEventHandler<string, Zeta.ZetaDOMEventMap, T>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to a DOM element, where the handler is fired only when there exists an ancestor of the event target matches the specified selector.
 * @param element A DOM element.
 * @param event Name of the event.
 * @param selector A valid CSS selector.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<T extends Element, E extends Zeta.ZetaDOMEventName>(element: T, event: E, selector: string, handler: Zeta.ZetaEventHandler<E, Zeta.ZetaDOMEventMap, T>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to a DOM element, where the handler is fired only when there exists an ancestor of the event target matches the specified selector.
 * @param element A DOM element.
 * @param event Name of the event.
 * @param selector A valid CSS selector.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<T extends Element>(element: T, event: string, selector: string, handler: Zeta.ZetaEventHandler<string, Zeta.ZetaDOMEventMap>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to a DOM element.
 * @param element A DOM element.
 * @param handlers An object which each entry represent the handler to be registered on the event.
 * @returns A function that will unregister the handler when called.
 */
export declare function listenDOMEvent<T extends Element>(element: T, handlers: Zeta.ZetaEventHandlers<string, Zeta.ZetaDOMEventMap, T>): Zeta.UnregisterCallback;
