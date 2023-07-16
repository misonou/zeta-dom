import Promise from "./include/promise-polyfill.js";
import * as ErrorCode from "./errorCode.js";
import { window, root } from "./env.js";
import { always, any, catchAsync, definePrototype, each, errorWithCode, executeOnce, isFunction, makeArray, noop, reject, resolve, retryable, setImmediate } from "./util.js";
import { bind, containsOrEquals, parentsAndSelf } from "./domUtil.js";
import { emitDOMEvent, listenDOMEvent } from "./events.js";
import { TraversableNode, TraversableNodeTree } from "./tree.js";

const handledErrors = new WeakMap();
const getTree = executeOnce(function () {
    const tree = new TraversableNodeTree(root, DOMLock);
    tree.on('update', function (e) {
        each(e.records, function (i, v) {
            if (!containsOrEquals(root, v.node)) {
                v.node.cancel(true);
            }
        });
    });
    return tree;
});

var leaveCounter = 0;

function ensureLock(element) {
    return getTree().setNode(element);
}

function lock(element, promise, oncancel) {
    var lock = ensureLock(element);
    return promise && lock.wait(promise, oncancel, false);
}

function subscribeAsync(element, callback) {
    ensureLock(element);
    if (isFunction(callback)) {
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
    var lock = ensureLock(element);
    catchAsync(lock.wait(promise, function () {
        (oncancel || noop)();
        return true;
    }, true));
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
    element = element || root;
    var lock = getTree().getNode(element);
    if (!parents || element === root) {
        return !!lock && lock.element === element && lock.locked;
    }
    return !!any(parents ? parentsAndSelf(lock) : makeArray(lock), function (v) {
        return v.locked;
    });
}

function cancelLock(element, force) {
    var lock = getTree().getNode(element || root);
    return lock ? lock.cancel(force) : resolve();
}

function createDependantPromise(parent, oncancel, notifyAsync) {
    var resolve;
    var promise = new Promise(function (resolve_) {
        resolve = resolve_;
    });
    catchAsync(parent.wait(promise, oncancel, notifyAsync));
    return function (force) {
        var item = force && parent.promises.get(promise);
        resolve();
        if (item) {
            item.finish();
        }
    };
}

function DOMLock() {
    var self = this;
    TraversableNode.apply(self, arguments);
    self.async = 0;
    self.locks = 0;
    self.promises = new Map();
    self.unlock = noop;
    self.asyncEnd = noop;
}

definePrototype(DOMLock, TraversableNode, {
    get locked() {
        return this.locks > 0;
    },
    cancel: function (force) {
        var self = this;
        var promises = self.promises;
        if (force || !promises.size) {
            if (promises.size) {
                setImmediate(function () {
                    emitDOMEvent('cancelled', self.element);
                });
            }
            if (self.async) {
                self.async = 0;
                emitDOMEvent('asyncEnd', self.element);
            }
            // remove all promises from the dictionary so that
            // filtered promise from lock.wait() will be rejected by cancellation
            promises.clear();
            self.locks = 0;
            self.handler = null;
            self.unlock(true);
            self.asyncEnd(true);
            return resolve();
        }
        return (self.handler || (self.handler = retryable(function () {
            // request user cancellation for each async task in sequence
            return makeArray(promises).reduce(function (a, v) {
                return a.then(v.cancel);
            }, resolve()).then(function () {
                // @ts-ignore: unable to reflect on interface member
                self.cancel(true);
            }, function () {
                throw errorWithCode(ErrorCode.cancellationRejected);
            });
        })))();
    },
    wait: function (promise, oncancel, flag) {
        var self = this;
        var parent = self.parentNode;
        var promises = self.promises;
        var notifyLock = flag !== true;
        var notifyAsync = flag !== false;
        var finish = function () {
            if (promises.delete(promise)) {
                if (!promises.size) {
                    self.cancel(true);
                }
                if (notifyLock && self.locks && !--self.locks) {
                    self.unlock();
                }
                if (notifyAsync && self.async && !--self.async) {
                    emitDOMEvent('asyncEnd', self.element);
                    self.asyncEnd();
                }
            }
        };
        promises.set(promise, {
            cancel: oncancel === true ? resolve : retryable(oncancel || reject, finish),
            finish: finish
        });
        if (notifyLock && !self.locks++ && parent) {
            self.unlock = createDependantPromise(parent, self.cancel.bind(self), false);
        }
        if (notifyAsync && !self.async++) {
            if (!emitDOMEvent('asyncStart', self.element) && parent) {
                self.asyncEnd = createDependantPromise(parent, true, true);
            }
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

bind(window, 'beforeunload', function (e) {
    if (leaveCounter) {
        e.returnValue = '';
        e.preventDefault();
    }
});

export {
    lock,
    locked,
    cancelLock,
    subscribeAsync,
    notifyAsync,
    preventLeave
};
