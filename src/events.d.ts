/// <reference path="types.d.ts" />

/**
 * @deprecated
 */
export declare var lastEventSource: Zeta.ZetaEventSource;

export interface EventEmitAlias {
    /**
     * Specifies the name of alias event.
     */
    eventName: string;
    /**
     * Specifies event data.
     */
    data?: any;
}

export interface EventEmitOptions {
    /**
     * Specifies x-coordinate of a point on screen associated with the event.
     * If specified, only elements at the point will receive the event.
     */
    clientX?: number;

    /**
     * Specifies y-coordinate of a point on screen associated with the event.
     * If specified, only elements at the point will receive the event.
     */
    clientY?: number;

    /**
     * Specifies if the event should bubble up.
     * Default is false.
     */
    bubbles?: boolean;

    /**
     * Specifies whether the event can be handled, such that by returning a result value,
     * subsequent event handlers would be skipped and the returned value will be passed to
     * the caller of the emit function. Default is true.
     *
     * This option is ignored and is forced to be false when {@link EventEmitOptions.deferrable}
     * option is set to true.
     */
    handleable?: boolean;

    /**
     * Specifies whether the event is deferrable by multiple handlers. Default is false.
     *
     * When set to true, the emit function will always return a promise that resolves after
     * all promises registered to {@link Zeta.ZetaDeferrableEvent.waitFor} has settled.
     */
    deferrable?: boolean;

    /**
     * Specifies if the emit function should wrap the return value from event handlers as a Promise.
     * Default is true.
     */
    asyncResult?: boolean;

    /**
     * Specifies the event source that controls how the event should bubble up, as well as
     * the `source` and `sourceKeyName` properties of the event object that would be passed
     * to event handlers.
     */
    source?: Zeta.ZetaEventSource;

    /**
     * Provides a native Event object the event is associated with.
     */
    originalEvent?: Event;

    /**
     * Whether to automatically prevent default behavior when event is handled.
     * This flag is used in conjunction to {@link EventEmitOptions.originalEvent}.
     */
    preventNative?: boolean;

    /**
     * Specifies additional events to be emitted before the main event for each target before propagating up.
     */
    preAlias?: readonly (string | EventEmitAlias)[];

    /**
     * Specifies additional events to be emitted after the main event for each target before propagating up.
     */
    postAlias?: readonly (string | EventEmitAlias)[];
}

export interface EventContainerOptions<T> {
    /**
     * Sets whether all event handlers are automatically removed when the root element is detached.
     */
    autoDestroy?: boolean;

    /**
     * Sets whether {@link ZetaEventContainer.destroy} will be called to end its lifetime.
     *
     * It ensures references to event targets are not held by the container even unregistering callbacks from {@link ZetaEventContainer.add} is still being referenced by consumer.
     * Setting {@link EventContainerOptions.autoDestroy} will enable this flag automatically.
     */
    willDestroy?: boolean;

    /**
     * @deprecated Unused option.
     */
    normalizeTouchEvents?: boolean;

    /**
     * Sets whether DOM events will be captured.
     * If yes, DOM events will be dispatched to registered components within this container in prior to global event handlers registered by `dom.on`.
     */
    captureDOMEvents?: boolean;

    /**
     * Process event object before event is dispatched to handlers registered on this container.
     */
    initEvent?: (e: Zeta.ZetaEventBase<T>) => void;
}

export class ZetaEventSource implements Zeta.ZetaEventSource {
    constructor();
    /**
     * @deprecated Parameters are no longer used. Use constructor with no arguments instead.
     */
    constructor(target: Element, path?: Element[]);

    readonly source: Zeta.ZetaEventSourceName;
    readonly sourceKeyName: string | null;
    /**
     * Gets the elements that are receiving user interaction.
     * @deprecated
     */
    readonly path: readonly Element[];
}

export class ZetaEventContainer<T = Element, M = Zeta.ZetaDOMEventMap<T>> implements Zeta.HasElement {
    /**
     * Createa a new event container for listening or dispatching events.
     * @param root A DOM element of which DOM events fired on descedant elements will be captured.
     * @param context An object to be exposed through `dom.context` if the `captureDOMEvents` option is set to `true`.
     * @param options A dictionary containing options specifying the behavior of the container.
     */
    constructor(root?: Element, context?: any, options?: Zeta.EventContainerOptions<T>);

    /**
     * Gets the root element this container associates with.
     */
    readonly element: HTMLElement;

    /**
     * Gets the public interfacing object exposed through `dom.context` if the `captureDOMEvents` option is set to `true`.
     */
    readonly context: any;

    /**
     * Gets the event currently being fired within this container.
     */
    readonly event: Zeta.ZetaEventBase<T> | null;

    /**
     * Gets whether all event handlers are automatically removed when the root element is detached.
     */
    readonly autoDestroy: boolean;

    /**
     * @deprecated Unused property.
     */
    readonly normalizeTouchEvents: boolean;

    /**
     * Gets whether DOM events will be captured.
     */
    readonly captureDOMEvents: boolean;

    /**
     * Gets context object associated with the event target.
     * @param target An event target, typically a DOM element.
     */
    getContexts(target: T): (T extends Zeta.ZetaEventContextBase<infer R> ? R : T)[];

    /**
     * Enumerates targets to which event will be bubbled up.
     * @param target An event target, typically a DOM element.
     * @param eventData A dictionary containing properties associated to the event.
     */
    getEventPath(target: T, eventData: Zeta.ZetaEventData<any>): Iterable<T>;

    /**
     * Registers event handlers to a DOM element or a custom event target.
     * @param target An event target.
     * @param handlers An object which each entry represent the handler to be registered on the event.
     * @returns A function that will unregister the handler when called.
     */
    add(target: T, handlers: Zeta.ZetaEventHandlers<M, T>): Zeta.UnregisterCallback;

    /**
     * Registers event handlers to a DOM element or a custom event target.
     * @param target An event target.
     * @param event Name of the event.
     * @param handler A callback function to be fired when the specified event is triggered.
     * @returns A function that will unregister the handlers when called.
     */
    add<E extends Zeta.StringKeyOf<M>>(target: T, event: E, handler: Zeta.ZetaEventHandler<E, M, T>): Zeta.UnregisterCallback;

    /**
     * Registers event handlers to a DOM element or a custom event target.
     * @param target An event target.
     * @param event Name of the event.
     * @param handler A callback function to be fired when the specified event is triggered.
     * @returns A function that will unregister the handlers when called.
     */
    add<E extends Zeta.HintedStringKeyOf<M>>(target: T, event: E, handler: Zeta.ZetaEventHandler<Zeta.WhitespaceDelimited<E>, M, T>): Zeta.UnregisterCallback;

    /**
     * Removes the DOM element or custom event target from the container.
     * All event handlers are also removed.
     * @param target An event target.
     */
    delete(target: T): void;

    /**
     * Defunct the container. Destroy event will be fired for all registered elements.
     */
    destroy(): void;

    /**
     * Re-emits an event to components.
     * If the event is handled by component, a promise object is returned.
     * @param event An instance of ZetaEvent representing the event to be re-emitted.
     * @param target Event target. If target is not specified, {@link Zeta.ZetaEventBase.target} from the `event` parameter will be used.
     * @param data Data to be set on {@link Zeta.ZetaEventBase.data} property. If an object is given, the properties will be copied to the {@link Zeta.ZetaEvent} object during dispatch.
     */
    emit(event: Zeta.ZetaEventBase<any>, target?: T, data?: Zeta.Primitive | Zeta.ZetaEventGenericInit): any;

    /**
     * Re-emits an event to components.
     * If the event is handled by component, a promise object is returned.
     * @param event An instance of ZetaEvent representing the event to be re-emitted.
     * @param target Event target.
     * @param data Data to be set on {@link Zeta.ZetaEventBase.data} property. If an object is given, the properties will be copied to the {@link Zeta.ZetaEvent} object during dispatch.
     * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
     */
    emit<U extends boolean | Zeta.EventEmitOptions>(event: Zeta.ZetaEventBase<any>, target: T, data: Zeta.Primitive | Zeta.ZetaEventGenericInit, options: boolean | Zeta.EventEmitOptions): Zeta.ZetaEventEmitReturnTypeByOptions<U>;

    /**
     * Emits an event to components synchronously.
     * If the event is handled by component, a promise object is returned.
     * @param eventName Event name.
     * @param target Event target.
     * @param data Data to be set on {@link Zeta.ZetaEventBase.data} property. If an object is given, properties will be copied to the {@link Zeta.ZetaEvent} object during dispatch.
     * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
     */
    emit<E extends { [E in Zeta.StringKeyOf<M>]: boolean extends Zeta.ZetaEventEmitOptionType<E, M> ? E : never }[Zeta.StringKeyOf<M>]>(eventName: E, target?: T, data?: Zeta.ZetaEventInit<E, M>): Zeta.ZetaEventEmitReturnType<E, M>;

    /**
     * Emits an event to components synchronously.
     * If the event is handled by component, a promise object is returned.
     * @param eventName Event name.
     * @param target Event target.
     * @param data Data to be set on {@link Zeta.Zeta.ZetaEventBase.data} property. If an object is given, properties will be copied to the {@link Zeta.ZetaEvent} object during dispatch.
     * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
     */
    emit<E extends Zeta.StringKeyOf<M>>(eventName: E, target: T, data: Zeta.ZetaEventInit<E, M>, options: Zeta.ZetaEventEmitOptionType<E, M>): Zeta.ZetaEventEmitReturnType<E, M>;

    /**
     * Emits an event to components synchronously.
     * If the event is handled by component, a promise object is returned.
     * @param eventName Event name.
     * @param target Event target.
     * @param data Data to be set on {@link Zeta.ZetaEventBase.data} property. If an object is given, properties will be copied to the {@link Zeta.ZetaEvent} object during dispatch.
     */
    emit<E extends string>(eventName: Exclude<E, keyof M>, target?: T, data?: Zeta.Primitive | Zeta.ZetaEventGenericInit): Promise<any> | undefined;

    /**
     * Emits an event to components synchronously.
     * If the event is handled by component, a promise object is returned.
     * @param eventName Event name.
     * @param target Event target.
     * @param data Data to be set on {@link Zeta.ZetaEventBase.data} property. If an object is given, properties will be copied to the {@link Zeta.ZetaEvent} object during dispatch.
     * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
     */
    emit<E extends string, U extends boolean | Zeta.EventEmitOptions>(eventName: Exclude<E, keyof M>, target: T, data: Zeta.Primitive | Zeta.ZetaEventGenericInit, options: U): Zeta.ZetaEventEmitReturnTypeByOptions<U>;

    /**
     * Emits an event to components asynchronously.
     * @param eventName Event name.
     * @param target Event target.
     * @param data Data to be set on {@link Zeta.ZetaEventBase.data} property. If an object is given, properties will be copied to the {@link Zeta.ZetaEvent} object during dispatch.
     * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
     * @param mergeData A callback to aggregates data from the previous undispatched event of the same name on the same target.
     * @deprecated
     */
    emitAsync<E extends keyof M, V = any>(eventName: E, target?: T, data?: V, options?: boolean | Zeta.EventEmitOptions, mergeData?: (v: V, a: V) => V): void;

    /**
     * Emits an event to components asynchronously.
     * @param eventName Event name.
     * @param target Event target.
     * @param data Data to be set on {@link Zeta.ZetaEventBase.data} property. If an object is given, properties will be copied to the {@link Zeta.ZetaEvent} object during dispatch.
     * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
     * @param mergeData A callback to aggregates data from the previous undispatched event of the same name on the same target.
     * @deprecated
     */
    emitAsync<V = any>(eventName: string, target?: T, data?: V, options?: boolean | Zeta.EventEmitOptions, mergeData?: (v: V, a: V) => V): void;

    /**
     * Adds a handler to intercept event being fired within this container.
     * @param handler An event handler.
     */
    tap(handler: Zeta.ZetaEventHandler<'tap', {}, ZetaEventContainer>): Zeta.UnregisterCallback;

    /**
     * Fire scheduled asynchronous events immediately.
     * @deprecated
     */
    flushEvents(): void;
}

/**
 * @deprecated
 */
export declare function prepEventSource<T>(promise: Promise<T>): Promise<T>;
/**
 * @deprecated
 */
export declare function getEventSource(element?: Element): Zeta.ZetaEventSourceName;
export declare function getEventContext(element: Element): Zeta.EventContainerOptions<any> & { element: Element; context: any };
/**
 * @deprecated
 */
export declare function setLastEventSource(element: Element | EventTarget | null): void;

/**
 * Emits an event to a DOM element.
 * @param eventName Name of the event.
 * @param nativeEvent A native event object dispatched from browser.
 * @param target A DOM element or a custom event target which the event should be dispatched on.
 * @param data Any data to be set on ZetaEvent#data property. If an object is given, the properties will be copied to the ZetaEvent object during dispatch.
 * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
 */
export declare function emitDOMEvent<E extends Zeta.ZetaDOMEventName>(eventName: E, target: Element, data?: Zeta.ZetaEventInit<E, Zeta.ZetaDOMEventMap>, options?: Zeta.ZetaEventEmitOptionType<E, Zeta.ZetaDOMEventMap>): Zeta.ZetaEventEmitReturnType<E, Zeta.ZetaDOMEventMap>;

/**
 * Emits an event to the active DOM element.
 * @param eventName Name of the event.
 * @param nativeEvent A native event object dispatched from browser.
 * @param data Any data to be set on ZetaEvent#data property. If an object is given, the properties will be copied to the ZetaEvent object during dispatch.
 * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
 */
export declare function emitDOMEvent<E extends Zeta.ZetaDOMEventName>(eventName: E, data?: Zeta.ZetaEventInit<E, Zeta.ZetaDOMEventMap>, options?: Zeta.ZetaEventEmitOptionType<E, Zeta.ZetaDOMEventMap>): Zeta.ZetaEventEmitReturnType<E, Zeta.ZetaDOMEventMap>;

/**
 * Registers event handlers to the root element.
 * @param handlers An object which each entry represent the handler to be registered on the event.
 * @returns A function that will unregister the handler when called.
 */
export declare function listenDOMEvent(handlers: Zeta.ZetaDOMEventHandlers<HTMLHtmlElement>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to a DOM element.
 * @param element A DOM element.
 * @param handlers An object which each entry represent the handler to be registered on the event.
 * @returns A function that will unregister the handler when called.
 */
export declare function listenDOMEvent<T extends Element>(element: T, handlers: Zeta.ZetaDOMEventHandlers<T>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to a DOM element.
 * @param element A DOM element.
 * @param event Name of the event.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<T extends Element, E extends Zeta.HintedString<Zeta.ZetaDOMEventName>>(element: T, event: E, handler: Zeta.ZetaDOMEventHandler<Zeta.WhitespaceDelimited<E>, T>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to a DOM element, where the handler is fired only when there exists an ancestor of the event target matches the specified selector.
 * @param element A DOM element.
 * @param event Name of the event.
 * @param selector A valid CSS selector.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<T extends Element, E extends Zeta.HintedString<Zeta.ZetaDOMEventName>, K extends string>(element: T, event: E, selector: K, handler: Zeta.ZetaDOMEventHandler<Zeta.WhitespaceDelimited<E>, Zeta.ElementType<K>>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to the root element.
 * @param event Name of the event.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<E extends Zeta.HintedString<Zeta.ZetaDOMEventName>>(event: E, handler: Zeta.ZetaDOMEventHandler<Zeta.WhitespaceDelimited<E>, HTMLHtmlElement>): Zeta.UnregisterCallback;

/**
 * Registers event handlers to the root element, where the handler is fired only when there exists an ancestor of the event target matches the specified selector.
 * @param event Name of the event.
 * @param selector A valid CSS selector.
 * @param handler A callback function to be fired when the specified event is triggered.
 * @returns A function that will unregister the handlers when called.
 */
export declare function listenDOMEvent<E extends Zeta.HintedString<Zeta.ZetaDOMEventName>, K extends string>(event: E, selector: K, handler: Zeta.ZetaDOMEventHandler<Zeta.WhitespaceDelimited<E>, Zeta.ElementType<K>>): Zeta.UnregisterCallback;
