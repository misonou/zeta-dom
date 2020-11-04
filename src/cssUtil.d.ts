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

/**
 * Gets the computed value of z-index CSS property of an element or its pseudo element.
 * @param element A DOM element.
 * @param [pseudo] A CSS pseudo element selector.
 * @returns The computed value of the z-index CSS property.
 */
export function getZIndex(element: Element, pseudo?: string): number;

/**
 * Gets a z-index CSS property value that is 1 higher than the given element.
 * @param element A DOM element.
 * @returns A number defining a CSS property value.
 */
export function getZIndexOver(element: Element): number;

/**
 * Sets the value of z-index CSS property such that the first element will be painted above the second element.
 * @param element A DOM element to be painted above.
 * @param over A DOM element to be painted below.
 */
export function setZIndexOver(element: Element, over: Element): void;

/**
 * Computes a set of CSS rules that, when applied to an element, the specified corner of that element
 * will be at the given position relative to the top-left corner of the window.
 * @param x X-coordinate in pixels.
 * @param y Y-coordinate in pixels.
 * @param [origin] The corner of an element to be set to the given position. Default is top left.
 * @param [parent] When given, the CSS rules will be computed base on the top left corner of the parent rather than document body.
 * @returns A set of CSS rules which contains the left, top, right and bottom rules.
 */
export function cssFromPoint(x: number, y: number, origin?: Zeta.Direction2D, parent?: Element): object;

/**
 * Computes a set of CSS rules that, when applied to an element, the specified corner of that element
 * will be at the given position relative to the top-left corner of the window.
 * @param point A point in pixels.
 * @param [origin] The corner of an element to be set to the given position. Default is top left.
 * @param [parent] When given, the CSS rules will be computed base on the top left corner of the parent rather than document body.
 * @returns A set of CSS rules which contains the left, top, right and bottom rules.
 */
export function cssFromPoint(point: Zeta.PointLike, origin?: Element, parent?: Element): object;

/**
 * Gets a set of CSS rules which has the top, left, right, bottom, width and height properties based on the given rect.
 * @param rect A rect object.
 * @param [parent] When given, the CSS rules will be computed base on the top left corner of the parent rather than document body.
 * @returns A set of CSS rules which contains the left, top, right, bottom, width and height rules.
 */
export function cssFromRect(rect: Zeta.RectLike, parent?: Element): object;

/**
 * Places an element to such that the top-left corner of the element is at the specified point relative to the top-left corner of the window.
 * @param element A DOM element.
 * @param to A point in pixels.
 */
export function position(element: Element, to: Zeta.PointLike): void;

/**
 * Places an element to such that the element is at the corner or side of another element,
 * and optionally fit the position such that the entire element is inside of another element.
 * @param element A DOM element.
 * @param to A DOM element such that the element given by the first argument will be placed with respect to this element.
 * @param dir A string represent a corner or a side of the element given by the second argument to align with.
 * @param [within] Optionally fit the entire element given by the first argument to be inside this element.
 */
export function position(element: Element, to: Element | Window, dir: Zeta.Direction2D, within?: Element | Window): void;
