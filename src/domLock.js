import Promise from "./include/promise-polyfill.js";
import * as ErrorCode from "./errorCode.js";
import { window, root } from "./env.js";
import { any, catchAsync, createPrivateStore, definePrototype, each, errorWithCode, extend, is, makeArray, mapRemove, reject, resolve, setImmediate } from "./util.js";
import { containsOrEquals, parentsAndSelf } from "./domUtil.js";
import { emitDOMEvent } from "./events.js";
import { afterDetached } from "./observe.js";

const lockedElements = new WeakMap();
const handledErrors = new WeakMap();
const _ = createPrivateStore();

function retryable(fn, done) {
    var promise;
    return function () {
        return promise || (promise = resolve(fn()).then(done, function () {
            // user has rejected the cancellation
            // remove the promise object so that user will be prompted again
            promise = null;
            return reject(errorWithCode(ErrorCode.cancellationRejected));
        }));
    };
}

function lock(element, promise, oncancel) {
    var lock = lockedElements.get(element) || new DOMLock(element);
    return promise ? lock.wait(promise, oncancel) : resolve();
}

function locked(element, parents) {
    return !!any(parents ? parentsAndSelf(element) : [element], function (v) {
        return (lockedElements.get(v) || '').locked;
    });
}

function cancelLock(element, force) {
    var lock = lockedElements.get(element);
    return lock ? lock.cancel(force) : resolve();
}

function removeLock(element) {
    var lock = mapRemove(lockedElements, element);
    if (lock) {
        lock.cancel(true);
    }
}

function DOMLock(element) {
    var self = this;
    _(self, {
        promises: new Map()
    });
    self.element = element;
    lockedElements.set(element, self);
    if (element !== root) {
        afterDetached(element, removeLock);
    }
}

definePrototype(DOMLock, {
    get locked() {
        var self = this;
        var promises = _(self).promises;
        each(promises, function (i, v) {
            if (is(i.lock, DOMLock) && !containsOrEquals(self.element, i.lock.element)) {
                promises.delete(i);
            }
        });
        if (!promises.size) {
            self.cancel(true);
        }
        return promises.size > 0;
    },
    cancel: function (force) {
        var self = this;
        var state = _(self);
        var promises = state.promises;
        if (force || !promises.size) {
            if (promises.size) {
                setImmediate(function () {
                    emitDOMEvent('cancelled', self.element);
                });
            }
            // remove all promises from the dictionary so that
            // filtered promise from lock.wait() will be rejected by cancellation
            promises.clear();
            state.handler = null;
            if (self.element !== root) {
                lockedElements.delete(self.element);
            }
            if (state.deferred) {
                state.deferred.resolve();
            }
            return resolve();
        }
        return (state.handler || (state.handler = retryable(function () {
            // request user cancellation for each async task in sequence
            return makeArray(promises).reduce(function (a, v) {
                return a.then(v);
            }, resolve()).then(function () {
                // @ts-ignore: unable to reflect on interface member
                self.cancel(true);
            });
        })))();
    },
    wait: function (promise, oncancel) {
        var self = this;
        var state = _(self);
        var promises = state.promises;
        var finish = function () {
            if (promises.delete(promise) && !promises.size) {
                emitDOMEvent('asyncEnd', self.element);
                self.cancel(true);
            }
        };
        promises.set(promise, retryable(oncancel === true ? resolve : oncancel || reject, finish));
        if (promises.size === 1) {
            var callback = {
                lock: this
            };
            var deferred = new Promise(function (resolve, reject) {
                callback.resolve = resolve;
                callback.reject = reject;
            });
            state.deferred = extend(deferred, callback);
            for (var parent = self.element.parentNode; parent && !lockedElements.has(parent); parent = parent.parentNode);
            if (parent) {
                catchAsync(lockedElements.get(parent).wait(deferred, self.cancel.bind(self)));
            }
            emitDOMEvent('asyncStart', self.element);
        }
        promise.catch(function (error) {
            if (error && !handledErrors.has(error)) {
                emitDOMEvent('error', self.element, {
                    error: error
                }, true);
                // avoid firing error event for the same error for multiple target
                // while propagating through the promise chain
                if (typeof error === 'object') {
                    handledErrors.set(error, true);
                }
            }
            finish();
        });
        return promise.then(function (value) {
            var cancelled = !promises.has(promise);
            finish();
            // the returned promise will be rejected
            // if the current lock has been released or cancelled
            return cancelled ? reject(errorWithCode(ErrorCode.cancelled)) : value;
        });
    }
});

lock(root);
window.onbeforeunload = function (e) {
    if (locked(root)) {
        e.returnValue = '';
        e.preventDefault();
    }
};

export {
    lock,
    locked,
    cancelLock
};
