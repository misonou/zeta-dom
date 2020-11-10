/// <reference path="types.d.ts" />

/**
 * Gets the DOM event which triggers the current event loop.
 */
export var event: Event | null;

/**
 * Gets the current active element which is readily receiving user input.
 */
export var activeElement: HTMLElement;

/**
 * Gets the element, and also any ancestors, which are in focus.
 */
export var focusedElements: HTMLElement[];

/**
 * Gets the type of user interaction that triggers the current event.
 */
export var eventSource: Zeta.ZetaEventSourceName;

/**
 * Gets the root element of the document, usually the `<html>` element.
 */
export const root: HTMLHtmlElement;

/**
 * Gets a promise which is resolved when DOM is ready.
 */
export const ready: Promise<void>;

/**
 * Determines whether the given element is currently focusable.
 * The result will be `false` in case the element is outside the current modal element,
 * which prevents focus to be moved outside the model element.
 * @param element A DOM element.
 */
export function focusable(element: Element): boolean;

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

export * from "./domLock";

/* --------------------------------------
 * Observe
 * -------------------------------------- */

export * from "./observe";
