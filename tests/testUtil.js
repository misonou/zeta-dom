import $ from 'jquery';
import { body, cleanup } from '@misonou/test-utils';
import { listenDOMEvent } from '../src/events';

export { root, body, after, cleanup, delay, mockFn, verifyCalls, _ } from "@misonou/test-utils";

const eventTarget = new EventTarget();
const EventTargetProtoImpl = Object.getPrototypeOf(eventTarget[Object.getOwnPropertySymbols(eventTarget)[0]]);
const _dispatch = EventTargetProtoImpl._dispatch;

let forceTrusted = false;
let forceTrustedOnce = false;

EventTargetProtoImpl._dispatch = function (e) {
    e.isTrusted = e.isTrusted || forceTrusted;
    if (forceTrustedOnce) {
        forceTrusted = false;
    }
    return _dispatch.apply(this, arguments);
};

async function fireEventAsTrustedAsync(callback) {
    try {
        forceTrusted = true;
        forceTrustedOnce = false;
        return await callback();
    } finally {
        forceTrusted = false;
    }
}

export function fireEventAsTrusted(target, event) {
    if (typeof target === 'function') {
        return fireEventAsTrustedAsync(target);
    }
    var previous = forceTrusted;
    try {
        forceTrusted = true;
        forceTrustedOnce = true;
        return target.dispatchEvent(event);
    } finally {
        forceTrusted = previous;
    }
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

export function bindEvent(...args) {
    // @ts-ignore
    cleanup(listenDOMEvent(...args));
}
