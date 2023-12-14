import $ from 'jquery';
import { body, cleanup } from '@misonou/test-utils';
import { listenDOMEvent } from '../src/events';

export { root, body, after, cleanup, delay, mockFn, verifyCalls, _ } from "@misonou/test-utils";

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

export function bindEvent(...args) {
    // @ts-ignore
    cleanup(listenDOMEvent(...args));
}
