import Promise from "./include/promise-polyfill.js";
import * as ErrorCode from "./errorCode.js";
import { window, root } from "./env.js";
import { always, any, combineFn, each, errorWithCode, executeOnce, extend, grep, is, isFunction, makeArray, makeAsync, mapGet, mapRemove, noop, reject, resolve, retryable, setAdd } from "./util.js";
import { bind, containsOrEquals, parentsAndSelf } from "./domUtil.js";
import { emitDOMEvent, listenDOMEvent, ZetaEventSource } from "./events.js";
import { createAutoCleanupMap } from "./observe.js";
import { iterateFocusPath, reportError } from "./dom.js";

const handledErrors = new WeakSet();
const subscribers = new WeakMap();
const locks = createAutoCleanupMap(clearLock);

var leaveCounter = 0;

function CancellationRequest(reason, eventSource) {
    var self = this;
    eventSource = eventSource || new ZetaEventSource();
    self.reason = String(reason || '');
    self.source = eventSource.source;
    self.sourceKeyName = eventSource.sourceKeyName;
}

function muteAndReturn(error) {
    handledErrors.add(error);
    return error;
}

function ensureLock(element) {
    var promises = mapGet(locks, element, Map);
    if (!promises.cancel) {
        promises.element = element;
        promises.cancel = retryable(function (reason) {
            // request user cancellation for each async task in sequence
            return makeArray(promises).reduce(function (a, v) {
                return a.then(v.bind(0, false, reason));
            }, resolve()).catch(function () {
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
    });
    if (sendAsync) {
        var eventSource = window.event ? new ZetaEventSource() : null;
        source.catch(function (error) {
            // avoid firing error event for the same error for multiple target
            // while propagating through the promise chain
            if (error && (typeof error !== 'object' || setAdd(handledErrors, error))) {
                reportError(error, element, eventSource);
            }
        });
        var targets = new Map();
        // ensure oncancel is called when cancelLock is called
        ensureLock(element);
        subscribeAsync(element);
        each(iterateFocusPath(element), function (i, v) {
            var promises = subscribers.get(v);
            if (promises) {
                targets.set(v, promises);
                promises.set(promise, cancel);
                return !promises.handled;
            }
        });
        always(promise, function () {
            each(targets, function (i, v) {
                if (v.delete(promise) && v.started && !v.size) {
                    v.started = false;
                    emitDOMEvent('asyncEnd', i);
                }
            });
        });
        setTimeout(function () {
            each(targets, function (i, v) {
                if (v.size && !v.started) {
                    v.started = true;
                    emitDOMEvent('asyncStart', i);
                }
            });
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
    promises.set(promise, function (force, reason) {
        return resolve(force || oncancel(reason)).then(promise.cancel);
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
    var delegated, resolve = noop;
    var controller = { abort: noop };
    var promise = makeAsync(callback)({
        get signal() {
            return controller.signal || (controller = new AbortController()).signal;
        },
        get promise() {
            return delegated || promise || (delegated = new Promise(function (res) {
                resolve = res;
            }));
        }
    });
    resolve(promise);
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

function cancelLock(element, reason) {
    var targets = element ? grep(locks, function (v, i) {
        return containsOrEquals(element, i);
    }) : makeArray(locks);
    var finalize = function () {
        each(targets, function (i, v) {
            clearLock(v.element);
        });
    };
    if (reason === true) {
        return resolve(finalize());
    }
    reason = is(reason, CancellationRequest) || new CancellationRequest(reason);
    return targets.reduce(function (a, v) {
        return a.then(v.cancel.bind(v, reason));
    }, resolve()).then(finalize);
}

bind(window, 'beforeunload', function (e) {
    if (leaveCounter) {
        e.returnValue = '';
        e.preventDefault();
    }
});
subscribeAsync(root);

export {
    CancellationRequest,
    lock,
    locked,
    cancelLock,
    subscribeAsync,
    notifyAsync,
    runAsync,
    preventLeave
};
