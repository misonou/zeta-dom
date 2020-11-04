/// <reference path="types.d.ts" />

/**
 * Gets the DOM event which triggers the current event loop.
 */
export var event: Event | null;

/**
 * Gets the current active element which is readily receiving user input.
 */
export var activeElement: HTMLElement;

export var focusedElements: HTMLElement[];

/**
 * Gets the type of user interaction that triggers the current event.
 */
export var eventSource: Zeta.ZetaEventSourceName;

export const root: HTMLHtmlElement;

export const ready: Promise<void>;

export function focusable(window: Window): boolean;

/**
 * Determines whether current window is in focus.
 * @param window Window object.
 */
export function focused(window: Window): boolean;

/**
 * Determines whether a given element is in focus.
 * @param element A DOM element.
 */
export function focused(element: Element, strict?: boolean): boolean;

export function focus(element: Element): void;

export function setModal(element: Element): void;

export function retainFocus(a: Element, b: Element): void;

export function releaseFocus(a: Element, b: Element): void;

export function emit(eventName: string, target: Element, data?: any, bubbles?: boolean)

export function on<T extends Zeta.ZetaEventName>(event: T, handler: Zeta.ZetaEventHandler<T>): void;

export function on(event: string, handler: Zeta.ZetaEventHandler<any>): void;

export function on(event: Zeta.ZetaEventHandlers): void;

export function on<T extends Zeta.ZetaEventName>(element: Element, event: T, handler: Zeta.ZetaEventHandler<T>): void;

export function on(element: Element, event: string, handler: Zeta.ZetaEventHandler<any>): void;

export function on(element: Element, event: Zeta.ZetaEventHandlers): void;


/* --------------------------------------
 * domLock
 * -------------------------------------- */

export declare function lock(element: Element, promise: Promise<any>, oncancel?: () => Promise<any>): Promise<any>;
export declare function locked(element: Element, parents?: boolean): boolean;
export declare function cancelLock(element: Element, force?: boolean): void;
export declare function removeLock(element: Element): void;

/* --------------------------------------
 * Observe
 * -------------------------------------- */

export function watchElements(element: Element, selector: string, callback: (addedNodes: Element[], removedNodes: Element[]) => any): void;

/**
 * Scroll all ancestor container so that the specified element is in view.
 * @param element Element to be scrolled into view.
 * @param rect A rect represent a region inside the element to be scrolled into view.
 */
export function scrollIntoView(element: Element, rect?: Zeta.RectLike): void;
