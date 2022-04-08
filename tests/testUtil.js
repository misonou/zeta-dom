import $ from 'jquery';
import { jest } from '@jest/globals';
import { listenDOMEvent } from '../src/events';

export * as ErrorCode from '../src/errorCode';

export const root = document.documentElement;
export const body = document.body;
export const mockFn = jest.fn;
export const objectContaining = expect.objectContaining;
export const _ = expect.anything();

var cleanup = [];

export function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds || 10);
    });
}

/** @type {<T>(callback: () => T) => Promise<T>} */
export async function after(callback) {
    var result = callback();
    await delay();
    return result;
}

/** @type {(html: string) => Zeta.Dictionary<HTMLElement>} */
export function initBody(html) {
    var dict = {};
    $(body).html(html);
    $('[id]').each(function (i, v) {
        dict[v.id] = v;
    });
    // @ts-ignore
    return dict;
}

export function verifyCalls(cb, args) {
    expect(cb).toBeCalledTimes(args.length);
    args.forEach((v, i) => {
        expect(cb).toHaveBeenNthCalledWith(i + 1, ...v);
    });
}

export function combineFn(...fn) {
    return function () {
        fn.forEach(v => v());
    };
}

export function bindEvent(...args) {
    // @ts-ignore
    cleanup.push(listenDOMEvent(...args));
}

afterEach(() => {
    cleanup.splice(0).forEach(v => v());
});
