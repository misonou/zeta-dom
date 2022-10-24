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
        expect(dom.focusedElements).toEqual([modal, root]);
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

    it('should return false if element is detached', () => {
        const div = document.createElement('div');
        expect(dom.focusable(div)).toBe(false);

        dom.retainFocus(body, div);
        expect(dom.focusable(div)).toBe(false);
    });
});

describe('setFocus', () => {
    it('should not throw when delegated element containing the source element', async () => {
        await dom.ready;
        const { outer, inner } = initBody(`
            <div id="outer">
                <div id="inner"></div>
            </div>
        `);
        dom.retainFocus(inner, outer);
        dom.focus(inner);
    });

    it('should not throw when source element containing the delegated element', async () => {
        await dom.ready;
        const { outer, inner } = initBody(`
            <div id="outer">
                <div id="inner"></div>
            </div>
        `);
        dom.retainFocus(outer, inner);
        dom.focus(inner);
    });
});

describe('setModal', () => {
    it('should focus modal element', async () => {
        await dom.ready;
        const { modal } = initBody(`
            <div>
                <div id="modal"></div>
            </div>
        `);
        expect(dom.setModal(modal)).toBe(true);
        expect(dom.activeElement).toBe(modal);
        expect(dom.modalElement).toBe(modal);
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
        expect(dom.focusedElements).toEqual([child, modal, root]);
        expect(dom.modalElement).toBe(modal);
    });

    it('should keep focus inside modal element', async () => {
        await dom.ready;
        const { modal, button } = initBody(`
            <div>
                <div id="modal"></div>
                <button id="button"></button>
            </div>
        `);
        dom.setModal(modal);
        button.focus();
        expect(dom.activeElement).toBe(modal);
        expect(dom.focusedElements).toEqual([modal, root]);
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
        expect(dom.focusedElements).toEqual([modal, root]);

        await after(() => {
            body.removeChild(modal);
        });
        expect(dom.focusable(button)).toBeTruthy();
        expect(dom.focusedElements).toEqual([button, other, body, root]);
    });

    it('should do no-op and return true when element is already modal', async () => {
        await dom.ready;
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        dom.setModal(modal);
        expect(dom.focusedElements).toEqual([modal, root]);

        expect(dom.setModal(modal)).toBe(true);
        expect(dom.focusedElements).toEqual([modal, root]);
    });

    it('should do no-op and return false when element is not focusable', async () => {
        await dom.ready;
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        dom.setModal(modal);
        expect(dom.focusedElements).toEqual([modal, root]);

        expect(dom.setModal(body)).toBe(false);
        expect(dom.focusedElements).toEqual([modal, root]);
    });

    it('should emit modalchange event', async () => {
        await dom.ready;
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        const cb = mockFn();
        const unregister = dom.on('modalchange', cb);
        await after(() => {
            dom.setModal(modal);
        });
        verifyCalls(cb, [
            [objectContaining({ type: 'modalchange', modalElement: modal }), _]
        ]);
        unregister();
    });
});

describe('releaseModal', () => {
    it('should keep currently focused element', async () => {
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
        expect(dom.focusedElements).toEqual([modal, root]);
        expect(dom.modalElement).toBe(modal);

        dom.releaseModal(modal);
        expect(dom.focusable(button)).toBeTruthy();
        expect(dom.focusedElements).toEqual([modal, body, root]);
        expect(dom.modalElement).toBe(null);
    });

    it('should fire focusout event on previously focused element', async () => {
        await dom.ready;
        const { modal, other, button } = initBody(`
            <div id="modal"></div>
            <div id="other">
                <button id="button"></button>
            </div>
        `);
        const cb = mockFn();
        const unregister = dom.on(button, 'focusout', cb);
        button.focus();
        dom.setModal(modal);
        dom.releaseModal(modal);
        expect(cb).toBeCalled();
        unregister();
    });

    it('should emit modalchange event', async () => {
        await dom.ready;
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        await after(() => {
            dom.setModal(modal);
        });
        const cb = mockFn();
        const unregister = dom.on('modalchange', cb);
        await after(() => {
            dom.releaseModal(modal);
        });
        verifyCalls(cb, [
            [objectContaining({ type: 'modalchange' }), _]
        ]);
        unregister();
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
