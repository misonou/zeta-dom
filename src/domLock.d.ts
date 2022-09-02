/// <reference path="types.d.ts" />

/**
 * Enables listening of `asyncStart` and `asyncEnd` events that is triggered by descedant elements.
 * @param element A DOM element.
 */
export declare function lock(element: Element): Promise<void>;

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
 * The element, and its parent elements that has been called with {@link lock} will receive `asyncStart` and `asyncEnd` events when
 * the promise is the first one associated to those elements and is the last one resolves.
 *
 * When the `oncancel` handler is supplied, it will be invoked upon request of cancellation; otherwise the cancellation request will be always rejected.
 * To reject the cancellation from the handler, return a rejected promise.
 *
 * @param element A DOM element.
 * @param promise A promise which resolves or rejects when operation is completed.
 * @param oncancel A handler which handles request of cancellation by {@link cancelLock}.
 * @returns A promise which, when the operation was not cancelled, forwards the result of the given promise; or rejects if the operation was cancelled; or the DOM element was detached before the operation completed.
 */
export declare function lock<T>(element: Element, promise: Promise<T>, oncancel?: () => Promise<any>): Promise<T>;

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
 * Has the same effect of calling `lock` with third argument being `true`.
 *
 * @param element A DOM element.
 * @param promise A promise which resolves or rejects when operation is completed.
 * @see {@link lock}
 */
export declare function notifyAsync(element: Element, promise: Promise<any>): void;

/**
 * Associates an asynchronous operation with the specified element.
 * Requests of cancellation can be raised by calling {@link cancelLock} on any parent elements.
 *
 * When the `oncancel` handler is supplied, it will be invoked upon request of cancellation; otherwise the cancellation request will be always rejected.
 * To reject the cancellation from the handler, return a rejected promise.
 *
 * Has the similar effect of calling `lock` with the same argument except that there will be no `asyncStart` and `asyncEnd` events triggered.
 *
 * @param element A DOM element.
 * @param promise A promise which resolves or rejects when operation is completed.
 * @param oncancel A handler which handles request of cancellation by {@link cancelLock}.
 * @see {@link lock}
 */
export declare function preventLeave<T>(element: Element, promise: Promise<T>, oncancel?: () => Promise<any>): void;
