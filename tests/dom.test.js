import syn from "syn";
import dom from "../src/dom";
import { removeNode } from "../src/domUtil";
import { domReady } from "../src/env";
import { ZetaEventContainer } from "../src/events";
import { after, body, initBody, mockFn, objectContaining, root, verifyCalls, _ } from "./testUtil";

async function type(elm, keystroke) {
    await domReady;
    await after(() => {
        dom.focus(elm);
        // @ts-ignore: unable to infer dynamically created method
        syn.type(elm, keystroke);
    });
}

describe('activeElement', () => {
    it('should return body as initial focused element', async () => {
        await dom.ready;
        expect(dom.activeElement).toBe(body);
    });

    it('should return current focused element', async () => {
        await dom.ready;
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        expect(dom.activeElement).toBe(button);
    });

    it('should not return detached element', async () => {
        await dom.ready;
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        removeNode(button);
        expect(dom.activeElement).toBe(body);
    });
});

describe('focusedElements', () => {
    it('should return current focused element and its parents', async () => {
        await dom.ready;
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        expect(dom.focusedElements).toEqual([button, body, root]);
    });

    it('should not return detached element', async () => {
        await dom.ready;
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        removeNode(button);
        expect(dom.focusedElements).toEqual([body, root]);
    });

    it('should exclude elements that is not descandents of modal element', async () => {
        await dom.ready;
        const { modal } = initBody(`
            <div id="modal">
                <button id="button"></button>
            </div>
        `);
        dom.setModal(modal);
        expect(dom.focusedElements).toEqual([modal]);
    });
});

describe('context', () => {
    it('should be null initially', async () => {
        await dom.ready;
        expect(dom.context).toBeNull();
    });

    it('should return context object of current DOM event capturing container', async () => {
        await dom.ready;
        const { treeRoot, button } = initBody(`
            <div id="treeRoot">
                <button id="button"></button>
            </div>
        `);
        const context = {};
        new ZetaEventContainer(treeRoot, context, {
            captureDOMEvents: true
        });
        button.focus();
        expect(dom.context).toBe(context);
    });
});

describe('focusable', () => {
    it('should return false if element is blocked by modal element', async () => {
        await dom.ready;
        const { modal, other } = initBody(`
            <div id="modal"></div>
            <div id="other"></div>
        `);
        dom.setModal(modal);
        expect(dom.focusable(other)).toBe(false);
    });
});

describe('setModal', () => {
    it('should focus modal element', async () => {
        await dom.ready;
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        dom.setModal(modal);
        expect(dom.activeElement).toBe(modal);
    });

    it('should keep modal element and its descendant as focused', async () => {
        await dom.ready;
        const { modal, child } = initBody(`
            <div id="modal">
                <div id="child"></div>
            </div>
        `);
        dom.focus(child);
        dom.setModal(modal);
        expect(dom.focusedElements).toEqual([child, modal]);
    });

    it('should keep focus inside modal element', async () => {
        await dom.ready;
        const { modal, button } = initBody(`
            <div id="modal"></div>
            <button id="button"></button>
        `);
        const cb = mockFn();
        const unregister = dom.on(button, 'focusin', cb);
        dom.setModal(modal);
        button.focus();
        expect(dom.activeElement).toBe(modal);
        expect(cb).not.toBeCalled();
        unregister();
    });

    it('should fire focusreturn event if keyboard, mouse or touch event is triggered outside modal element', async () => {
        await dom.ready;
        const { modal, button } = initBody(`
            <div id="modal"></div>
            <button id="button"></button>
        `);
        const cb = mockFn();
        const unregister = dom.on(modal, 'focusreturn', cb);
        dom.setModal(modal);

        const event = new MouseEvent('mousedown');
        button.dispatchEvent(event);
        expect(cb).toBeCalledTimes(1);
        unregister();
    });

    it('should return focus to previously focused element if modal element is removed', async () => {
        await dom.ready;
        const { modal, other, button } = initBody(`
            <div id="modal"></div>
            <div id="other">
                <button id="button"></button>
            </div>
        `);
        button.focus();
        expect(dom.focusedElements).toEqual([button, other, body, root]);
        dom.setModal(modal);
        expect(dom.focusable(button)).toBe(false);
        expect(dom.focusedElements).toEqual([modal]);

        await after(() => {
            body.removeChild(modal);
        });
        expect(dom.focusable(button)).toBeTruthy();
        expect(dom.focusedElements).toEqual([button, other, body, root]);
    });
});

describe('retainFocus', () => {
    it('should return keep element given as first argument in focused state', async () => {
        await dom.ready;
        const { modal, other, inner } = initBody(`
            <div id="modal">
                <div id="inner"></div>
            </div>
            <div id="other"></div>
        `);
        const cb = mockFn();
        const unregister = dom.on(modal, 'focusout', cb);
        dom.focus(inner);
        dom.retainFocus(modal, other);
        dom.focus(other);
        expect(dom.focusedElements).toEqual([other, modal, body, root]);
        expect(cb).not.toBeCalled();
        unregister();
    });

    it('should allow focus to delegated element outside modal element', async () => {
        await dom.ready;
        const { modal, other } = initBody(`
            <div id="modal"></div>
            <div id="other"></div>
        `);
        dom.setModal(modal);
        dom.retainFocus(modal, other);
        dom.focus(other);
        expect(dom.activeElement).toEqual(other);
    });
});

describe('focus event', () => {
    it('is not handleable', () => {
        const { node1, node2 } = initBody(`
            <div id="node1"></div>
            <div id="node2"></div>
        `);
        const cb = mockFn().mockReturnValue(42);
        dom.on(node1, { focusin: cb, focusout: cb });
        dom.on(node1, { focusin: cb, focusout: cb });
        dom.focus(node1);
        verifyCalls(cb, [
            [objectContaining({ type: 'focusin' }), _],
            [objectContaining({ type: 'focusin' }), _]
        ]);

        cb.mockReset();
        dom.focus(node2);
        verifyCalls(cb, [
            [objectContaining({ type: 'focusout', relatedTarget: node2 }), _],
            [objectContaining({ type: 'focusout', relatedTarget: node2 }), _]
        ]);
    });

    it('should be fired in correct order', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const cb = mockFn();
        dom.on(node1, { focusin: cb, focusout: cb });
        dom.on(node2, { focusin: cb, focusout: cb });
        dom.focus(node2);
        verifyCalls(cb, [
            [objectContaining({ type: 'focusin', target: node1 }), _],
            [objectContaining({ type: 'focusin', target: node2 }), _]
        ]);

        cb.mockReset();
        dom.focus(body);
        verifyCalls(cb, [
            [objectContaining({ type: 'focusout', target: node2 }), _],
            [objectContaining({ type: 'focusout', target: node1 }), _]
        ]);
    });
});

describe('keystroke event', () => {
    it('should be fired in correct order', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const cb = mockFn();
        dom.on(node1, { keystroke: cb, ctrlA: cb });
        dom.on(node2, { keystroke: cb, ctrlA: cb });

        await type(node2, '[ctrl]a[ctrl-up]');
        verifyCalls(cb, [
            [objectContaining({ currentTarget: node2, type: 'ctrlA', data: null }), _],
            [objectContaining({ currentTarget: node2, type: 'keystroke', data: 'ctrlA' }), _],
            [objectContaining({ currentTarget: node1, type: 'ctrlA', data: null }), _],
            [objectContaining({ currentTarget: node1, type: 'keystroke', data: 'ctrlA' }), _],
        ]);
    });

    it('should be fired with correct meta key prefix', async () => {
        const cb = mockFn();
        const unregister = dom.on(body, { metakeychange: cb, keystroke: cb });

        await type(body, '[ctrl]a[ctrl-up]');
        verifyCalls(cb, [
            [objectContaining({ type: 'metakeychange', data: 'ctrl' }), _],
            [objectContaining({ type: 'keystroke', data: 'ctrlA' }), _],
            [objectContaining({ type: 'metakeychange', data: '' }), _]
        ]);
        cb.mockReset();

        await type(body, '[ctrl][shift]a[ctrl-up][shift-up]');
        verifyCalls(cb, [
            [objectContaining({ type: 'metakeychange', data: 'ctrl' }), _],
            [objectContaining({ type: 'metakeychange', data: 'ctrlShift' }), _],
            [objectContaining({ type: 'keystroke', data: 'ctrlShiftA' }), _],
            [objectContaining({ type: 'metakeychange', data: 'shift' }), _],
            [objectContaining({ type: 'metakeychange', data: '' }), _]
        ]);
        cb.mockReset();

        await type(body, '[ctrl][alt]a[ctrl-up][alt-up]');
        verifyCalls(cb, [
            [objectContaining({ type: 'metakeychange', data: 'ctrl' }), _],
            [objectContaining({ type: 'metakeychange', data: 'ctrlAlt' }), _],
            [objectContaining({ type: 'keystroke', data: 'ctrlAltA' }), _],
            [objectContaining({ type: 'metakeychange', data: 'alt' }), _],
            [objectContaining({ type: 'metakeychange', data: '' }), _]
        ]);
        cb.mockReset();

        await type(body, '[ctrl][alt][shift]a[shift-up][ctrl-up][alt-up]');
        verifyCalls(cb, [
            [objectContaining({ type: 'metakeychange', data: 'ctrl' }), _],
            [objectContaining({ type: 'metakeychange', data: 'ctrlAlt' }), _],
            [objectContaining({ type: 'metakeychange', data: 'ctrlAltShift' }), _],
            [objectContaining({ type: 'keystroke', data: 'ctrlAltShiftA' }), _],
            [objectContaining({ type: 'metakeychange', data: 'ctrlAlt' }), _],
            [objectContaining({ type: 'metakeychange', data: 'alt' }), _],
            [objectContaining({ type: 'metakeychange', data: '' }), _]
        ]);
        unregister();
    });

    it('should be followed by textInput event for typed character on element allowing text input', async () => {
        const { input } = initBody(`
            <input id="input" type="text" />
        `);
        const cb = mockFn();
        dom.on(input, { keystroke: cb, textInput: cb });

        await type(input, 'a');
        verifyCalls(cb, [
            [objectContaining({ currentTarget: input, type: 'keystroke', data: 'a' }), _],
            [objectContaining({ currentTarget: input, type: 'textInput', data: 'a' }), _]
        ]);
        cb.mockReset();

        await type(input, ';');
        verifyCalls(cb, [
            [objectContaining({ currentTarget: input, type: 'keystroke', data: 'semiColon' }), _],
            [objectContaining({ currentTarget: input, type: 'textInput', data: ';' }), _]
        ]);
        cb.mockReset();

        // this test is skipped in simulated DOM environment
        // the syn library did not report 'A' in e.key as in real browser
        //
        // await type(input, '[shift]a[shift-up]');
        // verifyCalls(cb, [
        //     [objectContaining({ currentTarget: input, type: 'keystroke', data: 'shiftA' }), _],
        //     [objectContaining({ currentTarget: input, type: 'textInput', data: 'A' }), _]
        // ]);
    });

    it('should be fired in correct order when tapped and re-emitted', async () => {
        const { input } = initBody(`
            <input id="input" type="text" />
        `);
        const cb = mockFn();
        /** @type {Zeta.ZetaEventContainer<Zeta.HasElement>} */
        const container = new ZetaEventContainer(body, {}, {
            captureDOMEvents: true
        });
        const context = { element: input };
        container.add(context, { a: cb, keystroke: cb, textInput: cb });
        container.tap(function (e) {
            cb(...arguments);
            container.emit(e);
        });
        // @ts-ignore
        dom.on(input, { a: cb, keystroke: cb, textInput: cb });
        input.focus();
        cb.mockReset();

        await type(input, 'a');
        verifyCalls(cb, [
            [objectContaining({ context: container, type: 'keystroke', data: 'a' }), _],
            [objectContaining({ context: context, type: 'a' }), _],
            [objectContaining({ context: context, type: 'keystroke', data: 'a' }), _],
            [objectContaining({ context: container, type: 'textInput', data: 'a' }), _],
            [objectContaining({ context: context, type: 'textInput', data: 'a' }), _],
            [objectContaining({ context: input, type: 'a' }), _],
            [objectContaining({ context: input, type: 'keystroke', data: 'a' }), _],
            [objectContaining({ context: input, type: 'textInput', data: 'a' }), _],
        ]);
    });
});
