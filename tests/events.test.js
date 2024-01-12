import { after, body, initBody, mockFn, root, verifyCalls, _, bindEvent, fireEventAsTrusted, delay } from "./testUtil";
import { emitDOMEvent, getEventContext, listenDOMEvent, ZetaEventContainer } from "../src/events";
import { domReady } from "../src/env";
import dom from "../src/dom";
import { combineFn } from "../src/util";

const { objectContaining } = expect;

beforeAll(async () => {
    await domReady;
});

afterEach(async () => {
    await delay();
});

describe('ZetaEventContainer.event', () => {
    it('should return current event emitted from this container', () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        container.add(target, 'customEvent', (e) => {
            expect(container.event).toBe(e);
            container.emit('nestedEvent', target);
            expect(container.event).toBe(e);
        });
        container.add(target, 'nestedEvent', (e) => {
            expect(container.event).toBe(e);
        });
        expect(container.event).toBeNull();
        container.emit('customEvent', target);
        expect(container.event).toBeNull();
        expect.assertions(5);
    });
});

describe('ZetaEventContainer.add', () => {
    it('should return a callback to unregister handlers', () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb1 = mockFn();
        const cb2 = mockFn();
        const cb3 = mockFn();
        const unregister = container.add(target, 'customEvent', cb1);
        container.add(target, 'customEvent', cb2);
        container.add(target, 'anotherEvent', cb3);

        container.emit('customEvent', target, 'string');
        unregister();
        container.emit('customEvent', target, 'second string');
        container.emit('anotherEvent', target, 'anotherEvent');

        verifyCalls(cb1, [
            [objectContaining({ type: 'customEvent', data: 'string' }), _]
        ]);
        verifyCalls(cb2, [
            [objectContaining({ type: 'customEvent', data: 'string' }), _],
            [objectContaining({ type: 'customEvent', data: 'second string' }), _]
        ]);
        verifyCalls(cb3, [
            [objectContaining({ type: 'anotherEvent', data: 'anotherEvent' }), _]
        ]);
    });

    it('should allow objects other than DOM element as event target', () => {
        const container = new ZetaEventContainer();
        const target = {};
        const cb = mockFn();
        container.add(target, 'customEvent', cb);
        container.emit('customEvent', target, 'string');
        verifyCalls(cb, [
            [objectContaining({ type: 'customEvent', data: 'string' }), _]
        ]);
    });
});

describe('ZetaEventContainer.delete', () => {
    it('should remove all handlers', () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb1 = mockFn();
        const cb2 = mockFn();
        const cb3 = mockFn();
        container.add(target, 'customEvent', cb1);
        container.add(target, 'customEvent', cb2);
        container.add(target, 'anotherEvent', cb3);

        container.emit('customEvent', target, 'string');
        container.emit('anotherEvent', target, 'anotherEvent');
        container.delete(target);
        container.emit('customEvent', target, 'second string');
        container.emit('anotherEvent', target, 'second anotherEvent');

        verifyCalls(cb1, [
            [objectContaining({ type: 'customEvent', data: 'string' }), _]
        ]);
        verifyCalls(cb2, [
            [objectContaining({ type: 'customEvent', data: 'string' }), _]
        ]);
        verifyCalls(cb3, [
            [objectContaining({ type: 'anotherEvent', data: 'anotherEvent' }), _]
        ]);
    });
});

describe('ZetaEventContainer.emit', () => {
    it('should emit bubbling event', () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const container = new ZetaEventContainer(node1);
        const cb = mockFn();
        container.add(node1, 'customEvent', cb);
        container.add(node2, 'customEvent', cb);

        container.emit('customEvent', node2, 'string', true);
        verifyCalls(cb, [
            [objectContaining({ target: node2, currentTarget: node2 }), _],
            [objectContaining({ target: node2, currentTarget: node1 }), _]
        ]);
    });

    it('should emit non-bubbling event', () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const container = new ZetaEventContainer(node1);
        const cb = mockFn();
        container.add(node1, 'customEvent', cb);
        container.add(node2, 'customEvent', cb);

        container.emit('customEvent', node2, 'string');
        verifyCalls(cb, [
            [objectContaining({ context: node2, target: node2 }), _]
        ]);
    });

    it('should emit non-bubbling event on form element', () => {
        // fix @ 405b382
        const { form } = initBody(`
            <form id="form">
                <input type="text">
            </form>
        `);
        const cb = mockFn();
        listenDOMEvent(form, 'click', cb);
        emitDOMEvent('click', form);
        expect(cb).toBeCalledTimes(1);
    });

    it('should emit event with custom data', () => {
        // fix @ 3485e4c
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb = mockFn();
        container.add(target, 'customEvent', cb);

        container.emit('customEvent', target, 'string');
        container.emit('customEvent', target, { data: null });
        container.emit('customEvent', target, { data: 'data property' });
        container.emit('customEvent', target, { customProp: 'custom property' });
        verifyCalls(cb, [
            [objectContaining({ data: 'string' }), _],
            [objectContaining({ data: null }), _],
            [objectContaining({ data: 'data property' }), _],
            [objectContaining({ customProp: 'custom property' }), _]
        ]);
    });

    it('should emit event with context object', () => {
        /** @type {Zeta.ZetaEventContainer<{ element: HTMLElement }>} */
        const container = new ZetaEventContainer();
        const target = container.element;
        const context = { element: target };
        const cb = mockFn();
        container.add(context, 'customEvent', cb);

        container.emit('customEvent', context);
        verifyCalls(cb, [
            [objectContaining({ context: expect.sameObject(context) }), _]
        ]);
    });

    it('should emit event with context object when emitting on associated element', () => {
        /** @type {Zeta.ZetaEventContainer<{ element: HTMLElement }>} */
        const container = new ZetaEventContainer();
        const target = container.element;
        const context = { element: target };
        const cb = mockFn();
        container.add(context, 'customEvent', cb);

        container.emit('customEvent', target);
        verifyCalls(cb, [
            [objectContaining({ context: expect.sameObject(context) }), _]
        ]);
    });

    it('should emit event with different context objects', () => {
        /** @type {Zeta.ZetaEventContainer<{ element: HTMLElement }>} */
        const container = new ZetaEventContainer();
        const target = container.element;
        const context1 = { element: target };
        const context2 = { element: target };
        const cb = mockFn();
        container.add(context1, 'customEvent', cb);
        container.add(context2, 'customEvent', cb);

        container.emit('customEvent', target);
        verifyCalls(cb, [
            [objectContaining({ context: expect.sameObject(context1) }), _],
            [objectContaining({ context: expect.sameObject(context2) }), _]
        ]);
    });

    it('should emit event to specified context object only', () => {
        /** @type {Zeta.ZetaEventContainer<{ element: HTMLElement }>} */
        const container = new ZetaEventContainer();
        const target = container.element;
        const context1 = { element: target };
        const context2 = { element: target };
        const cb = mockFn();
        container.add(context1, 'customEvent', cb);
        container.add(context2, 'customEvent', cb);

        container.emit('customEvent', context1);
        verifyCalls(cb, [
            [objectContaining({ context: expect.sameObject(context1) }), _]
        ]);
    });

    it('should emit event correctly when element property of context object is not a DOM Node', () => {
        /** @type {Zeta.ZetaEventContainer<{ element: string }>} */
        const container = new ZetaEventContainer();
        const context1 = { element: 'foo' };
        const context2 = { element: 'bar', parent: context1 };
        const cb = mockFn();
        container.add(context1, 'customEvent', cb);
        container.add(context2, 'customEvent', cb);

        container.emit('customEvent', context2, null, true);
        verifyCalls(cb, [
            [objectContaining({ context: expect.sameObject(context2) }), _],
            [objectContaining({ context: expect.sameObject(context1) }), _],
        ]);
    });

    it('should return undefined if event is not handled', () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb = mockFn();
        container.add(target, 'customEvent', cb);

        const returnValue = container.emit('customEvent', target, 'string');
        expect(returnValue).toBeUndefined();
        expect(cb).toBeCalled();
    });

    it('should return promise if any handler has returned value other than undefined', async () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb = mockFn().mockReturnValue(42);
        container.add(target, 'customEvent', cb);

        const promise = container.emit('customEvent', target, 'string');
        await expect(promise).resolves.toBe(42);
    });

    it('should return promise if any handler has called ZetaEvent.handled', async () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb = mockFn(/** @param {Zeta.ZetaAsyncHandleableEvent} e */ e => {
            e.handled(42);
        });
        container.add(target, 'customEvent', cb);

        const promise = container.emit('customEvent', target, 'string');
        await expect(promise).resolves.toBe(42);
    });

    it('should return rejected promise if handler throws an error', async () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const error = new Error();
        container.add(target, 'customEvent', () => {
            throw error;
        });

        const promise = container.emit('customEvent', target, 'string');
        await expect(promise).rejects.toBe(error);
    });

    it('should stop propagation if event is handled', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const container = new ZetaEventContainer(node1);
        const cb1 = mockFn();
        const cb2 = mockFn(/** @param {Zeta.ZetaAsyncHandleableEvent} e */ e => {
            e.handled(42);
        });
        container.add(node1, 'customEvent', cb1);
        container.add(node2, 'customEvent', cb2);

        const promise = container.emit('customEvent', node2, 'string', true);
        await expect(promise).resolves.toBe(42);
        expect(cb1).not.toBeCalled();
    });

    it('should stop immediate propagation if event is handled', async () => {
        const { node1 } = initBody(`
            <div id="node1"></div>
        `);
        const container = new ZetaEventContainer(node1);
        const cb1 = mockFn(/** @param {Zeta.ZetaAsyncHandleableEvent} e */ e => {
            e.handled(42);
        });
        const cb2 = mockFn();
        container.add(node1, 'customEvent', cb1);
        container.add(node1, 'customEvent', cb2);

        const promise = container.emit('customEvent', node1, 'string');
        await expect(promise).resolves.toBe(42);
        expect(cb2).not.toBeCalled();
    });

    it('should not mark event to be handled if handleable is false', () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const container = new ZetaEventContainer(node1);
        const cb = mockFn(/** @param {Zeta.ZetaAsyncHandleableEvent} e */ e => {
            e.handled(42);
        });
        container.add(node1, 'customEvent', cb);
        container.add(node1, 'customEvent', cb);
        container.add(node2, 'customEvent', cb);

        const returnValue = container.emit('customEvent', node2, 'string', {
            bubbles: true,
            handleable: false
        });
        expect(returnValue).toBeUndefined();
        expect(cb).toBeCalledTimes(3);
    });

    it('should return value directly if asyncResult is false', () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb = mockFn(/** @param {Zeta.ZetaAsyncHandleableEvent} e */ e => {
            e.handled(42);
        });
        container.add(target, 'customEvent', cb);

        const returnValue = container.emit('customEvent', target, 'string', {
            asyncResult: false
        });
        expect(returnValue).toBe(42);
    });

    it('will not rethrow nor mark as handled if asyncResult is false', () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const error = new Error();
        const cb = mockFn(() => {
            throw error;
        });
        container.add(target, 'customEvent', cb);
        container.add(target, 'customEvent', cb);

        const returnValue = container.emit('customEvent', target, 'string', {
            asyncResult: false
        });
        expect(returnValue).toBeUndefined();
        expect(cb).toBeCalledTimes(2);
    });
});

describe('ZetaEventContainer.emitAsync', () => {
    it('should emit once asynchronously without data', async () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb = mockFn();
        container.add(target, 'asyncEvent', cb);

        await after(() => {
            container.emitAsync('asyncEvent', target);
            container.emitAsync('asyncEvent', target);
            container.emitAsync('asyncEvent', target);
            expect(cb).not.toBeCalled();
        });
        verifyCalls(cb, [
            [objectContaining({ type: 'asyncEvent', data: null }), _]
        ]);
    });

    it('should emit once asynchronously with mergeData callback', async () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const receiver = mockFn();
        const mergeData = mockFn((v, a) => v ? v + ' ' + a : a);
        container.add(target, 'asyncEvent', receiver);

        await after(() => {
            container.emitAsync('asyncEvent', target, 'first', false, mergeData);
            container.emitAsync('asyncEvent', target, 'second', false, mergeData);
            container.emitAsync('asyncEvent', target, 'third', false, mergeData);
            expect(receiver).not.toBeCalled();
        });
        verifyCalls(receiver, [
            [objectContaining({ type: 'asyncEvent', data: 'first second third' }), _],
        ]);
        verifyCalls(mergeData, [
            ['first', 'second'],
            ['first second', 'third']
        ]);
    });

    it('should emit the same number of times asynchronously without mergeData callback', async () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb = mockFn();
        container.add(target, 'asyncEvent', cb);

        await after(() => {
            container.emitAsync('asyncEvent', target, 0);
            container.emitAsync('asyncEvent', target, 1);
            container.emitAsync('asyncEvent', target, 2);
            expect(cb).not.toBeCalled();
        });
        verifyCalls(cb, [
            [objectContaining({ type: 'asyncEvent', data: 0 }), _],
            [objectContaining({ type: 'asyncEvent', data: 1 }), _],
            [objectContaining({ type: 'asyncEvent', data: 2 }), _]
        ]);
    });

    it('should not fire handlers deleted thereafter', async () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb = mockFn();
        container.add(target, 'asyncEvent', cb);

        await after(() => {
            container.emitAsync('asyncEvent', target);
            container.delete(target);
            expect(cb).not.toBeCalled();
        });
        expect(cb).not.toBeCalled();
    });

    it('should emit event as non-handleable', async () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb = mockFn(/** @param {Zeta.ZetaAsyncHandleableEvent} e */ e => {
            e.handled(42);
            expect(e.isHandled()).toBe(false);
        });
        container.add(target, 'asyncEvent', cb);
        container.add(target, 'asyncEvent', cb);

        await after(() => {
            container.emitAsync('asyncEvent', target, null, { handleable: true });
        });
        expect(cb).toBeCalledTimes(2);
    });

    it('should emit event with context object', async () => {
        /** @type {Zeta.ZetaEventContainer<{ element: HTMLElement }>} */
        const container = new ZetaEventContainer();
        const target = container.element;
        const context = { element: target };
        const cb = mockFn();
        container.add(context, 'customEvent', cb);

        await after(() => {
            container.emitAsync('customEvent', context);
        });
        verifyCalls(cb, [
            [objectContaining({ context: expect.sameObject(context) }), _]
        ]);
    });

    it('should emit event with context object when emitting on associated element', async () => {
        /** @type {Zeta.ZetaEventContainer<{ element: HTMLElement }>} */
        const container = new ZetaEventContainer();
        const target = container.element;
        const context = { element: target };
        const cb = mockFn();
        container.add(context, 'customEvent', cb);

        await after(() => {
            container.emitAsync('customEvent', context);
        });
        verifyCalls(cb, [
            [objectContaining({ context: expect.sameObject(context) }), _]
        ]);
    });

    it('should emit event with different context objects', async () => {
        /** @type {Zeta.ZetaEventContainer<{ element: HTMLElement }>} */
        const container = new ZetaEventContainer();
        const target = container.element;
        const context1 = { element: target };
        const context2 = { element: target };
        const cb = mockFn();
        container.add(context1, 'customEvent', cb);
        container.add(context2, 'customEvent', cb);

        await after(() => {
            container.emitAsync('customEvent', target);
        });
        verifyCalls(cb, [
            [objectContaining({ context: expect.sameObject(context1) }), _],
            [objectContaining({ context: expect.sameObject(context2) }), _]
        ]);
    });

    it('should emit event to specified context object only', async () => {
        /** @type {Zeta.ZetaEventContainer<{ element: HTMLElement }>} */
        const container = new ZetaEventContainer();
        const target = container.element;
        const context1 = { element: target };
        const context2 = { element: target };
        const cb = mockFn();
        container.add(context1, 'customEvent', cb);
        container.add(context2, 'customEvent', cb);

        await after(() => {
            container.emitAsync('customEvent', context1);
        });
        verifyCalls(cb, [
            [objectContaining({ context: expect.sameObject(context1) }), _]
        ]);
    });

    it('should emit event correctly when element property of context object is not a DOM Node', async () => {
        /** @type {Zeta.ZetaEventContainer<{ element: string }>} */
        const container = new ZetaEventContainer();
        const context1 = { element: 'foo' };
        const context2 = { element: 'bar', parent: context1 };
        const cb = mockFn();
        container.add(context1, 'customEvent', cb);
        container.add(context2, 'customEvent', cb);

        await after(() => {
            container.emit('customEvent', context2, null, true);
        });
        verifyCalls(cb, [
            [objectContaining({ context: expect.sameObject(context2) }), _],
            [objectContaining({ context: expect.sameObject(context1) }), _],
        ]);
    });
});

describe('ZetaEventContainer.flushEvents', () => {
    it('should emit asynchronous event immediately', () => {
        const container = new ZetaEventContainer();
        const target = container.element;
        const cb = mockFn();
        container.add(target, 'asyncEvent', cb);

        container.emitAsync('asyncEvent', target, 'string');
        container.flushEvents();
        expect(cb).toBeCalledTimes(1);
    });
});

describe('ZetaEventContainer.tap', () => {
    it('should return callback to unregister handler', () => {
        const { root } = initBody(`
            <div id="root"></div<
        `);
        const cb = mockFn();
        const container = new ZetaEventContainer(root, null, { captureDOMEvents: true });
        const unbind = container.tap(cb);
        emitDOMEvent('custom', root);
        expect(cb).toBeCalledTimes(1);

        cb.mockClear();
        unbind();
        emitDOMEvent('custom', root);
        expect(cb).not.toBeCalled();
    });
});

describe('ZetaEvent.target', () => {
    it('should always be Element when possible', () => {
        /** @type {Zeta.ZetaEventContainer<{ element: HTMLElement }>} */
        const container = new ZetaEventContainer();
        const target = container.element;
        const context = { element: target };
        const cb = mockFn();
        container.add(context, 'customEvent', cb);

        container.emit('customEvent', target);
        verifyCalls(cb, [
            [objectContaining({ target: target }), _]
        ]);
    });
});

describe('ZetaEvent.currentTarget', () => {
    it('should always be Element when possible', () => {
        /** @type {Zeta.ZetaEventContainer<{ element: HTMLElement }>} */
        const container = new ZetaEventContainer();
        const target = container.element;
        const context = { element: target };
        const cb = mockFn();
        container.add(context, 'customEvent', cb);

        container.emit('customEvent', target);
        verifyCalls(cb, [
            [objectContaining({ currentTarget: target }), _]
        ]);
    });
});

describe('ZetaEvent.preventDefault', () => {
    it('should forward preventDefault to native events', async () => {
        const event = new MouseEvent('mousedown', {
            button: 1,
            buttons: 1,
            cancelable: true
        });
        const cb = mockFn(/** @param {Zeta.ZetaNativeUIEvent} e */ e => {
            e.preventDefault();
        });
        const unregister = listenDOMEvent(body, 'mousedown', cb);

        expect(body.dispatchEvent(event)).toBe(false);
        expect(cb).toBeCalledTimes(1);
        unregister();
    });
});

describe('ZetaEvent.source', () => {
    it('should return mouse in mousedown event', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1"></div>
            <div id="node2"></div>
        `);
        const event = new MouseEvent('mousedown', {
            button: 1,
            buttons: 1,
            cancelable: true
        });
        const cb = mockFn();
        dom.focus(node1);
        bindEvent(body, 'mousedown', cb);
        fireEventAsTrusted(node2, event);
        verifyCalls(cb, [
            [objectContaining({ source: 'mouse', target: node2 }), _]
        ]);
    });

    it('should return touch in touchstart event', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1"></div>
            <div id="node2"></div>
        `);
        const event = new TouchEvent('touchstart', {
            cancelable: true,
            touches: [{ clientX: 0, clientY: 0, identifier: 1, target: node2 }]
        });
        const cb = mockFn();
        dom.focus(node1);
        bindEvent(body, 'touchstart', cb);
        fireEventAsTrusted(node2, event);
        verifyCalls(cb, [
            [objectContaining({ source: 'touch', target: node2 }), _]
        ]);
    });

    it('should return script in manually dispatched event', async () => {
        const cb = mockFn();
        bindEvent(body, 'mousedown', cb);
        body.dispatchEvent(new MouseEvent('mousedown', {
            button: 1,
            buttons: 1,
            bubbles: true,
            cancelable: true
        }));
        verifyCalls(cb, [
            [objectContaining({ source: 'script', target: body }), _]
        ]);
    });

    it('should be determined by trusted event', async () => {
        const cb = mockFn();
        bindEvent(body, 'mousedown', cb);
        bindEvent(body, 'touchstart', cb);
        bindEvent(body, 'mousedown', () => {
            body.dispatchEvent(new TouchEvent('touchstart', {
                touches: [{ clientX: 0, clientY: 0, identifier: 1, target: body }],
                bubbles: true,
                cancelable: true
            }));
        });
        fireEventAsTrusted(body, new MouseEvent('mousedown', {
            button: 1,
            buttons: 1,
            bubbles: true,
            cancelable: true
        }));
        verifyCalls(cb, [
            [objectContaining({ source: 'mouse', type: 'mousedown' }), _],
            [objectContaining({ source: 'mouse', type: 'touchstart' }), _],
        ]);
    });
});

describe('getEventContext', () => {
    it('should return context object passed to container that capture DOM events', () => {
        const { node1, node2, node3, node4 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
                <div id="node3">
                    <div id="node4"></div>
                </div>
            </div>
        `);
        const context1 = {};
        const context2 = {};
        const container1 = new ZetaEventContainer(node1, context1, {
            captureDOMEvents: true
        });
        const container2 = new ZetaEventContainer(node3, context2, {
            captureDOMEvents: true
        });
        expect(getEventContext(node1)).toMatchObject({
            context: expect.sameObject(context1),
            element: node1
        });
        expect(getEventContext(node2)).toMatchObject({
            context: expect.sameObject(context1),
            element: node1
        });
        expect(getEventContext(node4)).toMatchObject({
            context: expect.sameObject(context2),
            element: node3
        });
        container1.destroy();
        container2.destroy();
    });
});

describe('emitDOMEvent', () => {
    it('should dispatch custom event to modally locked element', async () => {
        const cb = mockFn();
        const { modal, child } = initBody(`
            <div id="modal">
                <div id="child"></div>
            </div>
        `);
        dom.setModal(modal);
        const unregister = combineFn(
            dom.on(root, 'custom', cb),
            dom.on(body, 'custom', cb),
            dom.on(modal, 'custom', cb),
            dom.on(child, 'custom', cb),
        );
        dom.emit('custom', modal, null, true);
        verifyCalls(cb, [
            [objectContaining({ type: 'custom' }), modal],
            [objectContaining({ type: 'custom' }), root],
        ]);

        cb.mockClear();
        dom.emit('custom', child, null, true);
        verifyCalls(cb, [
            [objectContaining({ type: 'custom' }), child],
            [objectContaining({ type: 'custom' }), modal],
            [objectContaining({ type: 'custom' }), root],
        ]);
        unregister();
    });

    it('should dispatch custom event to element from which focus can be delegated', async () => {
        const cb = mockFn();
        const { modal, child1, child2 } = initBody(`
            <div id="modal">
                <div id="child1"></div>
                <div id="child2"></div>
            </div>
        `);
        dom.retainFocus(child1, child2);
        const unregister = combineFn(
            dom.on(root, 'custom', cb),
            dom.on(body, 'custom', cb),
            dom.on(modal, 'custom', cb),
            dom.on(child1, 'custom', cb),
            dom.on(child2, 'custom', cb),
        );
        dom.emit('custom', child2, null, true);
        verifyCalls(cb, [
            [objectContaining({ type: 'custom' }), child2],
            [objectContaining({ type: 'custom' }), child1],
            [objectContaining({ type: 'custom' }), modal],
            [objectContaining({ type: 'custom' }), body],
            [objectContaining({ type: 'custom' }), root],
        ]);
        unregister();
    });

    it('should dispatch pointer event to target and its parents', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1"></div>
            <div id="node2"></div>
        `);
        dom.retainFocus(node1, node2);
        dom.focus(node1);
        dom.focus(node2);
        expect(dom.focusedElements).toEqual([node2, node1, body, root]);

        const cb = mockFn();
        bindEvent(root, 'click', cb);
        bindEvent(body, 'click', cb);
        bindEvent(node1, 'click', cb);
        bindEvent(node2, 'click', cb);

        node2.dispatchEvent(new MouseEvent('click', {
            clientX: 0,
            clientY: 0,
            bubbles: true,
            cancelable: true
        }));
        verifyCalls(cb, [
            [objectContaining({ currentTarget: node2 }), node2],
            [objectContaining({ currentTarget: body }), body],
            [objectContaining({ currentTarget: root }), root],
        ]);

        cb.mockClear();
        dom.focus(body);
        expect(dom.focusedElements).toEqual([body, root]);

        node2.dispatchEvent(new MouseEvent('click', {
            clientX: 0,
            clientY: 0,
            bubbles: true,
            cancelable: true
        }));
        verifyCalls(cb, [
            [objectContaining({ currentTarget: node2 }), node2],
            [objectContaining({ currentTarget: body }), body],
            [objectContaining({ currentTarget: root }), root],
        ]);
    });

    it('should dispatch pointer event to target and its parents when target is not in focus', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1"></div>
            <div id="node2"></div>
        `);
        dom.retainFocus(node1, node2);
        dom.focus(body);
        expect(dom.focusedElements).toEqual([body, root]);

        const cb = mockFn();
        bindEvent(root, 'click', cb);
        bindEvent(body, 'click', cb);
        bindEvent(node1, 'click', cb);
        bindEvent(node2, 'click', cb);

        node2.dispatchEvent(new MouseEvent('click', {
            clientX: 0,
            clientY: 0,
            bubbles: true,
            cancelable: true
        }));
        verifyCalls(cb, [
            [objectContaining({ currentTarget: node2 }), node2],
            [objectContaining({ currentTarget: body }), body],
            [objectContaining({ currentTarget: root }), root],
        ]);
    });

    it('should dispatch pointer event to only focusable elements', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        dom.retainFocus(node1, node2);
        dom.focus(node1);
        dom.setModal(node2);
        expect(dom.focusedElements).toEqual([node2, root]);

        const cb = mockFn();
        bindEvent(root, 'click', cb);
        bindEvent(body, 'click', cb);
        bindEvent(node1, 'click', cb);
        bindEvent(node2, 'click', cb);

        node2.dispatchEvent(new MouseEvent('click', {
            clientX: 0,
            clientY: 0,
            bubbles: true,
            cancelable: true
        }));
        verifyCalls(cb, [
            [objectContaining({ currentTarget: node2 }), node2],
            [objectContaining({ currentTarget: root }), root],
        ]);
    });
});
