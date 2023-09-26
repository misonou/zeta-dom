import { after, body, combineFn, delay, ErrorCode, initBody, mockFn, objectContaining, root, verifyCalls, _ } from "./testUtil";
import { cancelLock, lock, locked, notifyAsync, preventLeave, subscribeAsync } from "../src/domLock";
import { catchAsync, noop } from "../src/util";
import { removeNode } from "../src/domUtil";
import dom from "../src/dom";

describe('lock', () => {
    it('should pass promise result if not cancelled', async () => {
        await expect(lock(body, Promise.resolve(42))).resolves.toBe(42);
    });

    it('should lock element until promise is settled', async () => {
        const promise = lock(body, delay());
        expect(locked(body)).toBe(true);
        await promise;
        expect(locked(body)).toBe(false);
    });

    it('should accept boolean for cancellable lock', async () => {
        const promise = lock(body, delay(), true);
        await expect(cancelLock()).resolves.toBeUndefined();
        await expect(promise).rejects.toBeErrorWithCode(ErrorCode.cancelled);
    });

    it('should be cancelled automatically when element is detached', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const promise = lock(div, delay());
        body.removeChild(div);
        await expect(promise).rejects.toBeErrorWithCode(ErrorCode.cancelled);
    });

    it('should not emit asyncStart event when element is first locked', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = combineFn(
            dom.on(div, 'asyncStart', cb),
            dom.on(root, 'asyncStart', cb)
        );
        const promise1 = delay();
        const promise2 = delay();
        lock(div, promise1);
        lock(div, promise2);
        await promise1;
        await promise2;
        expect(cb).not.toBeCalled();
        unregister();
    });

    it('should not emit asyncEnd event when all promises are resolved', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = combineFn(
            dom.on(div, 'asyncEnd', cb),
            dom.on(root, 'asyncEnd', cb)
        );
        const promise1 = delay();
        const promise2 = delay();
        lock(div, promise1);
        lock(div, promise2);
        await promise1;
        await promise2;
        expect(cb).not.toBeCalled();
        unregister();
    });
});

describe('subscribeAsync', () => {
    it('should invoke callback at asyncStart and asyncEnd event', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = subscribeAsync(div, cb);
        const promise = delay();
        notifyAsync(div, promise);

        await promise;
        await delay();
        verifyCalls(cb, [
            [true],
            [false],
        ]);
        unregister();
    });
});

describe('notifyAsync', () => {
    it('should not lock element', async () => {
        const promise = delay();
        notifyAsync(body, promise);
        expect(locked(body)).toBe(false);
        await promise;
        expect(locked(body)).toBe(false);
    });

    it('should emit asyncStart event when element is first locked', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = combineFn(
            dom.on(div, 'asyncStart', cb),
            dom.on(root, 'asyncStart', cb)
        );
        const promise1 = delay();
        const promise2 = delay();
        notifyAsync(div, promise1);
        notifyAsync(div, promise2);
        await promise1;
        await promise2;
        verifyCalls(cb, [
            [objectContaining({ currentTarget: div }), _],
            [objectContaining({ currentTarget: root }), _],
        ]);
        unregister();
    });

    it('should emit asyncEnd event when all promises are resolved', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = combineFn(
            dom.on(div, 'asyncEnd', cb),
            dom.on(root, 'asyncEnd', cb)
        );
        var resolve1, resolve2;
        var promise1 = new Promise(resolve => resolve1 = resolve);
        var promise2 = new Promise(resolve => resolve2 = resolve);
        notifyAsync(div, promise1);
        notifyAsync(div, promise2);

        await after(resolve1 || noop);
        expect(cb).not.toBeCalled();

        await after(resolve2 || noop);
        verifyCalls(cb, [
            [objectContaining({ currentTarget: div }), _],
            [objectContaining({ currentTarget: root }), _]
        ]);
        unregister();
    });

    it('should emit asyncStart and asyncEnd event to elements from where focus is delegated', async () => {
        const { div, other } = initBody(`
            <div id="other"></div>
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = combineFn(
            dom.on(div, 'asyncStart', cb),
            dom.on(div, 'asyncEnd', cb),
            dom.on(other, 'asyncStart', cb),
            dom.on(other, 'asyncEnd', cb),
        );
        dom.retainFocus(other, div);
        dom.focus(other);
        dom.focus(div);

        const promise = delay();
        subscribeAsync(div);
        subscribeAsync(other);
        notifyAsync(div, promise);
        verifyCalls(cb, [
            [objectContaining({ type: 'asyncStart', currentTarget: div }), _],
            [objectContaining({ type: 'asyncStart', currentTarget: other }), _],
        ]);

        cb.mockClear();
        dom.focus(document.body);
        dom.releaseFocus(div);
        await promise;
        await delay();
        verifyCalls(cb, [
            [objectContaining({ type: 'asyncEnd', currentTarget: div }), _],
            [objectContaining({ type: 'asyncEnd', currentTarget: other }), _],
        ]);
        unregister();
    });

    it('should emit error event when given promise rejects', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = combineFn(
            dom.on(div, 'error', cb),
            dom.on(root, 'error', cb)
        );
        const error = new Error('dummy');
        notifyAsync(div, Promise.reject(error));

        await delay();
        verifyCalls(cb, [
            [objectContaining({ currentTarget: div }), _],
            [objectContaining({ currentTarget: root }), _]
        ]);
        unregister();
    });

    it('should emit error event for the same error only once', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = combineFn(
            dom.on(div, 'error', cb),
            dom.on(root, 'error', cb)
        );
        const error = new Error('dummy');
        notifyAsync(div, Promise.reject(error));
        notifyAsync(div, Promise.reject(error));

        await delay();
        verifyCalls(cb, [
            [objectContaining({ currentTarget: div }), _],
            [objectContaining({ currentTarget: root }), _]
        ]);
        unregister();
    });

    it('should emit asyncEnd event when cancelLock is called', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = dom.on(div, 'asyncEnd', cb);
        var promise = new Promise(() => { });
        notifyAsync(div, promise);

        await after(() => cancelLock(div));
        expect(cb).toBeCalledTimes(1);
        unregister();
    });

    it('should invoke oncancel callback when cancelLock is called', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        var promise = new Promise(() => { });
        notifyAsync(div, promise, cb);

        await after(() => cancelLock(div));
        expect(cb).toBeCalledTimes(1);
    });

    it('should not invoke oncancel callback when cancelLock is rejected', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        var promise = new Promise(() => { });
        catchAsync(lock(div, new Promise(() => { })));
        notifyAsync(div, promise, cb);

        await expect(cancelLock(div)).rejects.toBeErrorWithCode(ErrorCode.cancellationRejected);
        expect(cb).toBeCalledTimes(0);
    });

    it('should not invoke oncancel callback when promise settled before cancellation', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        var promise = delay();
        notifyAsync(div, promise, cb);

        await promise;
        await after(() => cancelLock(div));
        expect(cb).not.toBeCalled();
    });
});

describe('preventLeave', () => {
    it('should lock element until promise is settle', async () => {
        const promise = delay();
        preventLeave(body, promise);
        expect(locked(body)).toBe(true);
        await promise;
        await delay();
        expect(locked(body)).toBe(false);
    });

    it('should not emit asyncStart event when element is first locked', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = combineFn(
            dom.on(div, 'asyncStart', cb),
            dom.on(root, 'asyncStart', cb)
        );
        const promise1 = delay();
        const promise2 = delay();
        preventLeave(div, promise1);
        preventLeave(div, promise2);
        await promise1;
        await promise2;
        expect(cb).not.toBeCalled();
        unregister();
    });

    it('should not emit asyncEnd event when all promises are resolved', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = combineFn(
            dom.on(div, 'asyncEnd', cb),
            dom.on(root, 'asyncEnd', cb)
        );
        const promise1 = delay();
        const promise2 = delay();
        preventLeave(div, promise1);
        preventLeave(div, promise2);
        await promise1;
        await promise2;
        expect(cb).not.toBeCalled();
        unregister();
    });
});

describe('locked', () => {
    it('should return if element is locked', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        expect(locked(div)).toBe(false);
        lock(div, delay());
        expect(locked(div)).toBe(true);
        await delay();
        expect(locked(div)).toBe(false);
    });

    it('should return false if element is unlocked', async () => {
        expect(locked(document.createElement('div'))).toBe(false);
    });

    it('should return false if parent element is locked when last argument is false', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        expect(locked(div)).toBe(false);
        lock(body, delay());
        expect(locked(div)).toBe(false);
        await delay();
        expect(locked(div)).toBe(false);
    });

    it('should return true if parent element is locked when last argument is true', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        expect(locked(div, true)).toBe(false);
        lock(body, delay());
        expect(locked(div, true)).toBe(true);
        await delay();
        expect(locked(div, true)).toBe(false);
    });

    it('should return true for root element if there is element locked', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        expect(locked(root)).toBe(false);
        lock(div, delay());
        expect(locked(root)).toBe(true);
        await delay();
        expect(locked(root)).toBe(false);
    });

    it('should return false if locked child element has just be detached', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const promise = lock(div, delay());
        expect(locked(root)).toBe(true);
        removeNode(div);
        expect(locked(root)).toBe(false);
        await expect(promise).rejects.toBeErrorWithCode(ErrorCode.cancelled);
    });
});

describe('cancelLock', () => {
    it('should call oncancel callback and cause lock promise to reject', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn().mockResolvedValue(true);
        const lockResult = lock(div, delay(100), cb);

        const cancelResult = cancelLock(div);
        await expect(cancelResult).resolves.toBeUndefined();
        expect(locked(div)).toBe(false);

        await expect(lockResult).rejects.toBeErrorWithCode(ErrorCode.cancelled);
        expect(cb).toBeCalledTimes(1);
    });

    it('should call oncancel again if cancellation was previously rejected', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn().mockRejectedValueOnce('').mockResolvedValueOnce('');
        const lockResult = lock(div, delay(100), cb);

        const cancelResult1 = cancelLock(div);
        await expect(cancelResult1).rejects.toBeErrorWithCode(ErrorCode.cancellationRejected);

        const cancelResult2 = cancelLock(div);
        await expect(cancelResult2).resolves.toBeUndefined();
        expect(locked(div)).toBe(false);

        await expect(lockResult).rejects.toBeErrorWithCode(ErrorCode.cancelled);
        expect(cb).toBeCalledTimes(2);
    });

    it('should return resolved promise if element is not locked', async () => {
        await expect(cancelLock(root)).resolves.toBeUndefined();
    });

    it('should emit asyncEnd event when lock is cancelled', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const unsettled = new Promise(noop);
        const cb = mockFn();
        const unregister = dom.on(div, 'asyncEnd', cb);
        notifyAsync(div, unsettled);
        cancelLock(div);

        await delay();
        expect(cb).toBeCalledTimes(1);
        unregister();
    });
});
