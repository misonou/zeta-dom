import Promise from "./include/promise-polyfill.js";
import * as ErrorCode from "./errorCode.js";
import { window, root } from "./env.js";
import { always, any, combineFn, each, errorWithCode, executeOnce, extend, grep, isFunction, makeArray, mapGet, mapRemove, noop, reject, resolve, retryable } from "./util.js";
import { bind, containsOrEquals, parentsAndSelf } from "./domUtil.js";
import { emitDOMEvent, listenDOMEvent } from "./events.js";
import { createAutoCleanupMap } from "./observe.js";
import { iterateFocusPath } from "./dom.js";

const handledErrors = new WeakMap();
const subscribers = new WeakMap();
const locks = createAutoCleanupMap(clearLock);

var leaveCounter = 0;

function ensureLock(element) {
    var promises = mapGet(locks, element, Map);
    if (!promises.cancel) {
        promises.element = element;
        promises.cancel = retryable(function () {
            // request user cancellation for each async task in sequence
            return makeArray(promises).reduce(function (a, v) {
                return a.then(v.bind(0, false));
            }, resolve()).then(function () {
                clearLock(element);
            }, function () {
                throw errorWithCode(ErrorCode.cancellationRejected);
            });
        });
    }
    return promises;
}

function clearLock(element, map) {
    var cancelCallbacks = makeArray(mapRemove(locks, element) || map).concat(makeArray(subscribers.get(element)));
    if (cancelCallbacks[0]) {
        combineFn(cancelCallbacks)(true);
        emitDOMEvent('cancelled', element);
    }
}

function handlePromise(promise, element, oncancel) {
    var cancel;
    promise = new Promise(function (resolve, reject) {
        cancel = executeOnce(function () {
            reject(errorWithCode(ErrorCode.cancelled));
            (oncancel || noop)();
        });
        promise.then(resolve, reject);
        promise.catch(function (error) {
            if (error && !handledErrors.has(error)) {
                emitDOMEvent('error', element, { error }, true);
                // avoid firing error event for the same error for multiple target
                // while propagating through the promise chain
                if (typeof error === 'object') {
                    handledErrors.set(error, true);
                }
            }
        });
    });
    return extend(promise, { cancel });
}

function lock(element, promise, oncancel) {
    if (!promise) {
        return subscribeAsync(element);
    }
    var promises = ensureLock(element);
    promise = handlePromise(promise, element);
    oncancel = isFunction(oncancel) ? retryable(oncancel) : oncancel ? noop : reject;
    promises.set(promise, function (force) {
        return resolve(force || oncancel()).then(promise.cancel);
    });
    always(promise, function () {
        promises.delete(promise);
    });
    return promise;
}

function subscribeAsync(element, callback) {
    var promises = mapGet(subscribers, element, Map);
    if (callback === true) {
        promises.handled = true;
    } else if (isFunction(callback)) {
        return listenDOMEvent(element, {
            asyncStart: function () {
                callback.call(element, true);
            },
            asyncEnd: function () {
                callback.call(element, false);
            }
        });
    }
}

function notifyAsync(element, promise, oncancel) {
    promise = handlePromise(promise, element, oncancel);
    subscribeAsync(element);
    each(iterateFocusPath(element), function (i, v) {
        var promises = subscribers.get(v);
        if (promises) {
            // ensure oncancel is called when cancelLock is called
            ensureLock(v);
            always(promise, function () {
                if (promises.delete(promise) && !promises.size) {
                    emitDOMEvent('asyncEnd', v);
                }
            });
            promises.set(promise, promise.cancel);
            if (promises.size === 1) {
                emitDOMEvent('asyncStart', v);
            }
            return !promises.handled;
        }
    });
}

function preventLeave(element, promise, oncancel) {
    if (promise) {
        element = lock(element, promise, oncancel);
    }
    leaveCounter++;
    always(element, function () {
        leaveCounter--;
    });
}

function locked(element, parents) {
    if (!element || element === root) {
        return !!any(locks, function (v, i) {
            return containsOrEquals(root, i) && v.size;
        });
    }
    return !!any(parents ? parentsAndSelf(element) : [element], function (v) {
        return (locks.get(v) || '').size;
    });
}

function cancelLock(element, force) {
    var targets = element ? grep(locks, function (v, i) {
        return containsOrEquals(element, i);
    }) : makeArray(locks);
    if (force) {
        each(targets, function (i, v) {
            clearLock(v.element);
        });
        return resolve();
    }
    return targets.reduce(function (a, v) {
        return a.then(v.cancel);
    }, resolve());
}

bind(window, 'beforeunload', function (e) {
    if (leaveCounter) {
        e.returnValue = '';
        e.preventDefault();
    }
});
subscribeAsync(root);

export {
    lock,
    locked,
    cancelLock,
    subscribeAsync,
    notifyAsync,
    preventLeave
};
