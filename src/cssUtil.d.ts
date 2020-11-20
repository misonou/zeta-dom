/// <reference path="types.d.ts" />

export function parseCSS(value: string): Partial<CSSStyleDeclaration>;

export function isCssUrlValue(value: string): string | false;

/**
 * Adds a class to the element and returns a promise that is fulfilled when the CSS animation or transition is completed.
 * If there is no animation or transition triggered, the promise is immediately fulfilled.
 * If the class is removed before the animation or transition is completed, the promise will be rejected.
 * If the element already has the given class, a rejected promise is returned.
 * @param element A DOM element.
 * @param className A string specifying the class name which triggers CSS animation or transition.
 * @param callback A callback that is synchronously called when animation or transition is completed.
 */
export function runCSSTransition(element: Element, className: string, callback?: boolean | (() => any)): Promise<any>;
