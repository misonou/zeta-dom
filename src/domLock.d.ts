/// <reference path="types.d.ts" />

export class CancellationRequest {
    /**
     * @param reason A canonical string that describes the reason.
     * @param eventSource When specified, it overrides current event source values.
     */
    constructor(reason: string, eventSource?: Zeta.ZetaEventSource);

    /**
     * A canonical string that describes the reason.
     */
    readonly reason: string;
    /**
     * Gets the type of user interaction that triggers the event.
     */
    readonly source: Zeta.ZetaEventSourceName;
    /**
     * Gets the keystroke that triggers the event, or `null` if the event is not triggered by keyboard.
     */
    readonly sourceKeyName: string | null;
}

/**
 * Enables listening of `asyncStart` and `asyncEnd` events that is triggered by descedant elements.
 * @param element A DOM element.
 * @deprecated Use {@link subscribeAsync} instead.
 */
export declare function lock(element: Element): void;

/**
 * Equivalent to calling with third argument with `Promise.resolve()` when `cancellable` is `true`; and `Promise.reject()` otherwise.
 * @param element A DOM element.
 * @param promise A promise which resolves or rejects when operation is completed.
 * @param cancellable Whether the operation is cancellable.
 * @returns A promise which, when the operation was not cancelled, forwards the result of the given promise; or rejects if the operation was cancelled; or the DOM element was detached before the operation completed.
 */
export declare function lock<T>(element: Element, promise: Promise<T>, cancellable?: boolean): Promise<T>;

/**
 * Associates an asynchronous operation with the specified element.
 * Requests of cancellation can be raised by calling {@link cancelLock} on any parent elements.
 *
 * When the `oncancel` handler is supplied, it will be invoked upon request of cancellation; otherwise the cancellation request will be always rejected.
 * To reject the cancellation from the handler, return a rejected promise.
 *
 * @param element A DOM element.
 * @param oncancel A handler which handles request of cancellation by {@link cancelLock}.
 * @returns A callback that remove the lock.
 */
export declare function lock<T>(element: Element, oncancel: (reason: CancellationRequest) => any): Zeta.UnregisterCallback;

/**
 * Associates an asynchronous operation with the specified element.
 * Requests of cancellation can be raised by calling {@link cancelLock} on any parent elements.
 *
 * When the `oncancel` handler is supplied, it will be invoked upon request of cancellation; otherwise the cancellation request will be always rejected.
 * To reject the cancellation from the handler, return a rejected promise.
 *
 * @param element A DOM element.
 * @param promise A promise which resolves or rejects when operation is completed.
 * @param oncancel A handler which handles request of cancellation by {@link cancelLock}.
 * @returns A promise which, when the operation was not cancelled, forwards the result of the given promise; or rejects if the operation was cancelled; or the DOM element was detached before the operation completed.
 */
export declare function lock<T>(element: Element, promise: Promise<T>, oncancel?: (reason: CancellationRequest) => any): Promise<T>;

/**
 * Gets whether there are any pending operations associated, i.e. being locked.
 */
export declare function locked(): boolean;

/**
 * Gets whether a given element has pending operation associated, i.e. being locked.
 * @param element A DOM element.
 * @param parents When given `true`, parent elements will be taken into account.
 */
export declare function locked(element: Element, parents?: boolean): boolean;

/**
 * Requests cancellation of all asynchronous operations.
 * @returns A promise which is fulfilled when all operations are cancelled; or is rejected otherwise.
 */
export declare function cancelLock(): Promise<void>;

/**
 * Requests cancellation of asynchronous operations associated with any descendant elements
 * @param element A DOM element.
 * @param reason Reason that will be passed to cancellation handling callback.
 * @returns A promise which is fulfilled when all operations are cancelled; or is rejected otherwise.
 */
export declare function cancelLock(element: Element, reason?: string | CancellationRequest): Promise<void>;

/**
 * Requests cancellation of asynchronous operations associated with any descendant elements.
 * @param element A DOM element.
 * @param force Whether to disregard cancellation handler and forcibly release all locks.
 * @returns A promise which is fulfilled when all operations are cancelled; or is rejected otherwise.
 */
export declare function cancelLock(element: Element, force?: boolean): Promise<void>;

/**
 * Associates an asynchronous operation with the specified element.
 *
 * The element, and its parent elements that has been called with {@link lock} will receive `asyncStart` and `asyncEnd` events when
 * the promise is the first one associated to those elements and is the last one resolves.
 *
 * @param element A DOM element.
 * @param promise A promise which resolves or rejects when operation is completed.
 * @param oncancel An optional callback to be called when the operation is being cancelled.
 */
export declare function notifyAsync(element: Element, promise: Promise<any>, oncancel?: (error: Error) => any): void;

/**
 * Associates an asynchronous operation with the specified element.
 * @param element A DOM element.
 * @param callback A callback that perform asynchronous operation.
 * @returns A promise which forwards result returned from callback.
 */
export declare function runAsync<T>(element: Element, callback: (context: Zeta.RunAsyncContext) => T): Promise<Awaited<T>>;

/**
 * Enables listening of `asyncStart` and `asyncEnd` events that is triggered by descedant elements.
 * @param element A DOM element.
 * @param stopPropagation Optionally prevents `asyncStart` and `asyncEnd` events being bubbled up.
 */
export declare function subscribeAsync(element: Element, stopPropagation?: true): void;

/**
 * Listens and invokes supplied callback at `asyncStart` and `asyncEnd` events.
 * @param element A DOM element.
 * @param callback A callback that will be invoked with a boolean indicating if there is asynchronous operation in progress.
 */
export declare function subscribeAsync<T extends Element>(element: T, callback: (this: T, loading: boolean) => void): Zeta.UnregisterCallback;

/**
 * Prompts user before leaving the page.
 * @returns A callback that cancels the prompt.
 */
export declare function preventLeave(): Zeta.UnregisterCallback;

/**
 * Prompts user before leaving the page within the lifetime of the promise.
 * @param promise A promise object.
 */
export declare function preventLeave(promise: Promise<any>): void;

/**
 * Associates an asynchronous operation with the specified element.
 * Requests of cancellation can be raised by calling {@link cancelLock} on any parent elements.
 *
 * When the `oncancel` handler is supplied, it will be invoked upon request of cancellation; otherwise the cancellation request will be always rejected.
 * To reject the cancellation from the handler, return a rejected promise.
 *
 * @param element A DOM element.
 * @param promise A promise which resolves or rejects when operation is completed.
 * @param oncancel A handler which handles request of cancellation by {@link cancelLock}.
 * @deprecated Use {@link lock} instead.
 */
export declare function preventLeave<T>(element: Element, promise: Promise<T>, oncancel?: (reason: CancellationRequest) => Promise<any>): void;
