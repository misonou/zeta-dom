/// <reference path="types.d.ts" />

import { getEventContext, getEventSource, listenDOMEvent, emitDOMEvent } from "./events";
import * as lock from "./domLock";
import * as observe from "./observe";

// @ts-ignore
declare const methods = {
    textInputAllowed,
    focusable,
    focused,
    setTabRoot,
    unsetTabRoot,
    setModal,
    releaseModal,
    retainFocus,
    releaseFocus,
    iterateFocusPath,
    focus,
    blur,
    beginDrag,
    beginPinchZoom,
    insertText,
    getShortcut,
    setShortcut,
};

// @ts-ignore
declare const events = {
    getEventContext,
    getEventSource,
    on: listenDOMEvent,
    emit: emitDOMEvent
};

declare const dom: typeof lock & typeof observe & typeof events & typeof methods & {
    /**
     * Gets the DOM event which triggers the current event loop.
     */
    readonly event: Event | null;

    /**
     * Gets the currently pressed key modifiers.
     */
    readonly metaKey: '' | Zeta.KeyNameModifier;

    /**
     * Gets the active component registered through event container.
     * @see Zeta.ZetaEventContainer<T>
     */
    readonly context: any;

    /**
     * Gets the current active element which is readily receiving user input.
     */
    readonly activeElement: HTMLElement;

    /**
     * Gets the current modal element.
     */
    readonly modalElement: HTMLElement | null;

    /**
     * Gets the element, and also any ancestors, which are in focus.
     */
    readonly focusedElements: HTMLElement[];

    /**
     * Gets the type of user interaction that triggers the current event.
     */
    readonly eventSource: Zeta.ZetaEventSourceName;

    /**
     * Gets the root element of the document, usually the `<html>` element.
     */
    readonly root: HTMLHtmlElement;

    /**
     * Gets a promise which is resolved when DOM is ready.
     */
    readonly ready: Promise<void>;
}

export default dom;

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

/**
 * Sets focus to the given element.
 * @param element A DOM element.
 * @param focusInput Whether to focus the first focusable element within. Default is `true`.
 * @return Whether the given element is set focused.
 */
export function focus(element: Element, focusInput?: boolean): boolean;

/**
 * Removes focus from the given element.
 * @param element A DOM element.
 * @return Whether the given element is not focused after operation.
 */
export function blur(element: Element): boolean;

/**
 * Marks an element to be a tab root, such that when the element is focused,
 * only its descendant elements can be focused by pressing tab/shift-tab key,
 * or previous/next button in virtual keyboard.
 * @param element A DOM element.
 */
export function setTabRoot(element: Element): void;

/**
 * Unmarks an element to be a tab root, so that effect by {@link setTabRoot} is reverted.
 * @param element A DOM element.
 */
export function unsetTabRoot(element: Element): void;

/**
 * Sets the given element as modal element.
 *
 * When a element is modal, only its descendant elements and elements to which focus can be delegated
 * can be focused and receive events from user interaction.
 *
 * The modal state can be manually cancelled by {@link releaseModal}; or
 * automatically when the element is detached.
 *
 * @param element A DOM element.
 * @return Whether the given element has gained the modal state.
 */
export function setModal(element: Element): boolean;

/**
 * Unsets the modal state of the given element.
 * @param element A DOM element.
 */
export function releaseModal(element: Element): void;

/**
 * Allows focus delegation to another element that is not a descenant of the source element.
 *
 * Once delegated, the target element can be focused while the source element remains in
 * focused state (i.e. {@link focused} will still return true, and no `focusout` event will be fired.).
 *
 * Focus delegation can be cancelled by {@link releaseFocus}.
 *
 * @param source A DOM element to be remained in focused state.
 * @param target A DOM element, usually a flyout.
 */
export function retainFocus(source: Element, target: Element): void;

/**
 * Removes focus delegation given to the target element.
 * @param target A DOM element, usually a flyout.
 */
export function releaseFocus(target: Element): void;

export function iterateFocusPath(element: Element): Iterator<Element>;

export function getShortcut(key: string): string[];

export function setShortcut(command: string, keystroke: string | string[]): void;

export function setShortcut(setting: Zeta.Dictionary<string | string[]>): void;

export function beginDrag(progressCallback?: (x: number, y: number, dx: number, dy: number) => void): Promise<void>;

/**
 * @deprecated `within` parameter has no effect
 */
export function beginDrag(within: Element, progressCallback?: (x: number, y: number, dx: number, dy: number) => void): Promise<void>;

export function beginPinchZoom(progressCallback?: (deg: number, scale: number, translateX: number, translateY: number) => void): Promise<void>;

/**
 * Inserts text an input element, where text currently highlighted will be replaced.
 *
 * Note that if the input element does not support selection API, where it is the case for some input type in certain browsers,
 * an `zeta/invalid-operation` error will be thrown. It can be verifed by whether `selectionStart` property of the input element is `null`.
 *
 * @param element An input element.
 * @param text Text to be inserted.
 * @returns Whether text is inserted and native `input` event is dispatched.
 */
export function insertText(element: HTMLInputElement | HTMLTextAreaElement, text: string): boolean;

/**
 * Inserts text an input element.
 *
 * Note that if the input element does not support selection API, where it is the case for some input type in certain browsers,
 * an `zeta/invalid-operation` error will be thrown. It can be verifed by whether `selectionStart` property of the input element is `null`.
 *
 * @param element An input element.
 * @param text Text to be inserted.
 * @param startOffset Position to insert the text, `0` being at the start of current text. If it is larger than the length of current value, the text will be inserted at the end.
 * @param endOffset When specified, the substring between `startOffset` and `endOffset` will be replaced by the inserting text.
 * @returns Whether text is inserted and native `input` event is dispatched.
 */
export function insertText(element: HTMLInputElement | HTMLTextAreaElement, text: string, startOffset: number, endOffset?: number): boolean;
