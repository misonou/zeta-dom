// @ts-nocheck
import Promise from "./include/promise-polyfill.js";
import $ from "./include/jquery.js";

export const window = self;
export const document = window.document;
export const root = document.documentElement;
export const getSelection = window.getSelection;
export const getComputedStyle = window.getComputedStyle;
export const reportError = window.reportError || function (error) {
    console.error(error);
};
export const domReady = new Promise($);

export const IS_MAC = navigator.userAgent.indexOf('Macintosh') >= 0;
export const IS_IOS = (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || (IS_MAC && navigator.maxTouchPoints > 2);
export const IS_IE10 = !!window.ActiveXObject;
export const IS_IE = IS_IE10 || root.style.msTouchAction !== undefined || root.style.msUserSelect !== undefined;
export const IS_TOUCH = 'ontouchstart' in window;
