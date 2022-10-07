import { after, body, initBody, mockFn, verifyCalls } from "./testUtil";
import { afterDetached, createAutoCleanupMap, registerCleanup, watchAttributes, watchElements } from "../src/observe";

describe('registerCleanup', () => {
    it('should fire callback when element is removed from root', async () => {
        const { node1 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const cb = mockFn();
        registerCleanup(cb);
        await after(() => {
            body.removeChild(node1);
        });
        expect(cb).toBeCalledTimes(1);
        expect(cb).toBeCalledWith([node1]);
    });

    it('should fire callback once when specified element is removed from root', async () => {
        const { node1 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const cb = mockFn();
        registerCleanup(node1, cb);
        registerCleanup(node1, cb);
        await after(() => {
            body.removeChild(node1);
        });
        expect(cb).toBeCalledTimes(1);

        cb.mockClear();
        body.appendChild(node1);
        await after(() => {
            body.removeChild(node1);
        });
        expect(cb).toBeCalledTimes(0);
    });
});

describe('createAutoCleanupMap', () => {
    it('should remove entry when element is removed from root', async () => {
        const { node1 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const obj = {};
        const map = createAutoCleanupMap();
        map.set(node1, obj);
        await after(() => {
            body.removeChild(node1);
        });
        expect(map.size).toBe(0);
    });

    it('should fire callback with value when element is removed from root', async () => {
        const { node1 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const obj = {};
        const cb = mockFn();
        const map = createAutoCleanupMap(cb);
        map.set(node1, obj);
        await after(() => {
            body.removeChild(node1);
        });
        expect(cb).toBeCalledTimes(1);
        expect(cb).toBeCalledWith(node1, obj);
    });
});

describe('afterDetached', () => {
    it('should fire callback', async () => {
        const { node1 } = initBody(`
            <div id="node1"></div>
        `);
        const cb = mockFn();
        afterDetached(node1, cb);
        await after(() => {
            body.removeChild(node1);
        });
        expect(cb).toBeCalledTimes(1);
    });

    it('should fire callback, with container argument', async () => {
        const { node1, node2, node3 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3"></div>
            </div>
        `);
        const cb = mockFn();
        afterDetached(node3, node1, cb);
        await after(() => {
            node2.appendChild(node3);
        });
        // node3 is not yet moved outside node1
        // callback has not been called
        expect(cb).toBeCalledTimes(0);

        await after(() => {
            body.appendChild(node3);
        });
        expect(cb).toBeCalledTimes(1);
    });

    it('should return promise when callback is not supplied', async () => {
        // fix @ 27ce352
        const { node1 } = initBody(`
            <div id="node1"></div>
        `);
        const returnValue = afterDetached(node1);
        expect(returnValue).toBeInstanceOf(Promise);

        await after(() => {
            body.removeChild(node1);
        });
        await expect(returnValue).resolves.toBe(node1);
    });

    it('should return promise when callback is not supplied, with container argument', async () => {
        const { node1, node2, node3 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3"></div>
            </div>
        `);
        const returnValue = afterDetached(node3, node1);
        expect(returnValue).toBeInstanceOf(Promise);
        expect(returnValue).resolves.toBe(node3);
        await after(() => {
            node2.appendChild(node3);
        });
        // node3 is not yet moved outside node1
        // the promise should be still pending
        expect.assertions(1);

        await after(() => {
            body.appendChild(node3);
        });
        expect.assertions(2);
    });
});

describe('watchElements', () => {
    it('should fire callback when the set of matching elements changed', async () => {
        const cb1 = mockFn();
        const cb2 = mockFn();
        const { root, div1, div2, p } = await after(() => initBody(`
            <div id="root">
                <div id="div1">
                    <div id="div2" attr="value"></div>
                    <p id="p" attr="value"></p>
                </div>
            </div>
        `));
        watchElements(root, 'div', cb1);
        watchElements(root, '[attr]', cb2);

        await after(() => {
            p.removeAttribute('attr');
            div1.setAttribute('attr', 'value');
            div1.removeChild(div2);
        });
        verifyCalls(cb1, [
            [[], [div2]]
        ]);
        verifyCalls(cb2, [
            [[div1], [div2, p]]
        ]);
    });

    it('should fire callback without existing elements when fireInit is false', async () => {
        const cb = mockFn();
        const { root, div1, div2 } = await after(() => initBody(`
            <div id="root">
                <div id="div1" class="test">
                    <div id="div2" class="test"></div>
                </div>
            </div>
        `));
        watchElements(root, '.test', cb);

        await after(() => {
            const div = document.createElement('div');
            div.classList.add('test');
            div1.appendChild(div);
        });
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][0]).not.toContain(div1);
        expect(cb.mock.calls[0][0]).not.toContain(div2);
    });

    it('should fire callback with existing elements when fireInit is true', async () => {
        const cb = mockFn();
        const { root, div1, div2 } = await after(() => initBody(`
            <div id="root">
                <div id="div1" class="test">
                    <div id="div2" class="test"></div>
                </div>
            </div>
        `));
        watchElements(root, '.test', cb, true);
        verifyCalls(cb, [
            [[div1, div2], []]
        ]);
    });
});

describe('watchAttributes', () => {
    it('should fire callback with a set of element having specified attributes updated', async () => {
        const cb = mockFn();
        watchAttributes(body, ['attr', 'attr-two'], cb);

        const { div1, div2, p } = initBody(`
            <div id="div1">
                <div id="div2" attr="value"></div>
                <p id="p" attr="value"></p>
            </div>
        `);
        await after(() => {
            div1.setAttribute('attr', 'newValue');
            div2.setAttribute('attr', 'newValue');
            div2.setAttribute('attr-two', 'newValue');
        });
        await after(() => {
            div1.removeChild(div2);
            p.removeAttribute('attr');
            p.setAttribute('attr-two', 'value');
        });
        verifyCalls(cb, [
            [[div1, div2]],
            [[p]]
        ]);
    });
});
