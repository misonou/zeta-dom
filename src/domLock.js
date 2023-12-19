import Promise from "./include/promise-polyfill.js";
import * as ErrorCode from "./errorCode.js";
import { window, root } from "./env.js";
import { always, any, combineFn, each, errorWithCode, executeOnce, extend, grep, isFunction, makeArray, makeAsync, mapGet, mapRemove, noop, reject, resolve, retryable, setAdd } from "./util.js";
import { bind, containsOrEquals, parentsAndSelf } from "./domUtil.js";
import { emitDOMEvent, listenDOMEvent } from "./events.js";
import { createAutoCleanupMap } from "./observe.js";
import { iterateFocusPath } from "./dom.js";

const handledErrors = new WeakSet();
const subscribers = new WeakMap();
const locks = createAutoCleanupMap(clearLock);

var leaveCounter = 0;

function muteAndReturn(error) {
    handledErrors.add(error);
    return error;
}

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
                throw muteAndReturn(errorWithCode(ErrorCode.cancellationRejected));
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

function handlePromise(source, element, oncancel, sendAsync) {
    var cancel;
    var promise = new Promise(function (resolve, reject) {
        cancel = executeOnce(function () {
            var error = muteAndReturn(errorWithCode(ErrorCode.cancelled));
            reject(error);
            (oncancel || noop)(error);
        });
        source.then(resolve, reject);
        source.catch(function (error) {
            // avoid firing error event for the same error for multiple target
            // while propagating through the promise chain
            if (error && (typeof error !== 'object' || setAdd(handledErrors, error))) {
                emitDOMEvent('error', element, { error }, true);
            }
        });
    });
    if (sendAsync) {
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
                promises.set(promise, cancel);
                if (promises.size === 1) {
                    emitDOMEvent('asyncStart', v);
                }
                return !promises.handled;
            }
        });
    }
    return extend(promise, { cancel });
}

function lock(element, promise, oncancel) {
    if (!promise) {
        return subscribeAsync(element);
    }
    if (isFunction(promise)) {
        promise = lock(element, new Promise(noop), promise);
        return promise.cancel;
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
    handlePromise(promise, element, oncancel, true);
}

function runAsync(element, callback) {
    var controller = { abort: noop };
    var promise = makeAsync(callback)({
        get signal() {
            return controller.signal || (controller = new AbortController()).signal;
        }
    });
    return handlePromise(promise, element, function (error) {
        controller.abort(error);
    }, true);
}

function preventLeave(element, promise, oncancel) {
    if (!element) {
        leaveCounter++;
        return executeOnce(function () {
            leaveCounter--;
        });
    }
    always(promise ? lock(element, promise, oncancel) : element, preventLeave());
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
    runAsync,
    preventLeave
};
