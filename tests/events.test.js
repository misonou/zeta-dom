import { initBody, mockFn, objectContaining, verifyCalls, _ } from "./testUtil";
import { emitDOMEvent, listenDOMEvent, ZetaEventContainer } from "../src/events";

describe('EventContainer.add', () => {
    it('should return a callback to unregister handlers', () => {
        const container = new ZetaEventContainer();
        const cb = mockFn();
        const unregister = container.add(container.element, 'customEvent', cb);
        container.emit('customEvent', container.element, 'string');
        unregister();
        container.emit('customEvent', container.element, 'string');
        verifyCalls(cb, [
            [objectContaining({ data: 'string' }), _]
        ]);
    });
});

describe('EventContainer.emit', () => {
    it('should emit non-bubbling event on form element', () => {
        // fix @ 405b382
        const { form } = initBody(`
            <form id="form">
                <input type="text">
            </form>
        `);
        const cb = mockFn();
        listenDOMEvent(form, 'click', cb);
        emitDOMEvent('click', null, form);
        expect(cb).toBeCalledTimes(1);
    });

    it('should emit custom event with data', () => {
        // fix @ 3485e4c
        const container = new ZetaEventContainer();
        const cb = mockFn();
        container.add(container.element, 'customEvent', cb);

        container.emit('customEvent', container.element, 'string');
        container.emit('customEvent', container.element, { data: null });
        container.emit('customEvent', container.element, { data: 'data property' });
        container.emit('customEvent', container.element, { customProp: 'custom property' });
        verifyCalls(cb, [
            [objectContaining({ data: 'string' }), _],
            [objectContaining({ data: null }), _],
            [objectContaining({ data: 'data property' }), _],
            [objectContaining({ customProp: 'custom property' }), _]
        ]);
    });
});
