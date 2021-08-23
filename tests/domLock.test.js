import { after, body, combineFn, delay, initBody, mockFn, objectContaining, root, verifyCalls, _ } from "./testUtil";
import { cancelLock, lock, locked } from "../src/domLock";
import { noop } from "../src/util";
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

    it('should be cancelled automatically when element is detached', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const promise = lock(div, delay());
        body.removeChild(div);
        await expect(promise).rejects.toMatch('user_cancelled');
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
        await Promise.all([lock(div, delay()), lock(div, delay())]);
        verifyCalls(cb, [
            [objectContaining({ currentTarget: root }), _],
            [objectContaining({ currentTarget: div }), _]
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
        lock(div, promise1);
        lock(div, promise2);

        await after(resolve1 || noop);
        expect(cb).not.toBeCalled();

        await after(resolve2 || noop);
        verifyCalls(cb, [
            [objectContaining({ currentTarget: div }), _],
            [objectContaining({ currentTarget: root }), _]
        ]);
        unregister();
    });

    xit('should emit error event when given promise rejects', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn();
        const unregister = combineFn(
            dom.on(div, 'error', cb),
            dom.on(root, 'error', cb)
        );
        const error = new Error('dummy');
        const promise = lock(div, Promise.reject(error));
        promise.catch();

        await delay();
        verifyCalls(cb, [
            [objectContaining({ currentTarget: div }), _],
            [objectContaining({ currentTarget: body }), _],
            [objectContaining({ currentTarget: root }), _]
        ]);
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

        await expect(lockResult).rejects.toMatch('user_cancelled');
        expect(cb).toBeCalledTimes(1);
        expect(locked(div)).toBe(false);
    });

    it('should call oncancel again if cancellation was previously rejected', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const cb = mockFn().mockRejectedValueOnce('').mockResolvedValueOnce('');
        const lockResult = lock(div, delay(100), cb);

        const cancelResult1 = cancelLock(div);
        await expect(cancelResult1).rejects.toMatch('user_cancelled');

        const cancelResult2 = cancelLock(div);
        await expect(cancelResult2).resolves.toBeUndefined();

        await expect(lockResult).rejects.toMatch('user_cancelled');
        expect(cb).toBeCalledTimes(2);
        expect(locked(div)).toBe(false);
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
        lock(div, unsettled, true);
        cancelLock(div);

        await delay();
        expect(cb).toBeCalledTimes(1);
        unregister();
    });
});
