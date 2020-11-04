// @ts-nocheck
const root = document.documentElement;

export const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
export const IS_IE10 = !!window.ActiveXObject;
export const IS_IE = !!window.ActiveXObject || root.style.msTouchAction !== undefined || root.style.msUserSelect !== undefined;
export const IS_MAC = navigator.userAgent.indexOf('Macintosh') >= 0;
export const IS_TOUCH = 'ontouchstart' in window;
