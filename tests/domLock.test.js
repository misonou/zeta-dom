import { body, delay, initBody, mockFn, root, _ } from "./testUtil";
import { cancelLock, lock, locked } from "../src/domLock";
import { noop } from "../src/util";

describe('lock', () => {
    it('should pass promise result if not cancelled', () => {
        expect(lock(body, Promise.resolve(42))).resolves.toBe(42);
    });

    it('should lock element until promise is settled', async () => {
        const promise = lock(body, delay());
        expect(locked(body)).toBe(true);
        await promise;
        expect(locked(body)).toBe(false);
    });

    it('should be cancelled automatically when element is detached', () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        expect(lock(div, delay())).rejects.toMatch('user_cancelled');
        body.removeChild(div);
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
        const unsettled = new Promise(noop);
        const cb = mockFn().mockResolvedValue(true);
        const lockResult = lock(div, unsettled, cb);
        const cancelResult = cancelLock(div);
        expect(cancelResult).resolves.toBeUndefined();
        expect(lockResult).rejects.toMatch('user_cancelled');

        await delay();
        expect(cb).toBeCalledTimes(1);
        expect(locked(div)).toBe(false);
    });

    it('should call oncancel again if cancellation was previously rejected', async () => {
        const { div } = initBody(`
            <div id="div"></div>
        `);
        const unsettled = new Promise(noop);
        const cb = mockFn().mockRejectedValueOnce('').mockResolvedValueOnce('');
        const lockResult =  lock(div, unsettled, cb);
        const cancelResult1 = cancelLock(div);
        expect(cancelResult1).rejects.toMatch('user_cancelled');

        await delay();
        const cancelResult2 = cancelLock(div);
        expect(cancelResult2).resolves.toBeUndefined();
        expect(lockResult).rejects.toMatch('user_cancelled');

        await delay();
        expect(cb).toBeCalledTimes(2);
        expect(locked(div)).toBe(false);
    });

    it('should return resolved promise if element is not locked', () => {
        expect(cancelLock(root)).resolves.toBeUndefined();
    });
});
