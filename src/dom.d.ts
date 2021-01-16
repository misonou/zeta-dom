/// <reference path="types.d.ts" />

/**
 * Gets the DOM event which triggers the current event loop.
 */
export var event: Event | null;

/**
 * Gets the active component registered through event container.
 * @see Zeta.ZetaEventContainer<T>
 */
export var context: any;

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
 * Determines whether the element can receive text input.
 * @param element A DOM element.
 */
export function textInputAllowed(element: Element): boolean;

/**
 * Determines whether the given element is currently focusable.
 * The result will be `false` in case the element is outside the current modal element,
 * which prevents focus to be moved outside the model element.
 * @param element A DOM element.
 */
export function focusable(element: Element): Element | false;

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

export function releaseFocus(b: Element): void;

export function getShortcut(key: string): string[];

export function setShortcut(command: string, keystroke: string | string[]): void;

export function setShortcut(setting: Zeta.Dictionary<string | string[]>): void;

export function beginDrag(progressCallback?: (x: number, y: number) => void): PromiseLike<void>;

export function beginDrag(within: Element, progressCallback?: (x: number, y: number) => void): PromiseLike<void>;

export function beginPinchZoom(progressCallback?: (deg: number, scale: number, translateX: number, translateY: number) => void): PromiseLike<void>;

export { getEventContext, getEventSource, listenDOMEvent as on, emitDOMEvent as emit } from "./events";

export * from "./domLock";

export * from "./observe";
